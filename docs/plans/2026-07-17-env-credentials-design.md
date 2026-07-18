# Design: Keep credentials out of the open-source repo via `.env.local`

Date: 2026-07-17
Branch: `feature/expo-sdk-upgrade`
Status: Approved (design phase)

## Problem

The repo is open source. Real dev credentials (e.g. `EXPO_PUBLIC_REVERB_KEY`) must not
be committed, but the app must still run from a fresh clone. The user initially put
real values in an untracked `.env`, expecting it to override the committed
`.env.development`.

## Key constraint (Expo env precedence)

`@expo/env` (`getEnvFiles`) loads files in this order, **highest priority first**:

```
.env.development.local   ← highest
.env.local
.env.development
.env                     ← lowest
```

So `.env` is the **lowest** priority — `.env.development` overrides `.env`, not the
reverse. Putting secrets in `.env` does not override the committed placeholders; the
placeholders win. (This is the likely cause of the observed `[reverb] unavailable`:
the committed `.env.development` `localhost`/`key=local` placeholders were overriding
the real values in `.env`.)

The idiomatic gitignored override file is **`.env.local`** (all modes) — it ranks
above `.env.development` and is already matched by the existing `.env*.local`
gitignore rule.

## Decision

- Real dev credentials live in **`.env.local`** (gitignored).
- Committed `.env.*` files hold **non-secret** values only.
- The stray `.env` is removed, and `.env` is added to `.gitignore` as a safety net.

## File roles

| File | Committed | Contents | Priority |
|------|-----------|----------|----------|
| `.env.development` | yes | non-secret dev placeholders (localhost, `key=local`) | low |
| `.env.production` | yes | non-secret prod defaults; real prod key via EAS env / `.env.production.local` | low |
| `.env.example` | yes | documented template, no values | n/a |
| `.env.local` | no (gitignored) | real dev credentials — overrides `.env.development` | high |

A fresh clone builds/runs on the committed placeholders; a developer's local
`.env.local` transparently overrides them with real credentials. No secrets in git.

## Changes

1. **Move** current `.env` contents into `.env.local` (so real values win — expected to
   resolve `[reverb] unavailable` once creds are valid).
2. **Delete** the stray `.env`.
3. **Harden `.gitignore`**: add an exact `.env` rule alongside `.env*.local`. Keeps
   `.env.development` / `.env.production` / `.env.example` tracked (different names).
4. **Audit** committed env files + git history to confirm no real secret was ever
   staged or committed. `.env.development`/`.env.production` currently hold
   `key=local` / empty key — non-secret — but verify before trusting as
   open-source-safe.

## Error handling / edge cases

- `config/env.js` already falls back to safe defaults when a var is unset, so a clone
  without `.env.local` still boots.
- If a secret is found already committed in history, note it — it must be rotated
  (removing it from the working tree does not remove it from history).

## Verification

1. `git check-ignore .env .env.local` → both print (ignored).
2. `git ls-files | grep -E '(^|/)\.env'` → only `.env.development`, `.env.production`,
   `.env.example`.
3. `grep -rIl <secret-ish patterns>` across tracked files → none.
4. Run the app in dev → `.env.local` values take effect (Reverb connects with valid
   creds instead of `unavailable`).

## Out of scope

- Production secret delivery (EAS environment variables / EAS secrets) — separate task.
- The `config/env.js` default domain (`swinn.me` vs `swinn.io`) — tracked separately.
