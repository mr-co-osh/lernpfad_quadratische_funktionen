/* Lernpfad quadratische Funktionen – Zeichnen, Labor, Trainer, Ich-kann-Liste, Startklar, Glossar, Ansicht */
(function(){
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const fmt = (v, d=2) => { const r = Math.round(v * 10**d) / 10**d; return (Object.is(r,-0)?0:r).toString().replace('.', ',').replace('-', '−'); };
  const num = s => parseFloat(String(s).trim().replace(',', '.').replace('−','-'));

  // ---------- Zeichnen ----------
  function plot(cv, fns, opt){
    const ctx = cv.getContext('2d'); const W = cv.width, H = cv.height;
    const {xmin, xmax, ymin, ymax} = opt;
    const X = x => (x - xmin) / (xmax - xmin) * W, Y = y => H - (y - ymin) / (ymax - ymin) * H;
    ctx.clearRect(0,0,W,H); ctx.fillStyle = css('--paper'); ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = css('--grid'); ctx.lineWidth = 1;
    for(let x=Math.ceil(xmin); x<=xmax; x++){ ctx.beginPath(); ctx.moveTo(X(x),0); ctx.lineTo(X(x),H); ctx.stroke(); }
    for(let y=Math.ceil(ymin); y<=ymax; y++){ ctx.beginPath(); ctx.moveTo(0,Y(y)); ctx.lineTo(W,Y(y)); ctx.stroke(); }
    ctx.strokeStyle = css('--fg'); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0,Y(0)); ctx.lineTo(W,Y(0)); ctx.moveTo(X(0),0); ctx.lineTo(X(0),H); ctx.stroke();
    ctx.fillStyle = css('--muted'); ctx.font = '12px ' + css('--f-mono');
    ctx.textAlign = 'center';
    for(let x=Math.ceil(xmin); x<=xmax; x++){ if(x!==0 && x%2===0) ctx.fillText(String(x).replace('-','−'), X(x), Y(0)+15); }
    ctx.textAlign = 'right';
    for(let y=Math.ceil(ymin); y<=ymax; y++){ if(y!==0 && y%2===0) ctx.fillText(String(y).replace('-','−'), X(0)-5, Y(y)+4); }
    fns.forEach(f => {
      ctx.strokeStyle = f.color; ctx.lineWidth = f.w || 3; ctx.setLineDash(f.dash || []);
      ctx.beginPath(); let started = false;
      for(let i=0;i<=600;i++){ const x = xmin + (xmax-xmin)*i/600, y = f.f(x);
        if(y < ymin-5 || y > ymax+5){ started=false; continue; }
        if(!started){ ctx.moveTo(X(x),Y(y)); started=true; } else ctx.lineTo(X(x),Y(y)); }
      ctx.stroke(); ctx.setLineDash([]);
    });
    (opt.points||[]).forEach(p => { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(X(p.x),Y(p.y),6,0,7); ctx.fill();
      if(p.label){ ctx.font = '600 14px ' + css('--f-mono'); ctx.textAlign='left'; ctx.fillText(p.label, X(p.x)+9, Y(p.y)+ (p.below?18:-9)); } });
  }

  function drawHero(){
    if(!document.getElementById('heroCanvas')) return;
    plot(document.getElementById('heroCanvas'), [
      {f:x=>x*x, color:css('--muted'), w:2, dash:[6,5]},
      {f:x=>(x-2)**2-3, color:css('--blue')}
    ], {xmin:-4.5, xmax:6.5, ymin:-4.5, ymax:6.5, points:[{x:2,y:-3,color:css('--red'),label:'S(2|−3)',below:true}]});
  }

  // ---------- Labor ----------
  const sa = document.getElementById('sa'), sd = document.getElementById('sd'), se = document.getElementById('se');
  function sgnTerm(v, s){ return v===0 ? '' : (v>0?' + ':' − ') + fmt(Math.abs(v)) + s; }
  function spfText(a,d,e){
    const inner = d===0 ? 'x' : (d>0 ? '(x − ' + fmt(d) + ')' : '(x + ' + fmt(-d) + ')');
    const sq = d===0 ? 'x²' : inner + '²';
    const pre = a===1 ? '' : a===-1 ? '−' : fmt(a);
    return 'f(x) = ' + pre + sq + sgnTerm(e,'');
  }
  function nfText(a,b,c){
    let s = 'f(x) = ' + (a===1?'':a===-1?'−':fmt(a)) + 'x²';
    if(b!==0) s += (b>0?' + ':' − ') + (Math.abs(b)===1?'':fmt(Math.abs(b))) + 'x';
    if(c!==0) s += (c>0?' + ':' − ') + fmt(Math.abs(c));
    return s;
  }
  if(document.getElementById('sa')){
  function lab(){
    let a = num(sa.value); if(a===0){ a = 0.1; }
    const d = num(sd.value), e = num(se.value);
    document.getElementById('oa').textContent = fmt(a); document.getElementById('od').textContent = fmt(d); document.getElementById('oe').textContent = fmt(e);
    const b = -2*a*d, c = a*d*d + e;
    document.getElementById('rSpf').textContent = spfText(a,d,e);
    document.getElementById('rNf').textContent = nfText(a,b,c);
    document.getElementById('rS').textContent = 'S(' + fmt(d) + '|' + fmt(e) + ')';
    const form = (a>0?'nach oben geöffnet':'nach unten geöffnet') + ', ' + (Math.abs(a)>1?'gestreckt':Math.abs(a)<1?'gestaucht':'wie die Normalparabel');
    document.getElementById('rForm').textContent = form;
    const r = -e/a; let roots = [];
    if(r>1e-9){ roots=[d-Math.sqrt(r), d+Math.sqrt(r)]; } else if(Math.abs(r)<1e-9){ roots=[d]; }
    document.getElementById('rN').textContent = roots.length ? roots.map(v=>'x = '+fmt(v)).join(';  ') : 'keine';
    const xs = [-3,-2,-1,0,1,2,3].map(k=>d+k);
    document.getElementById('rTab').innerHTML = '<tr><th>x</th>' + xs.map(x=>'<td class="c">'+fmt(x)+'</td>').join('') + '</tr><tr><th>f(x)</th>' + xs.map(x=>'<td class="c">'+fmt(a*(x-d)**2+e)+'</td>').join('') + '</tr>';
    const pts = [{x:d,y:e,color:css('--red'),label:'S',below:a>0}];
    roots.forEach(x=>pts.push({x, y:0, color:css('--green')}));
    plot(document.getElementById('labCanvas'), [{f:x=>x*x, color:css('--muted'), w:1.5, dash:[6,5]}, {f:x=>a*(x-d)**2+e, color:css('--blue')}], {xmin:-8, xmax:8, ymin:-6.5, ymax:6.5, points:pts});
  }
  [sa,sd,se].forEach(el => el.addEventListener('input', lab));

  }
  // ---------- Trainer ----------
  const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  let type = 'spf', cur = null, right = 0, total = 0;
  if(document.getElementById('tform')){
  const tq = document.getElementById('tq'), tfb = document.getElementById('tfb');
  const L = [document.getElementById('l1'), document.getElementById('l2'), document.getElementById('l3')];
  const I = [document.getElementById('i1'), document.getElementById('i2'), document.getElementById('i3')];
  function setLabels(labels){ L.forEach((l,i)=>{ if(labels[i]){ l.hidden=false; l.firstChild.textContent = labels[i]; } else { l.hidden=true; } }); }
  function gen(){
    let q, sol, labels, way;
    if(type==='lin2p' || type==='linang'){
      const m = pick([-3,-2,-1.5,-1,-0.5,0.5,1,1.5,2,3]), b = rnd(-6,6);
      const f = x => m*x + b, lin = (mm,bb) => 'y = ' + fmt(mm) + 'x ' + (bb<0?'− ':'+ ') + fmt(Math.abs(bb));
      labels = ['m =','b ='];
      if(type==='lin2p'){
        let x1 = pick([-4,-3,-2,-1,1,2,3]), x2 = x1 + pick([2,4]); if(x2===0) x2 += 2;
        const y1 = f(x1), y2 = f(x2);
        q = 'Bestimme die Gleichung der Geraden durch A(' + fmt(x1) + '|' + fmt(y1) + ') und B(' + fmt(x2) + '|' + fmt(y2) + ').';
        way = 'm = (' + fmt(y2) + ' − ' + (y1<0?'('+fmt(y1)+')':fmt(y1)) + ') : (' + fmt(x2) + ' − ' + (x1<0?'('+fmt(x1)+')':fmt(x1)) + ') = ' + fmt(y2-y1) + ' : ' + fmt(x2-x1) + ' = ' + fmt(m) + ';  A einsetzen: ' + fmt(y1) + ' = ' + fmt(m) + ' · ' + (x1<0?'('+fmt(x1)+')':fmt(x1)) + ' + b → b = ' + fmt(b) + '  →  ' + lin(m,b);
      } else {
        const v = pick(['mp','sach','tab']);
        if(v==='mp'){ const x1 = pick([-3,-2,-1,1,2,3,4]), y1 = f(x1);
          q = 'Die Gerade hat die Steigung m = ' + fmt(m) + ' und geht durch P(' + fmt(x1) + '|' + fmt(y1) + '). Gib m und b an.';
          way = 'P einsetzen: ' + fmt(y1) + ' = ' + fmt(m) + ' · ' + (x1<0?'('+fmt(x1)+')':fmt(x1)) + ' + b → b = ' + fmt(b) + '  →  ' + lin(m,b); }
        else if(v==='sach'){ const g = pick([2,2.5,3,4,5,6,8]), pr = pick([0.5,1,1.5,2,2.5,3]), ding = pick([['Taxi','Grundpreis','pro km'],['Handyvertrag','Grundgebühr','pro GB'],['Fahrradverleih','Grundgebühr','pro Stunde']]);
          q = ding[0] + ': ' + fmt(g) + ' € ' + ding[1] + ' und ' + fmt(pr) + ' € ' + ding[2] + '. Gib die Funktionsgleichung y = m·x + b an (y in €).';
          cur = null; way = ding[1] + ' = Startwert b = ' + fmt(g) + ';  Preis ' + ding[2] + ' = Steigung m = ' + fmt(pr) + '  →  ' + lin(pr,g);
          tq.textContent = q; setLabels(labels); I.forEach(i=>i.value=''); tfb.hidden = true; cur = {sol:[pr,g], way}; return; }
        else { const xs = [0,1,2,3];
          q = 'Wertetabelle einer linearen Funktion:  x: ' + xs.map(fmt).join(' | ') + '   y: ' + xs.map(x=>fmt(f(x))).join(' | ') + '.  Gib m und b an.';
          way = 'b ist der y-Wert bei x = 0: b = ' + fmt(b) + ';  die y-Werte ändern sich pro Schritt um ' + fmt(m) + ' → m = ' + fmt(m) + '  →  ' + lin(m,b); }
      }
      sol = [m,b];
    } else if(type==='spf'){
      const a = pick([-3,-2,-1,-0.5,0.5,1,2,3]), d = rnd(-6,6), e = rnd(-8,8);
      q = 'Gib den Scheitelpunkt an:  ' + spfText(a,d,e); sol = [d,e]; labels=['xₛ =','yₛ =']; way = 'Aus f(x) = a(x − d)² + e liest man S(d|e) ab. Hier: S(' + fmt(d) + '|' + fmt(e) + '). Achtung Vorzeichen bei d!';
    } else if(type==='nf'){
      const a = pick([-2,-1,-0.5,0.5,1,2]), d = rnd(-5,5), e = rnd(-6,6), b = -2*a*d, c = a*d*d+e;
      q = 'Berechne den Scheitelpunkt:  ' + nfText(a,b,c); sol = [d,e]; labels=['xₛ =','yₛ =']; way = 'xₛ = −b : (2a) = ' + fmt(-b) + ' : ' + fmt(2*a) + ' = ' + fmt(d) + ';  yₛ = f(' + fmt(d) + ') = ' + fmt(e);
    } else if(type==='pq'){
      let x1 = rnd(-7,6), x2 = rnd(-6,7); if(x1>x2) [x1,x2]=[x2,x1];
      const p = -(x1+x2), qq = x1*x2;
      q = 'Löse:  ' + nfText(1,p,qq).replace('f(x) = ','') + ' = 0'; sol = [x1,x2]; labels=['x₁ (kleiner) =','x₂ (größer) =']; way = 'p = ' + fmt(p) + ', q = ' + fmt(qq) + ':  x = ' + fmt(-p/2) + ' ± √(' + fmt((p/2)**2) + ' − (' + fmt(qq) + ')) = ' + fmt(-p/2) + ' ± ' + fmt(Math.abs(x2-x1)/2) + (x1===x2?'  (nur eine Lösung: beide Felder gleich)':'');
    } else if(type==='fw'){
      const a = pick([-0.5,-0.2,-0.1,0.25,0.5,1,2]), b = pick([-2,-1,0.5,1,2,3]), c = rnd(-3,5), x = pick([-3,-2,-1.5,1,2,2.5,3,4]);
      q = nfText(a,b,c) + '.   Berechne f(' + fmt(x) + ').'; sol = [a*x*x+b*x+c]; labels=['f(' + fmt(x) + ') =']; way = fmt(a) + '·(' + fmt(x) + ')² + ' + fmt(b) + '·(' + fmt(x) + ') + ' + fmt(c) + ' = ' + fmt(a*x*x+b*x+c);
    } else if(type==='nfspf'){
      const a = pick([-2,-1,-0.5,0.5,1,2,3]), d = rnd(-5,5) || 2, e = rnd(-6,6), b = -2*a*d, c = a*d*d+e;
      q = 'Gib in Scheitelpunktform f(x) = a(x − xₛ)² + yₛ an:  ' + nfText(a,b,c); sol = [a, d, e]; labels=['a =','xₛ =','yₛ ='];
      way = '① xₛ = −b : (2a) = ' + fmt(-b) + ' : ' + fmt(2*a) + ' = ' + fmt(d) + '   ② yₛ = f(' + fmt(d) + ') = ' + fmt(e) + '   ③ a bleibt ' + fmt(a) + '  →  ' + spfText(a,d,e) + '   Probe: ausmultiplizieren.';
    } else {
      const a = pick([-2,-1,1,2,0.5]), d = rnd(-4,4) || 1, e = rnd(-5,5);
      q = 'Forme in ax² + bx + c um:  ' + spfText(a,d,e); sol = [a, -2*a*d, a*d*d+e]; labels=['a =','b =','c =']; way = 'Binomische Formel anwenden: ' + nfText(1,-2*d,d*d).replace('f(x) = ','') + ', dann mit ' + fmt(a) + ' multiplizieren und ' + fmt(e) + ' addieren → ' + nfText(a,-2*a*d,a*d*d+e);
    }
    cur = {sol, way}; tq.textContent = q; setLabels(labels); I.forEach(i=>i.value=''); tfb.hidden = true; I[0].focus({preventScroll:true});
  }
  document.querySelectorAll('.ttabs button[data-t]').forEach(bt => bt.addEventListener('click', () => {
    document.querySelectorAll('.ttabs button[data-t]').forEach(b=>b.setAttribute('aria-pressed','false'));
    bt.setAttribute('aria-pressed','true'); type = bt.dataset.t; gen();
  }));
  document.getElementById('tnew').addEventListener('click', gen);
  document.addEventListener('click', e => { const a = e.target.closest('[data-goto-t]'); if(!a) return; const bt = document.querySelector('.ttabs button[data-t="' + a.dataset.gotoT + '"]'); if(bt) bt.click(); });
  document.getElementById('tform').addEventListener('submit', ev => {
    ev.preventDefault(); if(!cur) return;
    const vals = cur.sol.map((_,i)=>num(I[i].value));
    if(vals.some(v=>isNaN(v))){ tfb.hidden=false; tfb.className='fb no'; tfb.textContent='Bitte alle Felder ausfüllen.'; return; }
    const ok = vals.every((v,i)=>Math.abs(v-cur.sol[i]) < 0.011);
    total++; if(ok) right++;
    tfb.hidden = false; tfb.className = 'fb ' + (ok?'ok':'no');
    tfb.textContent = (ok ? 'Richtig! ' : 'Noch nicht. ') + 'Lösungsweg: ' + cur.way;
    document.getElementById('tscore').textContent = 'Richtig: ' + right + ' von ' + total;
  });

  }
  if(document.getElementById('clist')){
  // ---------- Checkliste ----------
  const items = [
    ['eine lineare Funktion als Tabelle, Graph und Gleichung darstellen und m und b am Graphen ablesen und im Sachkontext deuten.','2023 T1, 2025 e'],
    ['Schnittpunkte zweier Geraden und Nullstellen linearer Funktionen berechnen.','Teil 1'],
    ['an einer Tabelle erkennen, ob ein Zusammenhang linear oder quadratisch ist.','2015 a · Grundlage'],
    ['Wertetabellen zu quadratischen Funktionen anlegen und den Graphen zeichnen.','2015 a'],
    ['den Einfluss von a beschreiben (Öffnung, gestreckt, gestaucht).','2022 T1'],
    ['den Scheitelpunkt aus der Scheitelpunktform ablesen.','2025 a'],
    ['eine Parabelgleichung aus dem Graphen oder aus Angaben aufstellen.','2025 d, f'],
    ['mit einer Punktprobe prüfen, ob ein Punkt auf der Parabel liegt.','2025 b'],
    ['Klammern auflösen und die binomischen Formeln anwenden.','2022 b, 2025 c'],
    ['die Scheitelpunktform in die Normalform umformen.','2022 b, 2025 c'],
    ['den Scheitelpunkt einer Parabel in Normalform berechnen (maximale Höhe) und die Scheitelpunktform angeben.','2023 c, 2024 c'],
    ['Nullstellen mit der pq-Formel, durch Ausklammern oder Wurzelziehen berechnen.','2023 b, 2026 d'],
    ['berechnen, an welcher Stelle eine Funktion einen bestimmten Wert hat (f(x) = k).','2022 c, 2023 d'],
    ['Schnittpunkte von zwei Parabeln oder von Parabel und Gerade berechnen – mit x- und y-Wert.','2024 d, 2026 e'],
    ['in einem Sachtext erkennen, welche Rechnung gefragt ist, und mit Antwortsatz antworten.','alle'],
    ['Abstände im Sachkontext richtig berücksichtigen (Säule, Netz, Breite).','2023, 2026'],
    ['zu einer Beschreibung passende Gleichungen auswählen und eine Flugbahn skizzieren.','2024 e, f']
  ];
  const KEY = 'qf-ichkann-v2'; let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch(e) { saved = {}; }
  const ul = document.getElementById('clist');
  items.forEach((it,i) => {
    const li = document.createElement('li');
    li.innerHTML = '<label for="c'+i+'"><input type="checkbox" id="c'+i+'"><span>Ich kann ' + it[0] + '</span><span class="zap">ZAP ' + it[1] + '</span></label>';
    ul.appendChild(li);
    const cb = li.querySelector('input'); cb.checked = !!saved[i];
    cb.addEventListener('change', () => { saved[i] = cb.checked; try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch(e) {} prog(); });
  });
  function prog(){ const n = items.filter((_,i)=>saved[i]).length; document.getElementById('pbar').style.width = (n/items.length*100) + '%'; document.getElementById('ptext').textContent = n + ' von ' + items.length + ' Punkten sicher'; }
  prog();


  }
  // ---------- Startklar: eigener Bereich, über Buttons erreichbar ----------
  const skView = document.getElementById('startklar');
  function drawSk(){
    if(!skView) return;
    const cv = document.getElementById('skCanvas'); if(!cv || skView.hidden) return;
    plot(cv, [{f:x=>0.5*x+1, color:css('--blue')}, {f:x=>-x+3, color:css('--orange')}],
      {xmin:-4.5, xmax:5.5, ymin:-3.5, ymax:4.5, points:[]});
    const ctx = cv.getContext('2d'); ctx.font = '700 16px ' + css('--f-mono'); ctx.textAlign = 'left';
    const X = x => (x + 4.5) / 10 * cv.width, Y = y => cv.height - (y + 3.5) / 8 * cv.height;
    ctx.fillStyle = css('--blue'); ctx.fillText('g', X(4.3), Y(0.5*4.3+1) - 8);
    ctx.fillStyle = css('--orange'); ctx.fillText('h', X(4.4) + 6, Y(-4.4+3) + 4);
    ctx.fillStyle = css('--muted'); ctx.font = '12px ' + css('--f-mono'); ctx.textAlign = 'center';
    [-3,-1,1,3,5].forEach(x => ctx.fillText(String(x).replace('-','−'), X(x), Y(0)+15));
    ctx.textAlign = 'right'; [-3,-1,1,3].forEach(y => ctx.fillText(String(y).replace('-','−'), X(0)-5, Y(y)+4));
  }

  if(document.getElementById('glGrid')){
  // ---------- Glossar ----------
  function miniSvg(o){
    const W = 200, H = 150, [x0,x1] = o.x, [y0,y1] = o.y;
    const X = x => (x - x0) / (x1 - x0) * W, Y = y => H - (y - y0) / (y1 - y0) * H;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.alt || '') + '">';
    for(let x = Math.ceil(x0); x <= x1; x++) s += '<line x1="' + X(x) + '" y1="0" x2="' + X(x) + '" y2="' + H + '" style="stroke:var(--grid)" stroke-width="1"/>';
    for(let y = Math.ceil(y0); y <= y1; y++) s += '<line x1="0" y1="' + Y(y) + '" x2="' + W + '" y2="' + Y(y) + '" style="stroke:var(--grid)" stroke-width="1"/>';
    s += '<line x1="0" y1="' + Y(0) + '" x2="' + (W - 2) + '" y2="' + Y(0) + '" style="stroke:var(--fg)" stroke-width="1.4"/>';
    s += '<line x1="' + X(0) + '" y1="' + H + '" x2="' + X(0) + '" y2="2" style="stroke:var(--fg)" stroke-width="1.4"/>';
    s += '<path d="M' + (W - 8) + ' ' + (Y(0) - 4) + ' L' + W + ' ' + Y(0) + ' L' + (W - 8) + ' ' + (Y(0) + 4) + 'Z" style="fill:var(--fg)"/>';
    s += '<path d="M' + (X(0) - 4) + ' 8 L' + X(0) + ' 0 L' + (X(0) + 4) + ' 8Z" style="fill:var(--fg)"/>';
    s += '<text x="' + (W - 4) + '" y="' + (Y(0) + 14) + '" text-anchor="end" class="gx">x</text><text x="' + (X(0) + 6) + '" y="11" class="gx">y</text>';
    (o.fns || []).forEach(fn => {
      let d = '', pen = false;
      for(let i = 0; i <= 160; i++){ const x = x0 + (x1 - x0) * i / 160, y = fn.f(x);
        if(y < y0 - 1 || y > y1 + 1){ pen = false; continue; }
        d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1) + ' '; pen = true; }
      s += '<path d="' + d + '" fill="none" style="stroke:var(' + (fn.c || '--blue') + ')" stroke-width="' + (fn.w || 2.6) + '"' + (fn.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
      if(fn.label) s += '<text x="' + X(fn.label[0]) + '" y="' + Y(fn.label[1]) + '" class="gl-lab" style="fill:var(' + (fn.c || '--blue') + ')"' + (fn.label[3] ? ' text-anchor="' + fn.label[3] + '"' : '') + '>' + fn.label[2] + '</text>';
    });
    if(o.extra) s += o.extra(X, Y);
    (o.pts || []).forEach(p => {
      s += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="4.2" style="fill:var(' + (p.c || '--red') + ')"/>';
      if(p.l) s += '<text x="' + (X(p.x) + (p.dx || 6)) + '" y="' + (Y(p.y) + (p.dy || -6)) + '" class="gl-lab" style="fill:var(' + (p.c || '--red') + ')"' + (p.anchor ? ' text-anchor="' + p.anchor + '"' : '') + '>' + p.l + '</text>';
    });
    return s + '</svg>';
  }
  const dashLine = (X, Y, a, b, c, d, col) => '<line x1="' + X(a) + '" y1="' + Y(b) + '" x2="' + X(c) + '" y2="' + Y(d) + '" style="stroke:var(' + (col || '--muted') + ')" stroke-width="1.6" stroke-dasharray="4 3"/>';
  const txt = (X, Y, x, y, t, col, anchor) => '<text x="' + X(x) + '" y="' + Y(y) + '" class="gl-lab" style="fill:var(' + (col || '--fg') + ')"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + t + '</text>';
  const FIG = {
    koord: () => miniSvg({x:[-1,5.5], y:[-1,4.5], alt:'Punkt P(2|3) im Koordinatensystem', pts:[{x:2,y:3,l:'P(2 | 3)'}],
      extra:(X,Y) => dashLine(X,Y,2,0,2,3) + dashLine(X,Y,0,3,2,3) + txt(X,Y,2,-0.75,'2 nach rechts','--muted','middle') + txt(X,Y,0.15,3.25,'3 hoch','--muted')}),
    gerade: () => miniSvg({x:[-1.5,3.5], y:[-2,5], alt:'Gerade y = 2x − 1 mit Steigungsdreieck', fns:[{f:x=>2*x-1, label:[-1.4,3.2,'y = 2x − 1']}],
      pts:[{x:0,y:-1,l:'b = −1',c:'--green',dx:6,dy:12}],
      extra:(X,Y) => '<path d="M' + X(1) + ' ' + Y(1) + ' L' + X(2) + ' ' + Y(1) + ' L' + X(2) + ' ' + Y(3) + '" fill="none" style="stroke:var(--orange)" stroke-width="2"/>' + txt(X,Y,1.5,0.4,'1','--orange','middle') + txt(X,Y,2.15,1.8,'m = 2','--orange')}),
    tabelle: () => '<div class="tbl"><table><tr><th>x</th><td class="c">0</td><td class="c">1</td><td class="c">2</td><td class="c">3</td></tr><tr><th>y = 2x + 1</th><td class="c">1</td><td class="c">3</td><td class="c">5</td><td class="c">7</td></tr></table></div>',
    nullstelle: () => miniSvg({x:[-4,4], y:[-4.5,3], alt:'Parabel mit zwei Nullstellen', fns:[{f:x=>x*x-4}],
      pts:[{x:-2,y:0,l:'x = −2',c:'--green',dx:-6,dy:16,anchor:'end'},{x:2,y:0,l:'x = 2',c:'--green',dx:6,dy:16}]}),
    schnitt: () => miniSvg({x:[-3,3.5], y:[-1,6], alt:'Parabel und Gerade schneiden sich in zwei Punkten', fns:[{f:x=>x*x},{f:x=>x+2,c:'--orange'}],
      pts:[{x:-1,y:1,l:'S₁',dx:-8,dy:-6,anchor:'end'},{x:2,y:4,l:'S₂',dx:8,dy:10}]}),
    parabel: () => miniSvg({x:[-3,3], y:[-1.5,6], alt:'Normalparabel y = x²', fns:[{f:x=>x*x, label:[1.75,1.0,'y = x²']}], pts:[{x:0,y:0,l:'S(0 | 0)',dx:8,dy:14}]}),
    scheitel: () => miniSvg({x:[-2.5,4.5], y:[-3,5], alt:'Parabel mit Scheitelpunkt und Symmetrieachse', fns:[{f:x=>(x-1)**2-2}],
      extra:(X,Y) => dashLine(X,Y,1,-3,1,5,'--orange') + '<text transform="translate(' + (X(1) - 6) + ' ' + Y(2.2) + ') rotate(-90)" text-anchor="middle" class="gl-lab" style="fill:var(--orange)">Symmetrieachse</text>',
      pts:[{x:1,y:-2,l:'S(1 | −2)',dy:16}]}),
    oeffnung: () => miniSvg({x:[-3,3], y:[-3,4], alt:'Eine Parabel nach oben und eine nach unten geöffnet', fns:[{f:x=>x*x-2, label:[1.6,3.4,'a > 0']},{f:x=>-x*x+2,c:'--orange', label:[1.5,-2.6,'a < 0']}]}),
    streck: () => miniSvg({x:[-3,3], y:[-0.5,5], alt:'Drei Parabeln mit verschiedenem a', fns:[{f:x=>2*x*x,c:'--red',label:[2.95,2.3,'a = 2','end']},{f:x=>x*x,label:[2.95,1.55,'a = 1','end']},{f:x=>0.5*x*x,c:'--green',label:[2.95,0.8,'a = 0,5','end']}]}),
    verschieben: () => miniSvg({x:[-2.5,4.5], y:[-1,5], alt:'Normalparabel nach rechts und oben verschoben', fns:[{f:x=>x*x,c:'--muted',w:2,dash:true},{f:x=>(x-2)**2+1}],
      extra:(X,Y) => '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(1.85) + '" y2="' + Y(0.92) + '" style="stroke:var(--orange)" stroke-width="2.2"/><path d="M' + X(2) + ' ' + Y(1) + ' l-9 -1 l4 8z" style="fill:var(--orange)"/>' + txt(X,Y,0.3,-0.7,'2 rechts, 1 hoch','--orange')}),
    flaeche: () => { const u = 24, xw = 70, s = 18;
      return '<svg viewBox="0 0 200 150" role="img" aria-label="Flächenmodell für (x + 2)²">' +
        '<rect x="' + s + '" y="' + s + '" width="' + xw + '" height="' + xw + '" style="fill:var(--blue-soft);stroke:var(--fg)"/>' +
        '<rect x="' + (s + xw) + '" y="' + s + '" width="' + (u * 2) + '" height="' + xw + '" style="fill:var(--green-soft);stroke:var(--fg)"/>' +
        '<rect x="' + s + '" y="' + (s + xw) + '" width="' + xw + '" height="' + (u * 2) + '" style="fill:var(--green-soft);stroke:var(--fg)"/>' +
        '<rect x="' + (s + xw) + '" y="' + (s + xw) + '" width="' + (u * 2) + '" height="' + (u * 2) + '" style="fill:var(--orange-soft);stroke:var(--fg)"/>' +
        '<text x="' + (s + xw / 2) + '" y="' + (s + xw / 2 + 5) + '" text-anchor="middle" class="gl-lab">x²</text>' +
        '<text x="' + (s + xw + u) + '" y="' + (s + xw / 2 + 5) + '" text-anchor="middle" class="gl-lab">2x</text>' +
        '<text x="' + (s + xw / 2) + '" y="' + (s + xw + u + 5) + '" text-anchor="middle" class="gl-lab">2x</text>' +
        '<text x="' + (s + xw + u) + '" y="' + (s + xw + u + 5) + '" text-anchor="middle" class="gl-lab">4</text>' +
        '<text x="' + (s + xw / 2) + '" y="' + (s - 5) + '" text-anchor="middle" class="gx">x</text><text x="' + (s + xw + u) + '" y="' + (s - 5) + '" text-anchor="middle" class="gx">2</text>' +
        '<text x="' + (s - 6) + '" y="' + (s + xw / 2 + 4) + '" text-anchor="end" class="gx">x</text><text x="' + (s - 6) + '" y="' + (s + xw + u + 4) + '" text-anchor="end" class="gx">2</text>' +
        '<text x="196" y="146" text-anchor="end" class="gl-lab">x² + 4x + 4</text></svg>'; },
    flugbahn: () => miniSvg({x:[-0.5,8.8], y:[-0.3,2.7], alt:'Flugbahn eines Balls mit Starthöhe und maximaler Höhe', fns:[{f:x=>-0.1*x*x+0.8*x+0.4}],
      extra:(X,Y) => dashLine(X,Y,4,0,4,2,'--orange') + txt(X,Y,4.15,0.2,'x = 4','--orange'),
      pts:[{x:0,y:0.4,l:'Starthöhe',c:'--green',dx:8,dy:14},{x:4,y:2,l:'maximale Höhe',dx:0,dy:-9,anchor:'middle'}]})
  };
  const GL = [
    {t:'Funktion', b:['B1'], d:'Eine Funktion ist eine Regel. Zu jedem x-Wert gehört genau ein y-Wert.', e:'Regel „mal 2, plus 1“: Für x = 3 ist y = 7.'},
    {t:'Funktionsgleichung', b:['B1','B4'], d:'So schreibt man die Regel auf. Links steht y oder f(x), rechts steht der Rechenweg mit x.', e:'y = 2x + 1   oder   f(x) = 2x + 1'},
    {t:'f(x)', b:['B4'], d:'f(x) ist der y-Wert an der Stelle x. f(x) und y bedeuten dasselbe. Man sagt „f von x“.', e:'f(3) = 7 heißt: Der Punkt (3 | 7) liegt auf dem Graphen.'},
    {t:'Wertetabelle', b:['B1','B2'], d:'In einer Tabelle stehen die x-Werte und die passenden y-Werte. Du setzt jeden x-Wert in die Gleichung ein.', fig:'tabelle'},
    {t:'Koordinatensystem', b:['Startklar'], d:'Zwei Achsen: Die x-Achse geht nach rechts. Die y-Achse geht nach oben. Wo sie sich treffen, ist der Ursprung (0 | 0).', fig:'koord'},
    {t:'Punkt P(x | y)', b:['Startklar'], d:'Ein Punkt hat zwei Zahlen. Die erste Zahl ist x: so weit nach rechts (oder links). Die zweite Zahl ist y: so weit nach oben (oder unten).', e:'P(2 | 3): 2 nach rechts, 3 nach oben.', fig:'koord'},
    {t:'Graph', b:['B1','B2'], d:'Der Graph ist das Bild einer Funktion im Koordinatensystem. Er besteht aus allen Punkten, die zur Regel passen.'},
    {t:'Punktprobe', b:['Startklar','B2','B4'], d:'Du prüfst, ob ein Punkt auf dem Graphen liegt. Setze den x-Wert ein. Kommt der y-Wert heraus? Dann liegt der Punkt darauf.', e:'y = 2x + 3 und A(2 | 7): 2 · 2 + 3 = 7 ✓'},
    {t:'lineare Funktion', b:['B1'], d:'Bei einer linearen Funktion ist der Graph eine Gerade. Die Gleichung hat die Form y = mx + b.', fig:'gerade'},
    {t:'Steigung m', b:['B1'], d:'m sagt, wie steil die Gerade ist. Gehe 1 nach rechts, dann m nach oben. Ist m negativ, geht es nach unten.', e:'y = 2x − 1: 1 nach rechts, 2 nach oben.', fig:'gerade'},
    {t:'y-Achsenabschnitt b', b:['B1'], d:'Hier schneidet die Gerade die y-Achse. In Sachaufgaben ist b oft der Startwert, zum Beispiel der Grundpreis.', e:'y = 2x − 1: b = −1, Punkt (0 | −1).'},
    {t:'Nullstelle', b:['B1','B6'], d:'Hier schneidet der Graph die x-Achse. Dort ist y = 0. Zum Berechnen setzt du die Gleichung gleich 0.', fig:'nullstelle'},
    {t:'Schnittpunkt', b:['B1','B6'], d:'Hier treffen sich zwei Graphen. Beide haben dort denselben y-Wert. Zum Berechnen setzt du beide Terme gleich.', fig:'schnitt'},
    {t:'gleichsetzen', b:['B1','B6'], d:'Du schreibst zwei Terme mit „=“ zusammen und löst die Gleichung. So findest du den Schnittpunkt.', e:'2x + 1 = −x + 7 → 3x = 6 → x = 2'},
    {t:'quadratische Funktion', b:['B2'], d:'In der Gleichung kommt x² vor (x hoch 2). Der Graph ist eine Parabel.', e:'f(x) = x²,   f(x) = −2x² + 3x + 1'},
    {t:'Parabel', b:['B2'], d:'Der Graph einer quadratischen Funktion. Er sieht aus wie ein U oder wie ein umgedrehtes U.', fig:'parabel'},
    {t:'Normalparabel', b:['B2'], d:'Die einfachste Parabel: y = x². Ihr Scheitelpunkt ist S(0 | 0). Sie ist nach oben geöffnet.', fig:'parabel'},
    {t:'Scheitelpunkt S', b:['B2','B4','B5'], d:'Der tiefste Punkt oder der höchste Punkt einer Parabel. In Sachaufgaben: die maximale Höhe.', fig:'scheitel'},
    {t:'Symmetrieachse', b:['B2','B4'], d:'Eine senkrechte Linie durch den Scheitelpunkt. Links und rechts davon sieht die Parabel gleich aus – wie im Spiegel.', fig:'scheitel'},
    {t:'nach oben / nach unten geöffnet', b:['B3'], d:'Ist a positiv, ist die Parabel ein U (nach oben offen). Ist a negativ, ist sie wie ein Berg (nach unten offen).', fig:'oeffnung'},
    {t:'Streckfaktor a', b:['B3'], d:'Die Zahl vor dem x². Sie bestimmt die Öffnung und die Breite der Parabel.', e:'f(x) = 3x²: a = 3'},
    {t:'gestreckt / gestaucht', b:['B3'], d:'Gestreckt heißt: schmaler als die Normalparabel (a größer als 1 oder kleiner als −1). Gestaucht heißt: breiter (a zwischen −1 und 1).', fig:'streck'},
    {t:'verschieben', b:['B4'], d:'Die Parabel rutscht nach rechts, links, oben oder unten. Ihre Form bleibt gleich.', fig:'verschieben'},
    {t:'Scheitelpunktform', b:['B4'], d:'f(x) = a(x − d)² + e. Hier kannst du den Scheitelpunkt S(d | e) direkt ablesen. Achtung: Das Vorzeichen in der Klammer dreht sich um.', e:'f(x) = (x − 3)² + 1 → S(3 | 1);   f(x) = (x + 3)² + 1 → S(−3 | 1)'},
    {t:'Normalform', b:['B5'], d:'f(x) = ax² + bx + c. Ohne Klammer. Die Zahl c zeigt, wo die Parabel die y-Achse schneidet.', e:'f(x) = −x² + 4x + 1: Schnitt mit der y-Achse bei 1.'},
    {t:'quadratische Ergänzung (Extra)', b:['B5'], d:'Für Neugierige – in der ZAP nicht nötig. Damit formst du die Normalform direkt in die Scheitelpunktform um. Du ergänzt eine Zahl so, dass eine binomische Formel entsteht, und ziehst sie gleich wieder ab. So: Zahl vor x halbieren, quadrieren, addieren und abziehen. Ist a nicht 1, klammerst du a vorher aus.', e:'x² − 6x + 5 = x² − 6x + <b>9</b> − <b>9</b> + 5 = (x − 3)² − 4 → S(3 | −4). Die 9 ist (6 : 2)² = 3².'},
    {t:'Klammer auflösen (ausmultiplizieren)', b:['Startklar','B5'], d:'Jeder Teil in der Klammer wird mit der Zahl vor der Klammer malgenommen. Auch das Vorzeichen.', e:'3(x + 4) = 3x + 12;   −2(x − 5) = −2x + 10'},
    {t:'binomische Formeln', b:['B5'], d:'Abkürzungen für „Klammer mal Klammer“. ① (a + b)² = a² + 2ab + b²  ② (a − b)² = a² − 2ab + b²  ③ (a + b)(a − b) = a² − b²', e:'(x + 2)² = x² + 4x + 4 – das Mittelglied 4x nicht vergessen!', fig:'flaeche'},
    {t:'quadrieren', b:['Startklar','B2'], d:'Eine Zahl mal sich selbst nehmen. Bei negativen Zahlen Klammern setzen!', e:'5² = 25;   (−3)² = 9;   aber −3² = −9'},
    {t:'Wurzel', b:['Startklar','B6'], d:'Die Wurzel ist das Gegenteil vom Quadrieren. Welche Zahl mal sich selbst ergibt die Zahl?', e:'√49 = 7, weil 7 · 7 = 49. Bei x² = 49 gibt es zwei Lösungen: 7 und −7.'},
    {t:'pq-Formel', b:['B6'], d:'Mit dieser Formel berechnest du Nullstellen. Vorher muss die Gleichung so aussehen: x² + px + q = 0. Die Formel steht in der Formelsammlung.', e:'x² − 2x − 3 = 0: p = −2, q = −3 → x = 1 ± 2'},
    {t:'Starthöhe und maximale Höhe', b:['B5','B7'], d:'Starthöhe: die Höhe bei x = 0, also f(0). Maximale Höhe: der y-Wert des Scheitelpunkts. Entfernung: der x-Wert.', fig:'flugbahn'},
    {t:'Antwortsatz', b:['B7'], d:'Am Ende einer Sachaufgabe schreibst du einen ganzen Satz. Er nennt das Ergebnis mit Einheit.', e:'Der Ball fliegt maximal 2 m hoch.'}
  ];
  const glGrid = document.getElementById('glGrid'), glQ = document.getElementById('glQ'), glF = document.getElementById('glF'), glN = document.getElementById('glN');
  let glTag = 'Alle';
  ['Alle','Startklar','B1','B2','B3','B4','B5','B6','B7'].forEach(tg => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = tg; b.setAttribute('aria-pressed', tg === glTag);
    b.addEventListener('click', () => { glTag = tg; glF.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); glRender(); });
    glF.appendChild(b);
  });
  function glRender(){
    const q = glQ.value.trim().toLowerCase();
    const list = GL.filter(g => (glTag === 'Alle' || g.b.includes(glTag)) && (!q || (g.t + ' ' + g.d + ' ' + (g.e || '')).toLowerCase().includes(q)));
    glGrid.innerHTML = list.map(g => '<article class="gl-card"><h3>' + g.t + '</h3><div class="gl-tags">' + g.b.map(x => '<span>' + x + '</span>').join('') + '</div><p>' + g.d + '</p>' +
      (g.e ? '<p class="gl-ex"><b>Beispiel:</b> ' + g.e + '</p>' : '') + (g.fig ? '<div class="gl-fig">' + FIG[g.fig]() + '</div>' : '') + '</article>').join('');
    glN.textContent = list.length + (list.length === 1 ? ' Wort' : ' Wörter');
  }
  glQ.addEventListener('input', glRender);
  glRender();

  }
  // ---------- Ansicht: immer nur ein Bereich ----------
  const views = Array.from(document.querySelectorAll('main > section.unit, main > .sk-view'));
  const navBtns = Array.from(document.querySelectorAll('.pnav [data-view]'));
  // Startansicht: zuletzt gewählter Baustein (nur in diesem Browser), sonst Baustein 1
  const KEYV = 'lernpfad-qf-view';
  let current = 'w1';
  try { const v = localStorage.getItem(KEYV); if(v && document.getElementById(v)) current = v; } catch(e) {}
  const content = document.querySelector('.layout') || document.body;
  function route(){
    const h = location.hash.slice(1);
    let view = current, target = null;
    if(h && h !== 'top'){
      const el = document.getElementById(h);
      if(el){ const v = el.closest('main > section.unit, main > .sk-view'); if(v){ view = v.id; if(v !== el) target = el; } }
    }
    if(views.length === 1) view = views[0].id;
    if(!views.length) return;
    views.forEach(v => v.hidden = v.id !== view);
    if(view !== 'startklar'){ current = view; try { localStorage.setItem(KEYV, view); } catch(e) {} }
    navBtns.forEach(b => { if(b.dataset.view === view) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
    if(view === 'startklar'){
      const topics = Array.from(document.querySelectorAll('#startklar .sk-topic'));
      const tp = (target && target.closest('.sk-topic')) || topics[0];
      topics.forEach(t => t.hidden = t !== tp);
      document.querySelectorAll('#skChips .skchip').forEach(c => c.setAttribute('aria-current', c.dataset.topic === tp.id ? 'true' : 'false'));
      drawSk();
      const chips = document.getElementById('skChips').getBoundingClientRect();
      if(chips.top < 0 || chips.top > innerHeight - 80) document.getElementById('skChips').scrollIntoView({block:'start'});
      return;
    }
    // BB-ROUTE-START
    if(view === 'basis'){
      const bl = Array.from(document.querySelectorAll('#basis .bb-sol'));
      const b = (target && target.closest('.bb-sol')) || bl[0];
      bl.forEach(x => x.hidden = x !== b);
      document.querySelectorAll('#bbChips .skchip').forEach(c => c.setAttribute('aria-current', c.dataset.bb === b.id ? 'true' : 'false'));
      const ch = document.getElementById('bbChips').getBoundingClientRect();
      if(ch.top < 0 || ch.top > innerHeight - 80) document.getElementById('bbChips').scrollIntoView({block:'start'});
      return;
    }
    // BB-ROUTE-END
    if(view === 'fuev'){
      const bl = Array.from(document.querySelectorAll('#fuev .fuev-sol'));
      const b = (target && target.closest('.fuev-sol')) || bl[0];
      bl.forEach(x => x.hidden = x !== b);
      document.querySelectorAll('#fuevChips .skchip').forEach(c => c.setAttribute('aria-current', c.dataset.fuev === b.id ? 'true' : 'false'));
      const ch = document.getElementById('fuevChips').getBoundingClientRect();
      if(ch.top < 0 || ch.top > innerHeight - 80) document.getElementById('fuevChips').scrollIntoView({block:'start'});
      return;
    }
    if(target) target.scrollIntoView();
    else if(h && h !== 'top'){ const r = content.getBoundingClientRect(); if(r.top < 0 || r.top > innerHeight * 0.75) content.scrollIntoView(); }
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);
  // interne Links ohne Springen des Browsers: Ansicht wechseln statt zum Anker zu scrollen
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if(!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    if(id && id !== 'top' && !document.getElementById(id)) return;
    e.preventDefault();
    try { history.pushState(null, '', '#' + (id || 'top')); } catch(err) { location.hash = id || 'top'; return; }
    route();
  });
  route();

  if(document.getElementById('skQ')){
  // ---------- Blitz-Trainer ----------
  const nz = (a,b) => { let v; do { v = rnd(a,b); } while(v===0); return v; };
  const sg = v => v < 0 ? '−' + Math.abs(v) : String(v);
  const lin = (m,b) => (m===1?'':m===-1?'−':sg(m)) + 'x' + (b===0?'':(b>0?' + ':' − ') + Math.abs(b));
  let skType = 'pp', skCur = null, skOk = 0, skAll = 0;
  const skQ = document.getElementById('skQ'), skA = document.getElementById('skA'), skFb = document.getElementById('skFb');
  function field(id, label){ return '<label>' + label + '<input id="' + id + '" inputmode="decimal" autocomplete="off"></label>'; }
  function skGen(){
    skFb.hidden = true;
    if(skType === 'pp'){
      const m = nz(-4,4), b = rnd(-6,6), x = nz(-3,3), on = Math.random() < 0.5;
      const y = m*x + b + (on ? 0 : nz(-2,2));
      skCur = {ans: on, expl: sg(m) + ' · ' + (x<0?'('+sg(x)+')':x) + (b===0?'':(b>0?' + ':' − ') + Math.abs(b)) + ' = ' + sg(m*x+b) + (on ? ' = y ✓ → liegt darauf' : ' ≠ ' + sg(y) + ' → liegt nicht darauf')};
      skQ.textContent = 'Liegt P(' + sg(x) + ' | ' + sg(y) + ') auf y = ' + lin(m,b) + '?';
      skA.innerHTML = '<label><span>Antwort</span><select id="skIn1" style="font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--fg)"><option value="">bitte wählen</option><option value="1">liegt darauf</option><option value="0">liegt nicht darauf</option></select></label>';
    } else if(skType === 'kl'){
      const a = nz(-5,5), c = nz(-8,8), withX = Math.random() < 0.25;
      if(withX){
        skCur = {k:[1, c], expl:'x · x + x · ' + (c<0?'('+sg(c)+')':c) + ' = x² ' + (c>0?'+ ':'− ') + Math.abs(c) + 'x', x2:true};
        skQ.textContent = 'x(x ' + (c>0?'+ ':'− ') + Math.abs(c) + ') = ?x² + ?x';
        skA.innerHTML = field('skIn1','Zahl vor x²') + field('skIn2','Zahl vor x');
      } else {
        skCur = {k:[a, a*c], expl: (a<0?'('+sg(a)+')':a) + ' · x + ' + (a<0?'('+sg(a)+')':a) + ' · ' + (c<0?'('+sg(c)+')':c) + ' = ' + lin(a, a*c)};
        skQ.textContent = (a===-1?'−':sg(a)) + '(x ' + (c>0?'+ ':'− ') + Math.abs(c) + ') = ?x + ?';
        skA.innerHTML = field('skIn1','Zahl vor x') + field('skIn2','Zahl ohne x');
      }
    } else if(skType === 'gl'){
      const a = nz(-5,5), x = rnd(-6,6), b = rnd(-9,9), c = a*x + b;
      skCur = {k:[x], expl: lin(a,b) + ' = ' + sg(c) + '  | ' + (b>=0?'− ':'+ ') + Math.abs(b) + '  →  ' + (a===1?'':a===-1?'−':sg(a)) + 'x = ' + sg(c-b) + '  | : ' + (a<0?'('+sg(a)+')':a) + '  →  x = ' + sg(x)};
      skQ.textContent = lin(a,b) + ' = ' + sg(c) + '   x = ?';
      skA.innerHTML = field('skIn1','x =');
    } else {
      const v = rnd(2,12), t = rnd(0,3);
      if(t === 0){ skCur = {k:[v*v], expl:'(−' + v + ')² = (−' + v + ') · (−' + v + ') = ' + v*v}; skQ.textContent = '(−' + v + ')² = ?'; }
      else if(t === 1){ skCur = {k:[-v*v], expl:'−' + v + '² = −(' + v + ' · ' + v + ') = −' + v*v}; skQ.textContent = '−' + v + '² = ?'; }
      else if(t === 2){ skCur = {k:[v], expl:'√' + v*v + ' = ' + v + ', weil ' + v + ' · ' + v + ' = ' + v*v}; skQ.textContent = '√' + v*v + ' = ?'; }
      else { skCur = {k:[v], two:true, expl:'x = ' + v + ' oder x = −' + v + ', denn beide Zahlen ergeben quadriert ' + v*v}; skQ.textContent = 'x² = ' + v*v + '   Gib die positive Lösung an. Wie heißt die zweite?'; }
      skA.innerHTML = field('skIn1','Ergebnis') + (skCur.two ? field('skIn2','zweite Lösung') : '');
      if(skCur.two) skCur.k = [v, -v];
    }
    skA.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if(e.key === 'Enter') skCheck(); }));
  }
  function skCheck(){
    if(!skCur) return;
    let ok;
    if(skType === 'pp'){ const v = document.getElementById('skIn1').value; if(v === '') return; ok = (v === '1') === skCur.ans; }
    else { ok = skCur.k.every((k,i) => { const el = document.getElementById('skIn' + (i+1)); const raw = el ? el.value.trim() : ''; const n = skType === 'kl' && (raw === '' || raw === '+') ? 1 : skType === 'kl' && (raw === '-' || raw === '−') ? -1 : num(raw); return Math.abs(n - k) < 1e-9; }); }
    skAll++; if(ok) skOk++;
    skFb.hidden = false; skFb.className = 'fb ' + (ok ? 'ok' : 'no');
    skFb.textContent = (ok ? 'Richtig! ' : 'Noch nicht. ') + 'Rechnung: ' + skCur.expl;
    document.getElementById('skScore').textContent = skOk + ' von ' + skAll + ' richtig';
  }
  document.querySelectorAll('[data-sk]').forEach(b => b.addEventListener('click', () => {
    skType = b.dataset.sk; document.querySelectorAll('[data-sk]').forEach(x => x.setAttribute('aria-pressed', x === b)); skGen(); }));
  document.getElementById('skCheck').addEventListener('click', skCheck);
  document.getElementById('skNew').addEventListener('click', skGen);
  skGen();

  }
  function drawAll(){ drawHero(); if(typeof lab === 'function') lab(); if(typeof drawSk === 'function') drawSk(); }
  drawAll(); if(typeof gen === 'function') gen();
  // Sprung zu einer Trainer-Aufgabenart: trainer.html#t-lin2p
  { const mt = location.hash.match(/^#t-(\w+)$/); if(mt){ const bt = document.querySelector('.ttabs button[data-t="' + mt[1] + '"]'); if(bt) bt.click(); } }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', drawAll);
  new MutationObserver(drawAll).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(drawAll);
})();
// GT-JS-START
  // ---------- Gleichungs-Trainer (mit / ohne Schritte) ----------
  if(document.getElementById('gtArea')) (function(){
    const R = (a,b) => a + Math.floor(Math.random()*(b-a+1));
    const NZ = (a,b) => { let v; do { v = R(a,b); } while(v === 0); return v; };
    const pick = a => a[Math.floor(Math.random()*a.length)];
    const f = v => { v = Math.round(v*10000)/10000; return (v < 0 ? '−' : '') + String(Math.abs(v)).replace('.', ','); };
    const par = v => v < 0 ? '(' + f(v) + ')' : f(v);
    const sgn = (v,t) => (v < 0 ? ' − ' : ' + ') + (t && Math.abs(v) === 1 ? '' : f(Math.abs(v))) + (t || '');
    const lead = (v,t) => (t && v === 1 ? '' : t && v === -1 ? '−' : f(v)) + (t || '');
    const lin = (a,b) => lead(a,'x') + (b ? sgn(b) : '');
    const poly = (a,b,c) => lead(a,'x²') + (b ? sgn(b,'x') : '') + (c ? sgn(c) : '');
    const op = v => (v > 0 ? '− ' : '+ ') + f(Math.abs(v));
    const SH = {s:v=>sgn(v), n:v=>f(v), c2:v=>lead(v,'x²'), sx:v=>sgn(v,'x')}, PRE = {s:' ', n:'', c2:'', sx:' '}, POST = {s:'', n:'', c2:'x²', sx:'x'};
    const S = (a,fm,q,h,tol) => ({slot:true, a, f:fm, q, h, tol:tol || 1e-6});
    const row = (l,o,r,n) => ({l:[].concat(l), o:o || '=', r:[].concat(r), n:n || ''});

    const GEN = {
      lin(){
        const a = pick([2,3,4,5,6,8,-2,-3,-4,-5,0.5,-0.5]);
        let x;
        if(Math.abs(a) === 0.5) x = 2 * NZ(-6,6);
        else if(Math.abs(a) % 2 === 0 && Math.random() < 0.3) x = NZ(-6,6) + 0.5;
        else x = NZ(-9,9);
        const b = -a * x;
        return {t:'0 = ' + lin(a,b), sol:[x], rows:[
          row('0', '=', lin(a,b), '| ' + op(b)),
          row(S(-b,'n','Rechne auf beiden Seiten ' + op(b) + '. Was steht jetzt links?', '0 ' + op(b) + ' = ?  Die Zahl wechselt beim Rüberbringen das Vorzeichen.'), '=', lead(a,'x'), '| : ' + par(a)),
          row(S(x,'n','Teile beide Seiten durch ' + par(a) + '. Welche Zahl ist x?', f(-b) + ' : ' + par(a) + ' = ?  Minus durch Minus ergibt Plus.'), '=', 'x')],
          fin:'x = ' + f(x)};
      },
      schnitt(){
        const A = pick([-0.1,-0.2,-0.25,-0.4,-0.5]), x2 = pick([2,3,4,5,6,8]), B = Math.round(-A * x2 * 1000) / 1000;
        const a2 = pick([-0.05,-0.1,-0.2,-0.3]), a1 = Math.round((a2 + A) * 1000) / 1000;
        const b2 = pick([0.5,0.8,1,1.2,1.5]), b1 = Math.round((b2 + B) * 1000) / 1000, c = pick([1.5,1.8,2,2.2]);
        const y = Math.round((a1*x2*x2 + b1*x2 + c) * 100) / 100;
        return {t:'f(x) = ' + poly(a1,b1,c) + ' und g(x) = ' + poly(a2,b2,c) + '. Wo sind beide gleich hoch?', sol:[x2, y], ordered:true,
          freeQ:'<b>Gib x und die Höhe des zweiten Schnittpunkts ein</b> (nicht x = 0), getrennt durch ; – z. B. 4; 3,1.', rows:[
          row(poly(a1,b1,c), '=', poly(a2,b2,c), 'gleichsetzen'),
          row([S(A,'c2','Bringe alles auf die linke Seite. Welche Zahl steht jetzt vor x²?','Rechne ' + f(a1) + ' − ' + par(a2) + '.'),
               S(B,'sx','Welche Zahl steht jetzt vor x?','Rechne ' + f(b1) + ' − ' + par(b2) + '. Die Zahl ohne x fällt weg: ' + f(c) + ' − ' + f(c) + ' = 0.')], '=', '0', 'alles auf eine Seite'),
          row('x(' + lead(A,'x') + sgn(B) + ')', '=', '0', 'x ausklammern'),
          row('x', '=', ['0  oder  x = ', S(x2,'n','x = 0 ist der Start. Löse ' + lin(A,B) + ' = 0.','Rechne ' + op(B) + ', dann : ' + par(A) + '.')]),
          row('f(' + f(x2) + ')', '≈', S(y,'n','Berechne die Höhe: Setze x = ' + f(x2) + ' in f ein (auf 2 Stellen runden).','f(' + f(x2) + ') = ' + f(a1) + ' · ' + f(x2) + '² + ' + f(b1) + ' · ' + f(x2) + ' + ' + f(c), 0.0051), 'y-Wert nicht vergessen!')],
          fin:'Schnittpunkt (' + f(x2) + ' | ' + f(y) + ') – bei x = 0 starten beide'};
      },
      quad(){
        const k = Math.random();
        if(k < 0.2){                                     // Falle: keine Lösung
          const a = pick([1,2,3,0.5,-1,-2]), q = pick([4,9,16,25,1,36]), c = a * q;   // gleiches Vorzeichen
          const rows = [row('0', '=', poly(a,0,c), '| ' + op(c))];
          if(a !== 1){
            rows.push(row(S(-c,'n','Rechne auf beiden Seiten ' + op(c) + '. Was steht links?','0 ' + op(c) + ' = ?'), '=', lead(a,'x²'), '| : ' + par(a)));
            rows.push(row(S(-q,'n','Teile durch ' + par(a) + '. Was steht links?', f(-c) + ' : ' + par(a) + ' = ?'), '=', 'x²', 'Wurzel ziehen?'));
          } else rows.push(row(S(-q,'n','Rechne auf beiden Seiten ' + op(c) + '. Was steht links?','0 ' + op(c) + ' = ?'), '=', 'x²', 'Wurzel ziehen?'));
          rows.push(row('Anzahl der Lösungen', '=', S(0,'n','x² ist negativ. Wie viele Lösungen gibt es? (0, 1 oder 2)','Keine Zahl mal sich selbst ergibt eine negative Zahl.')));
          return {t:'0 = ' + poly(a,0,c), sol:[], rows, fin:'keine Lösung'};
        }
        if(k < 0.45){                                    // x ausklammern
          const a = pick([1,1,2,3,-1]), r = NZ(-9,9), b = -a * r;
          return {t:'0 = ' + poly(a,b,0), sol:[0, r], rows:[
            row('0', '=', poly(a,b,0), 'x ausklammern'),
            row('0', '=', ['x(' + lead(a,'x'), S(b,'s','Klammere x aus. Welche Zahl steht in der Klammer hinter ' + lead(a,'x') + '?','Teile jedes Glied durch x: ' + lead(b,'x') + ' : x = ?'), ')'], 'ein Faktor muss 0 sein'),
            row('x', '=', ['0  oder  x = ', S(r,'n','Erste Lösung: x = 0. Löse für die zweite ' + lin(a,b) + ' = 0.','Rechne ' + op(b) + ' und dann : ' + par(a) + '.')])],
            fin:'x = 0  oder  x = ' + f(r)};
        }
        const a = pick([1,2,3,0.5,-1,-2,-0.5]), r = pick([1,2,3,4,5,6,7,8,9,10,1.5,2.5]), q = r * r, c = -a * q;
        const rows = [row('0', '=', poly(a,0,c), '| ' + op(c))];
        if(a !== 1){
          rows.push(row(S(-c,'n','Rechne auf beiden Seiten ' + op(c) + '. Was steht links?','0 ' + op(c) + ' = ?'), '=', lead(a,'x²'), '| : ' + par(a)));
          rows.push(row(S(q,'n','Teile beide Seiten durch ' + par(a) + '. Was steht links?', f(-c) + ' : ' + par(a) + ' = ?'), '=', 'x²', '| √'));
        } else rows.push(row(S(q,'n','Rechne auf beiden Seiten ' + op(c) + '. Was steht links?','0 ' + op(c) + ' = ?'), '=', 'x²', '| √'));
        rows.push(row('x', '=', [S(r,'n','Ziehe die Wurzel. Wie heißt die positive Lösung?','Welche Zahl mal sich selbst ergibt ' + f(q) + '?'), '  oder  x = ',
                                 S(-r,'n','Es gibt noch eine zweite Lösung. Welche?','Auch (−' + f(r) + ')² = ' + f(q) + '.')]));
        return {t:'0 = ' + poly(a,0,c), sol:[r, -r], rows, fin:'x = ' + f(r) + '  oder  x = ' + f(-r)};
      }
    };

    let type = 'lin', mode = 'steps', task = null, slots = [], idx = 0, tries = 0, helped = false, ok = 0, all = 0, streak = 0, done = false;
    const area = document.getElementById('gtArea'), q = document.getElementById('gtQ'), fb = document.getElementById('gtFb');
    const show = document.getElementById('gtShow'), form = document.getElementById('gtForm'), free = document.getElementById('gtFree');
    const hintBtn = document.getElementById('gtHint'), checkBtn = document.getElementById('gtCheck');
    function part(p, full){
      if(!p.slot) return p;
      const i = slots.indexOf(p);
      if(full || i < idx) return '<span class="st-done">' + SH[p.f](p.a) + '</span>';
      if(i === idx) return PRE[p.f] + '<input class="st-in" id="gtIn" inputmode="decimal" autocomplete="off" aria-label="Antwort">' + POST[p.f];
      return PRE[p.f] + '<span class="st-slot">?</span>' + POST[p.f];
    }
    function rowsHtml(full){
      const cur = !full && idx < slots.length ? slots[idx] : null;
      let last = task.rows.length - 1;
      if(cur) last = task.rows.findIndex(r => r.l.includes(cur) || r.r.includes(cur));
      let h = '<div class="eqg">';
      task.rows.slice(0, last + 1).forEach(r => {
        h += '<span class="eqlab"></span><span class="eql">' + r.l.map(p => part(p, full)).join('') + '</span><span class="eqo">' + r.o + '</span><span class="eqr">' + r.r.map(p => part(p, full)).join('') + '</span><span class="eqn">' + r.n + '</span>';
      });
      return h + '</div>' + (cur ? '' : '<p class="st-fin">Ergebnis: ' + task.fin + '</p>');
    }
    function render(){
      if(mode === 'free'){
        area.innerHTML = done ? rowsHtml(true) : '';
        q.innerHTML = done ? '' : (task.freeQ || '<b>Gib alle Lösungen ein.</b> Mehrere Lösungen mit ; trennen (z. B. 4; −4). Keine Lösung: „keine“.');
        free.hidden = done; checkBtn.hidden = done; hintBtn.hidden = done; show.hidden = done || tries < 1;
        if(!done) free.focus({preventScroll:true});
        return;
      }
      free.hidden = true;
      const cur = idx < slots.length ? slots[idx] : null;
      area.innerHTML = rowsHtml(false);
      checkBtn.hidden = hintBtn.hidden = !cur;
      show.hidden = !cur || tries < 2;
      q.innerHTML = cur ? '<b>Schritt ' + (idx + 1) + ' von ' + slots.length + ':</b> ' + cur.q : '';
      const inp = document.getElementById('gtIn'); if(inp) inp.focus({preventScroll:true});
    }
    function fresh(){
      task = GEN[type]();
      slots = []; task.rows.forEach(r => r.l.concat(r.r).forEach(p => { if(p.slot) slots.push(p); }));
      idx = 0; tries = 0; helped = false; done = false; fb.hidden = true; free.value = '';
      document.getElementById('gtTask').textContent = (task.ordered ? '' : 'Löse: ') + task.t;
      render();
    }
    function finish(){
      done = true; all++; if(!helped){ ok++; streak++; } else streak = 0;
      document.getElementById('gtScore').textContent = 'Ohne Hilfe gelöst: ' + ok + ' von ' + all;
      fb.hidden = false; fb.className = 'fb ok';
      let t = helped ? 'Fertig! Rechne die Aufgabe jetzt noch einmal allein im Heft.' : 'Super, alles richtig! Klick auf „Neue Aufgabe“.';
      if(mode === 'steps' && streak >= 3) t += '<div class="gt-tip"><b>Drei richtig ohne Hilfe!</b> Probier es jetzt ohne Schritte. <button type="button" class="xbtn" id="gtGoFree">Ohne Schritte üben →</button></div>';
      fb.innerHTML = t;
      const g = document.getElementById('gtGoFree'); if(g) g.addEventListener('click', () => setMode('free'));
    }
    function next(){
      idx++; tries = 0;
      if(idx >= slots.length){ render(); finish(); return; }
      fb.hidden = false; fb.className = 'fb ok'; fb.textContent = '✓ Richtig! Weiter mit dem nächsten Schritt.';
      render();
    }
    const num = t => parseFloat(t.replace(/\s/g,'').replace(/[−–]/g,'-').replace(',', '.'));
    function checkFree(){
      const raw = free.value.trim();
      if(!raw){ fb.hidden = false; fb.className = 'fb'; fb.textContent = 'Gib deine Lösung ein.'; return; }
      let vals;
      if(/kein/i.test(raw)) vals = [];
      else {
        vals = [];
        raw.split(/;|oder|und|\|/i).forEach(p => { p = p.trim().replace(/^x\s*[₁₂12]?\s*=\s*/i, ''); if(!p) return;
          if(/^±|^\+\/?-/.test(p)){ const v = num(p.replace(/^±|^\+\/?-/, '')); vals.push(v, -v); } else vals.push(num(p)); });
        if(vals.some(isNaN)){ fb.hidden = false; fb.className = 'fb'; fb.textContent = 'Das kann ich nicht lesen. Beispiel: 4; −4'; return; }
      }
      if(task.ordered){
        const okO = vals.length === task.sol.length && vals.every((v,i) => Math.abs(v - task.sol[i]) <= (i ? 0.0051 : 1e-6));
        if(okO){ render(); finish(); render(); return; }
        tries++; fb.hidden = false; fb.className = 'fb'; show.hidden = false;
        fb.innerHTML = '✗ Noch nicht. ' + (vals.length !== 2 ? 'Gib zwei Zahlen ein: x; Höhe.' : 'Prüfe x und die Höhe. Hast du f(x) mit deinem x berechnet?'); return;
      }
      const want = task.sol.slice().sort((a,b) => a-b), got = Array.from(new Set(vals.map(v => Math.round(v*10000)/10000))).sort((a,b) => a-b);
      if(want.length === got.length && want.every((v,i) => Math.abs(v - got[i]) < 1e-6)){ render(); finish(); render(); return; }
      tries++;
      fb.hidden = false; fb.className = 'fb';
      fb.innerHTML = '✗ Noch nicht. ' + (got.length < want.length ? 'Es gibt ' + (want.length === 2 ? 'zwei Lösungen.' : 'eine Lösung.') : got.length > want.length ? (want.length ? 'Es gibt weniger Lösungen.' : 'Prüfe, ob es überhaupt eine Lösung gibt.') : 'Prüfe deine Rechnung.') + ' Tipp: Schalte auf „Mit Schritten“, wenn du nicht weiterkommst.';
      show.hidden = false;
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      if(mode === 'free') return checkFree();
      const inp = document.getElementById('gtIn'); if(!inp) return;
      const raw = inp.value.trim(), v = num(raw);
      if(raw === '' || isNaN(v)){ fb.hidden = false; fb.className = 'fb'; fb.textContent = 'Bitte eine Zahl eingeben.'; return; }
      const s = slots[idx];
      if(Math.abs(v - s.a) <= s.tol) return next();
      tries++;
      fb.hidden = false; fb.className = 'fb'; fb.innerHTML = '✗ Noch nicht. <b>Tipp:</b> ' + s.h;
      show.hidden = tries < 2; inp.select();
    });
    area.addEventListener('keydown', e => { if(e.key === 'Enter' && e.target.id === 'gtIn'){ e.preventDefault(); form.requestSubmit(); } });
    hintBtn.addEventListener('click', () => {
      helped = true; fb.hidden = false; fb.className = 'fb';
      if(mode === 'free'){ const r0 = task.rows[0]; fb.innerHTML = '<b>Tipp:</b> Beginne mit: ' + r0.n + (type === 'quad' && task.sol.length === 2 && task.sol[0] !== 0 ? '. Denk an die zweite Lösung!' : '.'); return; }
      const s = slots[idx]; if(s) fb.innerHTML = '<b>Tipp:</b> ' + s.h;
    });
    show.addEventListener('click', () => {
      helped = true;
      if(mode === 'free'){ done = true; streak = 0; all++; document.getElementById('gtScore').textContent = 'Ohne Hilfe gelöst: ' + ok + ' von ' + all; render(); fb.hidden = false; fb.className = 'fb'; fb.textContent = 'So geht es. Probier die nächste Aufgabe!'; return; }
      const s = slots[idx]; next(); fb.className = 'fb'; fb.innerHTML = 'Lösung: <b>' + SH[s.f](s.a).trim() + '</b>. Weiter geht es mit dem nächsten Schritt.';
    });
    document.getElementById('gtNew').addEventListener('click', fresh);
    function setType(t){ type = t; document.querySelectorAll('#gtBlock [data-g]').forEach(b => b.setAttribute('aria-pressed', b.dataset.g === t ? 'true' : 'false')); fresh(); }
    function setMode(m){ mode = m; streak = 0; document.querySelectorAll('#gtBlock .gt-m').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === m ? 'true' : 'false')); fresh(); }
    document.querySelectorAll('#gtBlock [data-g]').forEach(b => b.addEventListener('click', () => setType(b.dataset.g)));
    document.querySelectorAll('#gtBlock .gt-m').forEach(b => b.addEventListener('click', () => setMode(b.dataset.m)));
    function fromHash(){ const m = location.hash.match(/^#gt-(lin|quad|schnitt)$/); if(m) setType(m[1]); }
    window.addEventListener('hashchange', fromHash);
    document.addEventListener('click', e => { const a = e.target.closest('a[href$="#gt-lin"], a[href$="#gt-quad"], a[href$="#gt-schnitt"]'); if(a) setTimeout(fromHash, 0); });
    fresh(); fromHash();
    window.gtTrainer = {GEN, setType, setMode};
  })();
// GT-JS-END
