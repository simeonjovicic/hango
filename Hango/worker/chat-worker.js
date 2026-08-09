const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const ipRequests = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const arr = ipRequests.get(ip) || [];
  const recent = arr.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  ipRequests.set(ip, recent);
  if (ipRequests.size > 1000) {
    for (const [key, times] of ipRequests) {
      if (times.length === 0 || now - times[times.length - 1] > RATE_LIMIT_WINDOW_MS) {
        ipRequests.delete(key);
      }
    }
  }
  return true;
}

const ALLOWED_ORIGINS = new Set([
  "https://hango.at",
  "https://www.hango.at",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
]);

const ALLOWED_BOT_NAMES = new Set(["Hugo", "Mia", "Leo", "Ben", "Lara", "Nora", "Finn"]);

function buildSystemPrompt(botName) {
  const name = ALLOWED_BOT_NAMES.has(botName) ? botName : "Hugo";
  return `Du bist ${name}, der freundliche, professionelle Chat-Assistent auf der Website von Hango Webdesign. Wenn jemand nach deinem Namen fragt, antworte mit "${name}".

ÜBER HANGO:
- Hango Webdesign ist eine Webdesign-Agentur, die moderne, hochwertige Websites für Unternehmen baut.
- Stil: clean, hochwertig, Apple-inspiriert.
- Schwerpunkte:
  1. Webentwicklung & UI/UX — maßgeschneiderte, responsive Websites mit schnellen Ladezeiten, Wartung und Hosting.
  2. Suchmaschinenoptimierung (SEO) — Local & E-Commerce SEO, On-Page & Off-Page, Keyword-Recherche, technisches SEO.
  3. Online Marketing — Meta & Google Ads, Targeted Ads Setup, A/B Testing, Conversion Tracking.
- Stärken: Zeiteffizient, Sicherheit (Schutz gegen DDoS), Reichweitensteigerung durch gezieltes SEO und smarte Ads.

VERHALTEN:
- Antworte auf Deutsch (außer der Nutzer schreibt in einer anderen Sprache).
- Höflich, präzise, ohne Bullshit. Halte Antworten kurz (2-4 Sätze), außer der Nutzer fragt explizit nach Details.
- Bei konkreten Anfragen zu Preisen, Verfügbarkeit, Projekt-Timelines oder individuellen Angeboten: Verweise freundlich auf das Kontaktformular auf der Website.
- Bei Themen außerhalb von Webdesign / Marketing / Hango: Lenke höflich zurück zum Thema, z.B. "Dazu kann ich leider nichts sagen — soll ich dir etwas zu unseren Services erklären?".
- Erfinde KEINE Fakten: keine konkreten Preise, keine Kunden-Namen, keine Garantien, keine Mitarbeiter-Anzahl. Bei Unsicherheit: aufs Kontaktformular verweisen.
- Verwende keine Emojis.`;
}

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://hango.at";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonError(message, status, cors) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin);

    // Die CORS-Header oben schützen nur Browser. Fremde Aufrufer würden sonst
    // ungehindert durchlaufen und Groq-Tokens verbrauchen — hier hart ablehnen.
    // Browser senden bei POST immer einen Origin, auch bei gleicher Domain.
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return jsonError("Forbidden", 403, cors);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors });
    }

    if (!env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY ist nicht gesetzt");
      return jsonError("Der Chat ist gerade nicht erreichbar.", 503, cors);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!checkRateLimit(ip)) {
      return jsonError("Zu viele Anfragen, bitte kurz warten.", 429, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON", 400, cors);
    }

    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return jsonError("Invalid messages", 400, cors);
    }
    for (const m of messages) {
      if (!m || (m.role !== "user" && m.role !== "assistant")) {
        return jsonError("Invalid role", 400, cors);
      }
      if (
        typeof m.content !== "string" ||
        m.content.length === 0 ||
        m.content.length > MAX_CONTENT_LENGTH
      ) {
        return jsonError("Invalid content", 400, cors);
      }
    }

    const botName = typeof body?.botName === "string" ? body.botName : undefined;
    const systemPrompt = buildSystemPrompt(botName);

    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!groqRes.ok) {
      // Nur loggen, nicht ausliefern — die Antwort kann Kontingent- und
      // Kontodetails enthalten und landet sonst im Browser des Besuchers.
      console.error("Groq-Fehler", groqRes.status, await groqRes.text());
      return jsonError("Der Chat ist gerade nicht erreichbar.", 502, cors);
    }

    return new Response(groqRes.body, {
      status: 200,
      headers: {
        ...cors,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  },
};
