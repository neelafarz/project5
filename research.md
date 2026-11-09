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
