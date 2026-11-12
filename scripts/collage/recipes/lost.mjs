// The page that is not there: Icarus, falling.

export default {
  /** Goltzius's round plate, cut along its own border. */
  async icarus({ kit, src }) {
    const print = await src("icarus", {
      crop: { left: 0.025, top: 0.03, width: 0.95, height: 0.94 },
      width: 900,
    });
    const size = Math.min(print.w, print.h);
    const square = kit.crop(
      print,
      Math.floor((print.w - size) / 2),
      Math.floor((print.h - size) / 2),
      size,
      size,
    );
    return kit.shape(
      kit.grain(square, { amount: 0.04, seed: 2 }),
      (u, v) => (0.492 - Math.hypot(u - 0.5, v - 0.5)) * size,
    );
  },
};
