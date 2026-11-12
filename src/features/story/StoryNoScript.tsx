/**
 * Without JavaScript nothing can tell which step the scroll has reached, so the
 * story is laid out as plain sections, one after another.
 */
const STYLES = `
.story { display: block !important; }
.story .story-track, .story .story-rail { display: none !important; }
.story .story-stage { position: static !important; display: block !important; height: auto !important; }
.story .story-step { opacity: 1 !important; translate: none !important; pointer-events: auto !important; min-height: 80svh; }
`;

export function StoryNoScript() {
  return (
    <noscript>
      <style>{STYLES}</style>
    </noscript>
  );
}
