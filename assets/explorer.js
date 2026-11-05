/* Entdecken: Graph + Wertetabelle + Gleichung, Schlüssel und Vermutung */
/* Explorer für Funktionen: Graph + Wertetabelle + Funktionsgleichung, Regler in 0,1-Schritten */
(function(){
  const r1 = v => Math.round(v * 10) / 10;
  const fmt = (v, d) => { if(d === undefined) d = 2; const k = Math.pow(10, d); v = Math.round(v * k) / k; if(v === 0) v = 0; return (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ','); };
  const FR = (a, b) => '<span class="fr"><span>' + a + '</span><span>' + b + '</span></span>';
  const par = v => v < 0 ? '(' + fmt(v) + ')' : fmt(v);

  // farbige Zahl eines Parameters (ohne Vorzeichen)
  function V(P, k, abs){ const v = abs === false ? P[k] : Math.abs(P[k]); return '<b class="xv" style="color:var(' + P._c[k] + ')">' + fmt(v, 1) + '</b>'; }
  // Summe von Gliedern: [k, 'x²'] = Parameter k mal x², ['=', 'x²'] = festes Glied mit Faktor 1
  function sum(P, terms){
    let s = '', first = true;
    terms.forEach(([k, t]) => {
      const v = k === '=' ? 1 : P[k];
      if(v === 0) return;
      const sg = first ? (v < 0 ? '−' : '') : (v < 0 ? ' − ' : ' + ');
      const num = k === '=' || (t && Math.abs(v) === 1) ? '' : V(P, k);
      s += sg + num + t; first = false;
    });
    return s || '0';
  }
  function opening(a){
    if(a === 0) return 'a = 0: Das ist keine Parabel mehr, sondern eine Gerade.';
    const o = a > 0 ? 'nach oben geöffnet' : 'nach unten geöffnet';
    const w = Math.abs(a) > 1 ? 'gestreckt (schmaler als die Normalparabel)' : Math.abs(a) < 1 ? 'gestaucht (breiter als die Normalparabel)' : 'genauso breit wie die Normalparabel';
    return 'Die Parabel ist <b>' + o + '</b> und <b>' + w + '</b>.';
  }
  const sq = x => x * x;

  const CFG = {
    e1: { bs: 1, title: 'm und b entdecken', L: 'y', vx: [-6, 6], vy: [-6, 6], diff: true, lin: true,
      params: [{k:'m', min:-4, max:4, v:0.5, c:'--blue', name:'Steigung'}, {k:'b', min:-5, max:5, v:1, c:'--green', name:'y-Achsenabschnitt'}],
      f: P => x => P.m * x + P.b,
      eq: P => 'y = ' + sum(P, [['m','x'], ['b','']]),
      xs: () => [-3,-2,-1,0,1,2,3],
      hl: (P, x, X) => X.showB && x === 0,
      info: (P, X) => {
        let s = '';
        if(X.showTri){ const dy = P.m * X.dx; s += '<p><b>Steigungsdreieck:</b> ' + X.dx + ' nach rechts, ' + fmt(Math.abs(dy)) + (dy < 0 ? ' nach unten.' : dy > 0 ? ' nach oben.' : ' – es geht weder hoch noch runter.') + '</p><p>m = ' + FR('Δy','Δx') + ' = ' + FR(fmt(dy), X.dx) + ' = <b>' + fmt(P.m) + '</b></p>'; }
        if(X.showB) s += '<p><b>b = ' + fmt(P.b) + ':</b> Hier schneidet die Gerade die y-Achse, im Punkt (0 | ' + fmt(P.b) + '). In der Tabelle ist das der y-Wert bei x = 0.</p>';
        return s || '<p>Tippe auf <b>Steigungsdreieck</b> oder <b>b zeigen</b>, um zu sehen, wo m und b im Graphen stecken.</p>';
      },
      q: ['Schiebe m nach rechts und nach links. Wann steigt die Gerade, wann fällt sie? Wann ist sie waagerecht?',
          'Schau in die Tabelle: Um wie viel wächst y, wenn x um 1 größer wird? Vergleiche mit m.',
          'Schiebe nur b. Was ändert sich am Graphen – und was bleibt gleich?',
          'Stelle die Gerade y = 2x + 1 ein. Passen die Punkte (1 | 3), (2 | 5) und (3 | 7) aus „Muster entdecken“?'] },

    e2: { bs: 2, title: 'Die Höhe des Scheitelpunkts', L: 'y', vx: [-5, 5], vy: [-6, 8], diff: true, ghost: true,
      params: [{k:'e', min:-5, max:5, v:0, c:'--green', name:'Höhe des Scheitelpunkts'}],
      f: P => x => x * x + P.e,
      eq: P => 'y = x²' + (P.e ? (P.e < 0 ? ' − ' : ' + ') + V(P,'e') : ''),
      xs: () => [-3,-2,-1,0,1,2,3],
      hl: (P, x) => x === 0,
      pts: P => [{x:0, y:P.e, c:'--green', t:'S(0 | ' + fmt(P.e) + ')', below:true}],
      info: P => '<p><b>Scheitelpunkt S(0 | ' + fmt(P.e) + ')</b></p><p>' + (P.e > 0 ? 'Die Normalparabel ist um ' + fmt(P.e) + ' nach oben verschoben.' : P.e < 0 ? 'Die Normalparabel ist um ' + fmt(-P.e) + ' nach unten verschoben.' : 'Das ist die Normalparabel y = x².') + '</p>',
      q: ['Schiebe e. Wohin wandert der Scheitelpunkt? Welche Zahl aus der Gleichung findest du im Scheitelpunkt wieder?',
          'Vergleiche die Differenzen in der Tabelle für verschiedene e. Was fällt dir auf?',
          'Bei einer Geraden sind die Differenzen immer gleich. Wie ist es hier?',
          'Plättchenmuster: Figur n hat n² + 2 Plättchen. Welches e passt dazu?'] },

    e3: { bs: 3, title: 'Der Streckfaktor a', L: 'y', vx: [-5, 5], vy: [-7, 7], ghost: true,
      params: [{k:'a', min:-4, max:4, v:2, c:'--blue', name:'Streckfaktor'}],
      f: P => x => P.a * x * x,
      eq: P => 'y = ' + sum(P, [['a','x²']]),
      xs: () => [-3,-2,-1,0,1,2,3],
      hl: (P, x) => x === 1,
      pts: P => [{x:1, y:P.a, c:'--blue', t:'(1 | ' + fmt(P.a) + ')'}],
      info: P => '<p>' + opening(P.a) + '</p><p><b>Ablesetrick:</b> Vom Scheitel 1 nach rechts, dann a = ' + fmt(P.a) + ' ' + (P.a < 0 ? 'nach unten' : 'nach oben') + '. Das ist der Punkt (1 | ' + fmt(P.a) + ').</p>',
      q: ['Für welche a ist die Parabel nach unten geöffnet?',
          'Für welche a ist die Parabel breiter als die gestrichelte Normalparabel?',
          'Stelle a = 2 und dann a = −2 ein. Was ist gleich, was ist anders?',
          'Lies in der Tabelle den y-Wert bei x = 2 ab. Was passiert damit, wenn du a verdoppelst?'] },

    e4: { bs: 4, title: 'Die Scheitelpunktform', L: 'f(x)', vx: [-7, 7], vy: [-7, 7], ghost: true,
      params: [{k:'a', min:-3, max:3, v:1, c:'--blue', name:'Streckfaktor'}, {k:'d', min:-5, max:5, v:2, c:'--orange', name:'nach rechts/links'}, {k:'e', min:-5, max:5, v:-1, c:'--green', name:'nach oben/unten'}],
      f: P => x => P.a * sq(x - P.d) + P.e,
      eq: P => {
        const inner = P.d === 0 ? 'x' : '(x ' + (P.d > 0 ? '− ' : '+ ') + V(P,'d') + ')';
        const q = P.d === 0 ? 'x²' : inner + '²';
        let s = P.a === 0 ? '' : (P.a === 1 ? '' : P.a === -1 ? '−' : (P.a < 0 ? '−' : '') + V(P,'a')) + q;
        if(P.e) s += (s ? (P.e < 0 ? ' − ' : ' + ') : (P.e < 0 ? '−' : '')) + V(P,'e');
        return 'f(x) = ' + (s || '0');
      },
      xs: P => [-3,-2,-1,0,1,2,3].map(k => r1(P.d + k)),
      hl: (P, x) => x === P.d,
      pts: P => [{x:P.d, y:P.e, c:'--orange', t:'S(' + fmt(P.d) + ' | ' + fmt(P.e) + ')', below:P.a > 0}],
      info: P => '<p><b>Scheitelpunkt S(' + fmt(P.d) + ' | ' + fmt(P.e) + ')</b></p><p>' +
        (P.d > 0 ? 'Um ' + fmt(P.d) + ' nach rechts – in der Klammer steht dann ein <b>Minus</b>.' : P.d < 0 ? 'Um ' + fmt(-P.d) + ' nach links – in der Klammer steht dann ein <b>Plus</b>.' : 'Nicht nach rechts oder links verschoben.') + ' ' +
        (P.e > 0 ? 'Um ' + fmt(P.e) + ' nach oben.' : P.e < 0 ? 'Um ' + fmt(-P.e) + ' nach unten.' : '') + '</p><p>' + opening(P.a) + '</p>',
      q: ['Schiebe nur d nach rechts. Warum steht in der Klammer dann ein Minus?',
          'Die Tabelle ist um den Scheitelpunkt herum gebaut. Was fällt dir an den Werten links und rechts auf?',
          'Stelle S(2 | −3) ein. Welches a brauchst du, damit die Parabel durch P(4 | −1) geht?',
          'Wie heißt die Gleichung, wenn S(4 | 2) sein soll und die Parabel so breit ist wie die Normalparabel?'] },

    e5: { bs: 5, title: 'Normalform und Scheitelpunkt', L: 'f(x)', vx: [-7, 7], vy: [-7, 7],
      params: [{k:'a', min:-3, max:3, v:1, c:'--blue', name:'Streckfaktor'}, {k:'b', min:-6, max:6, v:-2, c:'--orange', name:'Zahl vor x'}, {k:'c', min:-5, max:5, v:-3, c:'--green', name:'Zahl ohne x'}],
      f: P => x => P.a * x * x + P.b * x + P.c,
      eq: P => 'f(x) = ' + sum(P, [['a','x²'], ['b','x'], ['c','']]),
      xs: P => { const m = P.a ? Math.round(-P.b / (2 * P.a)) : 0; return [-3,-2,-1,0,1,2,3].map(k => m + k); },
      hl: (P, x) => x === 0,
      pts: P => { const p = [{x:0, y:P.c, c:'--green', t:'(0 | ' + fmt(P.c) + ')'}]; if(P.a){ const xs = -P.b / (2 * P.a); p.push({x:xs, y:P.a*xs*xs + P.b*xs + P.c, c:'--orange', t:'S', below:P.a > 0}); } return p; },
      info: P => {
        if(!P.a) return '<p>a = 0: Das ist keine Parabel mehr, sondern eine Gerade.</p>';
        const xs = -P.b / (2 * P.a), ys = P.a*xs*xs + P.b*xs + P.c;
        return '<p>x<sub>S</sub> = ' + FR('−b','2a') + ' = ' + FR('−' + par(P.b), '2 · ' + par(P.a)) + ' = ' + fmt(xs) + '</p><p>f(' + fmt(xs) + ') = ' + fmt(ys) + '  →  <b>S(' + fmt(xs) + ' | ' + fmt(ys) + ')</b></p><p>c = ' + fmt(P.c) + ' ist der y-Achsenabschnitt: Punkt (0 | ' + fmt(P.c) + ').</p>';
      },
      q: ['Ändere nur c. Was passiert mit der Parabel? Wo findest du c im Graphen und in der Tabelle?',
          'Ändere nur b. Wie wandert der Scheitelpunkt?',
          'Prüfe die Formel für x<sub>S</sub> mit der Tabelle: Wo sind zwei y-Werte gleich groß? Die Mitte ist x<sub>S</sub>.',
          'Stelle a = 1, b = −4, c = 3 ein. Wie heißt die Scheitelpunktform?'] },

    e6: { bs: 6, title: 'Nullstellen und pq-Formel', L: 'f(x)', vx: [-7, 7], vy: [-7, 7],
      params: [{k:'p', min:-6, max:6, v:-4, c:'--orange', name:'p'}, {k:'q', min:-6, max:6, v:3, c:'--green', name:'q'}],
      f: P => x => x * x + P.p * x + P.q,
      eq: P => 'f(x) = ' + sum(P, [['=','x²'], ['p','x'], ['q','']]),
      xs: P => { const m = Math.round(-P.p / 2); return [-3,-2,-1,0,1,2,3].map(k => m + k); },
      hl: (P, x) => Math.abs(x * x + P.p * x + P.q) < 1e-9,
      pts: P => { const D = sq(P.p / 2) - P.q, h = -P.p / 2; if(D < -1e-9) return []; if(Math.abs(D) < 1e-9) return [{x:h, y:0, c:'--red', t:'x = ' + fmt(h)}];
        const w = Math.sqrt(D); return [{x:h - w, y:0, c:'--red', t:'x₁'}, {x:h + w, y:0, c:'--red', t:'x₂'}]; },
      info: P => {
        const h = -P.p / 2, D = sq(P.p / 2) - P.q, Dr = Math.round(D * 10000) / 10000;
        let s = '<p>Unter der Wurzel: (' + FR('p','2') + ')² − q = ' + par(P.p / 2) + '² − ' + par(P.q) + ' = <b>' + fmt(Dr, 4) + '</b></p>';
        if(Dr > 0){ const w = Math.sqrt(D); s += '<p><b>Positiv → 2 Nullstellen:</b> x₁ = ' + fmt(h) + ' − √' + fmt(Dr, 4) + ' ≈ ' + fmt(h - w) + ',  x₂ = ' + fmt(h) + ' + √' + fmt(Dr, 4) + ' ≈ ' + fmt(h + w) + '</p>'; }
        else if(Dr === 0) s += '<p><b>Null → 1 Nullstelle:</b> x = ' + fmt(h) + '. Die Parabel berührt die x-Achse.</p>';
        else s += '<p><b>Negativ → keine Nullstelle.</b> Die Parabel liegt ganz über der x-Achse.</p>';
        return s;
      },
      q: ['Lass p = −4 und verändere q. Wann gibt es 2, 1 oder 0 Nullstellen?',
          'Was steht in diesen drei Fällen unter der Wurzel?',
          'Wo liegt der Scheitelpunkt im Vergleich zu den beiden Nullstellen?',
          'Stelle q = 0 ein. Was fällt dir an einer Nullstelle auf? Warum?'] },

    e7: { bs: 7, title: 'Ballwurf', L: 'f(x)', vx: [0, 12], vy: [0, 8], dom: [0, 100], sach: true,
      params: [{k:'a', min:-1, max:-0.1, v:-0.1, c:'--blue', name:'Streckfaktor'}, {k:'b', min:0, max:3, v:0.8, c:'--orange', name:'Zahl vor x'}, {k:'c', min:0, max:3, v:0, c:'--green', name:'Abwurfhöhe'}],
      f: P => x => P.a * x * x + P.b * x + P.c,
      eq: P => 'f(x) = ' + sum(P, [['a','x²'], ['b','x'], ['c','']]),
      xs: () => [0,1,2,3,4,5,6,7,8,9,10],
      hl: (P, x) => Math.abs(x - (-P.b / (2 * P.a))) < 1e-9,
      pts: P => { const xs = -P.b / (2 * P.a), ys = P.a*xs*xs + P.b*xs + P.c, xl = (-P.b - Math.sqrt(P.b*P.b - 4*P.a*P.c)) / (2*P.a);
        return [{x:0, y:P.c, c:'--green', t:'Start'}, {x:xs, y:ys, c:'--orange', t:'höchster Punkt'}, {x:xl, y:0, c:'--red', t:'Aufprall'}]; },
      info: P => { const xs = -P.b / (2 * P.a), ys = P.a*xs*xs + P.b*xs + P.c, xl = (-P.b - Math.sqrt(P.b*P.b - 4*P.a*P.c)) / (2*P.a);
        return '<p><b>Abwurfhöhe:</b> f(0) = c = ' + fmt(P.c) + ' m</p><p><b>Größte Höhe:</b> ' + fmt(ys) + ' m, nach ' + fmt(xs) + ' m (x<sub>S</sub> = ' + FR('−b','2a') + ')</p><p><b>Aufprall:</b> nach ' + fmt(xl) + ' m (Nullstelle)</p>'; },
      q: ['Lass a = −0,1 und b = 0,8. Verändere nur c. Wie ändern sich die größte Höhe und die Stelle x<sub>S</sub>?',
          'Was bedeutet c im Sachkontext?',
          'Was passiert mit der Flugbahn, wenn a näher an 0 rückt?',
          'Warum ergeben negative Werte in der Tabelle hier keinen Sinn?'] }
  };

  function build(el){
    const id = el.dataset.exp, cfg = CFG[id];
    if(!cfg) return;
    const uid = id + '-' + Math.random().toString(36).slice(2, 7);
    const P = {_c:{}}; cfg.params.forEach(p => { P[p.k] = p.v; P._c[p.k] = p.c; });
    const X = {showTri:false, showB:false, dx:1};
    el.classList.add('xp');
    el.innerHTML =
      (el.dataset.head === 'no' ? '' : '<div class="xp-head"><span class="xp-tag">Baustein ' + cfg.bs + ' · Entdecken</span><h3>' + cfg.title + '</h3></div>') +
      (store.get(id + '-pred') ? '<div class="xp-mine"><b>Deine Vermutung:</b> „' + esc(store.get(id + '-pred')) + '“ <span>Stimmt sie? Prüfe sie mit den Reglern.</span></div>' : '') +
      '<div class="xp-eq" aria-live="polite"></div>' +
      '<div class="xp-main"><div class="xp-graph"><svg role="img" aria-label="Graph der Funktion"></svg></div><div class="xp-side">' +
      cfg.params.map(p => '<div class="xs"><label for="' + uid + p.k + '"><b style="color:var(' + p.c + ')">' + p.k + '</b> = <output>' + fmt(p.v) + '</output> <small style="color:var(--muted)">' + (p.name !== p.k ? '· ' + p.name : '') + '</small></label>' +
        '<div class="xs-row"><button type="button" class="xs-b" data-k="' + p.k + '" data-d="-1" aria-label="' + p.k + ' um 0,1 verkleinern">−</button>' +
        '<input type="range" id="' + uid + p.k + '" data-k="' + p.k + '" min="' + p.min + '" max="' + p.max + '" step="0.1" value="' + p.v + '">' +
        '<button type="button" class="xs-b" data-k="' + p.k + '" data-d="1" aria-label="' + p.k + ' um 0,1 vergrößern">+</button></div></div>').join('') +
      (cfg.lin ? '<div class="xp-tools"><button type="button" class="xbtn tri" aria-pressed="false">△ Steigungsdreieck</button><button type="button" class="xbtn bb" aria-pressed="false">b zeigen</button>' +
        '<span class="xp-dx" hidden>Δx: <button type="button" class="xbtn dx" data-dx="1" aria-pressed="true">1</button><button type="button" class="xbtn dx" data-dx="2" aria-pressed="false">2</button><button type="button" class="xbtn dx" data-dx="3" aria-pressed="false">3</button></span></div>' : '') +
      '<div class="xp-info" aria-live="polite"></div><button type="button" class="xbtn xp-reset">↺ Zurücksetzen</button></div></div>' +
      '<div class="xp-table"></div>' +
      '<details class="xp-q" open><summary>Forscherfragen</summary><ol>' + cfg.q.map(t => '<li>' + t + '</li>').join('') + '</ol></details>';

    const svg = el.querySelector('svg');
    function set(k, v){
      const p = cfg.params.find(q => q.k === k);
      v = Math.min(p.max, Math.max(p.min, r1(v)));
      P[k] = v === 0 ? 0 : v;
      el.querySelector('input[data-k="' + k + '"]').value = v;
      el.querySelector('input[data-k="' + k + '"]').closest('.xs').querySelector('output').textContent = fmt(v);
      draw();
    }
    el.querySelectorAll('input[type=range]').forEach(i => i.addEventListener('input', () => set(i.dataset.k, parseFloat(i.value))));
    el.querySelectorAll('.xs-b').forEach(b => b.addEventListener('click', () => set(b.dataset.k, P[b.dataset.k] + 0.1 * b.dataset.d)));
    el.querySelector('.xp-reset').addEventListener('click', () => cfg.params.forEach(p => set(p.k, p.v)));
    if(cfg.lin){
      const tri = el.querySelector('.tri'), bb = el.querySelector('.bb'), dxw = el.querySelector('.xp-dx');
      tri.addEventListener('click', () => { X.showTri = !X.showTri; tri.setAttribute('aria-pressed', X.showTri); dxw.hidden = !X.showTri; draw(); });
      bb.addEventListener('click', () => { X.showB = !X.showB; bb.setAttribute('aria-pressed', X.showB); draw(); });
      el.querySelectorAll('.dx').forEach(b => b.addEventListener('click', () => { X.dx = +b.dataset.dx; el.querySelectorAll('.dx').forEach(c => c.setAttribute('aria-pressed', c === b)); draw(); }));
    }

    function draw(){
      const [x0, x1] = cfg.vx, [y0, y1] = cfg.vy, W = 480, H = Math.round(W * (y1 - y0) / (x1 - x0));
      const X_ = x => (x - x0) / (x1 - x0) * W, Y_ = y => H - (y - y0) / (y1 - y0) * H;
      svg.setAttribute('viewBox', '-2 -2 ' + (W + 4) + ' ' + (H + 4));
      const f = cfg.f(P);
      let s = '<defs><clipPath id="cp' + uid + '"><rect x="0" y="0" width="' + W + '" height="' + H + '"/></clipPath></defs>';
      s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="var(--paper)"/>';
      for(let x = Math.ceil(x0); x <= x1; x++) s += '<line class="g" x1="' + X_(x) + '" y1="0" x2="' + X_(x) + '" y2="' + H + '"/>';
      for(let y = Math.ceil(y0); y <= y1; y++) s += '<line class="g" x1="0" y1="' + Y_(y) + '" x2="' + W + '" y2="' + Y_(y) + '"/>';
      const ax = Y_(0), ay = X_(0);
      s += '<line class="ax" x1="0" y1="' + ax + '" x2="' + W + '" y2="' + ax + '"/><line class="ax" x1="' + ay + '" y1="0" x2="' + ay + '" y2="' + H + '"/>';
      const st = (x1 - x0) > 12 ? 2 : 1;
      for(let x = Math.ceil(x0); x <= x1; x++) if(x && x % st === 0 && x !== x1 && x !== x0) s += '<text class="lab" x="' + X_(x) + '" y="' + Math.min(H - 4, ax + 15) + '" text-anchor="middle">' + fmt(x) + '</text>';
      for(let y = Math.ceil(y0); y <= y1; y++) if(y && y % st === 0 && y !== y1 && y !== y0) s += '<text class="lab" x="' + (ay < 24 ? ay + 6 : ay - 6) + '" y="' + (Y_(y) + 4) + '" text-anchor="' + (ay < 24 ? 'start' : 'end') + '">' + fmt(y) + '</text>';
      s += '<text class="lab big" x="' + (W - 6) + '" y="' + (ax - 8) + '" text-anchor="end">x</text><text class="lab big" x="' + (ay + 8) + '" y="16">' + (cfg.sach ? 'Höhe' : cfg.L) + '</text>';
      s += '<g clip-path="url(#cp' + uid + ')">';
      const path = (fn, a, b) => { let d = '', pen = false; const N = 480; for(let i = 0; i <= N; i++){ const x = x0 + (x1 - x0) * i / N; if(x < a || x > b){ pen = false; continue; } const y = fn(x); if(!isFinite(y) || y < y0 - 20 || y > y1 + 20){ pen = false; continue; } d += (pen ? 'L' : 'M') + X_(x).toFixed(1) + ' ' + Y_(y).toFixed(1); pen = true; } return d; };
      if(cfg.ghost) s += '<path d="' + path(x => x * x, x0, x1) + '" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="6 5"/>';
      let a = x0, b = x1;
      if(cfg.sach){ a = 0; const xl = (-P.b - Math.sqrt(P.b*P.b - 4*P.a*P.c)) / (2*P.a); b = xl; }
      if(X.showTri){
        const dx = X.dx, dy = P.m * dx, xa = 0, ya = P.b;
        s += '<path d="M' + X_(xa) + ' ' + Y_(ya) + 'L' + X_(xa + dx) + ' ' + Y_(ya) + 'L' + X_(xa + dx) + ' ' + Y_(ya + dy) + 'Z" fill="var(--orange-soft)" stroke="var(--orange)" stroke-width="2.5"/>';
        s += '<text class="lab big" style="fill:var(--orange)" x="' + X_(xa + dx / 2) + '" y="' + (Y_(ya) + (dy >= 0 ? 18 : -8)) + '" text-anchor="middle">Δx = ' + dx + '</text>';
        s += '<text class="lab big" style="fill:var(--orange)" x="' + (X_(xa + dx) + 6) + '" y="' + (Y_(ya + dy / 2) + 5) + '">Δy = ' + fmt(dy) + '</text>';
      }
      s += '<path d="' + path(f, a, b) + '" fill="none" stroke="var(--blue)" stroke-width="3.2" stroke-linecap="round"/>';
      if(cfg.sach) s += '<line x1="0" y1="' + Y_(0) + '" x2="' + W + '" y2="' + Y_(0) + '" stroke="var(--green)" stroke-width="3"/>';
      const pts = (cfg.pts ? cfg.pts(P) : []).slice();
      if(X.showB) pts.push({x:0, y:P.b, c:'--green', t:'b = ' + fmt(P.b), left:true});
      pts.forEach(p => { if(!isFinite(p.x) || !isFinite(p.y)) return; const px = X_(p.x), py = Y_(p.y);
        s += '<circle cx="' + px + '" cy="' + py + '" r="6" fill="var(' + p.c + ')" stroke="var(--paper)" stroke-width="2"/>';
        const right = p.left ? false : px < W - 120;
        s += '<text class="lab big" style="fill:var(' + p.c + ')" x="' + (px + (right ? 10 : -10)) + '" y="' + (p.below || py < 24 ? py + 24 : py - 10) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + p.t + '</text>'; });
      s += '</g>';
      el.querySelector('.xp-eq').innerHTML = cfg.eq(P);
      svg.innerHTML = s;
      svg.setAttribute('aria-label', 'Graph von ' + el.querySelector('.xp-eq').textContent);
      el.querySelector('.xp-info').innerHTML = cfg.info(P, X);
      // Wertetabelle
      const xs = cfg.xs(P), ys = xs.map(x => f(x));
      let t = '<table><tr><th scope="row">x</th>' + xs.map(x => '<td>' + fmt(x) + '</td>').join('') + '</tr><tr><th scope="row">' + cfg.L + '</th>' +
        xs.map((x, i) => { const neg = cfg.sach && (ys[i] < 0 || x > b + 1e-9); return '<td class="' + (cfg.hl && cfg.hl(P, x, X) ? 'hl' : '') + (neg ? ' neg' : '') + '">' + (neg ? '–' : fmt(ys[i])) + '</td>'; }).join('') + '</tr>';
      if(cfg.diff) t += '<tr class="df"><th scope="row">Differenz</th><td></td>' + ys.slice(1).map((y, i) => { const d = y - ys[i]; return '<td>' + (d < 0 ? '' : '+') + fmt(d) + '</td>'; }).join('') + '</tr>';
      el.querySelector('.xp-table').innerHTML = t + '</table>';
    }
    draw();
  }

  // ---------- Schlüssel (Ergebnis der Muster-Aufgabe) + Vorhersage ----------
  const GATE = {
    e1: {task:"Bestimme jeweils die Steigung m der Geraden durch A und B.", rows:["a) A(0 | 1), B(1 | 3)", "b) A(0 | 1), B(2 | 5)", "c) A(0 | 1), B(3 | 7)", "d) A(1 | 3), B(3 | 7)"], key:'Welche Steigung m hast du bei allen vier Geraden aus „Muster entdecken“ heraus?', a:2, hint:'Rechne m = (y₂ − y₁) : (x₂ − x₁), z. B. für A(0 | 1) und B(1 | 3).',
         pred:'Was passiert mit der Geraden, wenn m negativ wird?'},
    e2: {task:"Berechne die Quadratzahlen und ihre Abstände (Differenzen).", rows:["1² = …   2² = …   3² = …   4² = …   5² = …   6² = …", "Differenzen: 2² − 1² = …   3² − 2² = …   4² − 3² = …   …"], key:'Rechne weiter wie in „Muster entdecken“: Wie groß ist die Differenz 6² − 5²?', a:11, hint:'6² = 36 und 5² = 25. Die Differenzen waren 3, 5, 7, 9, …',
         pred:'Wohin wandert der Scheitelpunkt, wenn e größer wird?'},
    e3: {task:"Berechne y für x = 2.", rows:["a) y = 0,5x²", "b) y = x²", "c) y = 2x²", "d) y = 4x²"], key:'„Muster entdecken“ d): Welchen y-Wert hat y = 4x² bei x = 2?', a:16, hint:'Erst 2² = 4, dann mal 4.',
         pred:'Was passiert mit der Parabel, wenn a negativ wird?'},
    e4: {task:"Gib jeweils den Scheitelpunkt S an.", rows:["a) y = (x − 1)² + 2", "b) y = (x − 2)² + 2", "c) y = (x − 3)² + 2", "d) y = (x + 1)² + 2"], key:'„Muster entdecken“ d): Welche x-Koordinate hat der Scheitelpunkt von y = (x + 1)² + 2?', a:-1, hint:'Bei (x − d)² ist S(d | e). Achte auf das Vorzeichen: (x + 1)² = (x − (−1))².',
         pred:'In welche Richtung verschiebt sich die Parabel, wenn d größer wird?'},
    e5: {task:"Löse die Klammer auf (1. binomische Formel).", rows:["a) (x + 1)²", "b) (x + 2)²", "c) (x + 3)²", "d) (x + 4)²"], key:'„Muster entdecken“ c): Welche Zahl steht vor dem x, wenn du (x + 3)² auflöst?', a:6, hint:'In der Mitte steht das Doppelte: 2 · 3 · x.',
         pred:'Was passiert mit der Parabel, wenn du nur c veränderst?'},
    e6: {task:"Löse mit der pq-Formel.", rows:["a) x² − 4x + 3 = 0", "b) x² − 4x + 4 = 0", "c) x² − 4x + 5 = 0"], key:'„Muster entdecken“ c): Welche Zahl steht bei x² − 4x + 5 = 0 unter der Wurzel?', a:-1, hint:'Unter der Wurzel: (p/2)² − q = (−2)² − 5.',
         pred:'Was passiert mit den Nullstellen, wenn q immer größer wird?'},
    e7: {task:"Ein Ball fliegt auf der Bahn h(x) = −0,1x² + 0,8x + c. Berechne die maximale Höhe.", rows:["a) c = 0", "b) c = 0,4", "c) c = 1"], key:'„Muster entdecken“ c): Wie hoch fliegt der Ball höchstens, wenn c = 1 ist? (in m)', a:2.6, hint:'x_S = −0,8 : (2 · (−0,1)) = 4. Setze x = 4 in h(x) ein.',
         pred:'Was passiert mit der größten Höhe, wenn die Abwurfhöhe c um 1 steigt?'}
  };
  const TEACH = '1c327408';                 // Prüfsumme des Lehrer-Codes
  const hash = t => { let h = 2166136261; for(const ch of t.trim().toUpperCase()){ h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16); };
  const store = {
    get(k){ try { return localStorage.getItem('qf-xp-' + k); } catch(e){ return null; } },
    set(k, v){ try { localStorage.setItem('qf-xp-' + k, v); } catch(e){} }
  };
  const esc = t => t.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function mount(el){
    const id = el.dataset.exp, g = GATE[id], cfg = CFG[id];
    if(!g || !cfg) return build(el);
    if(store.get('all') === '1' || store.get(id) === 'open') return build(el);
    const pred = store.get(id + '-pred');
    if(store.get(id) === 'key') return askPred(el, id, g, cfg);
    const uid = id + 'g' + Math.random().toString(36).slice(2, 6);
    el.classList.add('xp');
    el.innerHTML = (el.dataset.head === 'no' ? '' : '<div class="xp-head"><span class="xp-tag">Baustein ' + cfg.bs + ' · Entdecken</span><h3>' + cfg.title + '</h3></div>') +
      '<form class="xp-gate"><p class="xp-gate-h">🔒 Erst rechnen, dann entdecken</p>' +
      '<p>Rechne zuerst die Aufgabe „Muster entdecken“. Dein Ergebnis ist der Schlüssel.</p>' +
      '<div class="xp-task"><p class="xp-task-h">Die Aufgabe von deinem Blatt (Baustein ' + cfg.bs + ')</p><p>' + g.task + '</p><ul>' + g.rows.map(r => '<li>' + r + '</li>').join('') + '</ul></div>' +
      '<label for="' + uid + '"><b>' + g.key + '</b></label>' +
      '<div class="xp-gate-row"><input id="' + uid + '" autocomplete="off" inputmode="text" placeholder="Ergebnis"><button class="xbtn xp-go" type="submit">Öffnen</button></div>' +
      '<p class="xp-gate-fb" aria-live="polite"></p></form>';
    const f = el.querySelector('form'), inp = f.querySelector('input'), fb = f.querySelector('.xp-gate-fb');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const raw = inp.value.trim();
      if(hash(raw) === TEACH){ store.set('all', '1'); document.querySelectorAll('[data-exp]').forEach(x => { if(x.querySelector('.xp-gate, .xp-pred')) build(x); }); return; }
      const v = parseFloat(raw.replace(/\s/g, '').replace(/[−–]/g, '-').replace(',', '.'));
      if(raw === '' || isNaN(v)){ fb.textContent = 'Gib dein Ergebnis als Zahl ein.'; return; }
      if(Math.abs(v - g.a) < 1e-6){ store.set(id, 'key'); askPred(el, id, g, cfg); return; }
      fb.innerHTML = '<b>Noch nicht richtig.</b> Tipp: ' + g.hint;
      inp.select();
    });
  }
  function askPred(el, id, g, cfg){
    const uid = id + 'p' + Math.random().toString(36).slice(2, 6);
    el.classList.add('xp');
    el.innerHTML = (el.dataset.head === 'no' ? '' : '<div class="xp-head"><span class="xp-tag">Baustein ' + cfg.bs + ' · Entdecken</span><h3>' + cfg.title + '</h3></div>') +
      '<form class="xp-gate xp-pred"><p class="xp-gate-h">✓ Richtig! Jetzt deine Vermutung</p>' +
      '<p>Bevor du die Regler benutzt: Schreib auf, was du erwartest. Danach prüfst du es.</p>' +
      '<label for="' + uid + '"><b>' + g.pred + '</b></label>' +
      '<textarea id="' + uid + '" rows="3" placeholder="Ich vermute, dass …"></textarea>' +
      '<div class="xp-gate-row"><button class="xbtn xp-go" type="submit">Weiter zum Entdecken</button></div><p class="xp-gate-fb" aria-live="polite"></p></form>';
    const f = el.querySelector('form'), ta = f.querySelector('textarea'), fb = f.querySelector('.xp-gate-fb');
    f.addEventListener('submit', e => {
      e.preventDefault();
      const t = ta.value.trim();
      if(t.split(/\s+/).length < 3){ fb.textContent = 'Schreib einen ganzen Satz – mindestens drei Wörter.'; return; }
      store.set(id + '-pred', t); store.set(id, 'open'); build(el);
    });
  }
  window.EXPL = {mount, build, CFG, hash};
  document.querySelectorAll('[data-exp]').forEach(mount);
})();
