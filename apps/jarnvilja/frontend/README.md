# Järnvilja — React portfolio demo

Vite + React client with a centralized API layer under `src/services/api/`. All HTTP traffic for **live** mode goes through `httpClient.ts`; UI code must not call `fetch` directly (enforced by ESLint outside this folder).

## Modes

| `VITE_API_MODE` | Behavior |
|-----------------|----------|
| `live` (default) | Session cookies + CSRF (`XSRF-TOKEN` → `X-XSRF-TOKEN`) against Spring Security. |
| `mock` | In-memory data, artificial delay, no backend. |

## Local live mode (with Spring)

1. Start the backend (e.g. `./mvnw spring-boot:run -Dspring.profiles.active=demo` from the repo root).
2. Copy `.env.example` to `.env` and keep `VITE_API_BASE_URL` empty so requests stay same-origin.
3. `npm install` then `npm run dev` (default proxy target `http://localhost:8080`).
4. Open **http://localhost:5174** (fixed in `vite.config.ts`; `strictPort` prevents silent fallback to another port). Log in as a **member** (e.g. demo / demo123 in demo profile).

The portfolio site embeds this app via iframe at the same URL—keep Vite on **5174** or update `VITE_JARNVILJA_URL` in the portfolio app to match.

`CookieCsrfTokenRepository.withHttpOnlyFalse()` is enabled on the server so the SPA can read the CSRF cookie. Login/register use `redirect: 'manual'` to interpret Spring’s 302 responses without losing session cookies.

## Mock mode

```bash
VITE_API_MODE=mock npm run dev
```

Use **demo** / **demo123** or register a new account (data resets on full page reload).

## Build

```bash
npm run build
```

For a production build that talks to a remote API, set `VITE_API_BASE_URL` to the backend origin and ensure CORS and credentials are configured accordingly.
