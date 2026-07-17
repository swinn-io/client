# Env Credentials (`.env.local`) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move real dev credentials out of the committed/untracked `.env` into a gitignored `.env.local`, harden `.gitignore`, and prove no secret is (or was) committed to this open-source repo.

**Architecture:** Follows `docs/plans/2026-07-17-env-credentials-design.md`. Expo loads env files with `.env.local` ranking *above* `.env.development` (which ranks above `.env`), so `.env.local` (gitignored via the existing `.env*.local` rule) is the correct place for secrets that must override the committed non-secret placeholders.

**Tech Stack:** Expo SDK 57 `EXPO_PUBLIC_*` dotenv loading (`@expo/env`), git.

**Branch:** `feature/expo-sdk-upgrade` (continue here).

**SECURITY RULES for the implementer:**
- **Never `cat`/`grep`/print the contents** of `.env` or `.env.local` — they contain secrets. Use `mv`, `ls`, `wc -l`, `git check-ignore` only.
- Committed files (`.env.development`, `.env.production`, `.env.example`) are meant to be non-secret and MAY be printed for the audit.
- No test runner in this repo; each task's verification command is its test.

---

### Task 1: Baseline secret audit (before any change)

**Files:** none modified (read-only audit).

**Step 1: Confirm `.env` / `.env.local` are not tracked or staged**

Run:
```bash
git ls-files --error-unmatch .env .env.local 2>&1 || echo "OK: neither is tracked"
git diff --cached --name-only | grep -E '^\.env(\.local)?$' && echo "WARNING: staged!" || echo "OK: neither is staged"
```
Expected: "OK: neither is tracked" and "OK: neither is staged". If either is tracked/staged → STOP and report (a secret may already be exposed).

**Step 2: Confirm `.env` / `.env.local` never appear in git history**

Run:
```bash
git log --all --oneline -- .env .env.local
```
Expected: no output (empty). Any commit listed → report it; the secret must be treated as compromised/rotated (history rewrite is out of scope for this plan).

**Step 3: Audit committed env files for real (non-placeholder) secrets**

These are safe to print (they must be non-secret):
```bash
echo "--- .env.development ---"; cat .env.development
echo "--- .env.production ---";  cat .env.production
echo "--- .env.example ---";     cat .env.example
```
Verify: `.env.development` values are placeholders (e.g. `localhost`, `key=local`), `.env.production` has an EMPTY `EXPO_PUBLIC_REVERB_KEY`, and `.env.example` has no real values. If any real credential is present in a committed file → STOP and report (it needs removal + rotation).

**Step 4: Record the audit result**

No commit (read-only). Report: tracked? staged? in history? any real secret in committed files? Proceed only if all clear.

---

### Task 2: Move `.env` → `.env.local`

**Files:**
- Delete: `.env`
- Create: `.env.local` (gitignored; secret contents preserved from `.env`)

**Step 1: Guard against clobbering an existing `.env.local`**

Run:
```bash
if [ -f .env.local ]; then echo "STOP: .env.local already exists — merge manually"; else echo "OK to move"; fi
```
Expected: "OK to move". If it says STOP, do not overwrite — report and let the user merge.

**Step 2: Move the file (do NOT print contents)**

Run:
```bash
mv .env .env.local
```

**Step 3: Verify the move without revealing secrets**

Run:
```bash
[ -f .env ] && echo "FAIL: .env still exists" || echo "OK: .env removed"
[ -f .env.local ] && echo "OK: .env.local exists ($(wc -l < .env.local) lines)" || echo "FAIL: .env.local missing"
git check-ignore .env.local && echo "OK: .env.local is gitignored" || echo "FAIL: .env.local NOT ignored"
```
Expected: `.env` removed, `.env.local` exists with the same line count as the old `.env`, and `.env.local` is gitignored (by the existing `.env*.local` rule).

**Step 4: Commit**

Nothing to commit yet (only gitignored/removed-untracked files changed; `.env` was never tracked). Skip the commit; the tracked change lands in Task 3.

---

### Task 3: Harden `.gitignore` with an exact `.env` rule

**Files:**
- Modify: `.gitignore`

**Step 1: Append the exact `.env` safety-net rule**

The current rule is `.env*.local` (line ~17). Append an exact `.env` match so a future stray `.env` with secrets can never be committed. Add these lines to `.gitignore`:
```
# Never commit a root .env (secrets live in .env.local); mode files stay tracked
/.env
```
> Use `/.env` (anchored to repo root, exact) so it does NOT match `.env.development` / `.env.production` / `.env.example`.

**Step 2: Verify the ignore matrix**

Run:
```bash
git check-ignore .env .env.local && echo "-> .env and .env.local ignored"
for f in .env.development .env.production .env.example; do
  git check-ignore "$f" >/dev/null 2>&1 && echo "WRONG: $f ignored" || echo "OK: $f tracked-eligible"
done
```
Expected: `.env` and `.env.local` are ignored; `.env.development` / `.env.production` / `.env.example` are NOT ignored.

**Step 3: Confirm only the intended env files are tracked**

Run:
```bash
git ls-files | grep -E '(^|/)\.env' || echo "(none)"
```
Expected: exactly `.env.development`, `.env.production`, `.env.example` (no `.env`, no `.env.local`).

**Step 4: Commit**

```bash
git add .gitignore
git commit -m "Ignore root .env so credentials stay out of the open-source repo"
```
Include trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

### Task 4: End-to-end verification

**Files:** none modified.

**Step 1: Working tree is clean (no secret file dangling as untracked)**

Run:
```bash
git status --porcelain | grep -E '\.env' && echo "CHECK: env file showing in status" || echo "OK: no env files in git status"
```
Expected: "OK: no env files in git status" (`.env.local` is ignored, `.env` is gone).

**Step 2: Runtime — `.env.local` overrides `.env.development`**

Run (Node 22 via fnm):
```bash
eval "$(fnm env)" && fnm use 22
npx expo start --dev-client
```
Load the app in the iOS dev client. Confirm the values now come from `.env.local` (e.g. Reverb uses the real host/key and logs `[reverb] connected` instead of `[reverb] unavailable`, given valid creds). Stop Metro when done.

> If Reverb still shows `unavailable`, that's a credentials/server-reachability issue, not this change — the override mechanism is proven by the value taking effect at all.

**Step 3: Final report**

Summarize: audit clean, `.env` → `.env.local` moved, `.gitignore` hardened & committed, only the 3 non-secret env files tracked, override verified at runtime.

---

## Done criteria

- Audit shows no secret tracked, staged, or in history; committed env files are non-secret.
- `.env.local` holds the real dev creds and is gitignored; `.env` no longer exists.
- `.gitignore` ignores `.env` + `.env*.local`; `.env.development`/`.env.production`/`.env.example` stay tracked (committed in a scoped commit).
- App runs in dev with `.env.local` values overriding the committed placeholders.

## Follow-ups (out of scope)

- Production secret delivery via EAS environment variables / EAS secrets.
- `config/env.js` default domain (`swinn.me` vs original `swinn.io`).
- If Task 1 finds a committed secret: rotate it and scrub history (separate, careful task).
