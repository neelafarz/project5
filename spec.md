# Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep a concise, testable description of what the project should do now and how the system is structured to do it.

## Working agreement

Developer: Approve the intended behavior and the system's structure, test directly, understand each part well enough to explain it in your own words, and update this file whenever either changes.

Agent: Read the project documents and inspect the project. Turn the Developer's decisions into acceptance checks without inventing product choices or freezing details that still need testing. Propose structures suited to the project's scope, with their trade-offs, in plain language. Keep the architecture consistent with the actual project and point out where they have drifted apart. Do not restructure the project without the Developer's approval.

When you begin this step, start a fresh chat so its transcript stays clean. For example:

`Read the project documents, inspect the project, and help me specify what the next version should do.`

*Status: DRAFT for Developer review. Items marked **(provisional)** are the Agent's proposed defaults, not yet decided by the Developer. Items marked **(open)** need a Developer decision.*

## Intended experience

Going Chairside is a mobile-first browser game, a study aid for learning the general flow of common dental procedures. The player starts at a title screen, presses Start, and picks one of six modes from a menu:

| # | Mode | Engine | Phase |
|---|------|--------|-------|
| 1 | Extraction | Procedure | open (provisional: Phase 4, cut first if time runs short) |
| 2 | Composite filling | Procedure | 2 (MVP) |
| 3 | Crown prep | Procedure | 3 |
| 4 | Crown seat | Procedure | 4, stretch |
| 5 | Root canal | Procedure | 4, stretch |
| 6 | Sterilization sort | Sort | 3 |

Modes not yet built show "coming soon." The game always states that it is a study aid and that steps vary by dentist, office, and state.

**Procedure modes (1 to 5).** The player sees the scene as the assistant: the dentist's arm, a patient with an open mouth, and a tray of tools. At each step the dentist holds out an empty hand and a 10-second countdown runs. The player taps the correct tool or material, it flies to the dentist's hand, and the scene advances. Popups note where a step varies by dentist.

**Sterilization sort (mode 6).** The game shows one tool at a time, and the player taps either the **ultrasonic cleaner** or **heat sterilization** (for example, handpieces go to heat sterilization). The result is a time-based score out of 100. It is a short minigame that trains the same recall skill as the procedures.

**Shared.** Both engines show feedback on wrong answers, never imply a clinical standard, and work by touch on a phone. On a laptop the game runs as a centered portrait column. A tutorial and in-game guide list each procedure's steps in order so players can read and memorize them.

## Behavior and acceptance checks

### App flow and screens

Screens follow the Developer's frames (opening, selection, game, sterilization sort, end). Approved:
- **Opening screen:** the logo and three buttons, Begin, Procedures, Settings. Begin opens the selection screen.
- **Selection screen:** a home icon, "Overall Accuracy" at the top right, the disclaimer box, and six tiles in this order: Filling, Crown Prep, Crown Seat, Root Canal, Extraction, Sterilization. Unbuilt modes read "coming soon" and cannot be started.
- **Game screens:** back arrow, countdown, pause button, a hint box, then the scene and tray (procedures) or the item and two bins (sort).
- **End screen:** stars, the score as a percent labeled "Accuracy," and Play Again, New Game, Home.
- The disclaimer is shown, word for word, on the opening screen, the selection screen, and an intro screen before every game: "This game is a simplified study aid. Tools, materials, and procedure steps vary by dentist, office, and patient needs. It is not a substitute for clinical training or office protocols." The countdown does not begin until the player taps Start on the intro screen.
- **Check:** from a fresh load, a player reaches any built mode in a few taps and can return to the selection screen from it. The disclaimer text matches word for word on all three screens.

Provisional (not yet confirmed by the Developer):
- **Play Again** returns to the intro screen of the same mode. **New Game** opens the selection screen. **Home** opens the opening screen.
- **Procedures** button: lists each built procedure's steps in order (the in-game guide). **Settings:** "coming soon," with no content decided.
- **Overall Accuracy:** the average of the best score in each mode played so far, shown as "--" before any play.
- **Stars:** 5, with one earned per 20% of the score, rounded down (80% gives 4 stars).
- **Pause:** freezes the countdown and covers the screen, with Resume and Quit. It works only during a timed pick, never during a result, wait, or popup.
- The "Accuracy" label is the time-based score, not the share of correct picks. The Developer may rename it.

### Procedure engine (modes 1 to 5)

