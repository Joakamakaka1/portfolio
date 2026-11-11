import { capabilities, getProject, profile, projects } from "@/content";
import type { ScriptedQuestion, Source } from "./types";

/**
 * The scripted questions. Answers are assembled from src/content so the agent
 * never says something the rest of the site does not.
 */

const GITHUB_SITE = "GitHub";

function repoSource(slug: string): Source | null {
  const project = getProject(slug);
  if (!project || project.repository.visibility !== "publico") return null;
  return {
    id: slug,
    title: project.name,
    url: project.repository.url,
    site: GITHUB_SITE,
    snippet: project.summary,
  };
}

function present<T>(value: T | null): value is T {
  return value !== null;
}

const cronista = repoSource("cronista");
const hotel = repoSource("cancelaciones-hotel");

const profileSource: Source = {
  id: "perfil",
  title: `Perfil de ${profile.shortName} en GitHub`,
  url: profile.links.github.url,
  site: GITHUB_SITE,
  snippet: profile.summary,
};

const linkedinSource: Source = {
  id: "linkedin",
  title: `${profile.name} en LinkedIn`,
  url: profile.links.linkedin.url,
  site: "LinkedIn",
};

const inProgress = projects.filter((project) => project.status === "en-progreso").length;
const stackByArea = capabilities
  .map((capability) => `${capability.title}: ${capability.tools.slice(0, 4).join(", ")}`)
  .join(". ");

export const QUESTIONS: ScriptedQuestion[] = [
  {
    id: "proyectos",
    prompt: "¿Qué has construido?",
    keywords: [
      "proyectos",
      "proyecto",
      "construido",
      "hecho",
      "trabajos",
      "cronista",
      "twochi",
      "repos",
    ],
    steps: [
      {
        id: "leer",
        label: "Leyendo los repositorios",
        detail: ["Cronista/README.md", "machine-learning-project/docs/model-card.md"],
        mascot: "reading",
        durationMs: 1100,
      },
      {
        id: "comparar",
        label: "Separando lo terminado de lo que sigue en marcha",
        detail: [`${projects.length} proyectos, ${inProgress} en progreso`],
        mascot: "thinking",
        durationMs: 900,
      },
      {
        id: "redactar",
        label: "Redactando la respuesta",
        detail: ["Solo con datos que constan en los repositorios"],
        mascot: "thinking",
        durationMs: 700,
      },
    ],
    answer: [
      {
        text: "Lo más completo es Cronista, un juego narrativo donde un LLM publica cada noche el capítulo de una partida entre cinco amigos, con evaluaciones que comparan cada cambio contra una línea base.",
        cite: ["cronista"],
      },
      {
        text: " Terminado está un modelo de predicción de cancelaciones de hotel: lo interesante no es la cifra final (ROC-AUC 0,8175), sino que empezó en 0,95 y bajó al encontrar las fugas de información.",
        cite: ["cancelaciones-hotel"],
      },
      {
        text: " Además hay dos cosas en marcha: Twochi, una mascota virtual con memoria por persona, y una configuración de Claude Code que quiero respaldar con pruebas de calidad y coste.",
      },
    ],
    sources: [cronista, hotel].filter(present),
  },
  {
    id: "evaluacion",
    prompt: "¿Cómo sabes si un sistema con LLMs funciona?",
    keywords: [
      "evaluacion",
      "evaluar",
      "evaluas",
      "evals",
      "calidad",
      "funciona",
      "metricas",
      "medir",
      "sabes",
    ],
    steps: [
      {
        id: "leer",
        label: "Revisando cómo se evalúa cada proyecto",
        detail: ["Cronista/evals/", "machine-learning-project/outputs/final_evaluation/"],
        mascot: "reading",
        durationMs: 1100,
      },
      {
        id: "depurar",
        label: "Buscando dónde una cifra podía estar inflada",
        detail: ["0,9524 → 0,8683 → 0,8184 → 0,8175"],
        mascot: "debugging",
        durationMs: 1000,
      },
      {
        id: "redactar",
        label: "Redactando la respuesta",
        detail: ["Tres ideas, con su ejemplo"],
        mascot: "thinking",
        durationMs: 700,
      },
    ],
    answer: [
      {
        text: "Midiéndolo antes de creérmelo. En recuperación uso métricas como MRR y Recall; en la respuesta, fundamentación y relevancia, con un LLM como juez y trazas para ver por qué falló un caso.",
        cite: ["perfil"],
      },
      {
        text: " En Cronista cada cambio del narrador se compara contra una línea base con un conjunto fijo de casos y un segundo modelo que hace de juez.",
        cite: ["cronista"],
      },
      {
        text: " Y desconfío de las cifras bonitas: en el modelo de cancelaciones, un 0,95 resultó venir de fugas de información; al partir los datos por fecha y quitar variables que no existen al confirmar la reserva, se quedó en 0,8175.",
        cite: ["cancelaciones-hotel"],
      },
    ],
    sources: [profileSource, cronista, hotel].filter(present),
  },
  {
    id: "stack",
    prompt: "¿Con qué tecnologías trabajas?",
    keywords: [
      "stack",
      "tecnologias",
      "tecnologia",
      "herramientas",
      "lenguajes",
      "trabajas",
      "python",
      "typescript",
      "aws",
    ],
    steps: [
      {
        id: "leer",
        label: "Leyendo el stack del perfil y de los proyectos",
        detail: ["Joakamakaka1/README.md", "package.json, pyproject.toml"],
        mascot: "reading",
        durationMs: 1000,
      },
      {
        id: "agrupar",
        label: "Agrupando por área",
        detail: [`${capabilities.length} áreas`],
        mascot: "thinking",
        durationMs: 800,
      },
    ],
    answer: [
      {
        text: `Trabajo de punta a punta, así que el stack va por áreas. ${stackByArea}.`,
        cite: ["perfil"],
      },
      {
        text: " En los proyectos personales se ve en uso: TypeScript, Lambdas y evaluaciones en Cronista; Python, scikit-learn y FastAPI en el modelo de cancelaciones.",
        cite: ["cronista", "cancelaciones-hotel"],
      },
    ],
    sources: [profileSource, cronista, hotel].filter(present),
  },
  {
    id: "contacto",
    prompt: "¿Cómo hablo contigo?",
    keywords: [
      "contacto",
      "contactar",
      "hablo",
      "hablar",
      "correo",
      "email",
      "linkedin",
      "escribir",
      "contratar",
    ],
    steps: [
      {
        id: "buscar",
        label: "Buscando las vías de contacto",
        detail: ["LinkedIn, GitHub y correo"],
        mascot: "reading",
        durationMs: 800,
      },
    ],
    answer: [
      {
        text: `Lo más rápido es LinkedIn o un correo a ${profile.email}.`,
        cite: ["linkedin"],
      },
      {
        text: " Si prefieres ver código antes de escribir, todo lo público está en GitHub.",
        cite: ["perfil"],
      },
    ],
    sources: [linkedinSource, profileSource],
  },
];
