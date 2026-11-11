// The pieces pasted on the pages of the notebook: one small collage per page.

const INK = [30, 35, 33];
const PAPER = [238, 233, 220];
const RED = { ink: [178, 40, 22], tint: [245, 199, 180] };
const BLUE = { ink: [33, 68, 166], tint: [206, 217, 246] };
const GREEN = { ink: [30, 108, 64], tint: [208, 231, 208] };

/** A print cut out of its white page and reprinted in grey ink. */
async function figure({ kit, src }, id, crop, width, options = {}) {
  const print = await src(id, { crop, width });
  const cut = await kit.cutout(print, { ink: 0.9, close: 5, largest: true, ...options });
  const grey = kit.grain(kit.duotone(print, { ink: INK, tint: PAPER, black: 0.08 }), {
    amount: 0.05,
  });
  for (let i = 3; i < grey.data.length; i += 4) grey.data[i] = cut.data[i];
  return kit.trim(grey);
}

/** A piece torn from a print, kept on its own paper. */
async function scrap({ kit, src }, id, crop, width, tear, seed = 1) {
  const print = await src(id, { crop, width });
  return kit.tear(kit.grain(print, { amount: 0.04, seed }), { ...tear, seed });
}

/** A print re-inked on fresh aged paper, then torn. */
async function reprint({ kit, src }, id, crop, width, tear, seed = 1, color = [233, 225, 204]) {
  const print = await src(id, { crop, width });
  const sheet = kit.paper(print.w, print.h, { color, seed, foxing: 0.2 });
  kit.print(sheet, print, { ink: [40, 36, 32], black: 0.1 });
  return kit.tear(sheet, { ...tear, seed });
}

/** A block in two colours. */
async function block({ kit, src }, id, crop, width, colours, seed = 1) {
  const print = await src(id, { crop, width });
  return kit.grain(kit.duotone(print, { ...colours, black: 0.1 }), { amount: 0.06, seed });
}

/** A plain sheet of coloured paper. */
function sheet({ kit }, w, h, color, tear, seed) {
  return kit.tear(kit.paper(w, h, { color, seed, grain: 0.05, blotch: 0.08, edge: 0.06 }), {
    ...tear,
    seed,
  });
}

/** A strip of striped paper. */
function striped({ kit }, w, h, color, tear, seed) {
  const paper = kit.paper(w, h, {
    color: [255, 255, 255],
    seed,
    grain: 0.05,
    blotch: 0.05,
    edge: 0.04,
  });
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const band = Math.floor((x + y * 1.05) / 40) % 2 === 0 ? color : [240, 236, 224];
      const i = (y * w + x) * 4;
      for (let k = 0; k < 3; k += 1) paper.data[i + k] = (paper.data[i + k] * band[k]) / 255;
    }
  }
  return kit.tear(paper, { ...tear, seed });
}

const TEXT = { left: 0.2, top: 0.1, width: 0.6, height: 0.3 };

