import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { profile } from "@/content";
import { PREFS_INLINE_SCRIPT } from "@/features/prefs/prefs";
import "./globals.css";

// Reading: headings, the notebook and anything longer than a label.
const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// The interface: navigation, captions, labels and figures.
const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.summary,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before the first paint (no flash). */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static string defined in prefs.ts
          dangerouslySetInnerHTML={{ __html: PREFS_INLINE_SCRIPT }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
