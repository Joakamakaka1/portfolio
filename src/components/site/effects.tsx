"use client";

import dynamic from "next/dynamic";

/*
 * The canvas and WebGL effects of the site, loaded only in the browser: they
 * carry no content, so the server HTML goes without them and their code stays
 * out of the first bundle. Import them from here, never from vendor directly.
 */

export const Noise = dynamic(() => import("@/components/vendor/react-bits/Noise"), {
  ssr: false,
});

export const Ribbons = dynamic(() => import("@/components/vendor/react-bits/Ribbons"), {
  ssr: false,
});

export const HalftoneReveal = dynamic(
  () => import("@/components/vendor/react-bits/HalftoneReveal"),
  { ssr: false },
);
