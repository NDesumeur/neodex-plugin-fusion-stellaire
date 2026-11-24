// lancé par le test « local » de NeoDex : la vérification interne, les onze astres sur la grille, une fusion animée au clavier,
// la manette (trou de ver, annuler, glisser), l'écran de fin, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('fuCanvas').__fs, fu = T.st(); ${code} })()`);
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('fuCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'fusion-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`(() => { const s = document.getElementById('fuMode'); s.value = 'galaxie'; s.dispatchEvent(new Event('change')); return 0; })()`); await sleep(150);
  // les onze astres et deux débris, pour les reconnaître d'un coup d'œil
  await C(`fu.grid = fu.grid.map((_, i) => i < 11 ? {id: 900 + i, s: i, born: -100} : i === 12 || i === 18 ? {id: 950 + i, debris: true} : null); fu.anim = 0; fu.fuseFx = []; return 0;`); await sleep(120); await shot('0-astres');
  // une fusion : deux géantes gazeuses côte à côte, glissées à gauche
  await C(`fu.grid = fu.grid.map(() => null); fu.grid[20] = {id: 990, s: 7, born: -100}; fu.grid[22] = {id: 991, s: 7, born: -100}; fu.grid[0] = {id: 992, s: 3, born: -100}; return 0;`); await sleep(50);
  await key('ArrowLeft'); await sleep(190); await shot('1-attraction');
  if (!(await C('return fu.fuseFx.length;') > 0)) throw new Error('la fusion devait s\'animer');
  await sleep(120); await shot('2-eclat'); await sleep(400);
  if (await C('return fu.grid[20]?.s;') !== 8) throw new Error('les deux géantes devaient donner une étoile : ' + await C('return JSON.stringify(fu.grid[20]);'));
  // la manette : Y ouvre le trou de ver, la croix déplace le curseur, A prend deux tuiles qui s'échangent ; X annule
  await pj(`(() => { const pad = {axes: [0, 0], buttons: Array.from({length: 17}, () => ({pressed: false}))}; window.__pad = pad; navigator.getGamepads = () => [pad]; return 0; })()`);
  const btn = async i => { await pj(`(__pad.buttons[${i}].pressed = true, 0)`); await sleep(60); await pj(`(__pad.buttons[${i}].pressed = false, 0)`); await sleep(60); };
  await C(`fu.holes = 2; fu.cur = 0; fu.grid[1] = {id: 993, s: 5, born: -100}; return 0;`);
  await btn(3); if (!await C('return fu.holeMode;')) throw new Error('Y devait ouvrir le trou de ver');
  await btn(0); await btn(15); await shot('3-trou-de-ver'); await btn(0);
  if (await C('return fu.grid[0]?.s + "|" + fu.grid[1]?.s;') !== '5|3') throw new Error('le trou de ver devait échanger les deux tuiles : ' + await C('return fu.grid[0]?.s + "|" + fu.grid[1]?.s;'));
  await C(`fu.undos = 2; return 0;`); await btn(2); if (await C('return fu.grid[0]?.s + "|" + fu.grid[1]?.s;') !== '3|5') throw new Error('X devait annuler l\'échange');
  await btn(15); await sleep(300); if (await C('return fu.lastDir;') !== 'right') throw new Error('la croix devait faire glisser les tuiles');
  await pj(`navigator.getGamepads = () => [], 0`);
  // les formes de grille : chaque forme a ses murs, qui restent vides
  for (const [m, w] of [['anneau', 1], ['croix', 4], ['sablier', 12], ['grand', 0]]) {
    await pj(`(() => { const s = document.getElementById('fuMode'); s.value = '${m}'; s.dispatchEvent(new Event('change')); return 0; })()`); await sleep(250); await shot('5-' + m);
    const got = await C('return fu.kind + "|" + fu.n + "|" + fu.grid.filter(t => t?.wall).length + "|" + fu.grid.filter(t => t && !t.debris).length;');
    if (got !== m + '|' + (m === 'grand' || m === 'sablier' ? 6 : 5) + '|' + w + '|2') throw new Error('forme ' + m + ' : ' + got);
  }
  await pj(`(() => { const s = document.getElementById('fuMode'); s.value = 'galaxie'; s.dispatchEvent(new Event('change')); return 0; })()`); await sleep(150);
  // l'écran de fin
  await C(`fu.mode = 'over'; fu.won = false; fu.record = false; return 0;`); await sleep(80); await shot('4-fin');
  await pj(`document.getElementById('fuNew').click(), 0`); await sleep(100);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('fuFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('fuCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('fuCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('fuCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 380) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · 11 astres · fusion animée · manette (trou de ver, annuler, glisser) · fin · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
