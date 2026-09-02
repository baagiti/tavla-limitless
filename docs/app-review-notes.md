# App Review Resubmission Package (Guideline 4.3 — Spam)

Everything needed for this resubmission: what to paste into App Review Information → Notes, and
what to paste into the public listing fields (Subtitle / Keywords / Description).

---

## 1. App Review Information → Notes

Paste the section below as-is.

> This app was flagged under Guideline 4.3 for sharing similar binary, metadata, and/or concept
> with another app. We have identified and fixed the concrete causes:
>
> 1. **Removed an in-app cross-promotion screen** (added in a prior build, already removed before
>    this rejection) that referenced our other, unrelated app by name inside Settings.
>
> 2. **Removed all leftover Google AI Studio scaffold artifacts** that this project inherited from
>    its original prototyping tool and that were never cleaned up:
>    - Generic template project name (`react-example`) in package.json, replaced with
>      `backgammon-limitless`.
>    - A leftover `metadata.json` project descriptor and boilerplate `README.md` from the
>      scaffolding tool, both removed/rewritten.
>    - Unused dependencies pulled in by the template (`@google/genai`, `express`, `dotenv`) that
>      were never used by this app's actual code, removed entirely.
>    - Stale, previously-synced native build folders that still contained assets from an earlier,
>      already-reverted feature — deleted and regenerated from a clean build.
>
> 3. **This app and our other backgammon-themed app are distinct products**, sharing no runtime
>    code, no user-facing branding, no shared screens, and no cross-links between them:
>    - *Backgammon Limitless* — a traditional, realistic backgammon simulator: physics-based
>      checkers, a luxury wood/ebony board aesthetic, a classic single-player AI opponent, match/
>      career statistics, and standard tournament doubling-cube rules.
>    - Our other app is a different genre entirely (a stylized deckbuilder/roguelike that merely
>      uses backgammon movement as one mechanic among many, with its own distinct visual identity,
>      campaign structure, and monetization).
>    Both originated from the same starting template (a common React/Vite/Capacitor scaffold),
>    which is why early, unpolished builds may have looked structurally similar to automated
>    review tooling — that shared scaffolding has now been fully removed from this app.
>
> We believe the app now clearly demonstrates unique, substantial functionality and content, and
> respectfully ask for re-review.

**Don't submit this and our other app back-to-back.** Apple's message says it may be matching
against apps "submitted by you" — get this one fully approved and live first, then submit the
other one separately later.

---

## 2. Public listing fields (Subtitle / Keywords / Description)

The old copy ("championship-grade... ultra-luxurious... realistic physical checkers...
career analytics...") was generic, superlative-heavy marketing text left over from the original
prototyping tool — exactly the kind of templated copy an automated spam filter is trained to
flag. Replaced below with specific, feature-grounded copy; nothing here is a claim the app can't
back up with an actual screen.

### Subtitle (max 30 chars)

> Classic Backgammon, Real AI

(27 chars. Alternatives, also under 30: "Real AI. Full Doubling Cube." / "Doubling Cube. Real AI Rival")

### Keywords (max 100 chars, comma-separated)

> backgammon,tavla,board game,dice,doubling cube,ai opponent,gammon,strategy,classic,offline

(90 chars)

### Description

> Backgammon Limitless is a full backgammon simulator built for players who want the real game —
> not a simplified mobile skin of it.
>
> - Real opponent, not dice luck: Hard difficulty runs an actual search engine that looks several
>   moves ahead — it can catch even confident players off guard.
> - Full doubling cube rules: offer, drop, and raise the stakes from 2x up to 64x, with the timing
>   that actually matters in match play.
> - Standard scoring too, if you prefer it: play without the cube using Single, Gammon, and
>   Backgammon wins.
> - Move Review: step back through your match move-by-move on the actual board to see exactly
>   where a game turned.
> - Career stats: match history and performance tracked over time, not just a single session.
> - Multiple board and checker sets, from dark ebony-and-gold to platinum-and-onyx.
> - A built-in rules reference for official backgammon guidelines — useful for learning the game
>   or settling a house-rule debate.
> - Available in 10 languages: English, Turkish, Arabic, German, Spanish, French, Hindi, Polish,
>   Russian, and Chinese.
>
> Play against the AI locally, or pass-and-play with a friend on one device. No ads interrupting a
> match — just backgammon.

**Notes:**
- If the app *does* end up with ads/IAP before submission, remove the "No ads" line — don't ship
  a listing that contradicts the binary, that's its own rejection risk (this app currently has no
  ad/IAP code at all, confirmed).
- Screenshots should visibly show the specific things named above (Move Review's board replay,
  the Statistics/career screen, the doubling cube at a high value, a couple of the board/checker
  themes) — matching claims in the text to what reviewers actually see reduces both the spam-
  template read and a possible "2.3.1 metadata mismatch" flag.

---

## 3. Internal changelog (this cleanup pass)

- `package.json`: renamed from template default `react-example` → `backgammon-limitless`;
  removed unused `@google/genai`, `express`, `dotenv`, `@types/express`.
- Deleted root `metadata.json` (unused AI Studio project descriptor; declared an unused
  `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` flag — the app makes no Gemini/AI Studio API calls).
- Rewrote `README.md` (removed AI Studio banner/link boilerplate).
- Removed `assets/.aistudio/` (empty AI Studio local-state stub).
- `vite.config.ts`: removed an AI-Studio-specific code comment.
- Deleted stale `dist/`, `android/app/src/main/assets/public/`, `android/app/build/`,
  `ios/App/App/public/` — these still contained a compiled JS bundle and an icon file
  (`nextgammon-icon.png`) from the previously-reverted cross-promo feature. Rebuilt from
  scratch with `npm run build && npx cap sync` — verified clean (no trace of the other app's
  name/assets anywhere in source or synced native projects).
