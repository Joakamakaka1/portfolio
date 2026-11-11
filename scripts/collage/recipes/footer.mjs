// The landscape at the foot of the site, made of the same scraps as the rest:
// hills torn from marbled endpapers and from a page of text, a sun cut from
// red paper, a balloon and a leaf that stands for a tree.

const INK = [30, 35, 33];
const PAPER = [238, 233, 220];

/** A long strip whose top edge is torn into a skyline. */
async function hill({ kit, src }, id, crop, colours, ridge, height = 320) {
  const print = await src(id, { crop, width: 1900 });
  const band = kit.crop(print, 0, 0, print.w, Math.min(height, print.h));
  const inked = colours ? kit.duotone(band, colours) : band;
  return kit.ridge(kit.grain(inked, { amount: 0.06, seed: ridge.seed }), ridge);
}

/** A piece cut out of an aged page and reprinted in grey. */
async function cut({ kit, src }, id, crop, width, options) {
  const print = await src(id, { crop, width });
  const mask = await kit.cutout(print, { ink: 0.84, close: 5, largest: true, ...options });
  const grey = kit.grain(kit.duotone(print, { ink: INK, tint: PAPER, black: 0.1 }), {
    amount: 0.05,
  });
  for (let i = 3; i < grey.data.length; i += 4) grey.data[i] = mask.data[i];
  return kit.trim(grey);
}

/** A cloud torn from white paper: a few overlapping lobes. */
function cloud({ kit }, w, h, seed) {
  const sheet = kit.paper(w, h, {
    color: [247, 244, 236],
    seed,
    grain: 0.03,
    blotch: 0.03,
    edge: 0,
  });
  const next = kit.rng(seed);
  const lobes = Array.from({ length: 5 }, (_, i) => ({
    x: 0.16 + (i / 4) * 0.68 + (next() - 0.5) * 0.06,
    y: 0.62 - Math.sin((i / 4) * Math.PI) * 0.2 + (next() - 0.5) * 0.08,
    r: 0.15 + next() * 0.07,
  }));
  const rough = kit.noise2(seed * 7);
  return kit.shape(sheet, (u, v, x, y) => {
    let inside = -1;
    for (const lobe of lobes) {
      const d = Math.hypot((u - lobe.x) * (w / h), v - lobe.y);
      inside = Math.max(inside, lobe.r * (w / h) * 0.62 - d);
    }
    // A flat base, as clouds have.
    inside = Math.min(inside, 0.8 - v);
    return (inside + (rough(x / 5, y / 5) - 0.5) * 0.03) * h;
  });
}

export default {
  "hill-far": (c) =>
    hill(
      c,
      "marbled-1735",
      { left: 0.02, top: 0.06, width: 0.96, height: 0.34 },
      { ink: [22, 44, 120], tint: [120, 152, 222], black: 0.2, white: 0.8 },
      { height: 170, period: 560, seed: 3 },
      340,
    ),
  "hill-mid": (c) =>
    hill(
      c,
      "marbled-1720",
      { left: 0.1, top: 0.3, width: 0.86, height: 0.36 },
      { ink: [16, 70, 42], tint: [112, 190, 130], black: 0.2, white: 0.74 },
      { height: 130, period: 430, seed: 8 },
      300,
    ),
  "hill-near": (c) =>
    hill(
      c,
      "albinus-text",
      { left: 0.2, top: 0.2, width: 0.6, height: 0.14 },
      null,
      { height: 70, period: 620, seed: 12 },
      260,
    ),

  async sun({ kit, src }) {
    const print = await src("marbled-1735", {
      crop: { left: 0.6, top: 0.5, width: 0.3, height: 0.36 },
      width: 320,
    });
    const red = kit.duotone(print, {
      ink: [96, 20, 10],
      tint: [236, 84, 56],
      black: 0.22,
      white: 0.78,
    });
    return kit.shape(
      kit.crop(red, 0, 0, 320, 320),
      (u, v) => (0.48 - Math.hypot(u - 0.5, v - 0.5)) * 320,
    );
  },

  balloon: (c) => cut(c, "balloons", { left: 0.05, top: 0.08, width: 0.4, height: 0.4 }, 420),
  tree: (c) =>
    cut(c, "magnolia", { left: 0.06, top: 0.03, width: 0.6, height: 0.62 }, 420, { ink: 0.8 }),

  "cloud-a": (c) => cloud(c, 420, 130, 21),
  "cloud-b": (c) => cloud(c, 300, 96, 22),
};
