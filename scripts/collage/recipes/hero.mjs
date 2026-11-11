// The first picture of the site: a plate of an octopus read as an agent, its
// arms reaching the tools pasted around it.

const INK = [30, 35, 33];
const PAPER = [238, 233, 220];
const RED = { ink: [178, 40, 22], tint: [245, 199, 180] };
const BLUE = { ink: [33, 68, 166], tint: [206, 217, 246] };
const GREEN = { ink: [30, 108, 64], tint: [208, 231, 208] };

const white = (w, h) => `<rect width="${w}" height="${h}" fill="#fff"/>`;

// Both readings of the octopus have to register, so they are cut together.
let octopusPair;
async function octopus({ kit, src }) {
  if (octopusPair) return octopusPair;
  const print = await src("octopus-macropus", { width: 1200 });
  const cut = await kit.cutout(print, { ink: 0.95, close: 3, largest: true });
  const withCut = (img) => {
    for (let i = 3; i < img.data.length; i += 4) img.data[i] = cut.data[i];
    return img;
  };

  // As printed: a grey lithograph on its own paper.
  const plate = withCut(
    kit.grain(
      kit.duotone(print, { ink: INK, tint: PAPER, black: 0.08, white: 0.97, gamma: 1.05 }),
      {
        amount: 0.05,
        seed: 3,
      },
    ),
  );
  // As read: the same animal in the blue of a blueprint, its rows slipped.
  const blue = withCut(
    kit.grain(
      kit.duotone(print, {
        ink: [24, 50, 132],
        tint: [226, 231, 242],
        black: 0.08,
        white: 0.97,
        gamma: 1.05,
      }),
      {
        amount: 0.05,
        seed: 5,
      },
    ),
  );
  const read = kit.slip(blue, { from: -1, amount: 15, period: 19, seed: 6 });

  // One frame for both, with room for the slipped rows.
  const frame = kit.bounds(plate, 28);
  octopusPair = {
    plate: kit.crop(plate, frame.x, frame.y, frame.w, frame.h),
    read: kit.crop(read, frame.x, frame.y, frame.w, frame.h),
  };
  return octopusPair;
}

async function tool({ kit, src }, id, crop, colours, seed) {
  const print = await src(id, { crop, width: 330 });
  return kit.grain(kit.duotone(print, { ...colours, black: 0.1 }), { amount: 0.06, seed });
}

