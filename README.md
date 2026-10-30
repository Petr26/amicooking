# Handoff: Am I Cooking? — Mobile App (iOS + Android)

## Overview
"Am I Cooking?" is a single-user cooking-decision companion. Every evening it gives one blunt verdict — a dish to cook tonight — which the user can accept ("I'm cooking this"), reroll ("Ask again", with escalating sarcastic jabs), or decline ("No. I'm ordering in"). Accepting leads to a commit screen, then a step-by-step cook mode with per-step countdown timers, a "done" poster, and a one-tap log entry. Supporting surfaces: a Saved dishes library (with add-your-own-dish form), an activity Log, and a You tab (language EN/CS, time budget, preference toggles, stats).

**Target: native mobile apps for iOS and Android, built with React Native + Expo.** The prototype is React-shaped on purpose — state, flows, and data structures port directly.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing intended look and behavior, not production code to ship. The task is to **recreate this design in a React Native + Expo codebase**: RN components + StyleSheet (or your styling lib), Expo modules for notifications/haptics, AsyncStorage for persistence. The prototype's logic class (bottom of `Am I Cooking App.dc.html`) contains the complete state machine, dish data, step data, and both language string tables — port these nearly verbatim.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final. Recreate pixel-perfectly within platform conventions. The design system is "Modernist": flat, architectural, zero corner radius everywhere, strong 2px rules, flush-left labels (including inside buttons), black-and-white photography only.

## Design Tokens
- Ground / light text: `#f3f2f2`
- Ink (text): `#201e1d`
- Accent red: `#ec3013`; hover/pressed: `#dd2b0f`; deep: `#ae1800`
- Dark surface (opt-out screen): `#201e1d`
- Strong rule: 2px `rgba(32,30,29,.4)`; hairline: 1px `rgba(32,30,29,.18)`
- Muted text: `rgba(32,30,29,.55–.6)`; faint: `rgba(32,30,29,.5)`
- On-red rules: `rgba(243,242,242,.5)`
- Border radius: **0 everywhere.** No shadows.
- Font: **Archivo** (weights 400, 600, 800) — bundle via `expo-font` / `@expo-google-fonts/archivo`
- Type scale (px): display 68–88/0.86 w800 tight tracking (-.03em); dish name 27–31/1.02; screen title 30; step text 36/1.06; timer 46; stat number 26; body 14–16/1.5; meta labels 9–13 w600–800 uppercase, letter-spacing .05–.14em
- All uppercase labels use letter-spacing .05em–.14em; headings use negative tracking

## Screens / Views

### 1. Tonight — Verdict (default screen)
- Header row: app title "Am I cooking?" (13px w800 uppercase) left, meta "Solo · Tue 19:04" right; 2px rule below
- Kicker row: "Tonight" label + roll counter ("First answer" / "Answer N" in deep red)
- Giant "Yes." in accent red, 68px w800, animates in on each reroll (translateY 16px + fade, 460ms cubic-bezier(.16,.84,.24,1); dish name same at 70ms delay)
- Sarcastic jab line under it (13px muted) — escalates with reroll count (see `jabs` arrays; index = min(rolls, len-1))
- Dish name 31px w800
- Photo slot 186px, grayscale filter, 2px rules top/bottom (use a real image component; keep grayscale)
- 3-col stat grid (Time / Washing up / Status), 1px column separators
- Dish note (14.5px) + "Missing: X" line (deep red, uppercase)
- Buttons: primary full-width accent "I'm cooking this →" (label left, arrow right, 16px padding); row of two outlined: "Ask again" + "Save for later"/"Saved ✓"; ghost text link "No. I'm ordering in →" (accent)
- Footer note 12px muted

### 2. Tonight — Committed (accent red full-bleed)
- Entire screen `#ec3013`, light text: kicker "Confirmed 19:07", display "You're cooking." 74px, dish name 27px, meta line, 2px light rule, commit line copy
- Bottom: light button "Show me the steps →" (light bg, ink text) + ghost "I lied. Ask me again →"

### 3. Tonight — Opted out (dark full-bleed)
- Same layout on `#201e1d`: "No. Not cooking." display, opt-out copy, "Saved for another night" + dish name
- Light primary "Fine. Ask me again →" + ghost "See what I've saved →"

