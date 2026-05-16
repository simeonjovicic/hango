import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_STORAGE_KEY = "hango-chat-consent-v1";
const TEASER_DISMISS_KEY = "hango-chat-teaser-dismissed";

const TEASER_VARIANTS = [
  (n) => `Hi! Ich bin ${n}, dein KI-Assistent. Frag mich was zu Webdesign oder SEO.`,
  (n) => `Servus, ${n} hier. Brauchst du Hilfe? Ich antworte sofort.`,
  (n) => `Hallo! ${n} hier — ich bin ein KI-Chat und helfe gerne weiter.`,
];

const CHAT_API_URL =
  import.meta.env.VITE_CHAT_API_URL ||
  "https://falling-heart-60e1.simeon-jovicic.workers.dev";

const BOT_PROFILES = {
  Hugo: { role: "Webdesign-Beratung", gradient: "from-red-500/15 to-orange-400/15" },
  Mia: { role: "Online Marketing", gradient: "from-pink-500/15 to-rose-400/15" },
  Leo: { role: "SEO-Spezialist", gradient: "from-amber-500/15 to-yellow-400/15" },
  Ben: { role: "Webentwicklung", gradient: "from-blue-500/15 to-cyan-400/15" },
  Lara: { role: "UI/UX & Design", gradient: "from-purple-500/15 to-pink-400/15" },
  Nora: { role: "SEO & Content", gradient: "from-emerald-500/15 to-teal-400/15" },
  Finn: { role: "Performance & Hosting", gradient: "from-indigo-500/15 to-sky-400/15" },
};
const BOT_NAMES = Object.keys(BOT_PROFILES);

const WELCOME_VARIANTS = [
  (n) =>
    `Hallo! Ich bin ${n}, der digitale Assistent von Hango. Frag mich gerne zu Webdesign, SEO oder unseren Services — wobei kann ich dir helfen?`,
  (n) =>
    `Hi, ${n} hier! Schön, dass du da bist. Wenn du Fragen zu unseren Webdesign- oder Marketing-Services hast, schieß los.`,
  (n) =>
    `Servus! Mein Name ist ${n} und ich bin dein Ansprechpartner bei Hango. Womit kann ich dich heute unterstützen?`,
  (n) =>
    `Hallo! Ich bin ${n} und helfe dir gerne bei allem rund um Hango — von Webdesign über SEO bis zu Online Marketing.`,
];

const SUGGESTIONS = [
  "Welche Services bietet ihr?",
  "Wie läuft ein Webdesign-Projekt ab?",
  "Wie hilft mir SEO?",
  "Wie kann ich euch kontaktieren?",
];

const avatarUrl = (name) =>
  `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(name)}&backgroundColor=fef2f2,ffe4e6,fee2e2`;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSessionBotName() {
  if (typeof window === "undefined") return BOT_NAMES[0];
  const stored = sessionStorage.getItem("hango-bot-name");
  if (stored && BOT_NAMES.includes(stored)) return stored;
  const picked = pickRandom(BOT_NAMES);
  sessionStorage.setItem("hango-bot-name", picked);
  return picked;
}