export default {
  /** The page the plate came from: aged, foxed, torn out of its book. */
  async page({ kit }) {
    const w = 980;
    const h = 1240;
    const sheet = kit.paper(w, h, { color: [232, 224, 203], seed: 11, foxing: 0.3 });
    const type = await kit.svg(
      `${white(w, h)}
       <text x="74" y="1150" font-family="Georgia" font-style="italic" font-size="31">Octopus macropus, Risso.</text>
       <text x="74" y="1190" font-family="Georgia" font-size="22" letter-spacing="1">Grandezza naturale.</text>
       <text x="${w - 80}" y="104" font-family="Georgia" font-size="27" text-anchor="end" letter-spacing="2">TAV. 23.</text>
       <line x1="74" y1="1108" x2="330" y2="1108" stroke="#000" stroke-width="1.5"/>`,
      w,
      h,
    );
    kit.print(sheet, type, { ink: [52, 46, 38], strength: 0.9, white: 1 });
    return kit.tear(sheet, { right: 44, bottom: 16, seed: 4 });
  },

  /** A sheet of red paper with the works of an automaton printed on it. */
  async red({ kit, src }) {
    const w = 560;
    const h = 700;
    const sheet = kit.paper(w, h, {
      color: [214, 88, 64],
      seed: 21,
      grain: 0.05,
      blotch: 0.09,
      edge: 0.08,
    });
    const works = await src("turk", {
      crop: { left: 0.245, top: 0.585, width: 0.155, height: 0.3 },
      width: w + 40,
    });
    kit.print(sheet, works, {
      ink: [120, 30, 18],
      x: -20,
      y: 0,
      strength: 0.62,
      black: 0.15,
      white: 0.8,
    });
    return kit.tear(sheet, { left: 30, bottom: 34, seed: 9 });
  },

  /** A second, paler sheet under the page, with the number of arms. */
  async under({ kit }) {
    const w = 760;
    const h = 520;
    const sheet = kit.paper(w, h, { color: [240, 232, 214], seed: 61, foxing: 0.15, blotch: 0.04 });
    const type = await kit.svg(
      `${white(w, h)}<text x="96" y="${h - 70}" font-family="Rockwell, Georgia" font-weight="700" font-size="150">8</text>`,
      w,
      h,
    );
    kit.print(sheet, type, { ink: [58, 52, 46], white: 1, strength: 0.92 });
    return kit.tear(sheet, { top: 18, right: 10, seed: 17 });
  },

  /** A strip of striped paper, as from an envelope lining. */
  async stripe({ kit }) {
    const w = 640;
    const h = 330;
    const sheet = kit.paper(w, h, {
      color: [255, 255, 255],
      seed: 31,
      grain: 0.05,
      blotch: 0.05,
      edge: 0.04,
    });
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const band = Math.floor((x + y * 1.05) / 58) % 2 === 0 ? [44, 86, 178] : [240, 236, 224];
        const i = (y * w + x) * 4;
        for (let c = 0; c < 3; c += 1) sheet.data[i + c] = (sheet.data[i + c] * band[c]) / 255;
      }
    }
    return kit.tear(sheet, { left: 22, right: 26, seed: 14 });
  },

  /** Marbled endpaper cut into a leaf. */
  async leaf({ kit, src }) {
    const print = await src("marbled-1735", {
      crop: { left: 0.6, top: 0.2, width: 0.34, height: 0.42 },
      width: 420,
    });
    const red = kit.duotone(print, {
      ink: [84, 18, 10],
      tint: [236, 84, 56],
      black: 0.22,
      white: 0.78,
    });
    const cos = Math.cos(-0.7);
    const sin = Math.sin(-0.7);
    return kit.shape(red, (u, v) => {
      const x = (u - 0.5) * cos - (v - 0.5) * sin;
      const y = (u - 0.5) * sin + (v - 0.5) * cos;
      const reach = Math.max(Math.hypot(x, y - 0.42), Math.hypot(x, y + 0.42));
      return (0.62 - reach) * red.w;
    });
  },

  /** A square of marbled paper for the dot matrix. */
  async matrix({ kit, src }) {
    const print = await src("marbled-1720", {
      crop: { left: 0.3, top: 0.25, width: 0.46, height: 0.5 },
      width: 320,
    });
    return kit.grain(
      kit.duotone(print, { ink: [14, 66, 40], tint: [96, 186, 122], black: 0.2, white: 0.72 }),
      { amount: 0.05 },
    );
  },

  async octopus(context) {
    return (await octopus(context)).plate;
  },

  async "octopus-read"(context) {
    return (await octopus(context)).read;
  },

  /** What the arms reach: looking closely, weighing, writing it down. */
  "tool-observe": (context) =>
    tool(context, "microscope", { left: 0.18, top: 0.05, width: 0.62, height: 0.56 }, RED, 41),
  "tool-measure": (context) =>
    tool(context, "scales", { left: 0.36, top: 0.3, width: 0.3, height: 0.44 }, GREEN, 42),
  "tool-write": (context) =>
    tool(context, "printer", { left: 0.05, top: 0.1, width: 0.9, height: 0.74 }, BLUE, 43),
  "tool-reason": (context) =>
    tool(context, "turk", { left: 0.4, top: 0.4, width: 0.25, height: 0.15 }, RED, 44),

  /** A typed slip. */
  async label({ kit }) {
    const w = 300;
    const h = 92;
    const sheet = kit.paper(w, h, { color: [241, 237, 226], seed: 51, edge: 0.03, blotch: 0.03 });
    const type = await kit.svg(
      `${white(w, h)}<text x="${w / 2}" y="59" text-anchor="middle" font-family="Courier New" font-weight="700" font-size="34" letter-spacing="5">FIG. 1</text>`,
      w,
      h,
    );
    kit.print(sheet, type, { ink: [40, 36, 34], white: 1 });
    return kit.tear(sheet, { right: 9, seed: 3 });
  },
};