Approved:
- Each step runs a 10-second countdown shown on screen. A correct tap scores the whole seconds left, with the full 10 points for a handoff in the first 2 seconds. A step that runs out scores 0.
- The number of steps varies by procedure. The final score is out of 100: total points divided by the maximum (10 per step), times 100, rounded to a whole number.
- The score is based only on how much time the player takes to get each step correct. A wrong pick costs no points and has no separate penalty; it only uses up time.
- A correct tool flies to the dentist's hand (animated, not a swap). The next step does not start until the animation ends.
- A wrong tool gives feedback pointing to the correct step. The clock keeps running, and a later correct pick still scores by the seconds left.
- At 0 the correct tool is hinted and play moves on.
- Each step has an optional **pick** (timed) and a **result** (the scene change, an optional message, and an optional duration). A step with no pick, such as the dentist removing the matrix, just plays its result. A result marked as a wait (for example, curing, about 3 seconds) is not timed against the player and cannot be skipped. Only steps with a pick are counted for scoring.
- Popups appear on steps that vary by dentist.
- The tray shows the tool list of the current procedure.

Acceptance checks:
- The run 9, 10, 5, 10, 3, 6, 7, 8, 10, 6 totals 74. A timeout scores 0 for that step. A wrong pick followed by a correct one scores by the time of the correct pick.
- The cure wait cannot be skipped by tapping.
- A procedure with 8 steps, all handed over in the first 2 seconds, scores 100. A procedure with 12 steps and the same 74% result also scores 74.
- A wrong pick does not change the points for that step. Only the time of the correct pick does.
- The score screen shows the total out of 100.
- Adding a procedure means adding one data file and its images, with no code change.

Provisional:
- A wrong tool shakes the tool and shows a short message. **(provisional)**

### Sort engine (mode 6)

Approved:
- The game shows one tool at a time. The player taps one of two bins, the **ultrasonic cleaner** (6 items: mouth mirror, explorer, hand scaler, cotton pliers, extraction forceps, elevator) or **heat sterilization** (4 items: high-speed handpiece, low-speed motor, reusable metal prophy angle, contra-angle attachment). A round uses all 10 items in random order. Items are generic, never a brand.
- Instructions: "Tools have been initially wiped down. Sort each into ultrasonic cleaning or heat sterilization." Footnote: "*Both routes require proper cleaning before autoclaving. Follow manufacturer instructions."
- Each item has 10 seconds. At 5 seconds a hint appears. At 10 seconds the game sorts the item into the correct bin for the player, and that item scores 0.
- The score is based only on how much time the player takes to answer correctly, the same idea as the procedures. It is shown at the end of the round, after all items are done.
- A wrong pick is final: the item turns red, scores 0, and the round moves on. The player cannot pick again. (This differs from the procedures, where the player can retry.)
- A running count of correct answers shows during the round (for example 7/10).
- Item answers must be checked against a published source and a reviewer, not memory.

Provisional:
- The sort uses the procedure formula: whole seconds left of 10, with full points in the first 2 seconds, scaled to 100 over the round. **(provisional)**
- The count sits above the item, not at the top right, because the frame puts the pause button there. **(open)**
- The hint box shows the prompt "They've already all been wiped down. What's the next step?" during play, and a per-item hint at 5 seconds. Per-item hints are not written yet, so a generic line shows. **(provisional)**
- The instructions and footnote show on the intro screen, and the footnote also shows on the end screen. **(provisional)**
- The tapped item flies into the chosen bin, and the end screen also shows the final correct count. **(provisional)**
- After a wrong pick the game does not reveal the correct bin. **(open)**

Acceptance checks:
- Every item has exactly one correct bin in its data file (6 ultrasonic, 4 heat).
- With no tap, the hint shows at 5 seconds and the item is sorted for the player at 10 seconds with 0 points, not counted as correct.
- A round where every item is answered correctly in the first 2 seconds scores 100. Nine right and one wrong scores 90 and shows 9/10.
- A wrong tap turns the item red, scores 0 for it, and cannot be undone.
- The mode can be replayed, and adding items means editing data, not code.

### Content and accuracy (approved)

- Steps are the Developer's own wording, kept general, and checked against published sources.
- The disclaimer text lives in one place (a single constant or content file) and every screen that shows it reads from there, so the wording cannot drift.
- A reviewer (unconfirmed) checks at least one procedure in Phase 2.
- Art is AI-generated and disclosed. The tool, terms, and prompts are recorded in `research.md`.

### Accessibility (provisional)

- Tap targets large enough for a thumb. Text readable on a phone.
- Feedback uses text and shape, not color alone.
- Motion is short, and the countdown is also shown as a number.

