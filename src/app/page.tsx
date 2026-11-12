import type { Metadata } from "next";
import Link from "next/link";
import { Collage } from "@/components/collage/Collage";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { type Ink, story } from "@/content";
import { Story, type StoryStep } from "@/features/story/Story";
import { StoryNoScript } from "@/features/story/StoryNoScript";
import { Hero } from "./_components/Hero";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** The inks of the story, as they print on the wall in each theme. */
const INK: Record<Ink, string> = {
  ink: "text-foreground",
  vermilion: "text-wall-vermilion",
  cobalt: "text-wall-cobalt",
  leaf: "text-wall-leaf",
};

const two = (value: number) => String(value).padStart(2, "0");

const steps: StoryStep[] = story.map((step, index) => ({
  id: step.id,
  label: step.label,
  content: (
    <div className="mx-auto grid w-full max-w-6xl items-center gap-x-14 gap-y-6 px-5 pt-6 pb-28 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="flex flex-col gap-5 lg:gap-7">
        <p className="text-[0.85rem] text-muted-foreground tabular-nums">
          {two(index + 1)} / {two(story.length)}
        </p>
        <h2 className="max-w-[16ch] font-serif text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.05] tracking-[-0.018em] text-balance">
          {step.title}
        </h2>
        <div className="flex max-w-[44ch] flex-col gap-3 font-serif text-[clamp(1.05rem,1.5vw,1.3rem)] leading-[1.4] text-pretty">
          {step.lines.map((line) => (
            <p key={line.text} className={INK[line.ink]}>
              {line.text}
            </p>
          ))}
        </div>
        {step.link ? (
          <Link
            href={step.link.href}
            className="self-start rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {step.link.label}
          </Link>
        ) : null}
      </div>
      <Collage
        id={step.id}
        alt={step.picture}
        width="min(34rem, 90vw)"
        className="mx-auto max-w-[min(100%,34rem)] max-lg:order-first max-lg:max-w-[min(100%,calc(30svh*1.5))]"
      />
    </div>
  ),
}));

export default function HomePage() {
  return (
    <>
      <SiteHeader home />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Story steps={steps} label="Mi historia" />
        <StoryNoScript />
      </main>
      <SiteFooter home />
    </>
  );
}