export default {
  // The cover: boards covered in marbled paper, as on a half-bound book.
  async "cover-marble"({ kit, src }) {
    const print = await src("marbled-1720", {
      crop: { left: 0.2, top: 0.08, width: 0.6, height: 0.84 },
      width: 720,
    });
    return kit.grain(
      kit.duotone(print, { ink: [14, 18, 36], tint: [86, 100, 150], black: 0.18, white: 0.76 }),
      {
        amount: 0.06,
        seed: 31,
      },
    );
  },

  // Shared: a scrap of Latin text and two plain papers.
  "text-a": (c) => scrap(c, "albinus-text", TEXT, 420, { right: 18, bottom: 12 }, 11),
  "text-b": (c) =>
    scrap(
      c,
      "albinus-text",
      { left: 0.22, top: 0.3, width: 0.5, height: 0.22 },
      380,
      { left: 14, top: 10 },
      12,
    ),
  "paper-red": (c) => sheet(c, 420, 300, [214, 88, 64], { left: 16, top: 12 }, 6),
  "paper-blue": (c) => striped(c, 420, 240, [44, 86, 178], { left: 14, right: 16 }, 13),

  // Quién soy: a man at his desk, his face left to the octopus.
  "who-figure": (c) =>
    reprint(
      c,
      "bartisch",
      { left: 0.14, top: 0.31, width: 0.72, height: 0.34 },
      640,
      { bottom: 16, right: 12 },
      2,
    ),
  "who-block": (c) =>
    block(c, "octopus-macropus", { left: 0.4, top: 0.36, width: 0.3, height: 0.2 }, 300, BLUE, 3),

  // El principio: a plant from cone to flower.
  "seed-page": (c) =>
    scrap(
      c,
      "magnolia",
      { left: 0.04, top: 0.5, width: 0.92, height: 0.48 },
      660,
      { left: 18, top: 14 },
      4,
    ),
  "seed-block": (c) =>
    block(c, "magnolia", { left: 0.3, top: 0.06, width: 0.42, height: 0.3 }, 280, GREEN, 5),

  // Ahora: a man speaking to a machine.
  "speak-figure": (c) =>
    figure(c, "phonograph-use", { left: 0, top: 0, width: 1, height: 0.87 }, 760),

  // Lo que mido: two men looking closely at the works.
  "measure-figure": (c) =>
    figure(c, "phonograph-sheet", { left: 0, top: 0, width: 1, height: 0.93 }, 700),
  "measure-block": (c) =>
    block(c, "scales", { left: 0.36, top: 0.3, width: 0.3, height: 0.44 }, 260, RED, 7),

  // Proyectos: automata on their stage.
  "projects-plate": (c) =>
    scrap(
      c,
      "vaucanson",
      { left: 0.08, top: 0.3, width: 0.84, height: 0.5 },
      680,
      { right: 14, bottom: 12 },
      21,
    ),
  "projects-block": (c) =>
    block(c, "turk", { left: 0.245, top: 0.585, width: 0.155, height: 0.3 }, 220, BLUE, 22),

  // Cronista: two heads that speak.
  "cronista-plate": (c) =>
    scrap(
      c,
      "mical",
      { left: 0.1, top: 0.06, width: 0.8, height: 0.5 },
      620,
      { bottom: 16, left: 10 },
      23,
    ),
  "cronista-block": (c) =>
    block(c, "printer", { left: 0.05, top: 0.1, width: 0.9, height: 0.74 }, 280, RED, 24),

  // Cancelaciones: a man reading the barometer.
  "hotel-plate": (c) =>
    scrap(
      c,
      "barometer",
      { left: 0.12, top: 0.2, width: 0.76, height: 0.42 },
      640,
      { right: 16, top: 10 },
      25,
    ),
  "hotel-block": (c) =>
    block(c, "balloons", { left: 0.5, top: 0.1, width: 0.42, height: 0.36 }, 260, GREEN, 26),

  // Twochi: a pair.
  "twochi-figure": (c) =>
    figure(c, "pigeons", { left: 0.04, top: 0.1, width: 0.92, height: 0.8 }, 720, {
      ink: 0.86,
      close: 7,
    }),

  // Configuración evaluada: the scales.
  "config-plate": (c) =>
    reprint(
      c,
      "scales",
      { left: 0.22, top: 0.16, width: 0.56, height: 0.68 },
      620,
      { left: 14, bottom: 14 },
      27,
    ),
  "config-block": (c) =>
    block(c, "turk", { left: 0.4, top: 0.4, width: 0.25, height: 0.15 }, 300, BLUE, 28),

  // Contacto: balloons, the post of their day.
  "contact-plate": (c) =>
    scrap(
      c,
      "balloons",
      { left: 0.04, top: 0.03, width: 0.92, height: 0.46 },
      680,
      { bottom: 18, right: 10 },
      29,
    ),
};
