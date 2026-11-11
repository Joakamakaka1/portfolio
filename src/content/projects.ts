import type { z } from "zod";
import type { projectSchema } from "./schema";

/**
 * Every claim here comes from the project's own repository (README, docs,
 * ADRs or evaluation records). Do not add figures that the repository does not
 * back.
 */
export const projectsData: z.input<typeof projectSchema>[] = [
  {
    slug: "cronista",
    name: "Cronista",
    status: "en-progreso",
    kind: "Juego narrativo con IA",
    summary:
      "Una partida para cinco amigos: cada día cada jugador envía una acción que no puede editar y, a las 22:00, un narrador de IA las resuelve todas y publica el capítulo.",
    problem:
      "Que un LLM narre una historia compartida, día tras día, sin contradecirse, sin favorecer a nadie y sin que un fallo a medias publique un capítulo dos veces.",
    approach: [
      "Un motor de reglas decide qué pasa; el narrador solo lo cuenta.",
      "El narrador consulta la memoria de la partida con herramientas y RAG antes de escribir.",
      "Un segundo modelo hace de juez y las evaluaciones comparan cada cambio contra una línea base.",
      "El trabajo diario es idempotente por temporada y día: repetirlo no duplica nada.",
    ],
    highlights: [
      "Evaluaciones con promptfoo, conjuntos de datos y líneas base",
      "Más de 30 decisiones de arquitectura registradas (ADR)",
      "Despliegue con plan de solo lectura y aprobación manual",
      "Pruebas de base de datos con pgTAP y de extremo a extremo con Playwright",
    ],
    metrics: [
      { label: "Decisiones registradas", value: 30, prefix: "+", note: "ADR en el repositorio" },
      { label: "Servicios", value: 4, note: "core-api, ai-api, ai-worker y notifier" },
    ],
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "AWS Lambda",
      "EventBridge Scheduler",
      "SQS",
      "Supabase",
      "AWS CDK",
      "AI SDK",
      "Claude",
      "promptfoo",
    ],
    repository: { visibility: "publico", url: "https://github.com/Joakamakaka1/Cronista" },
  },
  {
    slug: "cancelaciones-hotel",
    name: "Predicción de cancelaciones de hotel",
    status: "terminado",
    kind: "Machine learning",
    summary:
      "Un modelo que estima, al confirmar una reserva de hotel, la probabilidad de que se cancele, con API, interfaz y seguimiento de experimentos.",
    problem:
      "La primera versión acertaba demasiado: un ROC-AUC de 0,95 que venía de fugas de información, no del modelo.",
    approach: [
      "Partir los datos por fecha en vez de al azar bajó la cifra a 0,87.",
      "Quitar las variables que no se conocen al confirmar la dejó en 0,82.",
      "Cinco modelos comparados contra una línea base, con intervalos de confianza.",
      "El modelo campeón se versiona con manifiesto y se verifica su huella al arrancar.",
    ],
    highlights: [
      "Auditoría de fugas documentada paso a paso",
      "Model card, data card y 8 decisiones registradas (ADR)",
      "Cobertura de tests mínima del 80 %",
      "Explicabilidad con SHAP y análisis por segmentos",
    ],
    metrics: [
      {
        label: "ROC-AUC en test temporal",
        value: 0.8175,
        decimals: 4,
        note: "IC 95 %: 0,8058 – 0,8297 · Random Forest",
      },
      { label: "Reservas del conjunto de datos", value: 119390, note: "Dos hoteles, 2015 – 2017" },
      { label: "Reservas reservadas para test", value: 40509, note: "Llegadas de 2017" },
    ],
    stack: [
      "Python",
      "scikit-learn",
      "XGBoost",
      "pandas",
      "FastAPI",
      "Streamlit",
      "MLflow",
      "SHAP",
      "Docker Compose",
    ],
    repository: {
      visibility: "publico",
      url: "https://github.com/Joakamakaka1/machine-learning-project",
    },
  },
  {
    slug: "twochi",
    name: "Twochi",
    status: "en-progreso",
    kind: "Mascota virtual con IA",
    summary:
      "Una app para dos personas: cada una cuida la mascota virtual que representa a la otra, con una IA que conoce sus gustos y su forma de hablar.",
    problem:
      "Dar a una mascota la personalidad de una persona concreta y mantenerla coherente, con un coste por conversación que se pueda asumir.",
    approach: [
      "Contratos compartidos entre frontend y backend, definidos con Zod y OpenAPI.",
      "Memoria por persona en Postgres con búsqueda vectorial y acceso por filas.",
      "Comparativa medida de tres frameworks de agentes antes de elegir uno.",
      "Infraestructura en Terraform y despliegue sin claves de larga duración.",
    ],
    highlights: [
      "Cada decisión queda registrada con la alternativa descartada",
      "CI con tests de base de datos y el plan de Terraform comentado en el PR",
      "Esqueleto probado en local; pendiente el primer despliegue",
    ],
    metrics: [],
    stack: [
      "TypeScript",
      "React",
      "PixiJS",
      "Hono",
      "AWS Lambda",
      "Supabase",
      "pgvector",
      "Amazon Bedrock",
      "AI SDK",
      "Terraform",
    ],
    repository: { visibility: "privado" },
  },
  {
    slug: "configuracion-evaluada",
    name: "Configuración evaluada de Claude Code",
    status: "en-diseno",
    kind: "Trabajo con agentes",
    summary:
      "Una configuración para trabajar con Claude Code en la que cada pieza (instrucciones, skills, subagentes) se queda solo si las pruebas dicen que aporta.",
    problem:
      "Las configuraciones de agentes se comparten por intuición. Sin medir, no se sabe si una regla mejora el resultado o solo encarece cada tarea.",
    approach: [
      "Un conjunto fijo de tareas reales contra el que comparar cada cambio.",
      "Dos medidas por cambio: calidad del resultado y coste de conseguirlo.",
      "Publicar la configuración junto con las pruebas que la respaldan.",
    ],
    highlights: ["En diseño: todavía no hay repositorio", "Nombre provisional"],
    metrics: [],
    stack: ["Claude Code", "Evaluaciones", "Medición de coste"],
    repository: { visibility: "sin-repositorio" },
  },
];
