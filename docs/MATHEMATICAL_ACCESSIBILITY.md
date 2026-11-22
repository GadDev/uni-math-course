# Mathematical accessibility sample — issue #167

Audit date: 2026-11-20. Scope: [#167](https://github.com/GadDev/uni-math-course/issues/167), within [#160](https://github.com/GadDev/uni-math-course/issues/160). Baseline: main commit `8b5a425`; navigation work from #162–#163 and the existing footer are retained. This is a targeted sample, not a WCAG conformance assessment or hosted acceptance.

## Method and limits

Local production test build, French and English, Playwright Chromium/Chrome Headless Shell 158.0.8127.18 (v1254) on macOS, Playwright keyboard/DOM/computed-style checks. No screen reader was operated. MathML structure, accessible names, focus and status-region presence are browser evidence; they do not establish what VoiceOver, NVDA or another screen reader speaks. Do not mark the issue's screen-reader criterion complete from these results.

The practice test uses the repository's synthetic Auth/Data API fixture. No invited hosted account was available or used. Real Supabase sessions, persistence and hosted assistive-technology behaviour remain unverified. No learner data or secrets are recorded here.

Severity: **medium** affects access to an explanation or operation; **low** improves identification/relationships; **pending** means an unverified area, not a confirmed failure. Criteria below refer to [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Issue and evidence matrix

All page paths below are tested with both `/fr/` and `/en/` prefixes unless explicitly stated. Keyboard tests wait for client hydration/enabled controls. Browser/AT for automated rows: Chromium 158 / Playwright, **no screen reader**.

| Page | Action and evidence | Result / change | Severity; relevant criteria |
| --- | --- | --- | --- |
| `logic-workshop/` | Submit a correct nonfinal answer. Source previously focused `#logic-next`; keyboard regression checks the new focus destination and explicit advancement. | Focus the feedback heading, leaving the explanation before Next in reading order. Incorrect-answer updates keep their status region; final completion keeps its existing summary focus and last-answer explanation. | Medium; 2.4.3, 4.1.3. Spoken ordering still needs AT verification. |
| `logic-workshop/` | Open Boolean-law and answer-check disclosures; inspect tables and tab to scrolling containers. | Give these tables names and their overflow containers labelled, keyboard-focusable regions. Add a consistent visible outline for focusable regions/headings. Native disclosures and existing scoped headers remain. | Medium for scroll access, low for table identification; 1.3.1, 2.1.1, 2.4.7. |
| `chapters/C04/lzw/` | Inspect dictionary/trace names and headers; validate a wrong then correct step and advance explicitly. | Add bilingual captions, explicit column scope, code/step row headers and an accessible Step column name while retaining the compact # label. Keep the explanation available until Next/Finish. Native header inference existed before; absence of explicit scope alone is not asserted as a WCAG failure. | Low; 1.3.1, 2.4.6. |
| `lessons/L29/` | Adjust slope by keyboard/numeric input; compare A, B, Δx, Δy; set Δx = 0. Inspect SVG description. | Preserve numerical equivalents and undefined 0/0 explanation. Add axis names, bounds and tick values to the shared geometry plot description; previously it stated equal scales without their values. | Medium for the missing nonvisual scale information; 1.1.1, 1.3.1, 2.1.1. |
| `lessons/L38/` | Set h = 0; inspect text/live summary and SVG descriptions; inspect fractions, subscripts, powers and limit conditions in rendered MathML. | Describe horizontal and dynamically changing vertical scales in both languages. Preserve the distinction between undefined secant quotient and limiting derivative. KaTeX already emits one MathML tree and an `aria-hidden` visual representation; no unverified duplicate-speech workaround is added. | Medium for scale information; 1.1.1. Formula speech: pending; 1.3.1. |
| `lessons/L03/` | Follow skip link, inspect native truth-table column headers and rows. | Retain table structure and main-content destination. Table navigation with actual AT remains pending. | Browser structure only; 1.3.1, 2.4.1. |
| `cheat-sheet/` | At 320px, measure page width and explicitly scroll horizontally. The page was 761px wide and could shift 441px into blank space despite separate table scrollers. | Give the reference page a positioning boundary for its absolutely positioned accessible math, keeping table/formula scrolling local. After the change: page width 320px, horizontal offset 0; separate table scrolling and print regression checks pass. | Medium; 1.4.10, 2.4.11. |
| `glossary/`, `cheat-sheet/` | Inspect searchable readings, language disclosures, reference-table headers and narrow layout. | Existing plain-language glossary readings, MathML, static reading and reference-table relationships retained. | Sample verification; 1.3.1, 1.4.10. |
| `lessons/L05/practice/` | With synthetic authenticated fixture, submit a response, check focus on verdict, read explanation, then explicitly request the next exercise. | Existing verdict focus and explanation are retained; no automatic advancement. This is local fixture evidence only. | Sample verification; 2.4.3, 3.3.1, 4.1.3. |
| All eight public sample routes above, including `lessons/L55/` | Render at 320 CSS px in both themes; measure visible prose/label foreground against nearest opaque background and selected workshop control bounds; request reduced motion. | All 32 page/locale/theme samples fit at 320px. Across 5,124 visible prose/label samples, the lowest measured foreground/background contrast is 5.49:1 (L29, English, light theme). Reduced-motion checks pass for the sampled LZW animation. Selected workshop controls are checked against the 24px minimum target size; actual phone spacing remains unverified. Intentional mathematical/table scrolling is assessed separately from page overflow. | Sample only; 1.4.3, 1.4.10, 2.5.8. Reduced-motion support is also checked; interaction animation criterion 2.3.3 is AAA, not an AA claim. |

## Validation record

- Dependencies installed from the committed lockfile with Node 24.19.0 and pnpm 11.25.0 in the dedicated worktree. No dependency or release-registry change.
- `pnpm check`: passed, including all 446 repository tests and the production build. Existing typecheck hints are unchanged. A sandboxed attempt could not open a fixture port; the unrestricted rerun passed.
- `pnpm test:e2e --config .data/a11y-validation/playwright.config.ts --reporter=line`: 152 of 153 tests passed across the eight suites listed below, including all 14 new audit cases. One existing English reference-navigation test reached the overall 30-second timeout and passed on an isolated retry (1/1), without a product change. This is 153 scenarios verified across the full run and retry, not a single clean 153-test run. Earlier attempts exposed audit-selector assumptions, native-select popup automation limits and port collisions with parallel worktrees; those runs are not acceptance evidence.
- Parallel-worktree validation uses ignored copies under `.data/a11y-validation/`, replacing only the app/fixture ports (4467/4469/54677) and the test-only Astro allowed-domain ports. No production configuration is changed. The canonical tests retain their standard ports.
- No independent mathematical review, hosted acceptance or full accessibility compliance is claimed.

To repeat on the standard ports when no other test server is running:

```sh
pnpm test:e2e tests/e2e/mathematical-accessibility.spec.ts tests/e2e/logic-workshop.spec.ts tests/e2e/lzw.spec.ts tests/e2e/geometry-labs.spec.ts tests/e2e/l38-explorers.spec.ts tests/e2e/glossary.spec.ts tests/e2e/cheat-sheet.spec.ts tests/e2e/reading.spec.ts --workers=1
```

The new sample writes per-page contrast measurements and narrow LZW screenshots to the ignored `test-results/` directory.

## Follow-up review — 2026-11-21

Fetched `main` again before PR preparation; its head remained `8b5a425`, and the branch required no integration changes. A code self-review retained the focused feedback heading for an active question and restored the original strong-text message in completion summaries, avoiding an unrelated summary heading-level change. This is an author review, not independent accessibility or mathematical review.

| Requested manual check | Attempt / available evidence | Status |
| --- | --- | --- |
| Screen-reader formula/table speech | Native Chrome access through Computer Use returned “Computer Use permissions are not granted”. No VoiceOver/Safari or NVDA session was operated. | Pending actual speech and table-navigation evidence. |
| Real browser zoom / text resizing | The same permission failure prevented operating the live browser zoom controls. Existing 320px browser tests remain reflow evidence only. | Pending real 200% text resizing and 400% browser zoom. |
| Physical touch spacing | No physical phone interaction was available through the tools. Selected control bounds passed automated checks; this does not verify actual touch use. | Pending device/browser identification and real-phone observations. |
| Invited hosted practice | Requested availability of a dedicated signed-in synthetic account. Browser permissions currently prevent inspecting or operating its session; no hosted attempt was submitted. | Pending an accessible invited test session and sanitized results. |

The PR references #167 and #160 without closing #167. Its current `docs` check and review discussion are the authority for merge readiness; this table does not approve or merge the PR.

## Manual verification still required

1. Use VoiceOver with Safari (record versions) and NVDA with Firefox or Chrome (record versions). In each language, read L38's average-velocity fraction, x₀, x² and derivative limit. Confirm numerator/denominator, index/power distinction, limit condition and no duplicated visual formula reading. Inspect the equivalent practice `Tex` rendering as well.
2. Navigate L03 truth-table cells, the logic law/correction tables, reference tables and LZW dictionary/trace by table commands. Confirm row/column announcements, named tables and access to scrolled content.
3. Read L29 and L38 graphs without looking at them. Find axes, ranges, ticks, points and changes through descriptions/controls/text. Check that limits and coincident points retain their mathematical meaning.
4. With keyboard and screen reader, submit incorrect, correct and revealed answers in the logic workshop and LZW, and in hosted practice using an invited synthetic account. Check announced validation, focus, hints, correction reading and explicit advancement, including the final item. Verify no trap and no obscured focus at narrow width and zoom.
5. Check real 200% text resizing and 400% browser zoom, touch spacing on an actual phone, text embedded in SVGs, native controls, focus/border contrast and colour-independent graph interpretation. The automated prose/label contrast sample does not measure these. Inspect both themes and reduced motion; test static fallbacks with scripting disabled.

Record browser/AT version, page/locale, action, actual speech or behaviour, result and remaining defect for each manual check before considering the corresponding issue criterion complete.
