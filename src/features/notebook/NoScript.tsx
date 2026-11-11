/**
 * Without JavaScript nothing can turn a page, so the notebook is laid out as a
 * plain column of pages, one after another, and its controls are hidden. Every
 * fragment link still lands on its page.
 */
const STYLES = `
.nb .nb-stage { width: auto !important; height: auto !important; transform: none !important; }
.nb .nb-book { position: static !important; display: block !important; overflow: visible !important; padding: 0 !important; perspective: none !important; }
.nb .nb-book::before { display: none !important; }
.nb .nb-leaf { display: contents !important; }
.nb .nb-face { position: relative !important; inset: auto !important; transform: none !important; width: var(--nb-page-w); min-height: var(--nb-page-h) !important; margin: 0 auto 1.5rem; border-radius: var(--nb-radius) !important; box-shadow: 0 1.2em 2.4em rgb(10 12 24 / 0.28) !important; scroll-margin-top: 1rem !important; }
.nb .nb-controls, .nb .nb-hit { display: none !important; }
`;

export function NotebookNoScript() {
  return (
    <noscript>
      <style>{STYLES}</style>
    </noscript>
  );
}
