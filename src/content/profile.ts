import type { z } from "zod";
import type { capabilitySchema, experienceSchema, profileSchema, studySchema } from "./schema";

export const profileData: z.input<typeof profileSchema> = {
  name: "Joaquín Castro Salas",
  shortName: "Joaquín",
  role: "Desarrollador Full Stack IA",
  focus: "LLMs, agentes y evaluación de calidad",
  headline: "Construyo aplicaciones con modelos de lenguaje y compruebo que funcionan.",
  headlineMark: "compruebo que funcionan",
  plate: "Lámina I. Un agente y sus herramientas: mirar de cerca, medir y dejarlo escrito.",
  notes: [
    {
      title: "Agentes",
      text: "Agentes con herramientas, flujos con estado y servidores MCP detrás de una API.",
    },
    {
      title: "Evaluación",
      text: "Métricas, un segundo modelo que hace de juez y trazas para saber por qué falló.",
    },
    {
      title: "De punta a punta",
      text: "Del backend y la nube en AWS a la interfaz en React, con tests desde el principio.",
    },
  ],
  summary:
    "Construyo aplicaciones con LLMs de punta a punta: del backend y la nube a la interfaz, y con evaluaciones que dicen si funcionan.",
  about: [
    "Trabajo como externo para Air Europa construyendo aplicaciones con LLMs de punta a punta, del backend y la nube a la interfaz.",
    "Soy Técnico Superior en DAM y DAW y ahora curso un Máster en Inteligencia Artificial, Cloud Computing y DevOps.",
    "Me interesa lo que pasa después de la demo: medir si un sistema con LLMs responde bien, cuánto cuesta y cómo falla.",
  ],
  location: "España",
  email: "jcastrosalas03@gmail.com",
  links: {
    github: { label: "GitHub", url: "https://github.com/Joakamakaka1" },
    linkedin: {
      label: "LinkedIn",
      url: "https://es.linkedin.com/in/joaquin-castro-salas-54882b2b6",
    },
  },
};

export const capabilitiesData: z.input<typeof capabilitySchema>[] = [
  {
    id: "agentes",
    title: "Agentes y backends con LLMs",
    description: "Agentes con herramientas, flujos con estado y servidores MCP detrás de una API.",
    tools: ["FastAPI", "TypeScript", "LangGraph", "LangChain", "Vercel AI SDK", "MCP"],
  },
  {
    id: "evaluacion",
    title: "Evaluación de RAG y LLMs",
    description:
      "Métricas de recuperación y de respuesta, un LLM como juez y trazas para saber por qué falló.",
    tools: ["MRR", "Recall", "Fundamentación", "LLM-as-a-Judge", "Langfuse"],
  },
  {
    id: "seguridad",
    title: "Seguridad de LLMs",
    description: "Guardrails y evaluaciones de seguridad antes de exponer un modelo a usuarios.",
    tools: ["Guardrails", "NeuralTrust"],
  },
  {
    id: "cloud",
    title: "Cloud en AWS",
    description:
      "Modelos, almacenamiento vectorial y datos en la nube, con infraestructura como código.",
    tools: ["Bedrock", "S3", "S3 Vectors", "RDS", "Terraform", "Docker", "GitHub Actions"],
  },
  {
    id: "frontend",
    title: "Frontends en React",
    description: "Interfaces para productos con IA: estado predecible y tests desde el principio.",
    tools: ["React", "Redux Toolkit", "Vite", "Vitest"],
  },
];

export const experienceData: z.input<typeof experienceSchema>[] = [
  {
    company: "Air Europa",
    role: "Desarrollador Full Stack IA (externo)",
    period: "mar 2026 – actualidad",
    current: true,
    description: "Aplicaciones con LLMs de punta a punta: backend, nube e interfaz.",
  },
  {
    company: "Moyseafood",
    role: "Desarrollador en prácticas",
    period: "abr – jun 2025",
    description: "Prácticas del ciclo de Desarrollo de Aplicaciones Web.",
  },
  {
    company: "Libnamic Consulting",
    role: "Desarrollador en prácticas",
    period: "abr – jun 2024",
    description: "Prácticas del ciclo de Desarrollo de Aplicaciones Multiplataforma.",
  },
];

export const studiesData: z.input<typeof studySchema>[] = [
  {
    title: "Máster en Inteligencia Artificial, Cloud Computing y DevOps",
    center: "PontIA",
    current: true,
  },
  {
    title: "Técnico Superior en Desarrollo de Aplicaciones Web",
    center: "IES Rafael Alberti",
    period: "2024 – 2025",
  },
  {
    title: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma",
    center: "Staff Formación",
  },
];
