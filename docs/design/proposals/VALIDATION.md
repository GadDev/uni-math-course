# Signal asset validation

Scope: selected raster concepts and format conversion. These are not browser screenshots or application acceptance evidence.

## Checks performed

- Exactly nine selected Signal files, including corrected practice/progress variants and corrected homepage implication caption.
- Actual RIFF/WEBP format, native dimensions, SHA-256 hashes and byte sizes recorded in [asset evidence](asset-evidence.json).
- Lossless conversion checked by byte equality of decoded RGBA pixels between each selected PNG and WebP. No resizing, cropping, palette substitution or UI regeneration occurs in conversion.
- Visual review of the selected concepts: course IDs, practice option values, feedback truth table, natural numbers including zero and French interval readings. Original sample-content derivations and limitations are in [content review](CONTENT_REVIEW.md).
- Repository quality gate: `pnpm check`. Converter syntax: `node --check docs/design/proposals/source/prepare-signal.ts`. No reading/interaction code changes in this PR; no new browser acceptance claim.

## Convert again from the selected originals

The [manifest](source/signal-screens.json) maps each source PNG to its WebP. Source PNGs remain outside Git; the requested repository assets are WebP only. If the selected originals are available, use an isolated Node environment with sharp:

```sh
node docs/design/proposals/source/prepare-signal.ts /absolute/path/to/selected-originals
```

The converter can resolve sharp from the normal environment or `CODEX_PRIMARY_RUNTIME_NODE_MODULES`. It writes images and evidence, and rejects an unexpected image set. It does not recreate a layout from code. Image generation is nondeterministic; prompt summaries and selection notes do not guarantee regeneration of an identical concept.

## Dimensions and coverage

Most desktop concepts are 1505 × 1045 pixels; the gate is 1504 × 1046; mobile is 809 × 1942. These are native raster dimensions. The mobile concept was requested to explore 375 px composition, but no actual CSS viewport or responsive DOM was measured. The selected set is eight desktop concepts and one phone concept, not the old 14-screen bilingual/320 px browser matrix.

Most page copy is French; the glossary contains both languages. Matched English lessons/feedback, additional mobile states and 320 px implementation checks remain to be done.

## Limits of the evidence

The old HTML fixture, browser renderer and render-evidence file are removed. Their 64-layout, keyboard-state and contrast results do not apply to Signal. No new contrast, screen-reader, keyboard, responsiveness, grading, authentication or persistence pass is claimed from these images.

Generated explanatory text is reviewed as design copy, not released lesson content. The original sample has been self-checked, not independently peer-reviewed. Direct source inspection and maintainer approval remain publication gates. The actual application must provide semantic text and mathematical markup rather than bitmap-based interaction.