function parseSSEStream(reader, onDelta) {
  return new Promise(async (resolve, reject) => {
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") return resolve();
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) onDelta(delta);
          } catch {}
        }
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function ChatWidget() {
  const botName = useMemo(getSessionBotName, []);
  const botProfile = BOT_PROFILES[botName];
  const botAvatar = useMemo(() => avatarUrl(botName), [botName]);

  const welcome = useMemo(
    () => ({ role: "assistant", content: pickRandom(WELCOME_VARIANTS)(botName) }),
    [botName]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const teaserText = useMemo(
    () => pickRandom(TEASER_VARIANTS)(botName),
    [botName]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(TEASER_DISMISS_KEY);
    } catch {}
    const t = setTimeout(() => setShowTeaser(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    dismissTeaser();
  }, [dismissTeaser]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.accepted) setHasConsent(true);
      }
    } catch {}
  }, []);

  const acceptConsent = useCallback(() => {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ accepted: true, ts: new Date().toISOString(), v: 1 })
      );
    } catch {}
    setHasConsent(true);
  }, []);

  const revokeConsent = useCallback(() => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      sessionStorage.removeItem("hango-bot-name");
    } catch {}
    setHasConsent(false);
    setMessages([welcome]);
    setInput("");
    setError(null);
  }, [welcome]);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const hasUserMessage = messages.some((m) => m.role === "user");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading || !hasConsent) return;

      const userMessage = { role: "user", content: trimmed };
      const history = [...messages.filter((m) => m !== welcome), userMessage];

      setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
      setInput("");
      setError(null);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(CHAT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, botName }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        await parseSSEStream(reader, (delta) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last.role === "assistant") {
              next[next.length - 1] = { ...last, content: last.content + delta };
            }
            return next;
          });
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Entschuldigung, da ist etwas schiefgelaufen. Bitte versuche es erneut.");
          setMessages((prev) => prev.slice(0, -1));
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, isLoading, welcome, botName, hasConsent]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-10 right-[7rem] z-[60] max-w-[16rem]"
          >
            <button
              type="button"
              onClick={openChat}
              className="group relative block w-full text-left rounded-2xl rounded-tr-md bg-white px-3.5 py-2.5 pr-7 shadow-[0_8px_28px_rgba(0,0,0,0.12)] ring-1 ring-black/5 hover:shadow-[0_10px_32px_rgba(220,38,38,0.18)] hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2 py-0.5 text-[0.6rem] font-bold text-white tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  KI-CHAT
                </span>
                <span className="inline-flex items-center gap-1 text-[0.6rem] font-medium text-gray-400">
                  ·
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  jetzt online
                </span>
              </div>
              <p className="mt-1 font-inter text-[0.75rem] leading-snug text-gray-700">
                {teaserText}
              </p>
              <span
                role="button"
                tabIndex={0}
                aria-label="Hinweis schließen"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissTeaser();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    dismissTeaser();
                  }
                }}
                className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span
                aria-hidden
                className="absolute top-1/2 -right-[5px] -translate-y-1/2 h-2.5 w-2.5 rotate-45 bg-white shadow-[1px_-1px_0_rgba(0,0,0,0.04)]"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setIsOpen((v) => !v);
          dismissTeaser();
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Chat schließen" : "Chat öffnen"}
        className="fixed bottom-8 right-8 z-[60] h-14 w-14 rounded-full bg-red-600 text-white shadow-[0_8px_24px_rgba(220,38,38,0.4)] flex items-center justify-center hover:bg-red-700 transition-colors group"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-red-600 opacity-30 blur-xl transition-opacity group-hover:opacity-50" />
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 right-8 z-[60] w-[calc(100vw-4rem)] max-w-sm h-[min(36rem,calc(100dvh-9rem))] rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/10 flex flex-col overflow-hidden"
          >
            <header className="relative overflow-hidden border-b border-gray-100">
              <div className={`absolute inset-0 bg-gradient-to-br ${botProfile.gradient}`} />
              <div className="relative flex items-center gap-3 px-5 py-4">
                <div className="relative">
                  <div className="h-11 w-11 rounded-full bg-white ring-2 ring-white shadow-md overflow-hidden">
                    <img
                      src={botAvatar}
                      alt={`Avatar von ${botName}`}
                      className="h-full w-full"
                      draggable={false}
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-roboto text-sm font-bold text-gray-900 leading-tight">
                    {botName}
                  </p>
                  <p className="font-inter text-[0.7rem] text-gray-600 mt-0.5">
                    {botProfile.role} · Hango
                  </p>
                </div>
              </div>
            </header>

            {!hasConsent && (
              <ConsentGate botName={botName} onAccept={acceptConsent} />
            )}

            <div
              ref={scrollRef}
              aria-hidden={!hasConsent}
              className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-white to-[#fafafa] ${
                !hasConsent ? "hidden" : ""
              }`}
            >
              {messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  botName={botName}
                  botAvatar={botAvatar}
                  isStreaming={
                    isLoading &&
                    i === messages.length - 1 &&
                    m.role === "assistant" &&
                    m.content === ""
                  }
                />
              ))}

              {!hasUserMessage && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="pt-1 pl-11 flex flex-wrap gap-2"
                >
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              {error && <p className="text-xs text-red-600 px-1">{error}</p>}
            </div>

            <div
              className={`border-t border-gray-100 bg-white/80 backdrop-blur-md p-3 ${
                !hasConsent ? "hidden" : ""
              }`}
            >
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    rows={1}
                    placeholder={`Nachricht an ${botName}…`}
                    disabled={isLoading}
                    maxLength={2000}
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/15 max-h-32 disabled:opacity-50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Senden"
                  className="h-10 w-10 flex-shrink-0 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-md"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
              <p className="mt-2 px-1 text-[0.65rem] text-gray-400 leading-snug text-center">
                Antworten können Fehler enthalten. Bitte keine persönlichen Daten eingeben.{" "}
                <button
                  type="button"
                  onClick={revokeConsent}
                  className="underline hover:text-red-600 transition-colors"
                >
                  Einwilligung widerrufen
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ role, content, isStreaming, botName, botAvatar }) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-red-600 text-white px-3.5 py-2.5 font-inter text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 items-start">
      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-white ring-1 ring-gray-200 shadow-sm overflow-hidden">
        <img src={botAvatar} alt="" aria-hidden className="h-full w-full" draggable={false} />
      </div>
      <div className="flex max-w-[80%] flex-col gap-1">
        <span className="text-[0.65rem] font-semibold text-gray-500 pl-1">{botName}</span>
        <div className="rounded-2xl rounded-tl-md bg-white ring-1 ring-gray-200 text-gray-900 px-3.5 py-2.5 font-inter text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm">
          {isStreaming ? <TypingIndicator botName={botName} /> : content}
        </div>
      </div>
    </div>
  );
}

function ConsentGate({ botName, onAccept }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label="Chat starten"
      className="flex-1 flex flex-col items-center justify-center text-center px-6 py-6 bg-gradient-to-b from-white to-[#fafafa]"
    >
      <h3 className="font-roboto text-base font-bold text-gray-900">
        Bereit für ein Gespräch?
      </h3>
      <p className="mt-2 font-inter text-xs leading-relaxed text-gray-600 max-w-[16rem]">
        Mit dem Klick auf „Los geht's" startest du den Chat mit {botName} und
        stimmst der Verarbeitung deiner Nachrichten gemäß unserer{" "}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline hover:text-red-700"
        >
          Datenschutzerklärung
        </a>{" "}
        zu.
      </p>

      <button
        type="button"
        onClick={onAccept}
        className="mt-5 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all"
      >
        Los geht's
      </button>

      <p className="mt-3 font-inter text-[0.65rem] text-gray-400">
        Jederzeit widerrufbar
      </p>
    </motion.div>
  );
}

function TypingIndicator({ botName }) {
  return (
    <span className="inline-flex items-center gap-2 py-0.5 text-gray-500">
      <span className="inline-flex gap-1 items-center">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
      </span>
      <span className="text-[0.7rem] italic">{botName} schreibt…</span>
    </span>
  );
}

export default ChatWidget;
