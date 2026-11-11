/**
 * The rule of the story, with no React and no DOM.
 *
 * Each step owns a stretch of scroll. Given where each stretch starts on the
 * screen (its top edge, in px from the top of the viewport) and the line that
 * decides (the middle of the screen), the step on show is the last one whose
 * stretch has started above that line. Before the story begins it is the first
 * step; once the story has scrolled past, it stays on the last.
 */
export function stepAt(tops: number[], line: number): number {
  let reached = 0;
  for (let index = 0; index < tops.length; index += 1) {
    if (tops[index] <= line) reached = index;
  }
  return reached;
}
