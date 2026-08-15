// Smooth red -> yellow -> green completion heatmap, matching the spec:
//   no tasks      -> neutral grey (not a judgment)
//   0%   .. 49%   -> red, interpolated: 0% = deepest red, 49% = lightest red
//   50%  .. 99%   -> yellow, interpolated: 50% = lightest, 99% = darkest
//   100%          -> solid green (a deliberate, distinct "perfect day" color,
//                    not a continuation of the yellow gradient)

const ANCHORS = {
  light: {
    grey: [223, 228, 226], // mist-200
    redDeep: [155, 32, 25], // 0%
    redLight: [240, 178, 172], // 49%
    yellowLight: [253, 226, 150], // 50%
    yellowDeep: [214, 150, 33], // 99%
    green: [42, 122, 78], // 100%
  },
  dark: {
    grey: [50, 58, 77], // night-600
    redDeep: [122, 30, 26],
    redLight: [199, 96, 87],
    yellowLight: [176, 130, 42],
    yellowDeep: [232, 176, 61],
    green: [58, 150, 98],
  },
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

function toRgbString([r, g, b]) {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/**
 * @param {number|null} percent - completion percentage 0-100, or null/undefined
 *   for "no tasks scheduled".
 * @param {'light'|'dark'} mode
 * @returns {string} an rgb() color string
 */
export function heatmapColor(percent, mode = 'light') {
  const c = ANCHORS[mode] || ANCHORS.light;

  if (percent === null || percent === undefined) {
    return toRgbString(c.grey);
  }
  if (percent >= 100) {
    return toRgbString(c.green);
  }
  if (percent >= 50) {
    const t = (percent - 50) / 49; // 50 -> 0, 99 -> 1 (clamped just past for 99.x)
    return toRgbString(lerpColor(c.yellowLight, c.yellowDeep, Math.min(t, 1)));
  }
  // 0 - 49
  const t = percent / 49; // 0 -> 0 (deepest), 49 -> 1 (lightest)
  return toRgbString(lerpColor(c.redDeep, c.redLight, Math.min(t, 1)));
}

/**
 * A short accessible label + glyph so the heatmap isn't color-only.
 * Used as an aria-label and as a tiny in-cell glyph for colorblind users.
 */
export function heatmapGlyph(percent) {
  if (percent === null || percent === undefined) return { glyph: '', label: 'No tasks scheduled' };
  if (percent >= 100) return { glyph: '✓', label: 'All tasks completed' };
  if (percent >= 50) return { glyph: '●', label: `${percent}% completed` };
  return { glyph: '!', label: `${percent}% completed` };
}

/** Decide whether cell text should be light or dark for contrast. */
export function heatmapTextClass(percent) {
  if (percent === null || percent === undefined) return 'text-ink-700 dark:text-mist-200';
  if (percent >= 50) return 'text-ink-900';
  return 'text-white';
}