## Architecture

How the system works and the structural decisions that keep it coherent, consistent, and easy to change.

### Overview

Plain HTML, CSS, and JavaScript, with no framework or backend. One shell handles screens and shared services. Each of the two engines is generic and takes a content file. Every mode is data for one engine.

```
index.html ── app shell (screens, menu, router)
   │
   ├── Procedure engine  ◄── data/<procedure>.json   (modes 1–5)
   │      scene · tray · countdown · fly animation · scoring · popups
   │
   ├── Sort engine       ◄── data/sterilization.json (mode 6)
   │      items · bins · feedback · result
   │
   └── shared: screen switching, disclaimer, localStorage progress, styles
```

Planned layout (provisional):

```
index.html
style.css
js/  app.js            screens, selection, saved scores
     score.js          the only scoring rules
     pickClock.js      countdown with pause, shared by both engines
     fly.js            the tool-flying animation, shared
     procedureRun.js   procedure rules (no DOM)    procedureView.js  draws it
     sortRun.js        sort rules (no DOM)         sortView.js       draws it
data/  app.json  composite-filling.json  sterilization.json  ...
assets/  tools/  scenes/  bins/  sort/  logo
tests/  index.html (rules)  smoke.html (click-through)
```

### Data and state

- **Mode registry:** one list of the six modes, with each mode's engine, data file, and built or coming-soon flag. It is the single source for the menu.
- **Procedure file:** tray tool list, then steps. Each step has an optional pick (the correct tool), a hint, optional popup text, and a result (scene, message, duration, wait flag). The tray's other tools are the decoys. The hand is empty with no spoken or written cue. The file is the single source for a procedure's content.
- **Sort file:** the two bins (ultrasonic cleaner, heat sterilization), then items. Each item has a name, correct bin, and reason. The file is the single source for sort content.
- **Run state (in memory):** current step or item, seconds left, running score, and a locked flag during animations. Cleared when a run ends.
- **Saved state (localStorage):** best scores per mode. The game works if it is empty or blocked. **(provisional)**

### Interaction loop

Procedure: step loads, hand held out, countdown starts, player taps a tool, then the engine checks it against the step. Correct: lock input, fly the tool, score the seconds left, show any popup, next step. Wrong: feedback, keep counting. Timeout: score 0, hint, next step. After the last step: score screen.

Sort: item shown, player picks a bin, engine checks it against the item's data and gives feedback. After the last item: result screen.

Both loops are one cycle of input, check against data, change state, and render, and the engine owns the state.

### Visual and content rules

- Mobile-first portrait layout, about 480px wide, centered on larger screens.
- The look (color and type) is not final. Colors and fonts are CSS variables so they can change in one place. **(open)**
- Scene art is a fixed set of layers: mouth and face, empty hand and sleeve, tray, and one transparent image per tool, all in one style.
- Placeholder shapes are used until the Developer supplies art. Fonts must be open-licensed and credited in `research.md`.

### Structure rules

- A new mode is new data, not new engine code. If a mode needs engine changes, revisit the engine instead of adding a special case.
- Scoring lives in one place, `score.js`, and both engines use it.
- Timing and layout values (10 seconds, 2-second full-score window, animation length) are named constants, not repeated numbers.
- Content and art never live in code.

### Decisions and changes

- **Procedure and sort as two engines** (from the pitch). An earlier idea of dragging step cards into order was dropped as too plain. Procedure content stays as data so modes are cheap to add.
- **Tap, not drag, for choosing tools** (Developer). Simpler and more reliable on a phone.
- **Tool flies to the hand** (Developer), to simulate passing it to the dentist.
- **Mobile-first with a centered column on desktop** (approved by Developer).
- **Sort has two bins, ultrasonic cleaner and heat sterilization, timed with a hint at 5 seconds and an auto-answer at 10** (Developer). This replaces the pitch wording "cold sterile or not" and the cold and hot sterile names used earlier, and makes the third-bin stretch goal unnecessary.
- **Scores:** one score, based only on the time taken to answer correctly. Wrong picks cost no points and there is no separate accuracy number. Scores are out of 100 whatever the step count (Developer).
- **Sort wrong picks are final** (turn red, score 0, no retry) with a running correct count (Developer). The count's position is open, since the frame's top right holds the pause button.
- **Disclaimer on the home page and on an intro screen before every game** (Developer).
- **Extraction replaces floss and polish** as mode 1 (Developer), because floss and polish uses very few tools. Its build phase is not yet set.
