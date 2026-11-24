// Fusion stellaire : fais glisser les astres ; deux pareils fusionnent en l'astre suivant, de la poussière au trou noir.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Fusion stellaire</span><span class="hint">Flèches, ZQSD, glisser à la souris ou manette · U : annuler · T : trou de ver · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="fuCanvas" width="240" height="330" role="img" aria-label="Fusion stellaire"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="fuStats"></div></div>
      <div class="row"><select class="f gSel" id="fuMode" title="Mode de jeu"></select></div>
      <div class="row"><button class="btn main" id="fuNew">NOUVELLE PARTIE</button><button class="btn" id="fuFs">PLEIN ÉCRAN</button></div>
      <div class="row"><button class="btn" id="fuUndoBtn" title="Annule le dernier coup (U)">ANNULER</button><button class="btn" id="fuHoleBtn" title="Échange deux tuiles (T)">TROU DE VER</button></div>
      <div class="hint">Toutes les tuiles glissent du côté choisi. Deux astres pareils qui se rencontrent s'attirent et fusionnent en l'astre suivant : poussière, caillou, astéroïde, comète, lune, planète, planète à anneaux, géante gazeuse, étoile, supernova, trou noir.</div>
      <div class="hint">Les débris ne bougent pas et ne fusionnent pas : ils cassent quand une fusion se fait à côté. Annuler et trou de ver (échange deux tuiles) : une charge de chaque tous les 150 coups et à chaque trou noir.</div>
      <div class="hint">Manette : croix ou stick pour glisser, X annuler, Y trou de ver (la croix choisit, A prend la tuile, B renonce), A ou Start pour rejouer.</div>
      <div class="hint">La partie en cours est sauvegardée et synchronisée : tu la retrouves sur ton autre PC.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 1 auto;min-width:min(100%,300px);position:relative}
.gameBox canvas{width:min(calc(100vw - 140px),max(280px,calc((100vh - 170px) * 240 / 330)));height:auto;aspect-ratio:240/330;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 240 / 330))}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:440px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx, ask, newTab, pixIcon, PIX, WX } = host;
  const folder = ctx.folder, legacy = ctx.legacy || {};
  ctx.host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'FUSION STELLAIRE', T: {k: '#0b031c', k2: '#140a2a', fill: '#1c1238', fillOn: '#2a1a4e', hl: '#36245e', line: '#5e4d85', acc: '#ff5ad9', accL: '#ffd0f4', accS: '#c02aa0', accD: '#4a0a3a',
    rivet: '#ffd0f4', btn: '#36245e', btnHi: '#5e4d85', btnLo: '#140a2a', btnHov: '#42306e', btnHovHi: '#7a68a8', text: '#f4eaff', muted: '#b8a8d8', acc2: '#7fe0ee', gold: '#ffd07a',
    orange: '#ffa040', red: '#ff4f6d', green: '#8ee8a0', green2: '#2f8a3a', bg: '#0b031c', bgDot: '#1c1238', bgDot2: '#140a2a', spark: '#5e4d85', spark2: '#ff5ad9',
    tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................', '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................']},
    emblem: ['............', '....gggg....', '...gwgggo...', '..gwggggoo..', 'aa.ggggooo.a', '.aaaaaaaaaa.', '..aagggoaa..', '...goooooo..', '....oooo....', '............', '............', '............'],
    icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => id === "fusionApp" ? view : (view.querySelector('#' + id) || document.getElementById(id));  // les identifiants de ta vue d'abord, puis ceux de la page (fenêtres, menus)
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const __icon = () => ctx.icon;  // l'icône de ce plugin
  const LEGACY_GAMES = {"top":["fusion"],"best":"^fusion_"};
  let games = await doc('games');
  if (games == null) {  // première ouverture : tu retrouves tes records et tes parties d'avant
    const old = legacy.api ? await legacy.api('games').catch(() => null) : null; games = { best: {} };
    if (old) { const re = new RegExp(LEGACY_GAMES.best); for (const [k, v] of Object.entries(old.best || {})) if (re.test(k)) games.best[k] = v; for (const k of LEGACY_GAMES.top) if (old[k] !== undefined) games[k] = old[k]; await folder.write('games', games); }
  }
  games = { best: {}, ...games };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v, higher = true) => { const b = games.best[k]; if (b == null || (higher ? v > b : v < b)) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);  // la section d'un jeu
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel (taille 16 = lettres doublées), sur une bande sombre
  const hs = lines.map(([, , size]) => (PXK.H + 3) * PXK.scale(size)), tot = hs.reduce((a, b) => a + b, 0);
  g.fillStyle = 'rgba(11,3,28,.8)'; g.fillRect(0, y0 - 12, w, tot + 14);
  let y = y0; lines.forEach(([text, color, size], i) => { const sc = PXK.scale(size); y += hs[i]; if (text) pxFont(g, text, w / 2, y - 4 * sc, color, size, 'center'); });
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };
const FU_STAR = ['.....y.....', '....yyy....', '....ywy....', 'yyyyywyyyyy', '.yyywwwyyy.', '..yyyyyyy..', '..yyy.yyy..', '.yyy...yyy.', '.yy.....yy.', 'y.........y'];
  // ---- ton code d'origine ----
/* ---------- jeu "Fusion stellaire": slide every tile of the board at once (arrows, ZQSD or a swipe of the mouse); two identical celestial
   objects that meet fuse into the next one: dust, pebble, asteroid, comet, moon, planet, ringed planet, gas giant, star, supernova, black hole.
   Debris can't fuse but breaks when a fusion happens next to it. Powers: undo, and the wormhole that swaps two tiles. Modes: Galaxie 5 x 5,
   Nébuleuse 4 x 4 (harder) and 15 challenges. Records, stars and the game in progress are kept in games.json (synced). ---------- */
