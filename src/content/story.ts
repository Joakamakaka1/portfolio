import type { z } from "zod";
import type { storyStepSchema } from "./schema";

/**
 * The story of the home page, step by step. It is told on purpose as a story:
 * a title and a few plain sentences per step, and nothing that needs a list.
 * The detail lives in the projects and in the repositories.
 *
 * Every fact here is also in profile.ts; keep them in step.
 */
export const storyData: z.input<typeof storyStepSchema>[] = [
  {
    id: "quien-soy",
    label: "Quién soy",
    picture:
      "Collage: grabado de un hombre sentado a su mesa, con la cara tapada por un recorte azul de un pulpo.",
    title: "Me llamo Joaquín y construyo software.",
    lines: [
      {
        text: "Empecé por las aplicaciones de móvil y de escritorio, seguí con la web y hoy hago aplicaciones con modelos de lenguaje.",
      },
      { text: "Esta es la historia de cómo he llegado hasta aquí.", ink: "vermilion" },
    ],
  },
  {
    id: "el-principio",
    label: "El principio",
    picture:
      "Collage: lámina botánica de una magnolia, de la piña a la flor, con un recorte verde de su hoja.",
    title: "Primero aprendí a construir.",
    lines: [
      {
        text: "Estudié dos ciclos de desarrollo de aplicaciones: multiplataforma primero, web después.",
      },
      {
        text: "Con cada uno hice prácticas en una empresa: Libnamic Consulting en 2024 y Moyseafood en 2025.",
      },
      {
        text: "Desde entonces hago las cosas de punta a punta, del servidor a la pantalla.",
        ink: "leaf",
      },
    ],
  },
  {
    id: "ahora",
    label: "Ahora",
    picture: "Collage: grabado de un hombre que habla a un fonógrafo, sobre un papel rojo.",
    title: "Después llegaron los modelos de lenguaje.",
    lines: [
      {
        text: "Desde marzo de 2026 trabajo como externo para Air Europa. Construyo aplicaciones con LLMs: el backend, la nube y la interfaz.",
      },
      {
        text: "Mientras tanto curso un máster en inteligencia artificial, cloud computing y DevOps.",
        ink: "cobalt",
      },
    ],
  },
  {
    id: "lo-que-mido",
    label: "Lo que mido",
    picture:
      "Collage: grabado de dos hombres que examinan una pieza de un fonógrafo, junto a un recorte rojo de una balanza.",
    title: "Lo interesante pasa después de la demo.",
    lines: [
      {
        text: "Que un modelo responda bien una vez es fácil. Lo difícil es saber si responde bien siempre, cuánto cuesta y cómo falla.",
      },
      {
        text: "Por eso mido antes de fiarme: evaluaciones, un segundo modelo que hace de juez y trazas para entender cada fallo.",
        ink: "vermilion",
      },
    ],
  },
  {
    id: "por-mi-cuenta",
    label: "Por mi cuenta",
    picture:
      "Collage: grabado de autómatas en su escenario, con un recorte azul de un mecanismo de engranajes.",
    title: "Fuera del trabajo construyo para aprender.",
    lines: [
      {
        text: "Son cuatro proyectos propios, cada uno con su problema, su enfoque y sus cifras.",
      },
    ],
    link: { label: "Ver los proyectos", href: "/proyectos" },
  },
];
