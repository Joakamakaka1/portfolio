/**
 * Without JavaScript nothing can turn a page, so the notebook is laid out as a
 * plain column of pages, one after another, and its controls are hidden. Every
 * fragment link still lands on its page.
 */
const STYLES = `
.nb-stage { width: auto !important; height: auto !important; transform: none !important; }
.nb-book { position: static !important; display: block !important; overflow: visible !important; padding: 0 !important; perspective: none !important; }
.nb-book::before { display: none !important; }
.nb-leaf { display: contents !important; }
.nb-face { position: relative !important; inset: auto !important; transform: none !important; width: var(--nb-page-w); min-height: var(--nb-page-h) !important; margin: 0 auto 1.5rem; border-radius: 0.4em !important; scroll-margin-top: 1rem !important; }
.nb-tabs, .nb-controls, .nb-open { display: none !important; }
.desk-intro { position: static !important; transform: none !important; width: auto !important; }
.desk .nb[data-open="0"] .nb-stage { transform: none !important; }
`;

export function NotebookNoScript() {
  return (
    <noscript>
      <style>{STYLES}</style>
    </noscript>
  );
}
