# Deployment

Drei Dinge laufen getrennt voneinander:

| Was | Wo | Konfiguration |
| --- | --- | --- |
| Website | Cloudflare Worker `hango` (statische Assets) | [`wrangler.jsonc`](wrangler.jsonc) |
| KI-Chat | Cloudflare Worker `falling-heart-60e1` | [`worker/wrangler.jsonc`](worker/wrangler.jsonc) |
| E-Mail | Hostinger | DNS-Einträge in Cloudflare |

Beide Worker hängen im Dashboard an Git und bauen bei einem Push selbst. Es gibt
kein Pages-Projekt — falls doch noch eines existiert, sollte es gelöscht werden,
sonst laufen zwei Deployments derselben Website nebeneinander.

## Website

### Build-Einstellungen im Dashboard

Worker `hango` → **Settings → Build**:

| Feld | Wert |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Path | `/` |

**Das Build-Kommando ist zwingend.** Ohne es lädt Wrangler das Repo-Verzeichnis
hoch statt `dist/`. Die ausgelieferte `index.html` zeigt dann auf
`/src/main.jsx`, das nie transpiliert wurde — die Seite bleibt weiß. Genau in
dem Zustand war der Worker anfangs.

### wrangler.jsonc

```jsonc
"assets": {
  "directory": "./dist/",
  "not_found_handling": "single-page-application"
}
```

`not_found_handling` übernimmt das SPA-Routing: Unbekannte Pfade liefern
`index.html` mit Status 200, statt eines 404. Ohne das sind `/gallery`,
`/impressum` und `/privacy-policy` bei Direktaufruf oder Reload nicht
erreichbar — so war es auf Hostinger live.

Lokal prüfen, was Cloudflare ausliefern wird:

```bash
npm run build
npx wrangler dev
```

### Domain verbinden

Sobald die Zone `hango.at` in Cloudflare aktiv ist: Worker `hango` → **Settings
→ Domains & Routes → Add custom domain** → `hango.at` und `www.hango.at`.
Cloudflare ersetzt dabei die alten A- und AAAA-Einträge, die noch auf den
Hostinger-Server zeigen. **Die Mail-Einträge bleiben unangetastet.**

Danach unter **SSL/TLS → Overview** auf **Full (strict)** prüfen.

## Chat-Worker

Eigener Worker, eigene Config in [`worker/`](worker/). Er hat ein Script und
damit auch Secrets — anders als die Website, die nur aus statischen Dateien
besteht.

### Deployen

```bash
cd worker
npx wrangler deploy
```

Bei Anbindung an Git ist hier **Path = `/worker`** einzutragen, denn dort liegt
die Config. Der Name in `wrangler.jsonc` bestimmt, wohin deployt wird — nicht,
an welchem Worker die Build-Konfiguration hängt. Ein abweichender Name erzeugt
einen zweiten, leeren Worker ohne Secret.

### Secret setzen

```bash
cd worker
npx wrangler secret put GROQ_API_KEY
```

Der Key steht ausschließlich in Cloudflare, nie im Repository.

### Nach Aktivierung der Zone

In `worker/wrangler.jsonc` `workers_dev` auf `false` setzen und die Route
`hango.at/api/chat` aktivieren, dann neu deployen. Danach in
`src/components/ChatWidget.jsx` die Konstante auf den relativen Pfad
`/api/chat` umstellen — gleiche Domain, damit entfällt CORS komplett.

`workers_dev: false` erst dann, aber dann auch wirklich: Solange die
workers.dev-Adresse erreichbar ist, lässt sich jede Ratenbegrenzung auf der
Domain-Route damit umgehen.

## Automatische Builds prüfen

Angebunden wurde über eine **öffentliche Git-URL**, nicht über die GitHub-App —
das Repository gehört einem anderen Account. Cloudflare kann in dem Fall keinen
Webhook im Repository setzen und bekommt Pushes unter Umständen nicht mit.

Nach dem nächsten Push im Dashboard nachsehen, ob ein Build startet. Falls
nicht, hilft ein Deploy Hook, der per `curl -X POST` aus einer GitHub Action
aufgerufen wird — oder schlicht `npx wrangler deploy` von Hand.

## Missbrauchsschutz

Im Chat-Worker umgesetzt:

- **Fremde Origins werden mit 403 abgewiesen.** Vorher setzte der Worker nur
  CORS-Header — die schützen ausschließlich Browser, ein direkter Aufruf lief
  durch und verbrauchte Groq-Tokens.
- **Upstream-Fehler werden nicht mehr ausgeliefert**, sondern nur geloggt. Die
  Groq-Antwort kann Kontingent- und Kontodetails enthalten.
- **Fehlendes `GROQ_API_KEY`** führt zu einer sauberen 503 statt zu einem
  Aufruf mit ungültigem Token.

Noch offen, per Dashboard zu erledigen:

- **EmailJS-Domainsperre.** Service-ID, Template-ID und Public Key stehen
  zwangsläufig im Browser-Bundle. Ohne Einschränkung kann jeder darüber Mails
  über den Account verschicken. EmailJS → **Account → Security → Allowed
  Origins** auf `hango.at` begrenzen.
- **WAF-Ratelimit** auf `hango.at/api/chat`, sobald die Route steht. Das
  In-Memory-Limit im Worker zählt nur pro Isolate und ist damit eher Bremse als
  Sperre.

## E-Mail

Die Postfächer liegen bei Hostinger, die MX-Einträge zeigen auf
`mx1/mx2.hostinger.com`. Der Umzug der Website ändert daran nichts.

Diese Einträge müssen in Cloudflare auf **DNS only** (graue Wolke) stehen —
hinter dem Proxy antwortet Cloudflare mit eigenen IPs statt der CNAME-Kette und
DKIM bricht:

| Eintrag | Typ |
| --- | --- |
| `hostingermail-a/b/c._domainkey` | CNAME (DKIM) |
| `autoconfig`, `autodiscover` | CNAME |
| `ftp` | A |
| MX, SPF, `_dmarc` | ohnehin nicht proxybar |

**Den Hostinger-Tarif nicht kündigen** — damit wären die Postfächer weg. Wer
Hostinger komplett verlassen will, muss die Mail vorher zu einem anderen
Anbieter migrieren und danach MX, SPF und DKIM umstellen.

## Rollback

Nameserver beim Registrar zurück auf `ns1/ns2.dns-parking.com`. Die
Hostinger-Zone und die Dateien in `public_html` bestehen unverändert weiter, die
alte Seite ist damit sofort wieder da.

## Offener Punkt: Build-Größe

`dist/` ist rund 189 MB groß. Davon sind etwa 56 MB Dateien, die nirgends im
Code referenziert werden (`assets/images/logo-white.png` mit 16 MB sowie
`0/2/4/6/7/9/12.png` mit je 4–6 MB). Zusätzlich lädt der Hero beim Seitenstart
rund 20 MB an `phone-view`-PNGs. Aufräumen und Komprimieren wäre der größte
Hebel für die Ladezeit.