### 4. Cook mode (replaces tab UI entirely — no tab bar)
- Header: "Cooking" + "Stop →" (accent, returns to committed); 2px rule
- Step position "Step N of M" + dish name (deep red); progress pips: flex row of 4px bars, done = accent, todo = `rgba(32,30,29,.18)`
- Step text 36px w800, slides in per step (translateX 20px, 380ms); detail line 16px muted
- Timer block (only when step has minutes): top+bottom 2px rules; label "Timer · N min", clock 46px w800 (m:ss); right-side 104px Start button (accent, label flush-left) → Pause (transparent, left border) when running. Countdown runs off a wall-clock end time (survives re-render; in RN also background the same way)
- No-timer steps show "No timer on this one. Use your eyes." above hairline
- Bottom: primary "Done — next step →"; ghost "← Back a step". Last step → Done screen
- Timer state resets on step change; pause preserves remaining seconds

### 5. Cook done (accent red full-bleed)
- "Done · 19:41" kicker, "Eat." 88px, dish name, light rule, done line (uses time + pans), light "Log it →" button + ghost "Run the steps again →"
- "Log it" prepends entry to log and navigates to Log tab

### 6. Saved tab
- Title "Saved" 30px + count ("N dishes") + accent "+ Add" button; 2px rule
- Rows: dish name 19px w800, meta line (time · pans · status) uppercase muted; right column: accent "Cook tonight" (jumps to Committed with that dish) + ghost "Remove"; 1px row rules
- Empty state: "Nothing here." + quip + "Get a verdict →" primary
- **Add-dish form** (replaces list): title "Your dish.", name input, minutes segmented control (15/20/30/45), pans segmented (1 pan / 2 pans), optional note input, "Add it →" primary (45% opacity until name non-empty), "Never mind" ghost. Inputs: 1px `rgba(32,30,29,.4)` border, radius 0, transparent bg. New dish: statusNew=true, auto-saved, single generic cook step, enters verdict pool

### 7. Log tab
- Title "Log" + "Cooked A of B"; quip paragraph; entries: date col (52px, uppercase), name + note, right badge — filled accent "Cooked" or outlined "Ordered in"; footer note. Entries logged from cook mode show "Tonight" + "Logged from cook mode. No notes."

### 8. You tab
- Title "You"; Language segmented (English / Čeština) + note; "On a normal night I have" segmented (15 min / 30 min / An hour / No limit) + contextual note; three toggle rows (Break my rotation / Never suggest fish / Ask before 6pm) — square 56×28 switches, accent when on, thumb is a 24×22 block; stats grid (Yeses 23 / Rerolls 61 / New dishes 7, last in accent); stats quip; footer "amicooking.com"
- Toggles are functional: rotation prefers statusNew dishes; noFish filters fish; time budget filters `time <= maxTime`

### Tab bar
- 2px rule above; 4 tabs (Tonight / Saved / Log / You), flush-left labels 11px w800 uppercase; active = 4px accent top border + ink text; inactive = 45% ink. Hidden entirely during cook mode. Respect safe-area bottom inset.

## Interactions & Behavior
- Reroll cycles through the filtered pool (`vIdx+1 % pool.length`), increments roll counter, replays land animation, advances jab
- Pool filter: time <= maxTime AND (noFish ? !fish : true); if breakRotation and any statusNew dishes exist, restrict to those; empty pool falls back to all dishes
- Commit stores dish id; "I lied" / "Fine. Ask me again" return to verdict AND advance the roll
- Save toggle adds/removes dish id from saved list
- Timers: store end timestamp, derive remaining every 500ms; **in RN use the same wall-clock approach + expo-notifications local notification at end time so it fires backgrounded**
- Language switch (You tab) re-renders every string instantly; all copy exists in EN + CS (see `ui` object)
- Animations: entrance fade+translate only, ~380–520ms, cubic-bezier(.16,.84,.24,1); alternate between two keyframe names to retrigger (in RN just re-run Animated/Reanimated on key change)

## State Management
State (prototype top-level; in RN: one context/store + AsyncStorage):
- `tab` (tonight|saved|log|you), `mode` (verdict|committed|optout|cooking|cookdone)
- `vIdx`, `rolls` (session), `saved` (dish ids — **persist**), custom dishes (**persist**)
- `maxTime`, `noFish`, `breakRotation`, `askEarly`, `lang` (**persist all**)
- `cookDish`, `cookStep`, timer end-timestamp, `log` entries (**persist**)
- The full dish array (8 dishes), per-dish step arrays (with EN+CS text and optional minutes), and the complete EN/CS UI string tables are in the logic class — copy them into a `data/` module verbatim

