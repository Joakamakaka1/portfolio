import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Shantell_Sans } from "next/font/google";
import { profile } from "@/content";
import { PREFS_INLINE_SCRIPT } from "@/features/prefs/prefs";
import "./globals.css";

// Printed matter: the name, labels, stamps and the interface.
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

// Long text outside the notebook.
const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

// Handwriting: everything written in the notebook.
const hand = Shantell_Sans({
  variable: "--font-hand",
  subsets: ["latin"],
  axes: ["BNCE", "INFM"],
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
      className={`${display.variable} ${body.variable} ${hand.variable} h-full antialiased`}
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