const FU = {W: 240, H: 330,
  stages: [  // name, main colour, light, dark
    ['Poussière', '#c9bdf0', '#ffffff', '#6a5a9a'], ['Caillou', '#a08a70', '#d8c4a8', '#5a4632'], ['Astéroïde', '#8f8fa8', '#d0d0e0', '#4a4a60'], ['Comète', '#7fe0ee', '#e0ffff', '#2a8a9e'],
    ['Lune', '#e8e4d0', '#ffffff', '#8a8670'], ['Planète', '#4f9fe0', '#a8dcff', '#1f4a8a'], ['Planète à anneaux', '#e0a050', '#ffd9a0', '#8a5020'], ['Géante gazeuse', '#e07a4f', '#ffc0a0', '#8a3a1c'],
    ['Étoile', '#ffd07a', '#fff8d0', '#c08020'], ['Supernova', '#ff5ad9', '#ffd0f4', '#a0207e'], ['Trou noir', '#1c1238', '#b46aee', '#05010b'],
  ],
};
// the challenges: [name, size, goal, start]
const FU_LEVELS = [
  ['Premières lunes', 5, {stage: 4, moves: 120}, {}], ['Ménage spatial', 5, {debris: 3}, {debris: 3}], ['Planète bleue', 5, {stage: 5, moves: 200}, {}], ['Petit univers', 4, {score: 1500}, {}],
  ['Ceinture', 5, {debris: 6}, {debris: 6}], ['Anneaux', 5, {stage: 6, moves: 380}, {}], ['Étroit', 4, {stage: 5}, {}], ['Champ de débris', 5, {debris: 9}, {debris: 8}],
  ['Géante', 5, {stage: 7}, {debris: 2}], ['Course aux points', 5, {score: 12000, moves: 500}, {}], ['Nébuleuse dense', 4, {stage: 6}, {debris: 1}], ['Naissance d\'une étoile', 5, {stage: 8}, {}],
  ['Chaos', 5, {debris: 14}, {debris: 10}], ['Supernova', 5, {stage: 9}, {debris: 3}], ['Horizon', 5, {stage: 10}, {}],
];
const fuSave = () => gstore('fusion', {best: {}, maxStage: 0, stars: {}, games: 0, cur: null});
let fu = null;
const fuGoalText = g => g.stage != null ? FU.stages[g.stage][0] + (g.moves ? ' en ' + g.moves + ' coups' : '') : g.debris ? 'Casser ' + g.debris + ' débris' : g.score + ' points' + (g.moves ? ' en ' + g.moves + ' coups' : '');
// les formes de grille : des cases vides (murs) qui ne bougent jamais, ne cassent jamais et coupent les lignes comme un débris
const FU_SHAPES = {anneau: {n: 5, walls: [12], name: 'Anneau · 5 × 5 sans le milieu'}, croix: {n: 5, walls: [0, 4, 20, 24], name: 'Croix · 5 × 5 sans les coins'},
  grand: {n: 6, walls: [], name: 'Grand espace · 6 × 6'}, sablier: {n: 6, walls: [0, 1, 4, 5, 6, 11, 24, 29, 30, 31, 34, 35], name: 'Sablier · 6 × 6 en losange'}};
