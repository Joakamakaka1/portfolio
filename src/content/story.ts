import type { z } from "zod";
import type { storyPageSchema } from "./schema";

/**
 * The notebook, page by page. It is told as a story on purpose: a few plain
 * sentences per page and nothing that needs a list. The detail lives in each
 * project's file and in the repositories.
 *
 * Every fact here is also in profile.ts or projects.ts; keep them in step.
 */
export const storyData: z.input<typeof storyPageSchema>[] = [
  {
    id: "quien-soy",
    picture:
      "Collage: grabado de un hombre sentado a su mesa, con la cara tapada por un recorte azul de un pulpo.",
    label: "Quién soy",
    title: "Me llamo Joaquín y construyo software.",
    lines: [
      {
        text: "Empecé por las aplicaciones de móvil y de escritorio, seguí con la web y hoy hago aplicaciones con modelos de lenguaje.",
      },
      { text: "Este cuaderno cuenta cómo he llegado hasta aquí.", ink: "vermilion" },
    ],
  },
  {
    id: "el-principio",
    picture:
      "Collage: lámina botánica de una magnolia, de la piña a la flor, con un recorte verde de su hoja.",
    label: "El principio",
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
    picture: "Collage: grabado de un hombre que habla a un fonógrafo, sobre un papel rojo.",
    label: "Ahora",
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
    picture:
      "Collage: grabado de dos hombres que examinan una pieza de un fonógrafo, junto a un recorte rojo de una balanza.",
    label: "Lo que mido",
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
    id: "proyectos",
    picture:
      "Collage: grabado de autómatas en su escenario, con un recorte azul de un mecanismo de engranajes.",
    label: "Proyectos",
    title: "Fuera del trabajo construyo para aprender.",
    lines: [{ text: "Son cuatro proyectos propios. Cada uno ocupa una página y tiene su ficha." }],
  },
  {
    id: "cronista",
    picture:
      "Collage: grabado de dos cabezas parlantes en un teatrillo, con un recorte rojo de una imprenta.",
    label: "Cronista",
    project: "cronista",
    title: "Cronista",
    lines: [
      {
        text: "Un juego para cinco amigos. Cada día cada uno envía una acción y, a las 22:00, un narrador de IA las resuelve todas y publica el capítulo.",
      },
      { text: "Un motor de reglas decide qué pasa; el narrador solo lo cuenta.", ink: "cobalt" },
    ],
  },
  {
    id: "cancelaciones-hotel",
    picture:
      "Collage: grabado de un hombre que consulta un barómetro, con un recorte verde de un globo aerostático.",
    label: "Cancelaciones de hotel",
    project: "cancelaciones-hotel",
    title: "Cancelaciones de hotel",
    lines: [
      { text: "Un modelo que estima si una reserva de hotel se va a cancelar." },
      {
        text: "La primera versión acertaba demasiado: un 0,95 que venía de fugas de información. Sin ellas quedó en 0,82, que es el número de verdad.",
        ink: "vermilion",
      },
    ],
  },
  {
    id: "twochi",
    picture: "Collage: grabado de dos palomas mensajeras, recortadas sobre un papel rojo.",
    label: "Twochi",
    project: "twochi",
    title: "Twochi",
    lines: [
      {
        text: "Una app para dos personas. Cada una cuida la mascota virtual que representa a la otra.",
      },
      {
        text: "La mascota habla con una IA que conoce los gustos y la forma de hablar de esa persona.",
        ink: "leaf",
      },
    ],
  },
  {
    id: "configuracion-evaluada",
    picture:
      "Collage: viñeta grabada de una balanza, con un recorte azul de un tablero de ajedrez.",
    label: "Configuración evaluada",
    project: "configuracion-evaluada",
    title: "Una configuración que se gana el sitio",
    lines: [
      { text: "Lo siguiente, todavía en diseño: una configuración para trabajar con Claude Code." },
      {
        text: "Cada instrucción, skill o subagente se queda solo si las pruebas dicen que aporta.",
        ink: "cobalt",
      },
    ],
  },
  {
    id: "contacto",
    picture: "Collage: lámina de dos globos aerostáticos sobre un papel rojo.",
    label: "Contacto",
    title: "Dónde encontrarme.",
    lines: [],
  },
];