## Native additions (not in prototype — build these)
- **6pm nudge**: when "Ask before 6pm" is on, schedule a daily local notification (expo-notifications) ~18:00: "Am I cooking tonight?" → opens verdict screen
- **Timer completion**: local notification + haptic when a step timer hits zero, incl. backgrounded
- **Persistence**: AsyncStorage for saved/custom dishes, prefs, log, language (prototype is session-only)
- Keep-awake (expo-keep-awake) during cook mode
- Safe areas via react-native-safe-area-context; status bar dark-content on light screens, light-content on red/dark screens

## Assets
- Font: Archivo 400/600/800 (Google Fonts)
- Dish photos: placeholders in the prototype (drop slots). Product should use user photos or none; always render grayscale (or desaturated) per the design system
- No icons in the UI — arrows are the text glyph "→" / "←"

## Files
- `Am I Cooking App.dc.html` — the full prototype: template (all screens/states) + logic class (state machine, dish data, step data, EN/CS strings). **Primary reference.**
- `styles.css` — Modernist design-system token sheet (color ramps, spacing, type variables) the prototype builds on
- `ios-frame.jsx`, `image-slot.js`, `support.js` — prototype scaffolding only; ignore for implementation

## Suggested implementation order
1. `npx create-expo-app amicooking` (TypeScript template), expo-router or a simple tab navigator
2. Port data: dishes, steps, EN/CS string tables → `src/data/`
3. Theme constants (`tokens.ts`) from Design Tokens above; load Archivo
4. Screens in order: Tonight/verdict → committed/optout → Saved (+add form) → Log → You → Cook mode + timers
5. AsyncStorage persistence layer
6. expo-notifications: 6pm nudge + timer completion
7. EAS Build → TestFlight / Play internal testing

---

## Status (2026-10-30)
All screens above are implemented in `src/` (React Native + Expo SDK 57) and verified in the iOS simulator (iPhone 17 Pro), EN + CS. Persistence, 6pm nudge, timer notifications, haptics and keep-awake are wired.

Notes beyond the prototype:
- You-tab stats are live (yeses / rerolls / custom dishes, persisted), not the demo numbers.
- The notification permission dialog is only shown on a user action (toggling "Ask before 6pm" or starting a timer), never cold at first launch.
- Dev helper: `EXPO_PUBLIC_SCENARIO="<tab>:<mode>:<lang>" npx expo start` opens straight on a screen (e.g. `tonight:cooking`, `you:verdict:cs`). Ignored in release builds.

### Run locally
```
npm install
npx expo run:ios        # builds the native dev client and opens the simulator
npx expo run:android    # needs an emulator/device
```

### Ship
```
npm i -g eas-cli && eas login
eas build --profile preview --platform all     # internal testing (APK + iOS ad hoc)
eas build --profile production --platform all  # store builds
eas submit --platform ios / android
```
`eas.json` has `development`, `preview` and `production` profiles. Store listing, screenshots and Apple/Google developer accounts are still needed.

## Backend (2026-10-30)
PocketBase on the Forpsi VPS `185.28.103.160` (shared with Riskuj — don't touch its nginx vhost), served at `https://api.amicooking.com`. Everything lives in `backend/`:
- `pb_migrations/` — schema (`dishes`, `user_dishes`, `saved`, `log_entries`, extra `users` fields) + seed of the base dishes
- `pb_hooks/` — dish limits (`limits.js`: anon 5 / free 12 / pro 500, served to the app at `/api/amicooking/config`)
- `./deploy.sh` pushes migrations + hooks and restarts `amicooking-api`; `./deploy.sh setup` was the one-off install; `./deploy.sh logs` tails logs
- Admin UI: `https://api.amicooking.com/_/` (credentials in `backend/.admin.env`, not in git). Base dishes are edited there; a subscription is granted by setting `plan = pro` (+ optional `plan_expires`) on the user.
- Pro (not on sale yet): no practical dish limit, own steps with timers on own dishes, and base dishes marked `premium` in admin (their steps are only served to Pro; free users never get them in the verdict).
- Daily DB backup 03:30 to `/var/backups/amicooking` (14 days, same server only).

App side: signed-out users keep everything on the phone (limit 5 dishes = saved ∪ own). Signing in (e-mail + password for now) uploads that data to the account; after that changes are applied locally and queued in a persisted outbox (`src/state/sync.ts`), and the server state is pulled at launch / on foreground. Local dev against a local PocketBase: `EXPO_PUBLIC_API_URL=http://127.0.0.1:8090 npx expo start`.