function fuStart(kind = 'galaxie', level = 0, resume = null) {
  const lv = kind === 'defi' ? FU_LEVELS[level] : null, sh = FU_SHAPES[kind], n = lv ? lv[1] : sh ? sh.n : kind === 'nebuleuse' ? 4 : 5;
  fu = {raf: fu?.raf || 0, g: $('fuCanvas').getContext('2d'), mode: 'play', kind, level, lv, goal: lv?.[2] || null, n, tick: 0,
    grid: Array.from({length: n * n}, () => null), score: 0, moves: 0, best: 0, broken: 0, undo: [], undos: 2, holes: 1, picking: null, seq: 1,
    anim: 0, slides: [], pops: [], parts: [], fuseFx: [], queued: null, cur: 0, flash: 0, banner: null, won: false, reached: {}};
  if (resume) { Object.assign(fu, resume, {g: fu.g, raf: fu.raf, mode: 'play', anim: 0, slides: [], pops: [], parts: [], fuseFx: [], queued: null}); fu.grid.forEach(t => { if (t) t.born = -100; }); }  // une partie reprise : ses tuiles sont déjà là
  else {
    for (const w of sh?.walls || []) fu.grid[w] = {id: fu.seq++, debris: true, wall: true, born: -100};
    for (let i = 0; i < (lv?.[3].debris || 0); i++) fuSpawn({debris: true});
    fuSpawn(); fuSpawn();
  }
  fuStore(); fuInfo(); fuMenu();
  gameLoop(fu, 'neodex:fusion', fuUpdate, fuDraw);
}
function fuStore() { if (!fu || !games || fu.kind === 'test') return; const s = fuSave(); s.cur = fu.mode === 'over' ? null : {kind: fu.kind, level: fu.level, grid: fu.grid, score: fu.score, moves: fu.moves, broken: fu.broken, undos: fu.undos, holes: fu.holes, seq: fu.seq, best: fu.best, reached: fu.reached}; saveGames(); }
function fuSpawn(o = {}) {
  const free = fu.grid.map((t, i) => t ? -1 : i).filter(i => i >= 0); if (!free.length) return;
  const i = free[Math.floor(Math.random() * free.length)];
  fu.grid[i] = o.debris ? {id: fu.seq++, debris: true, born: fu.tick} : {id: fu.seq++, s: Math.random() < .12 ? 1 : 0, born: fu.tick};
}
// one move: tiles slide to the side, two equal ones fuse once per move; returns false when nothing moved
function fuMove(dir) {
  if (fu.mode !== 'play') return false;
  if (fu.anim || fu.fuseFx.length) { fu.queued = dir; return false; }  // pendant une animation, le coup attend son tour
  const n = fu.n, before = JSON.stringify(fu.grid), at = (a, b) => dir === 'left' ? a * n + b : dir === 'right' ? a * n + (n - 1 - b) : dir === 'up' ? b * n + a : (n - 1 - b) * n + a;
  const snap = {grid: JSON.parse(before), score: fu.score, moves: fu.moves, broken: fu.broken};
  const slides = [], fused = [];
  for (let a = 0; a < n; a++) {
    const line = [], from = [];
    for (let b = 0; b < n; b++) { const t = fu.grid[at(a, b)]; if (t) { line.push(t); from.push(b); } }
    const out = [];
    // debris stay where they are: they cut the line into parts that slide on their own
    let seg = [], segFrom = [], start = 0;
    const flush = end => {
      let pos = start;
      for (let k = 0; k < seg.length; k++) {
        const t = seg[k], nx = seg[k + 1];
        if (nx && nx.s === t.s && t.s < FU.stages.length - 1) { const m = {id: fu.seq++, s: t.s + 1, born: fu.tick + FU_SLIDE + FU_PULL, merged: true}; out[pos] = m; slides.push([t, segFrom[k], pos, a], [nx, segFrom[k + 1], pos, a]); fused.push([pos, a, m.s]); k++; }
        else { out[pos] = t; slides.push([t, segFrom[k], pos, a]); }
        pos++;
      }
      start = end + 1;
    };
    line.forEach((t, k) => { if (t.debris) { flush(from[k]); out[from[k]] = t; slides.push([t, from[k], from[k], a]); start = from[k] + 1; seg = []; segFrom = []; return; } seg.push(t); segFrom.push(from[k]); });
    flush(n);
    for (let b = 0; b < n; b++) fu.grid[at(a, b)] = out[b] || null;
  }
  if (JSON.stringify(fu.grid) === before) return false;
  fu.undo.push(snap); if (fu.undo.length > 3) fu.undo.shift();
  fu.moves++;
  // fusions: points, records, and the debris around them break
  for (const [b, a, s] of fused) {
    fu.score += 2 ** (s + 1) * 2;
    const i = at(a, b), x = i % n, y = i / n | 0; fu.fuseFx.push({x, y, s: s - 1, t0: fu.tick + FU_SLIDE});
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy, j = Y * n + X; if (X >= 0 && Y >= 0 && X < n && Y < n && fu.grid[j]?.debris && !fu.grid[j].wall) { fu.grid[j] = null; fu.broken++; fuBurst(X, Y, '#8f8fa8', 10); } }
    if (s > fu.best) { fu.best = s; if (s >= 4 && !fu.reached[s]) { fu.reached[s] = true; fu.banner = {text: FU.stages[s][0].toUpperCase() + ' !', t: 90}; } }
    if (s === FU.stages.length - 1) fu.undos++, fu.holes++;  // a black hole gives a charge of each power
  }
  // a new tile; in Galaxie and Nébuleuse a debris now and then; a power charge every 150 moves
  fuSpawn(); if (!fu.lv && fu.moves % 30 === 0) fuSpawn({debris: true});
  if (fu.moves % 150 === 0) { fu.undos++; fu.holes++; }
  fu.slides = slides; fu.anim = FU_SLIDE;
  fuSnd(150 * 2 ** (Math.max(...fu.grid.map(t => t && !t.debris ? t.s : 0)) / 10), .09, 'triangle', 90, .035);  // le glissement, plus aigu quand de gros astres sont en jeu
  fuCheck(); fuStore(); fuInfo();
  return true;
}
// a move exists when a tile has an empty cell beside it, or an equal neighbour to fuse with
function fuCanMove() {
  const n = fu.n;
  return fu.grid.some((t, i) => t && !t.debris && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
    const X = i % n + dx, Y = (i / n | 0) + dy; if (X < 0 || Y < 0 || X >= n || Y >= n) return false;
    const o = fu.grid[Y * n + X]; return !o || (!o.debris && o.s === t.s && t.s < FU.stages.length - 1);
  }));
}
function fuCheck() {
  const g = fu.goal, s = fuSave();
  s.maxStage = Math.max(s.maxStage, fu.best);
  if (g) {
    const done = g.stage != null ? fu.best >= g.stage : g.debris ? fu.broken >= g.debris : fu.score >= g.score;
    if (done) return fuOver(true);
    if (g.moves && fu.moves >= g.moves) return fuOver(false);
  }
  if (!fuCanMove()) fuOver(false);
}
function fuOver(won) {
  fu.mode = 'over'; fu.won = won;
  const s = fuSave(); s.games++;
  if (fu.kind === 'defi') {
    if (won) { const g = fu.goal, par = g.moves ? fu.moves < g.moves * .7 : fu.moves < 60 + fu.level * 40; fu.got = 1 + (fu.undo.length === 0 || fu.undos >= 2 ? 1 : 0) + (par ? 1 : 0); s.stars[fu.level] = Math.max(s.stars[fu.level] || 0, fu.got); sfx('launch'); }
    else sfx('error');
  } else { fu.record = best('fusion_' + fu.kind, fu.score); sfx(fu.record ? 'launch' : 'error'); }
  s.cur = null; saveGames(); fuInfo(); fuMenu();
}
function fuUndo() {
  if (fu.mode !== 'play' || !fu.undos || !fu.undo.length || fu.anim) return;
  Object.assign(fu, fu.undo.pop()); fu.undos--; fu.picking = null; fu.fuseFx = []; fu.queued = null; fuSnd(330, .06, 'square', 220, .04); fuStore(); fuInfo();
}
function fuHole(i) {  // the wormhole: pick two tiles, they swap places
  if (fu.mode !== 'play' || !fu.holes) return;
  if (fu.picking == null) { if (fu.grid[i] && !fu.grid[i].debris) { fu.picking = i; sfx('click'); } return; }
  const a = fu.picking; fu.picking = null;
  if (a === i || !fu.grid[i] || fu.grid[i].debris) return;
  fu.undo.push({grid: JSON.parse(JSON.stringify(fu.grid)), score: fu.score, moves: fu.moves, broken: fu.broken});
  [fu.grid[a], fu.grid[i]] = [fu.grid[i], fu.grid[a]]; fu.holes--; fu.holeMode = false; sfx('notify'); fuStore(); fuInfo();
}
function fuBurst(x, y, col, n) { const L = fuLayout(); for (let k = 0; k < n; k++) fu.parts.push({x: L.x + x * L.c + L.c / 2, y: L.y + y * L.c + L.c / 2, vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, t: 30 + Math.random() * 20, col}); }
// une fusion : les deux astres tournent l'un vers l'autre (FU_PULL images), puis éclatent ; le son monte avec l'astre créé
const FU_SLIDE = 7, FU_PULL = 9;
let fuAc = null, fuMute = false;
function fuSnd(f, d, type = 'square', slide = 0, vol = .05) { if (fuMute) return; try { fuAc ??= new AudioContext(); const o = fuAc.createOscillator(), g = fuAc.createGain(), t = fuAc.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(fuAc.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function fuFuseSnd(s) { const f = 262 * 2 ** (s * 2 / 12); fuSnd(f, .1, 'square', 0, .045); setTimeout(() => fuSnd(f * 1.5, .18, 'triangle', 0, .05), 60); if (s >= 8) fuSnd(70, .5, 'sawtooth', 35, .06); }
function fuUpdate() {
  if (fu.anim) fu.anim--;
  for (const f of fu.fuseFx) if (fu.tick - f.t0 === FU_PULL) {  // l'éclat
    const ns = f.s + 1; fuBurst(f.x, f.y, ns === 9 ? '#ff5ad9' : FU.stages[ns][1], 8 + ns * 2); fuBurst(f.x, f.y, FU.stages[ns][2], 4); fuFuseSnd(ns); if (ns === 9) fu.flash = 20; }
  fu.fuseFx = fu.fuseFx.filter(f => fu.tick - f.t0 < FU_PULL);
  if (fu.queued && !fu.anim && !fu.fuseFx.length) { const d = fu.queued; fu.queued = null; fuGo(d); }
  if (fu.flash) fu.flash--;
  if (fu.banner && --fu.banner.t <= 0) fu.banner = null;
  for (const p of fu.parts) { p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy *= .96; p.t--; } fu.parts = fu.parts.filter(p => p.t > 0);
}
/* ---------- drawing: each celestial object is drawn in pixels, bigger and brighter as it grows ---------- */
const fuLayout = () => { const c = fu.n === 4 ? 50 : fu.n === 6 ? 36 : 42, w = c * fu.n; return {c, x: (FU.W - w) / 2, y: 62, w}; };
const fuSprites = {};
function fuSprite(s, size) {  // dessiné une fois par astre et par taille
  const k = s + ':' + size; if (fuSprites[k]) return fuSprites[k];
  const cv = document.createElement('canvas'); cv.width = cv.height = size; const g = cv.getContext('2d'), [, base, lt, dk] = FU.stages[s], m = size / 2, R = f => size * f;
  const P = (x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
  const each = fn => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) { const dx = x + .5 - m, dy = y + .5 - m; fn(x, y, dx, dy, Math.hypot(dx, dy), Math.atan2(dy, dx)); } };
  // une boule (bosselée si amp > 0) éclairée en haut à gauche, avec un bord sombre
  const ball = (r, fill = base, light = lt, dark = dk, amp = 0, seed = 0, cx = 0, cy = 0) => each((x, y, dx, dy) => { dx -= cx; dy -= cy; const d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), rr = r * (1 + amp * (Math.sin(3 * a + seed) * .6 + Math.sin(5 * a + seed * 2) * .4));
    if (d <= rr) { const l = (dx + dy) / rr; P(x, y, d > rr - 1.2 ? dark : l < -.6 ? light : l > .5 ? dark : fill); } });
  const glow = (r0, r1, c, alpha) => { g.globalAlpha = alpha; each((x, y, dx, dy, d) => { if (d > r0 && d <= r1) P(x, y, c); }); g.globalAlpha = 1; };
  if (s === 0) {  // poussière : un petit nuage d'étincelles
    glow(0, R(.42), base, .22);
    for (let i = 0; i < 24; i++) { const a = i * 2.399, d = R(.08) + (i * 5 % 13) / 13 * R(.32); P(m + Math.cos(a) * d - 1, m + Math.sin(a) * d - 1, i % 4 === 0 ? '#ffffff' : i % 2 ? base : lt, 2, 2); }
    P(m - 1, m - 1, '#ffffff', 2, 2);
  } else if (s === 1) {  // caillou : une petite pierre bosselée
    ball(R(.27), base, lt, dk, .16, 1); P(m - 2, m + 1, dk, 2, 2); P(m + 3, m - 2, dk, 1, 1);
  } else if (s === 2) {  // astéroïde : plus gros, grêlé de cratères
    ball(R(.36), base, lt, dk, .13, 2);
    for (const [cx, cy, r] of [[-.1, -.08, .07], [.12, .06, .09], [-.04, .16, .05], [.14, -.14, .04]]) { each((x, y, dx, dy) => { const d = Math.hypot(dx - R(cx), dy - R(cy)); if (d <= R(r)) P(x, y, d > R(r) - 1 ? lt : dk); }); }
  } else if (s === 3) {  // comète : une tête blanche et une longue queue
    for (let i = 0; i < R(.55); i++) { const w = Math.max(1, Math.round(R(.16) * (1 - i / R(.55)))); g.globalAlpha = 1 - i / R(.6); P(m + R(.06) + i, m - R(.06) - i * .65 - w / 2, i % 3 ? lt : '#ffffff', 2, w); }
    g.globalAlpha = 1; glow(R(.16), R(.26), base, .35); ball(R(.17), base, '#ffffff', dk); P(m - 2, m - 2, '#ffffff', 3, 3);
  } else if (s === 4) {  // lune : pâle, cratères, une ombre en croissant
    glow(R(.37), R(.45), '#ffffff', .2); ball(R(.38));
    for (const [cx, cy, r] of [[-.12, -.1, .08], [.1, .1, .1], [.16, -.12, .05], [-.08, .18, .05]]) each((x, y, dx, dy) => { if (Math.hypot(dx - R(cx), dy - R(cy)) <= R(r)) P(x, y, '#c0bca0'); });
    each((x, y, dx, dy, d) => { if (d <= R(.38) && Math.hypot(dx + R(.16), dy + R(.12)) > R(.42)) P(x, y, '#8a8670'); });
  } else if (s === 5) {  // planète : océans, continents verts, nuages, une nuit sur un côté
    glow(R(.38), R(.47), '#7ac8ff', .35); ball(R(.39));
    for (const [cx, cy, r] of [[-.12, -.06, .12], [.12, .12, .1], [-.02, .2, .06], [.16, -.16, .06]]) each((x, y, dx, dy, d) => { if (d < R(.37) && Math.hypot(dx - R(cx), (dy - R(cy)) * 1.4) <= R(r)) P(x, y, '#5fd08a'); });
    for (const [cx, cy, w] of [[-.2, -.22, .2], [.0, .04, .26], [-.1, .26, .16]]) P(m + R(cx), m + R(cy), '#ffffff', R(w), 2);
    each((x, y, dx, dy, d) => { if (d <= R(.39) && dx + dy > R(.3)) { g.globalAlpha = .45; P(x, y, '#0a1a4a'); g.globalAlpha = 1; } });
  } else if (s === 6) {  // planète à anneaux : l'anneau passe derrière puis devant
    const ring = front => each((x, y, dx, dy) => { const e = Math.hypot(dx, dy * 3.2); if (e > R(.36) && e < R(.5) && (front ? dy > 0 : dy <= 0)) P(x, y, e < R(.42) ? lt : '#c08040'); });
    ring(false); glow(R(.3), R(.36), base, .3); ball(R(.3)); P(m - R(.2), m - R(.08), lt, R(.4), 2); ring(true);
  } else if (s === 7) {  // géante gazeuse : grosse, rayée, une tache rouge
    glow(R(.44), R(.5), base, .3);
    each((x, y, dx, dy, d) => { if (d <= R(.45)) { const band = Math.floor((dy + R(.45)) / R(.1)) % 3; P(x, y, d > R(.45) - 1.2 ? dk : band === 0 ? lt : band === 1 ? base : '#c86a40'); } });
    each((x, y, dx, dy) => { if (Math.hypot((dx - R(.12)) / 1.6, dy - R(.12)) <= R(.06)) P(x, y, '#a02a1a'); });
    each((x, y, dx, dy, d) => { if (d <= R(.45) && dx + dy > R(.36)) { g.globalAlpha = .35; P(x, y, '#3a0a00'); g.globalAlpha = 1; } });
  } else if (s === 8) {  // étoile : un cœur blanc, des rayons, un grand halo
    glow(R(.3), R(.5), base, .22); glow(R(.26), R(.36), lt, .35);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, L = R(i % 2 ? .38 : .5); for (let d = R(.26); d < L; d++) P(m + Math.cos(a) * d - 1, m + Math.sin(a) * d - 1, i % 2 ? base : lt, 2, 2); }
    ball(R(.27), base, '#ffffff', '#e0a040'); ball(R(.12), '#fff8d0', '#ffffff', '#fff0b0');
  } else if (s === 9) {  // supernova : une explosion en étoile, une onde autour
    glow(R(.42), R(.5), lt, .45);
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, L = R(i % 2 ? .34 : .48); for (let d = R(.12); d < L; d++) P(m + Math.cos(a) * d - 1, m + Math.sin(a) * d - 1, i % 2 ? lt : base, 2, 2); }
    ball(R(.2), '#ffffff', '#ffffff', lt);
  } else {  // trou noir : un disque de lumière qui tourne autour d'un rond tout noir
    const disk = front => each((x, y, dx, dy) => { const e = Math.hypot(dx, dy * 2.6); if (e > R(.24) && e < R(.5) && (front ? dy > 0 : dy <= 0)) P(x, y, e < R(.32) ? '#ffffff' : (e / size * 30 | 0) % 2 ? '#b46aee' : '#ff8af0'); });
    disk(false); glow(R(.2), R(.24), '#e4c8ff', .9); ball(R(.2), '#05010b', '#05010b', '#05010b'); disk(true);
  }
  return (fuSprites[k] = cv);
}
function fuDebris(g, x, y, c, t) {
  g.fillStyle = '#3a3448'; g.fillRect(x + 6, y + 6, c - 12, c - 12);
  g.fillStyle = '#5a5470'; g.fillRect(x + 8, y + 8, c - 18, c - 18);
  g.fillStyle = '#1c1830'; for (const [a, b] of [[10, 14], [c - 16, 11], [14, c - 14], [c - 13, c - 16]]) g.fillRect(x + a, y + b, 3, 3);
  g.fillStyle = '#8f8fa8'; g.fillRect(x + 9, y + 9, 3, 2);
  if ((t + x) % 120 < 4) { g.fillStyle = '#ff7a4f'; g.fillRect(x + c - 12, y + 9, 2, 2); }
}
function fuDraw() {
  const g = fu.g, t = fu.tick, L = fuLayout(), c = L.c, n = fu.n;
  g.fillStyle = '#0b031c'; g.fillRect(0, 0, FU.W, FU.H);
  for (let i = 0; i < 60; i++) { const x = (i * 97) % FU.W, y = (i * 53 + (t >> 3)) % FU.H; g.fillStyle = (i + (t >> 4)) % 7 ? 'rgba(217,198,255,.25)' : '#ffffff'; g.fillRect(x, y, 1, 1); }
  // header: score, best, powers
  // en haut : score, record ou objectif, coups (en gros)
  pxFont(g, 'SCORE', 8, 14, '#b8a8d8', 8); pxFont(g, fu.goal ? 'OBJECTIF' : 'RECORD', FU.W / 2, 14, '#b8a8d8', 8, 'center'); pxFont(g, 'COUPS', FU.W - 8, 14, '#b8a8d8', 8, 'right');
  const big = (t, x, al, col) => pxFont(g, t, x, 40, col, PXK.layout(t).w * 2 > 74 ? 8 : 16, al);
  big(String(fu.score), 8, 'left', '#ffd07a'); big(String(fu.moves) + (fu.goal?.moves ? '/' + fu.goal.moves : ''), FU.W - 8, 'right', '#ffd07a');
  const gg = fu.goal; big(gg ? (gg.stage != null ? FU.stages[gg.stage][0] : gg.debris ? 'Débris ' + fu.broken + '/' + gg.debris : fu.score + '/' + gg.score) : String(games?.best['fusion_' + fu.kind] ?? 0), FU.W / 2, 'center', '#f4eaff');
  // board
  g.fillStyle = '#1c1238'; g.fillRect(L.x - 4, L.y - 4, L.w + 8, L.w + 8);
  for (let i = 0; i < n * n; i++) { const x = L.x + (i % n) * c, y = L.y + (i / n | 0) * c; if (fu.grid[i]?.wall) { g.fillStyle = '#0b031c'; g.fillRect(x, y, c, c); g.fillStyle = 'rgba(217,198,255,.35)'; g.fillRect(x + (i * 7 % (c - 4)) + 2, y + (i * 13 % (c - 4)) + 2, 1, 1); continue; } g.fillStyle = (i % n + (i / n | 0)) % 2 ? '#120a28' : '#160d30'; g.fillRect(x + 1, y + 1, c - 2, c - 2); }
  const k = fu.anim / 7;  // 1 at the start of a slide, 0 at the end
  const place = new Map(); for (const [tile, from, to, a] of fu.slides) place.set(tile.id, [from, to, a]);
  const posOf = (a, b) => { const d = fu.lastDir; return d === 'left' ? [b, a] : d === 'right' ? [n - 1 - b, a] : d === 'up' ? [a, b] : [a, n - 1 - b]; };
  // the tiles that moved (or fused) are drawn sliding from where they were
  if (fu.anim) for (const [tile, from, to, a] of fu.slides) {
    const [x0, y0] = posOf(a, from), [x1, y1] = posOf(a, to), x = L.x + (x1 + (x0 - x1) * k) * c, y = L.y + (y1 + (y0 - y1) * k) * c;
    fuTile(g, tile, x, y, c, t, 1);
  }
  for (let i = 0; i < n * n; i++) {
    const tile = fu.grid[i]; if (!tile) continue;
    if (fu.anim && place.has(tile.id) || tile.merged && fu.tick - tile.born < 0) continue;
    const x = L.x + (i % n) * c, y = L.y + (i / n | 0) * c, age = fu.tick - tile.born, sc = age < 8 ? .4 + age / 8 * .6 : tile.merged && age < 16 ? 1 + Math.sin((age - 8) / 8 * Math.PI) * .15 : 1;
    fuTile(g, tile, x, y, c, t, sc);
    if (fu.picking === i) { g.strokeStyle = '#7fe0ee'; g.lineWidth = 2; g.strokeRect(x + 2, y + 2, c - 4, c - 4); }
  }
  // les fusions en cours : les deux astres tournent l'un autour de l'autre en se rapprochant, avec un halo qui grandit
  for (const f of fu.fuseFx) { const age = fu.tick - f.t0; if (age < 0) continue; const k2 = age / FU_PULL, x = L.x + f.x * c, y = L.y + f.y * c, sp = fuSprite(f.s, c - 2), sz = Math.round((c - 2) * (1 - k2 * .3)), rr = (1 - k2) * c * .3, an = age * .55;
    g.globalAlpha = .25 + k2 * .5; g.fillStyle = FU.stages[f.s + 1][1]; g.fillRect(Math.round(x + c / 2 - 3 - k2 * 10), Math.round(y + c / 2 - 3 - k2 * 10), Math.round(6 + k2 * 20), Math.round(6 + k2 * 20)); g.globalAlpha = 1;
    for (const sg of [1, -1]) g.drawImage(sp, Math.round(x + c / 2 + Math.cos(an) * rr * sg - sz / 2), Math.round(y + c / 2 + Math.sin(an) * rr * sg - sz / 2), sz, sz); }
  if (fu.padHole && (fu.holeMode || fu.picking != null)) { const x = L.x + (fu.cur % n) * c, y = L.y + (fu.cur / n | 0) * c; g.strokeStyle = (t >> 3) % 2 ? '#ffd07a' : '#ffffff'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, c - 2, c - 2); }
  for (const p of fu.parts) { g.fillStyle = p.col; g.fillRect(p.x | 0, p.y | 0, 2, 2); }
  if (fu.flash) { g.fillStyle = `rgba(255,208,244,${fu.flash / 40})`; g.fillRect(0, 0, FU.W, FU.H); }
  // the chain of objects at the bottom, the reached ones lit
  const cy = L.y + L.w + 14, step = (FU.W - 24) / FU.stages.length;
  FU.stages.forEach((st, s) => { g.globalAlpha = s <= Math.max(fu.best, fuSave().maxStage) ? 1 : .25; g.drawImage(fuSprite(s, 20), Math.round(12 + s * step + step / 2 - 10), cy - 2); g.globalAlpha = 1; });
  pxFont(g, 'ANNULER x' + fu.undos + '  ·  TROU DE VER x' + fu.holes, FU.W / 2, cy + 34, '#b8a8d8', 8, 'center');
  if (fu.holeMode || fu.picking != null) pxFont(g, fu.picking == null ? 'CHOISIS UNE TUILE' : 'PUIS UNE AUTRE', FU.W / 2, 57, '#7fe0ee', 8, 'center');
  if (fu.banner) gameText(g, FU.W, [[fu.banner.text, '#ffd07a', 16]], L.y + L.w / 2 - 14);
  if (fu.mode === 'pause') gameText(g, FU.W, [['PAUSE', '#ffd07a', 16], ['Une flèche pour reprendre', '#d9c6ff', 8]], 140);
  if (fu.mode === 'over') {
    gameText(g, FU.W, fu.kind === 'defi' ? (fu.won ? [['DÉFI RÉUSSI', '#8ee8a0', 16], ['', '#fff', 8], [fu.level < FU_LEVELS.length - 1 ? 'Espace : défi suivant' : 'Tous les défis !', '#ffffff', 8]] : [['RATÉ', '#ff4f6d', 16], [fu.score + ' points', '#ffd07a', 8], ['Espace : réessayer', '#ffffff', 8]])
      : [['PLUS DE COUP', '#ff4f6d', 16], [fu.score + ' points' + (fu.record ? ' · record !' : ''), '#ffd07a', 8], ['Espace : nouvelle partie', '#ffffff', 8]], 130);
    if (fu.won) for (let i = 0; i < 3; i++) sprite(g, FU_STAR, FU.W / 2 - 22 + i * 16, 157, {y: i < fu.got ? '#ffd07a' : '#3a2a6e', w: i < fu.got ? '#fff5d0' : '#5e4d85'});
  }
}
function fuTile(g, tile, x, y, c, t, sc) {
  if (tile.wall) return;  // un mur : du vide, on voit les étoiles du fond
  if (tile.debris) return fuDebris(g, x, y, c, t);
  const [, base] = FU.stages[tile.s], size = c - 2;
  g.fillStyle = base + '22'; g.fillRect(x + 3, y + 3, c - 6, c - 6);  // a halo of its colour
  const spr = fuSprite(tile.s, size), d = size * sc;
  g.imageSmoothingEnabled = false; g.drawImage(spr, Math.round(x + (c - d) / 2), Math.round(y + (c - d) / 2), Math.round(d), Math.round(d));
}
/* ---------- input ---------- */
function fuGo(dir) { if (!fu) return; if (fu.mode === 'pause') fu.mode = 'play'; if (fuMove(dir)) fu.lastDir = dir; }
// au clavier et à la souris, le curseur de la manette s'efface
addEventListener('keydown', () => { if (fu) fu.padHole = false; }, true); addEventListener('pointerdown', () => { if (fu) fu.padHole = false; }, true);
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !fu || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, dir = {ArrowLeft: 'left', q: 'left', a: 'left', ArrowRight: 'right', d: 'right', ArrowUp: 'up', z: 'up', w: 'up', ArrowDown: 'down', s: 'down'}[k];
  if (dir) { e.preventDefault(); fuGo(dir); return; }
  if (k === 'u' || (e.ctrlKey && k === 'z')) fuUndo();
  else if (k === 't') { if (fu.holes) { fu.holeMode = !fu.holeMode; fu.picking = null; } }
  else if ((k === ' ' || k === 'Enter') && fu.mode === 'over') { e.preventDefault(); fuNext(); }
  else if (k === 'p' || k === 'Escape') { if (fu.mode === 'play') fu.mode = 'pause'; }
});
function fuNext() { const next = fu.won && fu.kind === 'defi' && fu.level < FU_LEVELS.length - 1; fuStart(fu.kind, fu.level + (next ? 1 : 0)); }
// mouse: a swipe moves the tiles; a click picks the tiles of the wormhole
$('fuCanvas').onpointerdown = e => {
  if (!fu) return;
  const cv = $('fuCanvas'), r = cv.getBoundingClientRect(), sx = e.clientX, sy = e.clientY;
  cv.setPointerCapture(e.pointerId);
  cv.onpointerup = u => {
    cv.onpointerup = null;
    const dx = u.clientX - sx, dy = u.clientY - sy, kk = cv.width / r.width;
    if (Math.hypot(dx, dy) * kk > 14) return fuGo(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    if (fu.mode === 'over') return fuNext();
    if (!fu.holeMode && fu.picking == null) return;
    const L = fuLayout(), X = Math.floor(((u.clientX - r.left) * kk - L.x) / L.c), Y = Math.floor(((u.clientY - r.top) * kk - L.y) / L.c);
    if (X >= 0 && Y >= 0 && X < fu.n && Y < fu.n) fuHole(Y * fu.n + X);
  };
};
/* ---------- page ---------- */
function fuInfo() { const s = fuSave(); $('fuStats').replaceChildren(...[['Galaxie', games?.best.fusion_galaxie ?? 0], ['Nébuleuse', games?.best.fusion_nebuleuse ?? 0], ...Object.keys(FU_SHAPES).map(k => [FU_SHAPES[k].name.split(' · ')[0], games?.best['fusion_' + k] ?? 0]), ['Plus loin', FU.stages[s.maxStage][0]], ['Défis', Object.values(s.stars).reduce((a, b) => a + b, 0) + ' / ' + FU_LEVELS.length * 3 + ' ★']].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))])); }
function fuMenu() {
  const s = fuSave(), sel = $('fuMode');
  sel.replaceChildren(Object.assign(el('option', '', 'Galaxie · 5 × 5'), {value: 'galaxie'}), Object.assign(el('option', '', 'Nébuleuse · 4 × 4'), {value: 'nebuleuse'}),
    ...Object.keys(FU_SHAPES).map(k => Object.assign(el('option', '', FU_SHAPES[k].name), {value: k})),
    ...FU_LEVELS.map(([nm, size, goal], i) => Object.assign(el('option', '', 'Défi ' + (i + 1) + ' · ' + nm + ' · ' + fuGoalText(goal) + (size === 4 ? ' · 4 × 4' : '') + (s.stars[i] ? ' · ' + '★'.repeat(s.stars[i]) : '') + (i && !s.stars[i - 1] && !s.stars[i] ? ' 🔒' : '')), {value: 'd' + i, disabled: !!(i && !s.stars[i - 1] && !s.stars[i])})));
  sel.value = fu ? (fu.kind === 'defi' ? 'd' + fu.level : fu.kind) : 'galaxie';
}
function fuOpen() {
  if (fu) { gameLoop(fu, 'neodex:fusion', fuUpdate, fuDraw); fuInfo(); return; }
  const c = fuSave().cur;  // the game in progress, here or on another PC
  if (c?.grid) fuStart(c.kind, c.level, c); else fuStart('galaxie');
}
$('fuMode').onchange = () => { const v = $('fuMode').value; if ($('fuMode').selectedOptions[0]?.disabled) { fuMenu(); return; } fuStart(v.startsWith('d') ? 'defi' : v, v.startsWith('d') ? +v.slice(1) : 0); $('fuMode').blur(); };
$('fuNew').onclick = () => { fuStart(fu?.kind || 'galaxie', fu?.level || 0); $('fuNew').blur(); };
$('fuUndoBtn').onclick = () => { fuUndo(); $('fuUndoBtn').blur(); };
$('fuHoleBtn').onclick = () => { if (fu?.holes) { fu.holeMode = !fu.holeMode; fu.picking = null; } $('fuHoleBtn').blur(); };
$('fuFs').onclick = () => { $('fuFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else $('fuCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
{  // la manette : croix ou stick = glisser (ou déplacer le curseur du trou de ver), X annuler, Y trou de ver, A choisir / rejouer, B renoncer, Start pause
  let prev = [], armed = true;
  const loop = () => {
    requestAnimationFrame(loop);
    const p = [...(navigator.getGamepads?.() || [])].find(Boolean);
    if (!p || !fu || !view.classList.contains('on')) { prev = []; return; }
    const now = p.buttons.map(b => b.pressed), was = prev, hit = i => now[i] && !was[i], ax = p.axes[0] || 0, ay = p.axes[1] || 0; prev = now;
    const stick = Math.abs(ax) > .6 || Math.abs(ay) > .6 ? (Math.abs(ax) > Math.abs(ay) ? (ax > 0 ? 'right' : 'left') : ay > 0 ? 'down' : 'up') : null;
    if (!stick && Math.abs(ax) < .3 && Math.abs(ay) < .3) armed = true;
    const dir = hit(12) ? 'up' : hit(13) ? 'down' : hit(14) ? 'left' : hit(15) ? 'right' : stick && armed ? (armed = false, stick) : null;
    if (fu.mode === 'over') { if (hit(0) || hit(9)) fuNext(); return; }
    if (hit(9)) { fu.mode = fu.mode === 'play' ? 'pause' : 'play'; return; }
    if (fu.holeMode || fu.picking != null) {
      if (dir) { fu.padHole = true; const n = fu.n, x = fu.cur % n, y = fu.cur / n | 0, [dx, dy] = {left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1]}[dir]; fu.cur = Math.min(n - 1, Math.max(0, y + dy)) * n + Math.min(n - 1, Math.max(0, x + dx)); }
      if (hit(0)) { fu.padHole = true; fuHole(fu.cur); }
      if (hit(1) || hit(3)) { fu.holeMode = false; fu.picking = null; }
      return;
    }
    if (dir) fuGo(dir);
    if (hit(2)) fuUndo();
    if (hit(3) && fu.holes) { fu.holeMode = true; fu.picking = null; fu.padHole = true; }
  };
  requestAnimationFrame(loop);
}
function fuSelf() {  // vérification : deux pareils fusionnent une seule fois par coup, les débris bloquent et cassent près d'une fusion ; l'animation de fusion ; un coup gardé pendant l'animation ; des astres bien dessinés
  const keep = fu, bad = []; fuMute = true;
  fu = {n: 4, grid: Array(16).fill(null), mode: 'play', anim: 0, seq: 100, tick: 0, score: 0, moves: 0, broken: 0, best: 0, undo: [], undos: 2, holes: 1, reached: {}, parts: [], fuseFx: [], queued: null, lv: {}, goal: null, kind: 'test'};
  const T = s => ({id: fu.seq++, s});
  fu.grid[0] = T(0); fu.grid[1] = T(0); fu.grid[2] = T(0); fu.grid[3] = T(0);      // 4 poussières en ligne -> 2 cailloux
  fu.grid[4] = T(1); fu.grid[5] = {id: 1, debris: true}; fu.grid[6] = T(2); fu.grid[7] = T(2);  // le débris garde sa place, les deux astéroïdes fusionnent et le cassent
  const real = {fuSpawn, fuInfo, fuCheck, fuStore}; fuSpawn = fuInfo = fuCheck = fuStore = () => {};
  try {
    fuMove('left');
    if (!(fu.grid[0]?.s === 1 && fu.grid[1]?.s === 1 && !fu.grid[2] && fu.grid[4]?.s === 1 && !fu.grid[5]?.debris && fu.grid[6]?.s === 3 && fu.broken === 1 && fu.score === 4 * 2 * 2 + 16 * 2)) bad.push('coup');
    if (fu.fuseFx.length !== 3 || fu.grid[0].born !== FU_SLIDE + FU_PULL) bad.push('animation');
    fuMove('right'); if (fu.queued !== 'right' || fu.moves !== 1) bad.push('coup en attente');
    for (let i = 0; i < FU_SLIDE + FU_PULL + 2; i++) { fuUpdate(); fu.tick++; }
    if (fu.moves !== 2 || fu.queued) bad.push('coup joué après l\'animation');
  } finally { ({fuSpawn, fuInfo, fuCheck, fuStore} = real); }
  fu = Object.assign(fu, {grid: Array(16).fill(null), anim: 0, queued: null, broken: 0, fuseFx: []}); fu.grid[1] = {id: 2, debris: true, wall: true}; fu.grid[2] = T(3); fu.grid[3] = T(3); fu.grid[0] = T(0);
  ({fuSpawn, fuInfo, fuCheck, fuStore} = {fuSpawn: () => {}, fuInfo: () => {}, fuCheck: () => {}, fuStore: () => {}});
  try { fuMove('left'); } finally { ({fuSpawn, fuInfo, fuCheck, fuStore} = real); }
  if (!(fu.grid[1]?.wall && fu.grid[2]?.s === 4 && fu.grid[0]?.s === 0 && fu.broken === 0)) bad.push('mur');
  fu.grid = fu.grid.map((t, i) => t?.wall ? t : T(0)); fu.grid[7] = null; fuSpawn(); if (!fu.grid[7] || !fu.grid[1].wall) bad.push('mur rempli');
  // chaque astre se voit : assez de pixels allumés, et aucun n'est pareil à un autre
  const prints = FU.stages.map((_, s) => { const c = fuSprite(s, 40), d = c.getContext('2d').getImageData(0, 0, 40, 40).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 40) n++; return [n, c.toDataURL()]; });
  if (prints.some(([n]) => n < 120) || new Set(prints.map(p => p[1])).size !== FU.stages.length) bad.push('astres');
  fuMute = false; fu = keep;
  return bad.length ? bad.join(', ') : 'ok';
}
{ const c = fuSelf(); console.assert(c === 'ok', 'fusion stellaire', c); }
$('fuCanvas').__fs = {st: () => fu, check: fuSelf};
  // ---- fin ----
  ctx.onOpen(() => { fuOpen(); });
}
