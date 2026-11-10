# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep the evidence, decisions, and current scope that guide the build.

## Working agreement

Developer: Direct the inquiry toward what the next decision needs, judge sources and options, make the consequential decisions, and keep this file current.

Agent: Read the project documents and inspect the project. Help investigate, compare options, and test assumptions quickly. Verify sources directly.

When you begin this step, start a fresh chat so its transcript stays clean. For example:

`Read the project documents and help me research what I need for the next build decision.`

## Inquiry and decisions

Record what informs your build decisions: the questions you investigated, useful sources and what they support, experiments and their results, and the decisions you made with your reasons. Distinguish evidence from assumptions; an Agent's recommendation alone is not evidence.

## Scope

### Stretch goals

Keep the current stretch goals in priority order, starting from your approved pitch, noting cuts and additions.

*Draft for Developer review. Order is from the pitch, listed with the first cut last.*

1. Remaining procedures (crown seat, root canal).
2. Replaying missed steps later.
3. A mode where the player sets up the tray.
4. A daily procedure with a streak.

Cut: the third sterilization bin (see Scope changes, 2026-11-09). Note: the pitch listed it as stretch goal 2.

### Scope changes

Record consequential changes to the approved scope: what changed, why, and what was added or cut. Update `spec.md` when a change alters the intended behavior.

*Drafts for Developer review. Both changes are already reflected in `spec.md`.*

**2026-11-09: Extraction replaces floss and polish.**
- Changed: the sixth-mode list now has extraction as mode 1 in place of floss and polish. The pitch listed floss and polish first among the six modes and named it as the first to be cut.
- Why: the Developer judged that floss and polish uses very few tools, so it gives the tray and handoff mechanic little to do. Extraction uses more tools, and the first concept mockup (made in Canva) already shows an extraction scene.
- Added/cut: extraction added, floss and polish cut. Extraction's build phase is not yet set. `spec.md` provisionally places it in Phase 4, cut first if time runs short.

**2026-11-09: Sterilization sort uses ultrasonic cleaner and heat sterilization bins, with a timer.**
- Changed: the pitch described sorting items into "cold sterile or not." The sort now has two named bins, **ultrasonic cleaner** and **heat sterilization** (10 items: 6 and 4). An earlier draft of this entry said "cold sterile" and "hot sterile," before the Developer's sort frame set the final names. Each item has 10 seconds, with a hint at 5 seconds and an automatic answer at 10 seconds. A wrong pick is final (turns red, scores 0), a running correct count shows in the top right, and the time-based score out of 100 shows at the end.
- Why: the Developer's decision. The reason for naming the two routes by process (ultrasonic cleaning, heat sterilization) rather than "cold sterile or not" is not yet recorded. Developer to add.
- Added/cut: the third-bin stretch goal (for example heat sterilization) is cut, because the second bin now covers it.
- Open: whether the correct bin is revealed after a wrong pick, and the number of items per round. Item answers still need a published source and a reviewer.

## Sources and credits

List every external source, code library, asset, and dataset you use, with its link, license or usage terms, and required credit.

- **First logo rendition** (`assets/first-logo-rendition.png`): made in Canva by the Developer. The tooth icon came from Canva. Canva's help pages say elements from its content library cannot be used in a trademark, except fonts, simple shapes, and lines. Not yet checked whether this icon is a library element or a simple shape. The logo is a working draft, and the project is not seeking a trademark. Source: [Canva logos and trademarks](https://www.canva.com/en_in/help/logo-trademarks/).
- **Tray artwork** (`assets/tray/canva-tray.png`, the Developer's file unchanged; `assets/tray/tray-landscape.png` is a trimmed copy rotated 90 degrees to fit the wide tray): made or selected in Canva by the Developer. Credited as "Tray artwork: Canva" on the Settings screen. Usage terms not yet verified: Canva's license page returned an error to the Agent, and search summaries say Canva content may be used inside a design but not redistributed on its own as standalone material (for example clipart or stock files), and that some free items come from other sources with their own licenses. Not yet checked whether this tray is a Canva-owned element or from a third party, or whether serving the image on a public website counts as standalone use. No attribution requirement was found in the summaries, but the credit is kept at the Developer's request. Source: [Canva licenses, copyright and commercial use](https://www.canva.com/help/licenses-copyright-legal-commercial-use/).
- **Music** (`assets/music/dental-clinic.m4a`, converted from the Developer's `the_mountain-dental-clinic-151199.mp3`, 2 minutes 32 seconds): "Dental Clinic" by the_mountain, apparently from Pixabay (the file name carries Pixabay's track number 151199; the Developer should confirm the source page). Credited on the Settings screen. Terms: the Pixabay Content License permits commercial and non-commercial use, with credit optional, but does not allow reselling the file on its own; the list of prohibited uses was not read in full. See [Pixabay Content License summary](https://pixabay.com/service/license/). It replaced two earlier tracks: "Autumn Morning" by sergequadrado (Freesound 654407, license never verified; too short, a 22-second loop) and "For Documentary Loop" by AudioCoffee (Freesound 717288, license never verified; an audible clicking pulse that players mistook for a timer). Their files (`autumn-morning.m4a`, `documentary-loop.m4a`) are in `assets/music/` but unused.
- **Sound effects** (`js/sound.js`): synthesized in the browser with the Web Audio API. No files, no outside source.
- **Character and tool art** (`assets/tools/`, `assets/cast/`): AI-generated, as disclosed in the pitch. Tool, terms and prompts not yet recorded here; the Developer needs to add them.
- **Font** (Nunito, loaded from Google Fonts in `index.html`): Google Fonts lists Nunito under the SIL Open Font License, which allows use in a web game; credited on the Settings screen. Not yet checked against the license text itself.
- **Logo** (`assets/logo.png`): the Developer's finalized logo, made in Canva, with its white background removed and downsized for the web. `assets/tooth-mascot.png` is the tooth cut from that logo. The Canva usage-terms note under the first logo still applies and is unverified.
