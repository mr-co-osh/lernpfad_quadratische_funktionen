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
          'Stelle e = 2 ein. Vergleiche mit der grauen Normalparabel und mit den Quadratzahlen 0, 1, 4, 9: Um wie viel ist jeder y-Wert in der Tabelle größer?',
          'Plättchenmuster: Figur n hat n² + 2 Plättchen (blaues Quadrat und 2 grüne Plättchen).<svg viewBox="0 0 202 70" width="202" height="70" role="img" aria-label="Plättchenmuster Figur 1 bis 3" style="display:block;margin:6px 0"><g stroke-width="1.2"><rect x="4" y="43" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="17" y="43" width="13" height="13" fill="var(--green-soft)" stroke="var(--green)"/><rect x="4" y="30" width="13" height="13" fill="var(--green-soft)" stroke="var(--green)"/><text x="17.0" y="68" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">Figur 1</text><rect x="57" y="43" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="57" y="30" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="70" y="43" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="70" y="30" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="83" y="30" width="13" height="13" fill="var(--green-soft)" stroke="var(--green)"/><rect x="70" y="17" width="13" height="13" fill="var(--green-soft)" stroke="var(--green)"/><text x="76.5" y="68" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">Figur 2</text><rect x="123" y="43" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="123" y="30" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="123" y="17" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="136" y="43" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="136" y="30" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="136" y="17" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="149" y="43" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="149" y="30" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="149" y="17" width="13" height="13" fill="var(--blue-soft)" stroke="var(--blue)"/><rect x="162" y="17" width="13" height="13" fill="var(--green-soft)" stroke="var(--green)"/><rect x="149" y="4" width="13" height="13" fill="var(--green-soft)" stroke="var(--green)"/><text x="149.0" y="68" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">Figur 3</text></g></svg>Welches e passt dazu? Stelle es ein und prüfe die Anzahlen 3, 6, 11 in der Tabelle.'] },

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
    e2: {task:"Berechne die y-Werte und ihre Abstände (Differenzen).", rows:["y = x²:   1² = …   2² = …   3² = …   4² = …   5² = …   Differenzen: …", "y = x² + 2:   1² + 2 = …   2² + 2 = …   3² + 2 = …   4² + 2 = …   5² + 2 = …   Differenzen: …"], key:'„Muster entdecken“: Welchen y-Wert hat y = x² + 2 bei x = 3?', a:11, hint:'Erst 3² = 9, dann + 2.',
         pred:'Wohin wandert der Scheitelpunkt, wenn e größer wird? Und wohin, wenn e negativ wird?', predFig:"<div class=\"xp-predfig\" style=\"display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin:8px 0 12px;padding:10px;border:1px solid var(--line);border-radius:var(--r);background:var(--paper)\"><svg viewBox=\"0 0 272 265\" width=\"272\" height=\"265\" style=\"max-width:100%;height:auto;flex:0 0 auto\" role=\"img\" aria-label=\"Normalparabel gestrichelt und um 2 nach oben verschobene Parabel y = x² + 2 mit Scheitelpunkt S(0|2)\"><line x1=\"13.6\" y1=\"0\" x2=\"13.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"47.6\" y1=\"0\" x2=\"47.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"81.6\" y1=\"0\" x2=\"81.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"115.6\" y1=\"0\" x2=\"115.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"149.6\" y1=\"0\" x2=\"149.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"183.6\" y1=\"0\" x2=\"183.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"217.6\" y1=\"0\" x2=\"217.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"251.6\" y1=\"0\" x2=\"251.6\" y2=\"265.2\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"258.4\" x2=\"272.0\" y2=\"258.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"224.4\" x2=\"272.0\" y2=\"224.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"190.4\" x2=\"272.0\" y2=\"190.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"156.4\" x2=\"272.0\" y2=\"156.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"122.4\" x2=\"272.0\" y2=\"122.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"88.4\" x2=\"272.0\" y2=\"88.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"54.4\" x2=\"272.0\" y2=\"54.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"20.4\" x2=\"272.0\" y2=\"20.4\" stroke=\"var(--grid)\" stroke-width=\"1\"/><line x1=\"0\" y1=\"224.4\" x2=\"272.0\" y2=\"224.4\" stroke=\"currentColor\" stroke-width=\"1.3\"/><line x1=\"115.6\" y1=\"265.2\" x2=\"115.6\" y2=\"0\" stroke=\"currentColor\" stroke-width=\"1.3\"/><text x=\"264.0\" y=\"218.4\" font-size=\"13\" text-anchor=\"end\" fill=\"currentColor\">x</text><text x=\"121.6\" y=\"13\" font-size=\"13\" fill=\"currentColor\">y</text><text x=\"110.6\" y=\"194.4\" font-size=\"11\" text-anchor=\"end\" fill=\"var(--muted)\">1</text><text x=\"110.6\" y=\"160.4\" font-size=\"11\" text-anchor=\"end\" fill=\"var(--muted)\">2</text><text x=\"110.6\" y=\"126.4\" font-size=\"11\" text-anchor=\"end\" fill=\"var(--muted)\">3</text><text x=\"110.6\" y=\"92.4\" font-size=\"11\" text-anchor=\"end\" fill=\"var(--muted)\">4</text><text x=\"110.6\" y=\"58.4\" font-size=\"11\" text-anchor=\"end\" fill=\"var(--muted)\">5</text><text x=\"110.6\" y=\"24.4\" font-size=\"11\" text-anchor=\"end\" fill=\"var(--muted)\">6</text><polyline points=\"28.9,3.3 30.6,11.9 32.3,20.3 34.0,28.6 35.7,36.6 37.4,44.5 39.1,52.3 40.8,59.8 42.5,67.2 44.2,74.5 45.9,81.5 47.6,88.4 49.3,95.1 51.0,101.7 52.7,108.0 54.4,114.2 56.1,120.3 57.8,126.1 59.5,131.8 61.2,137.4 62.9,142.7 64.6,147.9 66.3,152.9 68.0,157.8 69.7,162.4 71.4,166.9 73.1,171.3 74.8,175.4 76.5,179.4 78.2,183.3 79.9,186.9 81.6,190.4 83.3,193.7 85.0,196.9 86.7,199.8 88.4,202.6 90.1,205.3 91.8,207.7 93.5,210.0 95.2,212.2 96.9,214.1 98.6,215.9 100.3,217.5 102.0,219.0 103.7,220.2 105.4,221.3 107.1,222.3 108.8,223.0 110.5,223.6 112.2,224.1 113.9,224.3 115.6,224.4 117.3,224.3 119.0,224.1 120.7,223.6 122.4,223.0 124.1,222.3 125.8,221.3 127.5,220.2 129.2,219.0 130.9,217.5 132.6,215.9 134.3,214.1 136.0,212.2 137.7,210.0 139.4,207.7 141.1,205.3 142.8,202.6 144.5,199.8 146.2,196.9 147.9,193.7 149.6,190.4 151.3,186.9 153.0,183.3 154.7,179.4 156.4,175.4 158.1,171.3 159.8,166.9 161.5,162.4 163.2,157.8 164.9,152.9 166.6,147.9 168.3,142.7 170.0,137.4 171.7,131.8 173.4,126.1 175.1,120.3 176.8,114.2 178.5,108.0 180.2,101.7 181.9,95.1 183.6,88.4 185.3,81.5 187.0,74.5 188.7,67.2 190.4,59.8 192.1,52.3 193.8,44.5 195.5,36.6 197.2,28.6 198.9,20.3 200.6,11.9 202.3,3.3\" fill=\"none\" stroke=\"var(--muted)\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><polyline points=\"44.2,6.5 45.9,13.5 47.6,20.4 49.3,27.1 51.0,33.7 52.7,40.0 54.4,46.2 56.1,52.3 57.8,58.1 59.5,63.8 61.2,69.4 62.9,74.7 64.6,79.9 66.3,84.9 68.0,89.8 69.7,94.4 71.4,98.9 73.1,103.3 74.8,107.4 76.5,111.4 78.2,115.3 79.9,118.9 81.6,122.4 83.3,125.7 85.0,128.9 86.7,131.8 88.4,134.6 90.1,137.3 91.8,139.7 93.5,142.0 95.2,144.2 96.9,146.1 98.6,147.9 100.3,149.5 102.0,151.0 103.7,152.2 105.4,153.3 107.1,154.3 108.8,155.0 110.5,155.6 112.2,156.1 113.9,156.3 115.6,156.4 117.3,156.3 119.0,156.1 120.7,155.6 122.4,155.0 124.1,154.3 125.8,153.3 127.5,152.2 129.2,151.0 130.9,149.5 132.6,147.9 134.3,146.1 136.0,144.2 137.7,142.0 139.4,139.7 141.1,137.3 142.8,134.6 144.5,131.8 146.2,128.9 147.9,125.7 149.6,122.4 151.3,118.9 153.0,115.3 154.7,111.4 156.4,107.4 158.1,103.3 159.8,98.9 161.5,94.4 163.2,89.8 164.9,84.9 166.6,79.9 168.3,74.7 170.0,69.4 171.7,63.8 173.4,58.1 175.1,52.3 176.8,46.2 178.5,40.0 180.2,33.7 181.9,27.1 183.6,20.4 185.3,13.5 187.0,6.5\" fill=\"none\" stroke=\"var(--blue)\" stroke-width=\"3\"/><line x1=\"102.0\" y1=\"224.4\" x2=\"102.0\" y2=\"164.4\" stroke=\"var(--orange)\" stroke-width=\"2.6\"/><polygon points=\"96.0,165.4 108.0,165.4 102.0,156.4\" fill=\"var(--orange)\"/><line x1=\"166.6\" y1=\"147.9\" x2=\"166.6\" y2=\"87.9\" stroke=\"var(--orange)\" stroke-width=\"2.6\"/><polygon points=\"160.6,88.9 172.6,88.9 166.6,79.9\" fill=\"var(--orange)\"/><line x1=\"64.6\" y1=\"147.9\" x2=\"64.6\" y2=\"87.9\" stroke=\"var(--orange)\" stroke-width=\"2.6\"/><polygon points=\"58.6,88.9 70.6,88.9 64.6,79.9\" fill=\"var(--orange)\"/><text x=\"95.2\" y=\"195.4\" font-size=\"15\" font-weight=\"700\" text-anchor=\"end\" fill=\"var(--orange)\" stroke=\"var(--paper)\" stroke-width=\"4\" paint-order=\"stroke\">e = 2</text><circle cx=\"115.6\" cy=\"224.4\" r=\"4.5\" fill=\"var(--muted)\"/><circle cx=\"115.6\" cy=\"156.4\" r=\"6.5\" fill=\"var(--red)\" stroke=\"var(--paper)\" stroke-width=\"1.5\"/><text x=\"126.6\" y=\"175.4\" font-size=\"15\" font-weight=\"700\" fill=\"var(--red)\" stroke=\"var(--paper)\" stroke-width=\"4\" paint-order=\"stroke\">S(0 | 2)</text><text x=\"190.4\" y=\"30.6\" font-size=\"14\" font-weight=\"700\" fill=\"var(--blue)\" stroke=\"var(--paper)\" stroke-width=\"4\" paint-order=\"stroke\">y = x² + 2</text><text x=\"183.6\" y=\"125.8\" font-size=\"13\" fill=\"var(--muted)\" stroke=\"var(--paper)\" stroke-width=\"4\" paint-order=\"stroke\">y = x²</text></svg><div style=\"flex:1 1 220px;min-width:200px\"><p style=\"margin:0 0 8px\"><b style=\"color:var(--red)\">Scheitelpunkt S:</b> der <b>tiefste Punkt</b> der Parabel (bei einer nach unten geöffneten Parabel der höchste). Dort dreht die Parabel um. Bei y = x² ist das S(0 | 0).</p><p style=\"margin:0 0 8px\"><b style=\"color:var(--orange)\">e</b> ist die Zahl, die zu x² addiert wird: <b>y = x² + e</b>. Jeder Punkt der Normalparabel rutscht um e nach oben (e &gt; 0) oder nach unten (e &lt; 0).</p><p style=\"margin:0\">Im Bild ist e = 2: Der Scheitelpunkt wandert von S(0 | 0) nach <b>S(0 | 2)</b>.</p></div></div>"},
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
      (g.predFig || '') +
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
