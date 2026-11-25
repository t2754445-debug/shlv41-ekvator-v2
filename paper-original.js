var LegacyPaper = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../shkola-vliyaniya-41/ekvator-v2/work/paper-browser-entry.ts
  var paper_browser_entry_exports = {};
  __export(paper_browser_entry_exports, {
    IDLE: () => IDLE,
    LOOKS: () => LOOKS,
    drawHero: () => drawHero,
    drawPerson: () => drawPerson
  });

  // ../multik-paper/src/paper/lib.ts
  function hash(i, j = 0, seed = 0) {
    let n = i * 374761393 + j * 668265263 + seed * 982451653 | 0;
    n = (n ^ n >>> 13) * 1274126177;
    return ((n ^ n >>> 16) >>> 0) / 4294967295;
  }
  var paperPat = null;
  function paper(ctx) {
    if (paperPat) return paperPat;
    const c = document.createElement("canvas");
    c.width = c.height = 192;
    const g = c.getContext("2d");
    const im = g.createImageData(192, 192);
    for (let i = 0; i < 192 * 192; i++) {
      const x = i % 192, y = Math.floor(i / 192);
      const v = 236 + hash(x, y, 91) * 19 - hash(x >> 2, y >> 2, 92) * 8;
      im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v;
      im.data[i * 4 + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    g.strokeStyle = "rgba(150,140,130,0.35)";
    g.lineWidth = 1;
    for (let k = 0; k < 70; k++) {
      const x = hash(k, 1, 93) * 192, y = hash(k, 2, 93) * 192, a = hash(k, 3, 93) * Math.PI;
      const l = 4 + hash(k, 4, 93) * 12;
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 2, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
      g.stroke();
    }
    paperPat = ctx.createPattern(c, "repeat");
    return paperPat;
  }
  function cut(pts, seed, step = 26, amp = 1.6) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const n = Math.max(1, Math.round(len / step));
      const nx = -(b[1] - a[1]) / (len || 1), ny = (b[0] - a[0]) / (len || 1);
      for (let k = 0; k < n; k++) {
        const t = k / n;
        const j = k === 0 ? 0 : (hash(i * 31 + k, seed, 7) - 0.5) * 2 * amp;
        out.push([a[0] + (b[0] - a[0]) * t + nx * j, a[1] + (b[1] - a[1]) * t + ny * j]);
      }
    }
    return out;
  }
  function ovalPts(cx, cy, rx, ry, seed, n = 64, a0 = 0, a1 = Math.PI * 2) {
    const out = [];
    const full = Math.abs(a1 - a0 - Math.PI * 2) < 1e-6;
    const m = full ? n : n + 1;
    for (let i = 0; i < m; i++) {
      const a = a0 + (a1 - a0) * i / n;
      const j = 1 + (hash(i, seed, 8) - 0.5) * 0.012;
      out.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
    }
    return out;
  }
  var poly = (ctx, pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
  };
  function piece(ctx, pts, color, line = "rgba(20,16,14,0.85)", shadow = 1) {
    poly(ctx, pts);
    ctx.save();
    if (shadow) {
      ctx.shadowColor = `rgba(0,0,0,${0.28 * shadow})`;
      ctx.shadowOffsetX = 4 * shadow;
      ctx.shadowOffsetY = 5 * shadow;
      ctx.shadowBlur = 3 * shadow;
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = paper(ctx);
    ctx.fill();
    ctx.restore();
    if (line) {
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = line;
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  }
  var rectP = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  var roundP = (x0, y0, x1, y1, r, seed = 1) => {
    const out = [];
    const corners = [[x1 - r, y0 + r, -Math.PI / 2], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, Math.PI / 2], [x0 + r, y0 + r, Math.PI]];
    for (const [cx, cy, a0] of corners) for (let k = 0; k <= 6; k++) {
      const a = a0 + k / 6 * (Math.PI / 2);
      out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return cut(out, seed, 30, 1.4);
  };
  function label(ctx, text, x, y, size, color = "#1a1412", align = "center", font = "Arial Black") {
    ctx.save();
    ctx.font = `900 ${size}px "${font}", Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // ../multik-paper/src/paper/face.ts
  var LINE = "rgba(20,16,14,0.9)";
  var DARK = "#3b1214";
  var TEETH = "#fbfbf4";
  var TONGUE = "#d8606a";
  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function tint(hex, red = 0) {
    if (red <= 0) return hex;
    const [r, g, b] = rgb(hex);
    const k = Math.min(0.55, red * 0.5);
    const h = (v) => Math.round(v).toString(16).padStart(2, "0");
    return `#${h(r + (226 - r) * k)}${h(g + (88 - g) * k)}${h(b + (74 - b) * k)}`;
  }
  var strokeLine = (ctx, pts, color, w) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
    ctx.stroke();
  };
  var fillPath = (ctx, pts, fill, line, w) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (line) {
      ctx.strokeStyle = line;
      ctx.lineWidth = w;
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  };
  var clipTo = (ctx, pts) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
    ctx.closePath();
    ctx.clip();
  };
  var arcPts = (cx, cy, rx, ry, a0, a1, n = 16) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return out;
  };
  function eyeBrow(ctx, ex, ey, by, u, s, st, skin, browC, seed, lash = false) {
    const shock = st.shock;
    const ek = 1 + shock * 0.22;
    const ek2 = ek * (st.eye ?? 1);
    const rx = 0.068 * u * ek2, ry = 0.078 * u * ek2;
    const ang = st.anger ?? 0;
    const lid = (s < 0 ? st.lidL : st.lidR) ?? st.lid ?? 0;
    const closed = st.blink || lid >= 0.95;
    const squeeze = (st.squeeze ?? 0) > 0.5;
    const laugh = (st.laugh ?? 0) > 0.5;
    let browPts = null;
    if (squeeze) {
      strokeLine(ctx, [[ex + s * 0.05 * u, ey - 0.05 * u], [ex - s * 0.045 * u, ey], [ex + s * 0.05 * u, ey + 0.05 * u]], "#141110", 0.016 * u);
    } else if (laugh) {
      strokeLine(ctx, arcPts(ex, ey + 0.03 * u, 0.055 * u, 0.05 * u, Math.PI * 1.1, Math.PI * 1.9), "#141110", 0.014 * u);
    } else if (closed) {
      strokeLine(ctx, arcPts(ex, ey - 5e-3 * u, 0.06 * u, 0.03 * u, Math.PI * 0.1, Math.PI * 0.9), "#141110", 0.011 * u);
    } else {
      const eye = ovalPts(ex, ey, rx, ry, seed, 44);
      piece(ctx, eye, "#fbfbf6", LINE, 0.25);
      const cross = st.cross ? -s * 0.55 : 0;
      const pr = 0.0135 * u * (st.pupil ?? 1) * (1 - shock * 0.4);
      const px = ex + (st.look[0] + cross) * 0.033 * u;
      let py = ey + st.look[1] * 0.035 * u;
      const top = ey - ry;
      const aIn = lid * 2 * ry + Math.max(0, ang) * 0.85 * ry;
      const aOut = lid * 2 * ry + Math.max(0, -ang) * 0.7 * ry;
      const xo = ex + s * rx * 1.15, xi = ex - s * rx * 1.15;
      const yo = top + aOut, yi = top + aIn;
      const lidY = yo + (yi - yo) * (px - xo) / (xi - xo);
      py = Math.min(Math.max(py, lidY + pr * 1.15), ey + ry - pr * 1.1);
      ctx.save();
      clipTo(ctx, eye);
      piece(ctx, ovalPts(px, py, pr, pr, seed + 2, 16), "#111", null, 0);
      if (Math.max(aIn, aOut) > 4e-3 * u) {
        fillPath(ctx, [[xo, top - 0.05 * u], [xi, top - 0.05 * u], [xi, yi], [xo, yo]], skin, null, 0);
        strokeLine(ctx, [[xo, yo], [xi, yi]], "#141110", 0.01 * u);
      }
      const hp = st.happy ?? 0;
      if (hp > 0.05) {
        const yb = ey + ry - hp * ry * 1.05;
        const arc = arcPts(ex, yb + 0.04 * u, rx * 1.2, 0.04 * u, Math.PI * 1.05, Math.PI * 1.95);
        fillPath(ctx, [...arc, [ex + rx * 1.3, ey + ry + 0.05 * u], [ex - rx * 1.3, ey + ry + 0.05 * u]], skin, null, 0);
        strokeLine(ctx, arc, "#141110", 8e-3 * u);
      }
      ctx.restore();
      if (lash) {
        for (const k of [0, 1, 2]) strokeLine(ctx, [[ex + s * (0.03 + k * 0.015) * u, ey - ry * 0.85], [ex + s * (0.05 + k * 0.02) * u, ey - ry * 0.85 - 0.03 * u]], "#111", 6e-3 * u);
      }
      if (Math.abs(ang) > 0.25) {
        const off = 0.016 * u;
        browPts = [[xo + s * 0.012 * u, yo - off], [xi - s * 0.012 * u, yi - off]];
      }
    }
    if (!browPts) {
      const raise = (st.brow ?? 0) + ((s < 0 ? st.browL : st.browR) ?? 0) + shock * 0.6;
      const y = by - raise * 0.045 * u + (squeeze ? 0.03 * u : 0) + (closed ? 0.01 * u : 0);
      const tilt = squeeze ? 0.35 : Math.max(0, ang) * 0.4 - Math.max(0, -ang) * 0.4;
      const xi = ex - s * 0.055 * u, xo = ex + s * 0.055 * u;
      browPts = [[xo, y - tilt * 0.01 * u], [xi, y + tilt * 0.05 * u]];
    }
    const [[x0, y0], [x1, y1]] = browPts;
    const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1;
    const t = 0.012 * u * (st.bw ?? 1);
    fillPath(ctx, [[x0 + nx / nl * t, y0 + ny / nl * t], [x1 + nx / nl * t, y1 + ny / nl * t], [x1 - nx / nl * t, y1 - ny / nl * t], [x0 - nx / nl * t, y0 - ny / nl * t]], browC, null, 0);
  }
  function teethRow(ctx, x0, x1, y0, y1, n) {
    ctx.fillStyle = TEETH;
    ctx.fillRect(x0, Math.min(y0, y1), x1 - x0, Math.abs(y1 - y0));
    ctx.strokeStyle = "rgba(40,30,30,0.55)";
    ctx.lineWidth = Math.max(1.2, Math.abs(y1 - y0) * 0.08);
    ctx.beginPath();
    for (let k = 1; k < n; k++) {
      const xx = x0 + (x1 - x0) * k / n;
      ctx.moveTo(xx, y0);
      ctx.lineTo(xx, y1);
    }
    ctx.moveTo(x0, y1);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  function mouth(ctx, x, y, u, st, o = {}) {
    const mw = st.mw ?? 1;
    if (mw === 1) return mouthShape(ctx, x, y, u, st, o);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(mw, 1);
    ctx.translate(-x, -y);
    mouthShape(ctx, x, y, u, st, o);
    ctx.restore();
  }
  function mouthShape(ctx, x, y, u, st, o = {}) {
    const open = Math.max(st.talk, st.shock * 0.7);
    let kind = st.mouth ?? (st.smile > 0.45 ? "smile" : st.smile < -0.3 ? "frown" : "line");
    const ink = o.lips ?? "#141110";
    const lw = o.lips ? 0.012 * u : 8e-3 * u;
    const outline = o.lips ?? LINE;
    const ow = o.lips ? 0.01 * u : 7e-3 * u;
    const cavity = (pts, teethTop, teethBot, tongue) => {
      fillPath(ctx, pts, DARK, null, 0);
      ctx.save();
      clipTo(ctx, pts);
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const L = Math.min(...xs), R = Math.max(...xs), T = Math.min(...ys), B = Math.max(...ys);
      if (tongue) {
        ctx.fillStyle = TONGUE;
        ctx.beginPath();
        ctx.ellipse((L + R) / 2 + 0.01 * u, B, (R - L) * 0.3, (B - T) * 0.35, 0, Math.PI, Math.PI * 2);
        ctx.fill();
      }
      if (teethTop > 0) teethRow(ctx, L, R, T - 2, T + teethTop, 5);
      if (teethBot > 0) teethRow(ctx, L, R, B + 2, B - teethBot, 5);
      ctx.restore();
      fillPath(ctx, pts, "rgba(0,0,0,0)", outline, ow);
    };
    const w = 0.04 * u;
    if (kind === "line" && open > 0.08) kind = "line";
    switch (kind) {
      case "line":
      case "flat": {
        const dx = 0;
        if (open < 0.08) {
          if (kind === "flat") strokeLine(ctx, [[x - w * 0.85, y], [x + w * 0.5, y], [x + w * 0.85, y + 8e-3 * u]], ink, lw);
          else strokeLine(ctx, [[x - w + dx, y], [x + dx, y + st.smile * 8e-3 * u], [x + w + dx, y - st.smile * 0.012 * u]], ink, lw);
          return;
        }
        const h = (0.012 + open * 0.045) * u;
        const top = arcPts(x + dx, y + 0.012 * u, w * 1.05, 0.012 * u, Math.PI, Math.PI * 2, 10);
        const bot = arcPts(x + dx, y, w, h, 0, Math.PI, 14);
        cavity([...top, ...bot], Math.min(0.016 * u, h * 0.4), 0, open > 0.55);
        return;
      }
      case "smile": {
        if (open < 0.08) {
          strokeLine(ctx, arcPts(x, y - 0.03 * u, 0.06 * u, 0.04 * u, Math.PI * 0.18, Math.PI * 0.82, 14), ink, lw);
          return;
        }
        const h = (0.025 + open * 0.04) * u;
        const pts = [[x - 0.06 * u, y - 0.01 * u], [x + 0.06 * u, y - 0.012 * u], ...arcPts(x, y - 0.01 * u, 0.06 * u, h, 0, Math.PI, 14)];
        cavity(pts, 0.016 * u, 0, open > 0.4);
        return;
      }
      case "grin": {
        const h = (0.06 + open * 0.02) * u;
        const pts = [[x - 0.075 * u, y - 0.02 * u], [x + 0.075 * u, y - 0.022 * u], ...arcPts(x, y - 0.02 * u, 0.075 * u, h, 0, Math.PI, 16)];
        cavity(pts, 0.02 * u, 0, true);
        return;
      }
      case "frown": {
        if (open < 0.08) {
          strokeLine(ctx, arcPts(x, y + 0.035 * u, 0.05 * u, 0.03 * u, Math.PI * 1.18, Math.PI * 1.82, 14), ink, lw);
          return;
        }
        const h = (0.02 + open * 0.035) * u;
        const pts = [...arcPts(x, y + 0.02 * u, 0.05 * u, h, Math.PI, Math.PI * 2, 14), [x + 0.05 * u, y + 0.025 * u], [x - 0.05 * u, y + 0.025 * u]];
        cavity(pts, Math.min(0.012 * u, h * 0.4), 0, false);
        return;
      }
      case "smirk": {
        if (open < 0.08) {
          strokeLine(ctx, [[x - 0.045 * u, y + 6e-3 * u], [x + 0.01 * u, y + 6e-3 * u], [x + 0.05 * u, y - 0.02 * u]], ink, lw);
          return;
        }
        const h = (0.012 + open * 0.03) * u;
        const pts = [[x - 0.04 * u, y + 4e-3 * u], [x + 0.05 * u, y - 0.02 * u], ...arcPts(x + 0.01 * u, y - 4e-3 * u, 0.045 * u, h, -0.25, Math.PI, 12)];
        cavity(pts, Math.min(0.012 * u, h * 0.4), 0, false);
        return;
      }
      case "o": {
        const r = (0.018 + open * 0.012) * u;
        fillPath(ctx, ovalPts(x, y + 5e-3 * u, r, r * 1.2 + open * 0.015 * u, 701, 20), DARK, outline, ow);
        return;
      }
      case "O": {
        const pts = ovalPts(x, y + 0.02 * u, (0.035 + open * 0.01) * u, (0.05 + open * 0.015) * u, 702, 26);
        cavity(pts, 0.012 * u, 0, true);
        return;
      }
      case "grit": {
        const ww = 0.056 * u, hh = 0.02 * u, gap = Math.min(open, 0.6) * 0.022 * u;
        const curve = (st.anger ?? 0) > 0.2 ? 8e-3 * u : st.smile > 0.3 ? -8e-3 * u : 0;
        const top = arcPts(x, y + curve, ww, hh + 6e-3 * u, Math.PI, Math.PI * 2, 16);
        const bot = arcPts(x, y + gap + curve, ww, hh + 4e-3 * u, 0, Math.PI, 16);
        const pts = [...top, ...bot];
        fillPath(ctx, pts, TEETH, null, 0);
        ctx.save();
        clipTo(ctx, pts);
        const mid = y + curve;
        if (gap > 1) {
          ctx.fillStyle = DARK;
          ctx.fillRect(x - ww, mid, ww * 2, gap);
        }
        ctx.strokeStyle = "rgba(60,45,45,0.45)";
        ctx.lineWidth = 35e-4 * u;
        ctx.beginPath();
        ctx.moveTo(x - ww, mid);
        ctx.lineTo(x + ww, mid);
        ctx.moveTo(x - ww, mid + gap);
        ctx.lineTo(x + ww, mid + gap);
        for (const k of [-0.35, 0.35]) {
          ctx.moveTo(x + k * ww, mid - hh * 0.8);
          ctx.lineTo(x + k * ww, mid);
        }
        for (const k of [-0.6, 0, 0.6]) {
          ctx.moveTo(x + k * ww, mid + gap);
          ctx.lineTo(x + k * ww, mid + gap + hh * 0.7);
        }
        ctx.stroke();
        ctx.restore();
        fillPath(ctx, pts, "rgba(0,0,0,0)", outline, ow);
        return;
      }
      case "snarl": {
        const ww = 0.075 * u, h = (0.045 + open * 0.035) * u;
        const pts = [[x - ww, y + 0.012 * u], ...arcPts(x, y + 0.01 * u, ww * 0.95, 0.02 * u, Math.PI * 1.05, Math.PI * 1.95, 10), [x + ww, y + 0.012 * u], [x + ww * 0.8, y + h], [x - ww * 0.8, y + h]];
        cavity(pts, 0.016 * u, 0.012 * u, true);
        return;
      }
      case "wavy": {
        if (open < 0.08) {
          const pts = [];
          for (let k = 0; k <= 8; k++) pts.push([x - w * 1.1 + 2.2 * w * k / 8, y + (k % 2 ? -9e-3 : 9e-3) * u]);
          strokeLine(ctx, pts, ink, lw);
          return;
        }
        const h = (0.02 + open * 0.04) * u;
        const top = [];
        for (let k = 0; k <= 16; k++) top.push([x - w * 1.1 + 2.2 * w * k / 16, y + Math.sin(k / 16 * Math.PI * 3) * 6e-3 * u]);
        const bot = arcPts(x, y + 4e-3 * u, w * 1.1, h, 0, Math.PI, 16);
        cavity([...top, ...bot], Math.min(0.012 * u, h * 0.35), 0, false);
        return;
      }
      case "tongue": {
        const mw = 0.045 * u;
        fillPath(ctx, [...arcPts(x, y - 4e-3 * u, mw, 0.012 * u, Math.PI, Math.PI * 2, 12), ...arcPts(x, y - 4e-3 * u, mw, 0.016 * u, 0, Math.PI, 12)], DARK, outline, ow);
        const tl = (0.045 + open * 0.035) * u, tw = 0.028 * u;
        const tp = [[x - tw, y + 2e-3 * u], [x + tw, y + 2e-3 * u], ...arcPts(x, y + tl - tw, tw, tw, 0, Math.PI, 12)];
        fillPath(ctx, tp, TONGUE, LINE, 6e-3 * u);
        strokeLine(ctx, [[x, y + 8e-3 * u], [x, y + tl * 0.7]], "rgba(120,30,40,0.7)", 5e-3 * u);
        return;
      }
      case "pout": {
        fillPath(ctx, ovalPts(x + 0.01 * u, y, 0.02 * u, 0.016 * u + open * 0.012 * u, 703, 18), o.lips ?? "#c8707a", LINE, 6e-3 * u);
        strokeLine(ctx, [[x - 4e-3 * u, y], [x + 0.024 * u, y]], "rgba(60,20,20,0.8)", 4e-3 * u);
        return;
      }
      case "evil": {
        const ww = 0.085 * u;
        const h = (0.035 + open * 0.025) * u;
        const top = arcPts(x, y - 0.07 * u, ww, 0.06 * u, Math.PI * 0.12, Math.PI * 0.88, 14).reverse();
        const bot = arcPts(x, y - 0.07 * u, ww * 0.92, 0.06 * u + h, Math.PI * 0.15, Math.PI * 0.85, 14);
        const pts = [...bot, ...top];
        fillPath(ctx, pts, TEETH, null, 0);
        ctx.save();
        clipTo(ctx, pts);
        ctx.strokeStyle = "rgba(40,30,30,0.6)";
        ctx.lineWidth = 4e-3 * u;
        ctx.beginPath();
        for (let k = -4; k <= 4; k++) {
          ctx.moveTo(x + k * ww * 0.2, y - 0.05 * u);
          ctx.lineTo(x + k * ww * 0.2, y + 0.06 * u);
        }
        ctx.moveTo(x - ww, y - 0.01 * u + h * 0.45);
        ctx.quadraticCurveTo(x, y + 0.02 * u + h * 0.5, x + ww, y - 0.01 * u + h * 0.45);
        ctx.stroke();
        ctx.restore();
        fillPath(ctx, pts, "rgba(0,0,0,0)", outline, ow);
        return;
      }
    }
  }
  function blush(ctx, cx, ey, u, k) {
    if (k <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, k) * 0.6;
    for (const s of [-1, 1]) {
      const g = ctx.createRadialGradient(cx + s * 0.15 * u, ey + 0.095 * u, 0, cx + s * 0.15 * u, ey + 0.095 * u, 0.05 * u);
      g.addColorStop(0, "#ff6f7a");
      g.addColorStop(1, "rgba(255,111,122,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx + s * 0.15 * u, ey + 0.095 * u, 0.05 * u, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function beardFront(ctx, u, hcy, my, color, mcol, full = false) {
    const irx = (full ? 0.095 : 0.11) * u, iry = (full ? 0.045 : 0.05) * u;
    const outer = [];
    for (let i = 0; i <= 24; i++) {
      const a = 0.03 * Math.PI + i / 24 * 0.94 * Math.PI;
      const chin = Math.max(0, Math.sin(a) - 0.9) * 0.3 * u;
      outer.push([Math.cos(a) * 0.244 * u, hcy + Math.sin(a) * 0.204 * u + chin]);
    }
    const inner = [[-0.205 * u, hcy + 0.03 * u], [-irx, my + 5e-3 * u], ...arcPts(5e-3 * u, my + 5e-3 * u, irx, iry, Math.PI, 0, 14).slice(1), [0.205 * u, hcy + 0.03 * u]];
    fillPath(ctx, [...outer, ...inner], color, LINE, 6e-3 * u);
    return () => {
      const y = my - 0.03 * u;
      const m = [[-0.095 * u, y + 0.03 * u], [-0.08 * u, y], [-0.03 * u, y - 0.012 * u], [0, y - 4e-3 * u], [0.03 * u, y - 0.012 * u], [0.08 * u, y], [0.095 * u, y + 0.03 * u], [0.06 * u, y + 0.018 * u], [0.02 * u, y + 0.022 * u], [0, y + 0.016 * u], [-0.02 * u, y + 0.022 * u], [-0.06 * u, y + 0.018 * u]];
      fillPath(ctx, m, mcol, LINE, 6e-3 * u);
    };
  }

  // ../multik-paper/src/paper/people.ts
  var LINE2 = "rgba(20,16,14,0.85)";
  function darker(hex, k = 0.75) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round((n >> 16 & 255) * k), g = Math.round((n >> 8 & 255) * k), b = Math.round((n & 255) * k);
    return `rgb(${r},${g},${b})`;
  }
  function handAt(u, i, ang) {
    const s = i ? 1 : -1;
    const a = s * ang;
    const r = 0.21 * u + 0.042 * u;
    return [s * 0.15 * u + Math.sin(a) * r, -0.53 * u + Math.cos(a) * r];
  }
  function propDraw(ctx, u, p) {
    if (p === "crown") {
      const pts = [[-0.09 * u, 0], [-0.09 * u, -0.08 * u], [-0.045 * u, -0.035 * u], [0, -0.1 * u], [0.045 * u, -0.035 * u], [0.09 * u, -0.08 * u], [0.09 * u, 0]];
      piece(ctx, cut(pts, 901, 0.02 * u, 1.2), "#f2c12e", "rgba(60,40,10,0.9)", 0.6);
    } else if (p === "badges") {
      for (const k of [-1, 0, 1]) piece(ctx, roundP(k * 0.05 * u - 0.035 * u, -0.1 * u + Math.abs(k) * 0.01 * u, k * 0.05 * u + 0.035 * u, -0.01 * u, 8e-3 * u, 910 + k), "#f4ecd2", LINE2, 0.5);
    } else if (p === "jar") {
      piece(ctx, roundP(-0.06 * u, -0.14 * u, 0.06 * u, 0, 0.02 * u, 920), "#cfe8f6", LINE2, 0.6);
      for (let k = 0; k < 5; k++) piece(ctx, ovalPts((k - 2) * 0.02 * u, -0.03 * u - k % 2 * 0.03 * u, 0.018 * u, 0.018 * u, 921 + k, 14), "#f2c12e", "rgba(60,40,10,0.9)", 0);
    } else if (p === "dog") {
      piece(ctx, ovalPts(0, -0.06 * u, 0.07 * u, 0.045 * u, 930, 30), "#e8d3b0", LINE2, 0.6);
      piece(ctx, ovalPts(0.06 * u, -0.1 * u, 0.04 * u, 0.035 * u, 931, 24), "#e8d3b0", LINE2, 0.5);
      piece(ctx, ovalPts(0.075 * u, -0.105 * u, 7e-3 * u, 7e-3 * u, 932, 10), "#111", null, 0);
      piece(ctx, cut([[0.04 * u, -0.13 * u], [0.055 * u, -0.17 * u], [0.065 * u, -0.13 * u]], 933), "#b8946a", LINE2, 0.3);
    } else if (p === "magnifier") {
      piece(ctx, rectP(-8e-3 * u, -0.02 * u, 8e-3 * u, 0.06 * u), "#5a3a26", LINE2, 0.4);
      piece(ctx, ovalPts(0, -0.07 * u, 0.055 * u, 0.055 * u, 940, 30), "#cfe8f6", "#333", 0.6);
    } else if (p === "popcorn") {
      piece(ctx, cut([[-0.06 * u, -0.12 * u], [0.06 * u, -0.12 * u], [0.045 * u, 0.02 * u], [-0.045 * u, 0.02 * u]], 950), "#f4f4ee", LINE2, 0.6);
      for (const k of [-2, -1, 0, 1, 2]) piece(ctx, rectP(k * 0.022 * u - 6e-3 * u, -0.12 * u, k * 0.022 * u + 6e-3 * u, 0), "#d8302a", null, 0);
      for (let k = 0; k < 7; k++) piece(ctx, ovalPts((k - 3) * 0.018 * u, -0.13 * u - k % 2 * 0.015 * u, 0.016 * u, 0.014 * u, 951 + k, 12), "#fbf3d0", null, 0.2);
    } else if (p === "laptop") {
      piece(ctx, roundP(-0.11 * u, -0.17 * u, 0.11 * u, -0.02 * u, 8e-3 * u, 960), "#3a3d44", LINE2, 0.6);
      piece(ctx, rectP(-0.095 * u, -0.155 * u, 0.095 * u, -0.035 * u), "#bff0c8", null, 0);
      label(ctx, "12/12", 0, -0.095 * u, 0.045 * u, "#1f7a3a");
    }
  }
  function legsFront(ctx, u, o, sit, sd) {
    const L = (x, y) => [x * u, y * u];
    const w = o.legW ?? 0.068;
    for (const i of [0, 1]) {
      const s = i ? 1 : -1;
      const cx = s * 0.072;
      if (sit) {
        piece(ctx, ovalPts(cx * u, -0.13 * u, 0.082 * u, 0.06 * u, sd + 24 + i, 30), o.legC);
        piece(ctx, cut([L(cx - w / 2, -0.13), L(cx + w / 2, -0.13), L(cx + w * 0.42, -0.035), L(cx - w * 0.42, -0.035)], sd + 26 + i, 0.012 * u, 0.8), o.legC);
      } else {
        piece(ctx, cut([L(cx - w / 2, -0.19), L(cx + w / 2, -0.19), L(cx + w * 0.44, -0.11), L(cx + w * 0.4, -0.035), L(cx - w * 0.4, -0.035), L(cx - w * 0.44, -0.11)], sd + 20 + i, 0.012 * u, 0.8), o.legC);
      }
      if (o.jeans) {
        ctx.strokeStyle = "rgba(220,200,140,0.7)";
        ctx.lineWidth = 4e-3 * u;
        ctx.beginPath();
        ctx.moveTo((cx + s * w * 0.3) * u, (sit ? -0.12 : -0.18) * u);
        ctx.lineTo((cx + s * w * 0.28) * u, -0.06 * u);
        ctx.stroke();
        piece(ctx, rectP((cx - w * 0.43) * u, -0.062 * u, (cx + w * 0.43) * u, -0.04 * u), lighter(o.legC), LINE2, 0.3);
      }
      shoeFront(ctx, u, cx + s * 8e-3, s, o, sd + 22 + i);
    }
  }
  function lighter(hex) {
    const n = parseInt(hex.slice(1), 16);
    const h = (v) => Math.min(255, Math.round(v * 1.2 + 12));
    return `rgb(${h(n >> 16 & 255)},${h(n >> 8 & 255)},${h(n & 255)})`;
  }
  function shoeFront(ctx, u, cx, s, o, seed) {
    const X = cx * u, c = o.shoeC;
    switch (o.shoe) {
      case "sneakers":
        piece(ctx, roundP(X - 0.058 * u, -0.062 * u, X + 0.058 * u, -0.01 * u, 0.026 * u, seed), c, LINE2, 0.6);
        piece(ctx, roundP(X - 0.062 * u, -0.02 * u, X + 0.062 * u, 2e-3 * u, 8e-3 * u, seed + 40), "#f4f4f0", LINE2, 0.4);
        ctx.strokeStyle = "rgba(240,240,240,0.9)";
        ctx.lineWidth = 4e-3 * u;
        ctx.beginPath();
        for (const k of [0, 1]) {
          ctx.moveTo(X - 0.016 * u, (-0.05 + k * 0.014) * u);
          ctx.lineTo(X + 0.016 * u, (-0.05 + k * 0.014) * u);
        }
        ctx.stroke();
        return;
      case "boots":
        piece(ctx, rectP(X - 0.042 * u, -0.1 * u, X + 0.042 * u, -0.025 * u), c, LINE2, 0.5);
        piece(ctx, ovalPts(X + s * 8e-3 * u, -0.025 * u, 0.064 * u, 0.03 * u, seed, 36), c, LINE2, 0.5);
        piece(ctx, roundP(X - 0.062 * u, -0.01 * u, X + 0.062 * u, 6e-3 * u, 4e-3 * u, seed + 40), darker(c, 0.6), null, 0);
        return;
      case "heels":
        piece(ctx, ovalPts(X + s * 6e-3 * u, -0.022 * u, 0.046 * u, 0.024 * u, seed, 26), c, LINE2, 0.5);
        piece(ctx, rectP(X - s * 0.03 * u - 8e-3 * u, -0.012 * u, X - s * 0.03 * u + 8e-3 * u, 0.012 * u), darker(c, 0.7), LINE2, 0.3);
        return;
      case "flats":
        piece(ctx, ovalPts(X, -0.02 * u, 0.05 * u, 0.026 * u, seed, 26), c, LINE2, 0.5);
        piece(ctx, ovalPts(X, -0.034 * u, 0.012 * u, 8e-3 * u, seed + 40, 10), darker(c, 0.7), null, 0);
        return;
      case "loafers":
        piece(ctx, ovalPts(X, -0.025 * u, 0.062 * u, 0.03 * u, seed, 36), c, LINE2, 0.5);
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 5e-3 * u;
        ctx.beginPath();
        ctx.arc(X - 0.01 * u, -0.03 * u, 0.03 * u, Math.PI * 1.15, Math.PI * 1.55);
        ctx.stroke();
        return;
      default:
        piece(ctx, ovalPts(X, -0.03 * u, 0.06 * u, 0.032 * u, seed, 40), c);
    }
  }
  function bodyDetails(ctx, u, lk, sd, bottom) {
    const L = (x, y) => [x * u, y * u];
    const d = lk.details ?? [];
    const dk = darker(lk.top, 0.78);
    const thin = (pts, col, w) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = w * u;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
      ctx.stroke();
    };
    if (d.includes("hem")) piece(ctx, cut([L(-0.225, bottom - 0.045), L(0.225, bottom - 0.045), L(0.232, bottom), L(-0.232, bottom)], sd + 101), dk, LINE2, 0.4);
    if (d.includes("hood")) {
      piece(ctx, cut([L(-0.17, -0.6), L(-0.1, -0.64), L(0.1, -0.64), L(0.17, -0.6), L(0.1, -0.57), L(-0.1, -0.57)], sd + 102), dk, LINE2, 0.4);
      for (const s of [-1, 1]) {
        thin([L(s * 0.035, -0.59), L(s * 0.045, -0.47)], "#ececec", 7e-3);
        piece(ctx, rectP((s * 0.045 - 6e-3) * u, -0.475 * u, (s * 0.045 + 6e-3) * u, -0.455 * u), "#bdbdbd", null, 0);
      }
      piece(ctx, cut([L(-0.12, -0.33), L(0.12, -0.33), L(0.15, -0.2), L(-0.15, -0.2)], sd + 103), darker(lk.top, 0.9), LINE2, 0.4);
    }
    if (d.includes("zip")) {
      thin([L(0, -0.6), L(0, bottom)], "#c8c8c0", 6e-3);
      piece(ctx, roundP(-0.012 * u, -0.56 * u, 0.012 * u, -0.52 * u, 4e-3 * u, sd + 104), "#d8d8d0", LINE2, 0.3);
    }
    if (d.includes("jacketZip")) thin([L(-0.02, -0.6), L(0.06, -0.42), L(0.05, bottom)], "#b8b8b0", 6e-3);
    if (d.includes("pockets"))
      for (const s of [-1, 1]) {
        piece(ctx, rectP((s * 0.085 - 0.045) * u, -0.5 * u, (s * 0.085 + 0.045) * u, -0.4 * u), darker(lk.top, 0.92), LINE2, 0.4);
        piece(ctx, rectP((s * 0.085 - 0.048) * u, -0.505 * u, (s * 0.085 + 0.048) * u, -0.475 * u), dk, LINE2, 0.4);
      }
    if (d.includes("placket")) {
      thin([L(0, -0.58), L(0, bottom)], "rgba(60,60,60,0.35)", 5e-3);
      for (let k = 0; k < 4; k++) piece(ctx, ovalPts(0.014 * u, (-0.52 + k * 0.1) * u, 9e-3 * u, 9e-3 * u, sd + 105 + k, 10), "#9a9a90", null, 0);
      for (const s of [-1, 1]) piece(ctx, cut([L(0, -0.6), L(s * 0.1, -0.61), L(s * 0.06, -0.53)], sd + 110 + s), darker(lk.top, 0.95), LINE2, 0.4);
    }
    if (d.includes("lapels")) {
      for (const s of [-1, 1]) piece(ctx, cut([L(s * 0.065, -0.6), L(s * 0.14, -0.57), L(s * 0.07, -0.44), L(s * 0.02, -0.38)], sd + 112 + s), dk, LINE2, 0.4);
      for (const k of [0, 1]) piece(ctx, ovalPts(0.01 * u, (-0.33 + k * 0.08) * u, 0.011 * u, 0.011 * u, sd + 114 + k, 10), darker(lk.top, 0.6), null, 0);
    }
    if (d.includes("square")) piece(ctx, cut([L(-0.13, -0.48), L(-0.07, -0.48), L(-0.08, -0.45), L(-0.1, -0.465), L(-0.12, -0.45)], sd + 116), "#f4f4f0", LINE2, 0.3);
    if (d.includes("belt")) {
      piece(ctx, rectP(-0.225 * u, (bottom - 0.04) * u, 0.225 * u, (bottom - 0.012) * u), "#3a2a20", LINE2, 0.3);
      piece(ctx, rectP(-0.02 * u, (bottom - 0.044) * u, 0.02 * u, (bottom - 8e-3) * u), "#c8a040", LINE2, 0.3);
    }
  }
  function drawPerson(ctx, u, lk, st, prop = null, witch = 0) {
    const L = (x, y) => [x * u, y * u];
    const sd = Math.round(lk.skin.charCodeAt(2) * 7 + lk.top.charCodeAt(3) * 3);
    ctx.save();
    ctx.translate(0, -st.bounce);
    const hy = -0.79;
    const HX = (x) => x * u, HY = (y) => (hy + y) * u;
    const hs = lk.hair.style;
    const len = lk.hair.len ?? -0.5;
    if (hs === "long" || hs === "curly" || hs === "wavy" || hs === "bob") {
      const bottom2 = hs === "bob" ? HY(0.12) : len * u;
      const w = hs === "curly" ? 0.33 : hs === "bob" ? 0.29 : 0.28;
      const pts = [];
      const n = 22;
      for (let i = 0; i <= n; i++) {
        const a = Math.PI + i / n * Math.PI;
        pts.push([Math.cos(a) * w * u, HY(-0.02) + Math.sin(a) * 0.25 * u]);
      }
      const sides = 8;
      for (let i = 0; i <= sides; i++) {
        const t = i / sides;
        const bump = hs === "curly" ? i % 2 ? 0.035 : 0 : hs === "wavy" ? Math.sin(t * 9) * 0.015 : 0;
        pts.push([(w + bump) * u, HY(-0.02) + (bottom2 - HY(-0.02)) * t]);
      }
      for (let i = 0; i <= 6; i++) pts.push([(w - 2 * w * i / 6) * u, bottom2 + (hs === "curly" || hs === "wavy" ? i % 2 ? 0.025 * u : 0 : 0)]);
      for (let i = sides; i >= 0; i--) {
        const t = i / sides;
        const bump = hs === "curly" ? i % 2 ? 0.035 : 0 : hs === "wavy" ? Math.sin(t * 9 + 1) * 0.015 : 0;
        pts.push([-(w + bump) * u, HY(-0.02) + (bottom2 - HY(-0.02)) * t]);
      }
      piece(ctx, cut(pts, sd + 1, 0.03 * u, 1.4), lk.hair.color);
    }
    if (hs === "pony") {
      ctx.save();
      ctx.translate(HX(0.24), HY(0.02));
      ctx.rotate(0.35);
      piece(ctx, cut(ovalPts(0, 0.1 * u, 0.07 * u, 0.17 * u, sd + 3, 26), sd + 4, 0.02 * u, 1.2), lk.hair.color);
      ctx.restore();
    }
    legsFront(ctx, u, { legC: lk.dress || lk.skirt ? lk.tights ?? lk.skin : lk.pants ?? "#24262e", shoe: lk.shoe, shoeC: lk.shoeC ?? (lk.dress ? "#7a2a2a" : "#2a211b"), jeans: lk.jeans, legW: lk.legW }, !!st.sit, sd);
    const arm = (i, ang) => {
      const s = i ? 1 : -1;
      ctx.save();
      ctx.translate(s * 0.15 * u, -0.53 * u);
      ctx.rotate(-s * ang);
      const ln = 0.21 * u;
      piece(ctx, cut([[-0.035 * u, -0.02 * u], [0.035 * u, -0.02 * u], [0.032 * u, ln], [-0.032 * u, ln]], sd + 30 + i), lk.top);
      if (lk.details?.includes("cuffs")) piece(ctx, rectP(-0.034 * u, ln - 0.035 * u, 0.034 * u, ln), darker(lk.top, 0.82), LINE2, 0.3);
      ctx.translate(0, ln + 0.03 * u);
      piece(ctx, ovalPts(s * -0.035 * u, 0, 0.018 * u, 0.034 * u, sd + 34 + i, 24), lk.skin);
      piece(ctx, ovalPts(0, 0.012 * u, 0.04 * u, 0.048 * u, sd + 36 + i, 32), lk.skin);
      ctx.restore();
    };
    const bottom = lk.dress ? -0.17 : -0.12;
    const flare = lk.dress ? 0.26 : 0.23;
    piece(ctx, cut([L(-0.15, -0.6), L(0.15, -0.6), L(flare, bottom - 0.02), L(flare - 0.01, bottom), L(-flare + 0.01, bottom), L(-flare, bottom - 0.02)], sd + 40, 0.03 * u, 1.8), lk.top);
    if (lk.pattern) {
      for (let k = 0; k < 14; k++) {
        const x = -0.17 + k * 37 % 34 / 100, y = -0.55 + k * 23 % 38 / 100;
        if (Math.abs(x) > 0.15 + (y + 0.6) * 0.18) continue;
        piece(ctx, ovalPts(x * u, y * u, 0.012 * u, 0.012 * u, sd + 50 + k, 10), lk.pattern.color, null, 0);
        if (lk.pattern.kind === "floral") piece(ctx, ovalPts(x * u + 0.012 * u, y * u, 8e-3 * u, 8e-3 * u, sd + 70 + k, 8), "#7aa060", null, 0);
      }
    }
    if (lk.skirt) {
      const sb = lk.skirtLen ?? -0.15;
      piece(ctx, cut([L(-0.19, -0.33), L(0.19, -0.33), L(0.255, sb - 0.02), L(0.245, sb), L(-0.245, sb), L(-0.255, sb - 0.02)], sd + 41, 0.03 * u, 1.4), lk.skirt);
    }
    if (lk.top2) piece(ctx, cut([L(-0.06, -0.6), L(0.06, -0.6), L(0, -0.45)], sd + 44), lk.top2, null, 0.4);
    if (lk.details) bodyDetails(ctx, u, lk, sd, bottom);
    if (lk.necklace) piece(ctx, ovalPts(0, -0.5 * u, 0.018 * u, 0.025 * u, sd + 45, 14), lk.necklace, LINE2, 0.3);
    if (lk.camera) {
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 8e-3 * u;
      ctx.beginPath();
      ctx.moveTo(-0.1 * u, -0.6 * u);
      ctx.lineTo(0, -0.43 * u);
      ctx.lineTo(0.1 * u, -0.6 * u);
      ctx.stroke();
      piece(ctx, roundP(-0.075 * u, -0.46 * u, 0.075 * u, -0.36 * u, 0.012 * u, sd + 46), "#2a2a30", LINE2, 0.7);
      piece(ctx, ovalPts(0, -0.41 * u, 0.035 * u, 0.035 * u, sd + 47, 24), "#55606e", LINE2, 0.3);
      piece(ctx, ovalPts(0, -0.41 * u, 0.018 * u, 0.018 * u, sd + 48, 16), "#9fd0ff", null, 0);
    }
    ctx.save();
    ctx.translate(0, -0.58 * u);
    ctx.rotate(st.tilt);
    ctx.translate(0, 0.58 * u);
    const skin = tint(lk.skin, st.red ?? 0);
    for (const s of [-1, 1]) piece(ctx, ovalPts(HX(s * 0.235), HY(0.01), 0.035 * u, 0.045 * u, sd + 60 + s, 20), skin);
    piece(ctx, ovalPts(0, HY(0), 0.245 * u, 0.205 * u, sd + 62, 80), skin);
    if (lk.earrings) {
      for (const s of [-1, 1]) {
        if (lk.earrings.hoop) {
          ctx.strokeStyle = lk.earrings.color;
          ctx.lineWidth = 8e-3 * u;
          ctx.beginPath();
          ctx.arc(HX(s * 0.243), HY(0.075), 0.026 * u, 0, Math.PI * 2);
          ctx.stroke();
        } else piece(ctx, ovalPts(HX(s * 0.243), HY(0.06), 0.013 * u, 0.013 * u, sd + 64 + s, 10), lk.earrings.color, LINE2, 0.3);
      }
    }
    if (lk.stubble) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, HY(0), 0.243 * u, 0.203 * u, 0, 0, Math.PI * 2);
      ctx.clip();
      piece(ctx, ovalPts(0, HY(0.2), 0.27 * u, 0.15 * u, sd + 63, 40), darker(skin, 0.9), null, 0);
      ctx.restore();
    }
    const mY = HY(0.115);
    const moustache = lk.beard ? beardFront(ctx, u, HY(0), mY, lk.beard, darker(lk.beard, 0.85), true) : null;
    const eyeY = HY(-0.04);
    const bc = darker(lk.hair.color === "#e6cf9a" || lk.hair.color === "#d9c08a" || lk.hair.color === "#d8b56a" ? "#8a6a40" : lk.hair.color, 0.6);
    blush(ctx, 0, eyeY, u, st.blush ?? 0);
    mouth(ctx, HX(5e-3), mY, u, st, { lips: lk.lips });
    if (moustache) moustache();
    if (lk.mask) piece(ctx, roundP(HX(-0.2), HY(0.02), HX(0.2), HY(0.2), 0.03 * u, sd + 73), "#9fd3f0", LINE2, 0.5);
    const hc = lk.hair.color;
    const high = lk.hair.high ?? 0;
    if (hs === "buzz") {
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const a = Math.PI * 1.08 + i / 20 * Math.PI * 0.84;
        pts.push([Math.cos(a) * 0.247 * u, HY(0) + Math.sin(a) * 0.207 * u]);
      }
      pts.push([HX(0.2), HY(-0.12)], [HX(-0.2), HY(-0.12)]);
      piece(ctx, cut(pts, sd + 80, 0.02 * u, 1), hc, null, 0.2);
    } else {
      const pts = [];
      const r = hs === "curly" ? 1.1 : 1.05;
      for (let i = 0; i <= 24; i++) {
        const a = Math.PI * 1.02 + i / 24 * Math.PI * 0.96;
        const bump = hs === "curly" ? i % 2 ? 0.03 : 0 : hs === "short" ? i % 3 === 0 ? 0.015 : 0 : 0;
        pts.push([Math.cos(a) * (0.245 * r + bump) * u, HY(-0.02) + Math.sin(a) * (0.205 * r + bump) * u]);
      }
      const hl = HY(-0.11 - high);
      if (hs === "short") {
        pts.push([HX(0.22), HY(-0.08 - high)], [HX(0.08), hl], [HX(-0.1), hl + 0.01 * u], [HX(-0.22), HY(-0.08 - high)]);
      } else {
        pts.push([HX(0.24), HY(0.02)], [HX(0.16), HY(-0.1)], [HX(0.04), HY(-0.16)], [HX(0), HY(-0.13)], [HX(-0.06), HY(-0.15)], [HX(-0.18), HY(-0.08)], [HX(-0.24), HY(0.02)]);
      }
      piece(ctx, cut(pts, sd + 81, 0.02 * u, 1.4), hc);
      if (hs === "bun") {
        piece(ctx, ovalPts(HX(0), HY(-0.26), 0.09 * u, 0.075 * u, sd + 82, 30), hc);
      }
    }
    if (lk.fringe) piece(ctx, cut([[HX(-0.215), HY(-0.17)], [HX(0.215), HY(-0.17)], [HX(0.2), HY(-0.105)], [HX(0.1), HY(-0.125)], [HX(0), HY(-0.105)], [HX(-0.1), HY(-0.125)], [HX(-0.2), HY(-0.105)]], sd + 85, 0.015 * u, 1), hc);
    if (lk.hairband) {
      ctx.strokeStyle = lk.hairband;
      ctx.lineWidth = 0.028 * u;
      ctx.beginPath();
      ctx.ellipse(0, HY(-0.03), 0.25 * u, 0.205 * u, 0, Math.PI * 1.13, Math.PI * 1.87);
      ctx.stroke();
    }
    if (lk.clip) {
      ctx.save();
      ctx.translate(HX(0.15), HY(-0.15));
      ctx.rotate(0.5);
      piece(ctx, roundP(-0.04 * u, -0.012 * u, 0.04 * u, 0.012 * u, 8e-3 * u, sd + 89), lk.clip, LINE2, 0.4);
      ctx.restore();
    }
    if (lk.cap) {
      const band = HY(-0.19);
      const dome = [[HX(-0.25), band + 0.04 * u], ...ovalPts(0, band + 0.03 * u, 0.252 * u, 0.17 * u, sd + 83, 40, Math.PI, Math.PI * 2), [HX(0.25), band + 0.04 * u]];
      piece(ctx, cut(dome, sd + 84, 0.012 * u, 0.8), lk.cap);
      ctx.strokeStyle = darker(lk.cap, 0.7);
      ctx.lineWidth = 6e-3 * u;
      ctx.beginPath();
      for (const k of [-1, 1]) {
        ctx.moveTo(HX(k * 0.11), band + 0.01 * u);
        ctx.quadraticCurveTo(HX(k * 0.09), band - 0.09 * u, 0, band - 0.14 * u);
      }
      ctx.stroke();
      piece(ctx, ovalPts(0, band - 0.14 * u, 0.022 * u, 0.012 * u, sd + 86, 12), darker(lk.cap, 0.7), LINE2, 0.3);
      piece(ctx, roundP(HX(-0.05), band - 0.075 * u, HX(0.05), band - 0.02 * u, 0.01 * u, sd + 85), "#f4ecd2", LINE2, 0.4);
      label(ctx, "V", 0, band - 0.047 * u, 0.04 * u, "#2f4a7a");
      piece(ctx, ovalPts(0, band + 0.02 * u, 0.235 * u, 0.085 * u, sd + 88, 30, 0, Math.PI), "rgba(60,40,30,0.35)", null, 0);
      piece(ctx, ovalPts(0, band + 0.01 * u, 0.225 * u, 0.072 * u, sd + 87, 30, 0, Math.PI), darker(lk.cap, 0.5), null, 0);
      const vis = [[HX(-0.23), band + 0.01 * u], [HX(0.23), band + 0.01 * u], ...ovalPts(0, band + 0.01 * u, 0.23 * u, 0.058 * u, sd + 89, 30, 0, Math.PI)];
      piece(ctx, vis, darker(lk.cap, 0.88), LINE2, 0.7);
    }
    for (const s of [-1, 1]) eyeBrow(ctx, HX(s * 0.066), eyeY, HY(lk.cap ? -0.122 : -0.14), u, s, st, skin, bc, sd + 66 + s, !!lk.lips);
    if (lk.glasses) {
      for (const s of [-1, 1]) {
        const ex = HX(s * 0.066);
        if (lk.glasses === "sun") piece(ctx, ovalPts(ex, eyeY, 0.075 * u, 0.06 * u, sd + 86 + s, 30), "#141414", LINE2, 0.4);
        else {
          ctx.strokeStyle = "#111";
          ctx.lineWidth = 0.024 * u;
          ctx.beginPath();
          if (lk.glasses === "cat") {
            ctx.moveTo(ex - 0.075 * u, eyeY - 0.03 * u);
            ctx.quadraticCurveTo(ex, eyeY - 0.1 * u, ex + s * 0.09 * u, eyeY - 0.07 * u);
            ctx.quadraticCurveTo(ex + 0.07 * u * s, eyeY + 0.09 * u, ex - s * 0.065 * u, eyeY + 0.04 * u);
            ctx.closePath();
          } else ctx.ellipse(ex, eyeY, 0.078 * u, 0.088 * u, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 0.018 * u;
      ctx.beginPath();
      ctx.moveTo(HX(-0.01), eyeY - 0.01 * u);
      ctx.lineTo(HX(0.01), eyeY - 0.01 * u);
      ctx.stroke();
    }
    if (lk.horns) {
      for (const s of [-1, 1])
        piece(ctx, cut([[HX(s * 0.1), HY(-0.2)], [HX(s * 0.2), HY(-0.32)], [HX(s * 0.18), HY(-0.17)]], sd + 88 + s), "#d8302a", LINE2, 0.6);
    }
    if (witch > 0.01) {
      ctx.save();
      ctx.translate(0, HY(-0.18) - (1 - witch) * 0.4 * u);
      piece(ctx, cut([[-0.32 * u, 0], [0.32 * u, 0], [0.2 * u, -0.03 * u], [0.05 * u, -0.38 * u], [-0.1 * u, -0.03 * u]], sd + 90), "#2a1f3a", LINE2, 0.8);
      piece(ctx, rectP(-0.13 * u, -0.06 * u, 0.15 * u, -0.025 * u), "#8a3ad8", null, 0);
      ctx.restore();
    }
    ctx.restore();
    if (lk.bowtie) {
      piece(ctx, cut([[0, -0.585 * u], [-0.07 * u, -0.62 * u], [-0.07 * u, -0.55 * u]], sd + 91), lk.bowtie, LINE2, 0.5);
      piece(ctx, cut([[0, -0.585 * u], [0.07 * u, -0.62 * u], [0.07 * u, -0.55 * u]], sd + 92), lk.bowtie, LINE2, 0.5);
      piece(ctx, ovalPts(0, -0.585 * u, 0.015 * u, 0.015 * u, sd + 93, 12), darker(lk.bowtie, 0.7), null, 0);
    }
    if (!st.armsOff?.[0]) arm(0, st.armL);
    if (!st.armsOff?.[1]) arm(1, st.armR);
    if (lk.mic) {
      const [hx, hyy] = handAt(u, 1, st.armR);
      piece(ctx, rectP(hx - 0.012 * u, hyy - 0.09 * u, hx + 0.012 * u, hyy + 0.01 * u), "#222", null, 0.4);
      piece(ctx, ovalPts(hx, hyy - 0.1 * u, 0.028 * u, 0.032 * u, sd + 94, 20), "#444", LINE2, 0.4);
    }
    if (prop) {
      const [hx, hyy] = handAt(u, 0, st.armL);
      ctx.save();
      ctx.translate(hx, hyy - 0.03 * u);
      propDraw(ctx, u, prop);
      ctx.restore();
    }
    ctx.restore();
  }
  var LOOKS = {
    // 16.11, третий заход: у каждого свои ноги, обувь, силуэт одежды и одна-две детали (правила 29–32)
    natalia: { skin: "#e0b088", hair: { style: "curly", color: "#c8954a", len: -0.5 }, top: "#a9cbe8", top2: "#f4f4f0", lips: "#c0505a", skirt: "#2f3f63", skirtLen: -0.1, tights: "#d9a982", shoe: "flats", shoeC: "#2f3f63", legW: 0.052, details: ["cuffs"], earrings: { color: "#f4f0e6" } },
    tatyana: { skin: "#f0cfae", hair: { style: "long", color: "#3a2a22", len: -0.42 }, top: "#efdcc8", dress: true, pattern: { kind: "floral", color: "#e48aa8" }, lips: "#b84860", fringe: true, hairband: "#e48aa8", shoe: "flats", shoeC: "#c0405a", legW: 0.05 },
    viktor: { skin: "#e8bf98", hair: { style: "short", color: "#3a2e26" }, cap: "#8a8f99", beard: "#3a2e26", top: "#7d9440", pants: "#2f4a7a", jeans: true, shoe: "boots", shoeC: "#6a4426", details: ["zip", "pockets", "cuffs"] },
    // 16.11 кофта была #b8bcc4: свой цвет каждому
    arina: { skin: "#f3d2b5", hair: { style: "pony", color: "#7a5536" }, top: "#f2d23c", lips: "#c86070", pants: "#4a6a9a", jeans: true, shoe: "sneakers", shoeC: "#f4f4f0", legW: 0.056, details: ["hem", "cuffs"], clip: "#e8508a" },
    elena_k: { skin: "#ecc4a0", hair: { style: "bun", color: "#2a1e1a" }, glasses: "sun", top: "#d8302a", dress: true, pattern: { kind: "dots", color: "#fbfbf6" }, lips: "#c0202a" },
    irina: { skin: "#efc6a2", hair: { style: "wavy", color: "#8a4a2a", len: -0.52 }, top: "#e8a21c", mic: true, lips: "#c06060", skirt: "#1e1e22", skirtLen: -0.19, tights: "#2a2a30", shoe: "heels", shoeC: "#1e1e22", legW: 0.048, earrings: { color: "#d8b040", hoop: true }, details: ["belt"] },
    vlad: { skin: "#f0c8a6", hair: { style: "short", color: "#6a4a30" }, top: "#22305a", top2: "#f4f4f0", bowtie: "#c0222c", pants: "#22305a", shoe: "loafers", shoeC: "#141414", details: ["lapels", "square"] },
    anika: { skin: "#f0c8a6", hair: { style: "wavy", color: "#4a2e22", len: -0.45 }, glasses: "cat", top: "#2a2a30", necklace: "#c8a040", lips: "#b04050", dress: true, tights: "#1a1a1e", shoe: "heels", shoeC: "#8a1a2a", legW: 0.048, earrings: { color: "#c8a040" } },
    yuri: { skin: "#e3b48e", hair: { style: "short", color: "#7a6650", high: 0.04 }, stubble: true, top: "#2f6db5", pants: "#3a4a66", jeans: true, shoe: "sneakers", shoeC: "#5a5a62", details: ["hood", "hem", "cuffs"] },
    // 16.11 кофта была #3a3f4a
    ellina: { skin: "#f3d6bd", hair: { style: "bob", color: "#d9c08a" }, top: "#1e1e22", top2: "#f4f4f0", lips: "#b05060", pants: "#1e1e22", shoe: "loafers", shoeC: "#5a3a26", legW: 0.054, details: ["lapels"], earrings: { color: "#e8e0d0" } },
    regina: { skin: "#e6c09a", hair: { style: "long", color: "#141414", len: -0.22 }, top: "#151515", lips: "#a04050" },
    elena_s: { skin: "#f3d6bd", hair: { style: "long", color: "#e6cf9a", len: -0.42 }, top: "#d8202e", lips: "#c0101e" },
    evgeny: { skin: "#e0b896", hair: { style: "buzz", color: "#2a2a2a" }, beard: "#1e1a18", top: "#f4f4f0", pants: "#8a7a5a", shoe: "sneakers", shoeC: "#f4f4f0", details: ["placket", "cuffs"] },
    // 16.11, выпуск 9: бабушка Вити — седой пучок, круглые очки, халат в цветочек, тапки
    babushka: { skin: "#ecc4a4", hair: { style: "bun", color: "#d4d4da" }, glasses: "round", top: "#6a8fc8", dress: true, pattern: { kind: "floral", color: "#f4e0a0" }, lips: "#b06070", tights: "#d9b49a", shoe: "flats", shoeC: "#8a2a3a", legW: 0.06 },
    yana: { skin: "#f3d0b2", hair: { style: "curly", color: "#d8b56a", len: -0.5 }, top: "#1a1a1e", lips: "#d0202a", horns: true, camera: true, pants: "#1a1a1e", shoe: "boots", shoeC: "#2a2a30", legW: 0.052, details: ["jacketZip"], earrings: { color: "#d0202a" } }
  };

  // ../multik-paper/src/paper/hero.ts
  var IDLE = { talk: 0, blink: false, brow: 0, smile: 0, look: [0, 0], armR: 0.12, armL: 0.12, wave: 0, shock: 0, chicken: 0, bounce: 0, tilt: 0 };
  var JK = "#222227";
  var JK2 = "#34343b";
  var SKIN = "#f2cf9e";
  var HAIR = "#a8a8ae";
  var TEMPLE = "#4a4a50";
  var BEARD = "#8f8f96";
  var RED = "#b0262e";
  function handPos(u, i, ang) {
    const s = i ? 1 : -1;
    const a = s * ang;
    const r = 0.21 * u + 0.042 * u;
    return [s * 0.15 * u + Math.sin(a) * r, -0.53 * u + Math.cos(a) * r];
  }
  function chickenPlate(ctx, u) {
    piece(ctx, ovalPts(0, -0.03 * u, 0.12 * u, 0.025 * u, 901, 40), "#f4f4ee", "rgba(20,16,14,0.8)", 0.7);
    piece(ctx, ovalPts(0, -0.08 * u, 0.085 * u, 0.055 * u, 902, 40), "#c8782e", "rgba(60,30,10,0.9)", 0.6);
    for (const s of [-1, 1]) {
      piece(ctx, cut([[s * 0.06 * u, -0.1 * u], [s * 0.12 * u, -0.15 * u], [s * 0.13 * u, -0.13 * u], [s * 0.075 * u, -0.07 * u]], 903 + s), "#b8692a", "rgba(60,30,10,0.9)", 0.4);
      piece(ctx, ovalPts(s * 0.13 * u, -0.145 * u, 0.014 * u, 0.014 * u, 905 + s, 12), "#fbf6ea", "rgba(60,30,10,0.9)", 0);
    }
    piece(ctx, ovalPts(-0.03 * u, -0.1 * u, 0.025 * u, 0.012 * u, 907, 16), "#e8a050", null, 0);
  }
  function drawHero(ctx, u, st) {
    const L = (x, y) => [x * u, y * u];
    ctx.save();
    ctx.translate(0, -st.bounce);
    legsFront(ctx, u, { legC: "#24262e", shoe: "boots", shoeC: "#1e1a18", legW: 0.07 }, !!st.sit, 20);
    const arm = (i, ang) => {
      const s = i ? 1 : -1;
      ctx.save();
      ctx.translate(s * 0.15 * u, -0.53 * u);
      ctx.rotate(-s * ang);
      const len = 0.21 * u;
      piece(ctx, cut([[-0.035 * u, -0.02 * u], [0.035 * u, -0.02 * u], [0.032 * u, len], [-0.032 * u, len]], 30 + i), JK);
      ctx.translate(0, len + 0.03 * u);
      const open = i === 1 ? st.wave : 0;
      piece(ctx, ovalPts(s * -0.035 * u * (1 + open * 0.3), 0, 0.018 * u, 0.034 * u, 34 + i, 24), SKIN);
      piece(ctx, ovalPts(0, 0.012 * u, 0.04 * u, 0.048 * u, 36 + i, 32), SKIN);
      ctx.restore();
    };
    piece(ctx, cut([L(-0.15, -0.6), L(0.15, -0.6), L(0.23, -0.14), L(0.22, -0.12), L(-0.22, -0.12), L(-0.23, -0.14)], 40, 30, 1.8), JK);
    piece(ctx, cut([L(-0.065, -0.6), L(0.065, -0.6), L(0.035, -0.3), L(-0.035, -0.3)], 41), "#3c3c43", null, 0.6);
    for (let k = 0; k < 3; k++) piece(ctx, ovalPts(0, (-0.53 + k * 0.05) * u, 8e-3 * u, 8e-3 * u, 42 + k, 12), "#76767e", null, 0);
    piece(ctx, cut([L(-0.075, -0.6), L(-0.145, -0.52), L(-0.11, -0.49), L(-0.04, -0.28), L(-0.035, -0.3)], 45), JK2, "rgba(120,120,130,0.9)");
    piece(ctx, cut([L(0.075, -0.6), L(0.15, -0.53), L(0.115, -0.5), L(0.045, -0.28), L(0.035, -0.3)], 46), JK2, "rgba(120,120,130,0.9)");
    piece(ctx, cut([L(-0.225, -0.16), L(0.225, -0.16), L(0.23, -0.12), L(-0.23, -0.12)], 47), JK2, "rgba(120,120,130,0.9)", 0.4);
    ctx.strokeStyle = "#9a9aa4";
    ctx.lineWidth = 4;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0.045 * u, -0.28 * u);
    ctx.lineTo(0.15 * u, -0.13 * u);
    ctx.moveTo(-0.17 * u, -0.27 * u);
    ctx.lineTo(-0.12 * u, -0.2 * u);
    ctx.stroke();
    ctx.setLineDash([]);
    for (const [x, y] of [[-0.12, -0.52], [0.125, -0.525], [-0.2, -0.17], [0.2, -0.17]]) piece(ctx, ovalPts(x * u, y * u, 7, 7, 50 + x * 100, 10), "#c4c4cc", null, 0.3);
    ctx.save();
    ctx.translate(0, -0.58 * u);
    ctx.rotate(st.tilt);
    ctx.translate(0, 0.58 * u);
    const hy = -0.79;
    const HX = (x) => x * u, HY = (y) => (hy + y) * u;
    const skin = tint(SKIN, st.red ?? 0);
    for (const s of [-1, 1]) piece(ctx, ovalPts(HX(s * 0.235), HY(0.01), 0.035 * u, 0.045 * u, 60 + s, 20), skin);
    piece(ctx, ovalPts(0, HY(0), 0.245 * u, 0.205 * u, 62, 80), skin);
    for (const s of [-1, 1]) piece(ctx, cut([[HX(s * 0.245), HY(-0.07)], [HX(s * 0.19), HY(-0.12)], [HX(s * 0.18), HY(-0.03)], [HX(s * 0.24), HY(0)]], 63 + s), TEMPLE, null, 0.3);
    const hair = [[HX(-0.215), HY(-0.1)]];
    for (let i = 0; i <= 14; i++) {
      const a = Math.PI * 1.1 + i / 14 * Math.PI * 0.8;
      const quiff = i >= 10 && i <= 12 ? 0.06 : 0;
      const rr = 1 + (i % 2 ? 0.1 : 0) + quiff;
      hair.push([HX(Math.cos(a) * 0.245 * rr - (i % 2 ? 0.035 : 0)), HY(-0.03 + Math.sin(a) * 0.205 * rr - 0.02)]);
    }
    hair.push([HX(0.21), HY(-0.1)], [HX(0.1), HY(-0.135)], [HX(-0.05), HY(-0.14)]);
    piece(ctx, cut(hair, 65, 18, 1.5), HAIR);
    ctx.strokeStyle = "rgba(70,70,78,0.95)";
    ctx.lineWidth = 4.5;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo(HX(0.15 - k * 0.07), HY(-0.15 - k * 0.01));
      ctx.quadraticCurveTo(HX(0.02 - k * 0.07), HY(-0.23 + k * 0.01), HX(-0.13 - k * 0.03), HY(-0.17 + k * 0.03));
      ctx.stroke();
    }
    const mY = HY(0.12);
    const moustache = beardFront(ctx, u, HY(0), mY, BEARD, "#7a7a82");
    const eyeY = HY(-0.04);
    for (const s of [-1, 1]) eyeBrow(ctx, HX(s * 0.066), eyeY, HY(-0.14), u, s, st, skin, "#26221f", 66 + s);
    blush(ctx, 0, eyeY, u, st.blush ?? 0);
    mouth(ctx, HX(5e-3), mY, u, st);
    moustache();
    ctx.restore();
    for (const k of [0, 1]) {
      const x0 = k ? 0.045 : -0.035;
      piece(ctx, cut([L(x0 - 0.03, -0.585), L(x0 + 0.03, -0.585), L(x0 + 0.035, k ? -0.4 : -0.36), L(x0 - 0.028, k ? -0.4 : -0.36)], 80 + k), RED);
    }
    piece(ctx, cut([L(-0.16, -0.62), L(0.16, -0.62), L(0.15, -0.565), L(-0.15, -0.565)], 82), RED);
    if (!st.armsOff?.[0]) arm(0, st.armL);
    if (!st.armsOff?.[1]) arm(1, st.armR);
    if (st.chicken > 0.01) {
      const [hx, hy2] = handPos(u, 0, st.armL);
      ctx.save();
      ctx.translate(hx, hy2 - (1 - st.chicken) * 0.05 * u);
      ctx.scale(st.chicken, st.chicken);
      chickenPlate(ctx, u);
      ctx.restore();
    }
    ctx.restore();
  }
  return __toCommonJS(paper_browser_entry_exports);
})();
