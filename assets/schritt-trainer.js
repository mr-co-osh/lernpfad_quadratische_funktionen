/* Schritt-Trainer der Basis-Blöcke */
if(document.getElementById('stArea')){
  // ---------- Schritt-Trainer (Basis-Blöcke) ----------
  (function(){
    const R = (a,b) => a + Math.floor(Math.random()*(b-a+1));
    const NZ = (a,b) => { let v; do { v = R(a,b); } while(v === 0); return v; };
    const pick = a => a[Math.floor(Math.random()*a.length)];
    const f = v => { v = Math.round(v*10000)/10000; return (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ','); };
    const par = v => v < 0 ? '(' + f(v) + ')' : f(v);
    const sgn = (v,t) => (v < 0 ? ' − ' : ' + ') + (t && Math.abs(v) === 1 ? '' : f(Math.abs(v))) + (t || '');
    const lead = (v,t) => (t && v === 1 ? '' : t && v === -1 ? '−' : f(v)) + (t || '');
    const lin = (a,b) => lead(a,'x') + (b ? sgn(b) : '');
    const poly = (a,b,c) => lead(a,'x²') + (b ? sgn(b,'x') : '') + (c ? sgn(c) : '');
    const r2 = v => Math.round(v*100)/100;
    const FR = (a,b) => '<span class="fr"><span>' + a + '</span><span>' + b + '</span></span>';
    const SH = {cx:v=>lead(v,'x'), cx2:v=>lead(v,'x²'), sx:v=>sgn(v,'x'), s:v=>sgn(v), n:v=>f(v)};
    const PRE = {cx:'', cx2:'', sx:' ', s:' ', n:''}, POST = {cx:'x', cx2:'x²', sx:'x', s:'', n:''};
    const S = (a,fm,q,hh,tol) => ({slot:true, a, f:fm, q, h:hh, tol:tol || 1e-6});
    const row = (l,o,r,n) => ({l:[].concat(l), o:o || '=', r:[].concat(r), n:n || ''});
    const VZ = 'Vorzeichenregel: Plus mal Minus = Minus, Minus mal Minus = Plus.';

    const GEN = {
      zk(){
        const b = NZ(-9,9);
        if(Math.random() < 0.3){
          const k = NZ(-4,4), K = lead(k,'x');
          return {t: K + '(x' + sgn(b) + ')', rows:[
            row('', '=', K + ' · x + ' + (k < 0 ? '(' + K + ')' : K) + ' · ' + par(b), 'jeden Teil malnehmen'),
            row('', '=', [S(k,'cx2','Rechne ' + K + ' · x. Welche Zahl steht vor x²?','x · x = x². Die Zahl vor dem x bleibt stehen.'),
                          S(k*b,'sx','Rechne ' + K + ' · ' + par(b) + '. Welche Zahl steht vor x (mit Vorzeichen)?', VZ)], 'ausrechnen')],
            fin: poly(k, k*b, 0)};
        }
        let a; do { a = NZ(-8,8); } while(a === 1);
        const c = pick([1,1,2,3]), A = a === -1 ? '−' : f(a);
        return {t: A + '(' + lin(c,b) + ')', rows:[
          row('', '=', par(a) + ' · ' + lead(c,'x') + ' + ' + par(a) + ' · ' + par(b), 'jeden Teil malnehmen'),
          row('', '=', [S(a*c,'cx','Rechne ' + par(a) + ' · ' + lead(c,'x') + '. Welche Zahl steht vor x?', VZ),
                        S(a*b,'s','Rechne ' + par(a) + ' · ' + par(b) + '. Gib die Zahl mit Vorzeichen ein.', VZ)], 'ausrechnen')],
          fin: lin(a*c, a*b)};
      },
      kk(){
        let a, b; do { a = NZ(-9,9); b = NZ(-9,9); } while(a + b === 0);
        return {t:'(x' + sgn(a) + ')(x' + sgn(b) + ')', rows:[
          row('', '=', 'x · x + x · ' + par(b) + ' + ' + par(a) + ' · x + ' + par(a) + ' · ' + par(b), 'jeder mit jedem'),
          row('', '=', ['x²', S(b,'sx','Rechne x · ' + par(b) + '. Welche Zahl steht vor x?','Die Zahl bleibt, x kommt dazu.'),
                        S(a,'sx','Rechne ' + par(a) + ' · x. Welche Zahl steht vor x?','Die Zahl bleibt, x kommt dazu.'),
                        S(a*b,'s','Rechne ' + par(a) + ' · ' + par(b) + '.', VZ)], 'ausrechnen'),
          row('', '=', ['x²', S(a+b,'sx','Fasse die x-Glieder zusammen: ' + lead(b,'x') + sgn(a,'x') + ' = ?x', 'Rechne ' + f(b) + sgn(a) + '.'), sgn(a*b)], 'zusammenfassen')],
          fin: poly(1, a+b, a*b)};
      },
      bin(){
        const k = pick([1,1,2,2,3,4]), a = R(1,10);
        if(k === 1) return {t:'(x + ' + a + ')²', rows:[
          row('', '=', 'x² + 2 · x · ' + a + ' + ' + a + '²', '1. binomische Formel'),
          row('', '=', ['x²', S(2*a,'sx','Mittelglied: 2 · x · ' + a + ' = ?x','Das Doppelte: 2 · ' + a + '.'), S(a*a,'s','Letztes Glied: ' + a + '² = ?', a + ' · ' + a + ' – nicht 2 · ' + a + '!')], 'ausrechnen')],
          fin: poly(1, 2*a, a*a)};
        if(k === 2) return {t:'(x − ' + a + ')²', rows:[
          row('', '=', 'x² − 2 · x · ' + a + ' + ' + a + '²', '2. binomische Formel'),
          row('', '=', ['x²', S(-2*a,'sx','Mittelglied: −2 · x · ' + a + ' = ?x (mit Vorzeichen)','Das Doppelte von ' + a + ', mit Minus.'), S(a*a,'s','Letztes Glied: ' + a + '² = ?','Ein Quadrat ist nie negativ: (−' + a + ') · (−' + a + ') = +' + (a*a) + '.')], 'ausrechnen')],
          fin: poly(1, -2*a, a*a)};
        if(k === 3) return {t:'(x + ' + a + ')(x − ' + a + ')', rows:[
          row('', '=', 'x² − ' + a + '²', '3. binomische Formel: kein Mittelglied'),
          row('', '=', ['x²', S(-a*a,'s','Rechne −' + a + '². Gib die Zahl mit Vorzeichen ein.','Erst ' + a + ' · ' + a + ', dann das Minus davor.')], 'ausrechnen')],
          fin: poly(1, 0, -a*a)};
        const c = pick([2,3]), m = pick([1,-1]), A = Math.min(a,6);
        return {t:'(' + c + 'x' + sgn(m*A) + ')²', rows:[
          row('', '=', '(' + c + 'x)²' + (m > 0 ? ' + ' : ' − ') + '2 · ' + c + 'x · ' + A + ' + ' + A + '²', (m > 0 ? '1.' : '2.') + ' binomische Formel'),
          row('', '=', [S(c*c,'cx2','Rechne (' + c + 'x)². Welche Zahl steht vor x²?','(' + c + 'x)² = ' + c + 'x · ' + c + 'x. Auch die ' + c + ' wird quadriert!'),
                        S(m*2*c*A,'sx','Mittelglied: 2 · ' + c + 'x · ' + A + ' = ?x (mit Vorzeichen)','2 · ' + c + ' · ' + A + ' – und das Vorzeichen aus der Klammer.'),
                        S(A*A,'s','Letztes Glied: ' + A + '² = ?', A + ' · ' + A + '.')], 'ausrechnen')],
          fin: poly(c*c, m*2*c*A, A*A)};
      },
      gl(){
        const op = v => (v > 0 ? '− ' : '+ ') + f(Math.abs(v));
        if(Math.random() < 0.5){
          const x = R(-9,9), b = NZ(-15,15); let a; do { a = NZ(-9,9); } while(Math.abs(a) === 1);
          const c = a*x + b;
          return {t: lin(a,b) + ' = ' + f(c), rows:[
            row(lin(a,b), '=', f(c), '| ' + op(b)),
            row(lead(a,'x'), '=', S(c-b,'n','Rechne auf beiden Seiten ' + op(b) + '. Was steht rechts?', f(c) + ' ' + op(b) + ' = ?'), '| : ' + par(a)),
            row('x', '=', S(x,'n','Teile durch ' + par(a) + '.', f(c-b) + ' : ' + par(a) + ' = ?  Minus durch Minus = Plus.'))],
            fin: 'x = ' + f(x)};
        }
        const x = R(-8,8), c = NZ(-6,6), g = pick([2,3,4,5,-2,-3]), a = c + g, b = NZ(-12,12);
        if(a === 0) return GEN.gl();
        const d = a*x + b - c*x;
        return {t: lin(a,b) + ' = ' + lin(c,d), rows:[
          row(lin(a,b), '=', lin(c,d), '| ' + (c > 0 ? '− ' : '+ ') + lead(Math.abs(c),'x')),
          row([S(g,'cx','Bringe die x-Glieder nach links: ' + lead(a,'x') + (c > 0 ? ' − ' : ' + ') + lead(Math.abs(c),'x') + ' = ?x','Rechne ' + f(a) + (c > 0 ? ' − ' : ' + ') + f(Math.abs(c)) + '.'), sgn(b)], '=', f(d), '| ' + op(b)),
          row(lead(g,'x'), '=', S(d-b,'n','Rechne auf beiden Seiten ' + op(b) + '.', f(d) + ' ' + op(b) + ' = ?'), '| : ' + par(g)),
          row('x', '=', S(x,'n','Teile durch ' + par(g) + '.', f(d-b) + ' : ' + par(g) + ' = ?'))],
          fin: 'x = ' + f(x)};
      },
      sf(){
        const k = pick(['q','q0','aus']);
        if(k !== 'aus'){
          const n = pick([2,3,4,5,6,7,8,9,10,11,12,13,15,1.5,2.5,4.5]), q = n*n;
          const fin = [S(n,'n','Ziehe die Wurzel. Wie heißt die positive Lösung?','Welche Zahl mal sich selbst ergibt ' + f(q) + '?'), '  oder  x = ',
                       S(-n,'n','Es gibt noch eine zweite Lösung. Welche?','Auch (−' + f(n) + ')² = ' + f(q) + '.')];
          if(k === 'q') return {t:'x² = ' + f(q), rows:[row('x²', '=', f(q), '| √'), row('x', '=', fin)], fin:'x = ' + f(n) + '  oder  x = ' + f(-n)};
          return {t:'x² − ' + f(q) + ' = 0', rows:[row('x² − ' + f(q), '=', '0', '| + ' + f(q)),
            row('x²', '=', S(q,'n','Bringe die Zahl auf die rechte Seite.','Rechne auf beiden Seiten + ' + f(q) + '.'), '| √'), row('x', '=', fin)],
            fin:'x = ' + f(n) + '  oder  x = ' + f(-n)};
        }
        const a = pick([1,1,2,3]), r = NZ(-9,9), b = -a*r;
        return {t: poly(a,b,0) + ' = 0', rows:[
          row(poly(a,b,0), '=', '0', 'x ausklammern'),
          row(['x(' + lead(a,'x'), S(b,'s','Klammere x aus. Welche Zahl steht in der Klammer hinter ' + lead(a,'x') + '?','Teile jedes Glied durch x: ' + lead(a,'x²') + ' : x = ' + lead(a,'x') + ' und ' + lead(b,'x') + ' : x = ?'), ')'], '=', '0', 'ein Faktor muss 0 sein'),
          row('x', '=', ['0  oder  x = ', S(r,'n','Löse ' + lin(a,b) + ' = 0.','Rechne ' + op2(b) + ' und dann : ' + par(a) + '.')])],
          fin:'x = 0  oder  x = ' + f(r)};
        function op2(v){ return (v > 0 ? '− ' : '+ ') + f(Math.abs(v)); }
      },
      pq(){
        let x1, x2;
        do { x1 = NZ(-8,8); x2 = Math.random() < 0.15 ? x1 : NZ(-8,8); } while(((x1 + x2) % 2) || x1 + x2 === 0);
        if(x1 > x2) [x1, x2] = [x2, x1];
        const A = pick([1,1,1,-1,2]), p = -(x1+x2), q = x1*x2, hh = -p/2, D = hh*hh - q, w = Math.sqrt(D);
        const rows = [];
        if(A !== 1){
          rows.push(row(poly(A,A*p,A*q), '=', '0', '| : ' + par(A)));
          rows.push(row(['x²', S(p,'sx','Teile durch ' + par(A) + '. Welche Zahl steht jetzt vor x? (Das ist p.)','Rechne ' + f(A*p) + ' : ' + par(A) + '.'),
                         S(q,'s','Und die Zahl ohne x? (Das ist q.)','Rechne ' + f(A*q) + ' : ' + par(A) + '.')], '=', '0', 'Normalform: p und q ablesen'));
        } else {
          rows.push(row(poly(1,p,q), '=', '0', 'p und q ablesen'));
          rows.push(row('p', '=', S(p,'n','Lies p ab: die Zahl vor x, mit Vorzeichen.','Bei x² ' + (p < 0 ? '−' : '+') + ' ' + Math.abs(p) + 'x ist p = ' + (p < 0 ? '−' : '') + '…')));
          rows.push(row('q', '=', S(q,'n','Lies q ab: die Zahl ohne x, mit Vorzeichen.','Das Vorzeichen gehört dazu.')));
        }
        rows.push(row('x', '=', [S(hh,'n','Berechne −' + FR('p','2') + ' = −(' + f(p) + ') : 2.','Das Vorzeichen von p dreht sich um.'), ' ± <span class="rt">√</span><span class="rad">',
                                 S(D,'n','Berechne, was unter der Wurzel steht: (' + FR('p','2') + ')² − q = ' + par(p/2) + '² − ' + par(q) + '.','Erst ' + par(p/2) + '² = ' + f(p*p/4) + ', dann − ' + par(q) + '.'), '</span>']));
        rows.push(row('', '=', [f(hh) + ' ± ', S(w,'n','Ziehe die Wurzel aus ' + f(D) + '.','Welche Zahl mal sich selbst ergibt ' + f(D) + '?')]));
        if(D > 0){
          rows.push(row('x₁', '=', S(x1,'n','Rechne x₁ = ' + f(hh) + ' − ' + f(w) + '.','Minus-Rechnung zuerst.')));
          rows.push(row('x₂', '=', S(x2,'n','Rechne x₂ = ' + f(hh) + ' + ' + f(w) + '.','Plus-Rechnung.')));
        } else rows.push(row('x', '=', f(hh), 'unter der Wurzel 0: nur eine Lösung'));
        return {t: poly(A,A*p,A*q) + ' = 0', rows, fin: D > 0 ? 'x₁ = ' + f(x1) + ',  x₂ = ' + f(x2) : 'x = ' + f(hh)};
      },
      fw(){
        const a = pick([-0.05,-0.08,-0.12,-0.2,-0.25,-0.4,-0.6]), b = pick([0.5,0.8,1.2,1.6,2.4,2.5]), c = pick([0.4,1.5,2,2.3,1.8]), x = pick([1.5,2.5,3,3.5,4.2,5,6.5]);
        const t1 = a*x*x, t2 = b*x, y = t1 + t2 + c;
        return {t:'f(x) = ' + f(a) + 'x² + ' + f(b) + 'x + ' + f(c) + '.  Berechne f(' + f(x) + ').', rows:[
          row('f(' + f(x) + ')', '=', f(a) + ' · ' + f(x) + '² + ' + f(b) + ' · ' + f(x) + ' + ' + f(c), 'einsetzen'),
          row('', '=', [S(t1,'n','Rechne ' + f(a) + ' · ' + f(x) + '². (Erst ' + f(x) + '², dann mal ' + f(a) + '.)','Tippe ' + f(x) + '² = ' + f(x*x) + ' und dann · ' + par(a) + '. Das Ergebnis ist negativ.',0.0051),
                        ' + ', S(t2,'n','Rechne ' + f(b) + ' · ' + f(x) + '.','Taschenrechner: ' + f(b) + ' · ' + f(x) + '.',0.0051), ' + ' + f(c)], 'nicht zwischendurch runden'),
          row('', '≈', S(r2(y),'n','Addiere alles und runde auf 2 Nachkommastellen.','Rechne ' + f(r2(t1)) + ' + ' + f(r2(t2)) + ' + ' + f(c) + '.',0.0151), 'auf 2 Stellen')],
          fin:'f(' + f(x) + ') ≈ ' + f(r2(y))};
      }
    };

    let type = 'zk', task = null, slots = [], idx = 0, tries = 0, helped = false, ok = 0, all = 0;
    const area = document.getElementById('stArea'), q = document.getElementById('stQ'), fb = document.getElementById('stFb');
    const show = document.getElementById('stShow'), form = document.getElementById('stForm');
    function part(p){
      if(!p.slot) return p;
      const i = slots.indexOf(p);
      if(i < idx) return '<span class="st-done">' + SH[p.f](p.a) + '</span>';
      if(i === idx) return PRE[p.f] + '<input class="st-in" id="stIn" inputmode="decimal" autocomplete="off" aria-label="Antwort">' + POST[p.f];
      return PRE[p.f] + '<span class="st-slot">?</span>' + POST[p.f];
    }
    function render(){
      const cur = idx < slots.length ? slots[idx] : null;
      let last = task.rows.length - 1;
      if(cur) last = task.rows.findIndex(r => r.l.includes(cur) || r.r.includes(cur));
      let h = '<div class="eqg">';
      task.rows.slice(0, last + 1).forEach(r => {
        h += '<span class="eqlab"></span><span class="eql">' + r.l.map(part).join('') + '</span><span class="eqo">' + r.o + '</span><span class="eqr">' + r.r.map(part).join('') + '</span><span class="eqn">' + r.n + '</span>';
      });
      h += '</div>';
      if(!cur) h += '<p class="st-fin">Ergebnis: ' + task.fin + '</p>';
      area.innerHTML = h;
      form.querySelectorAll('button[type="submit"], #stHint').forEach(b => b.hidden = !cur);
      show.hidden = !cur || tries < 2;
      q.innerHTML = cur ? '<b>Schritt ' + (idx + 1) + ' von ' + slots.length + ':</b> ' + cur.q : '';
      const inp = document.getElementById('stIn'); if(inp) inp.focus({preventScroll:true});
    }
    function fresh(){
      task = GEN[type]();
      if(task.rows[0].l.length === 1 && task.rows[0].l[0] === '') task.rows[0].l = [task.t];
      slots = []; task.rows.forEach(r => r.l.concat(r.r).forEach(p => { if(p.slot) slots.push(p); }));
      idx = 0; tries = 0; helped = false; fb.hidden = true;
      document.getElementById('stTask').textContent = (type === 'fw' ? '' : (type === 'gl' || type === 'sf' || type === 'pq' ? 'Löse: ' : 'Löse die Klammer auf: ')) + task.t;
      render();
    }
    function next(){
      idx++; tries = 0;
      if(idx >= slots.length){
        all++; if(!helped) ok++;
        document.getElementById('stScore').textContent = 'Ohne Hilfe gelöst: ' + ok + ' von ' + all;
        fb.hidden = false; fb.className = 'fb ok'; fb.innerHTML = helped ? 'Fertig! Rechne die Aufgabe jetzt noch einmal allein im Heft.' : 'Super, alles richtig! Klick auf „Neue Aufgabe“.';
      } else { fb.hidden = false; fb.className = 'fb ok'; fb.textContent = '✓ Richtig! Weiter mit dem nächsten Schritt.'; }
      render();
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inp = document.getElementById('stIn'); if(!inp) return;
      const raw = inp.value.trim().replace(/\s/g,'').replace(/−|–/g,'-').replace(',', '.');
      const v = parseFloat(raw);
      if(raw === '' || isNaN(v)){ fb.hidden = false; fb.className = 'fb'; fb.textContent = 'Bitte eine Zahl eingeben.'; return; }
      const s = slots[idx];
      if(Math.abs(v - s.a) <= s.tol) return next();
      tries++;
      fb.hidden = false; fb.className = 'fb'; fb.innerHTML = '✗ Noch nicht. <b>Tipp:</b> ' + s.h;
      show.hidden = tries < 2;
      inp.select();
    });
    document.getElementById('stHint').addEventListener('click', () => { const s = slots[idx]; if(!s) return; helped = true; fb.hidden = false; fb.className = 'fb'; fb.innerHTML = '<b>Tipp:</b> ' + s.h; });
    show.addEventListener('click', () => { helped = true; const s = slots[idx]; next(); fb.className = 'fb'; fb.innerHTML = 'Lösung: <b>' + SH[s.f](s.a).trim() + '</b>. Weiter geht es mit dem nächsten Schritt.'; });
    area.addEventListener('keydown', e => { if(e.key === 'Enter' && e.target.id === 'stIn'){ e.preventDefault(); form.requestSubmit(); } });
    document.getElementById('stNew').addEventListener('click', fresh);
    function setType(t){
      type = t;
      document.querySelectorAll('#stTabs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.st === t ? 'true' : 'false'));
      fresh();
    }
    document.querySelectorAll('#stTabs button').forEach(b => b.addEventListener('click', () => setType(b.dataset.st)));
    document.addEventListener('click', e => { const a = e.target.closest('a[data-st]'); if(a) setTimeout(() => setType(a.dataset.st), 0); });
    window.bbTrainer = {GEN, setType};
    fresh();
  })();
}
