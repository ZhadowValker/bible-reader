/* Bible Timeline explorer — overlay with two tabs:
 *   1. Timeline  — zoomable, scrollable lanes (patriarchs, kingdoms, prophets, world powers, NT)
 *   2. 66 Books  — floating-bar chart of the period each book covers
 * Clicking anything can open the passage in the parallel reader.
 * Depends on globals from index.html: state, BIBLE_BOOKS, findBookKeyInData, getBooks,
 * selectBook, selectChap, readChap, scrollToVerse, showCopyToast.
 */
(function () {
  const LANES = window.TL_LANES, EVENTS = window.TL_EVENTS, BOOKS = window.TL_BOOKS;
  const LABEL_W = 118, ROW_H = 26, PAD_YEARS = 80;
  const RANGES = [
    { id: 'all',  label: 'All',            a: -4100, b: 120 },
    { id: 'pat',  label: '2200–1400 BC',   a: -2200, b: -1400 },
    { id: 'king', label: '1400–400 BC',    a: -1400, b: -400 },
    { id: 'nt',   label: '400 BC–AD 100',  a: -400,  b: 100 },
  ];
  const GROUP_COLORS = {
    'Law': '#c9a84c', 'History': '#b5835a', 'Poetry & Wisdom': '#9a7bb5', 'Major Prophets': '#6fa8a0',
    'Minor Prophets': '#7fae6e', 'Gospels': '#d4796b', 'Acts': '#d49a4a', 'Paul\'s Letters': '#8ab4c9',
    'General Letters': '#a3a3c9', 'Prophecy': '#c97b9c',
  };
  const LANE_COLORS = { orig: '#c9a84c', exod: '#b5835a', mon: '#6fa8a0', proph: '#9a7bb5', world: '#8a7d60', nt: '#8ab4c9' };

  const S = { mode: 'conv', tab: 'time', scale: 1.2, range: 'all', q: '', sel: null, built: false };
  let el = {};
  let minY = -4004 - PAD_YEARS, maxY = 100 + PAD_YEARS;

  // ── helpers ────────────────────────────────────────────────────────────────
  const fy = y => (y < 0 ? (-y) + ' BC' : 'AD ' + y);
  const norm = d => (d == null ? null : Array.isArray(d) ? d : [d, d]);
  function dates(it) {
    const c = norm(it.c), u = norm(it.u);
    if (S.mode === 'ussher') return { d: u || c, trad: false };
    if (c) return { d: c, trad: false };
    return { d: u, trad: true };
  }
  function fmtRange(d) { return d[0] === d[1] ? fy(d[0]) : fy(d[0]) + ' – ' + fy(d[1]); }
  function h(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function matches(str) { return !S.q || str.toLowerCase().includes(S.q.toLowerCase()); }
  function xOf(y) { return LABEL_W + (y - minY) * S.scale; }

  // ── styles ─────────────────────────────────────────────────────────────────
  function injectCSS() {
    const st = document.createElement('style');
    st.textContent = `
    #tl-overlay{position:fixed;inset:0;z-index:600;background:var(--bg);display:none;flex-direction:column;font-family:Georgia,serif;color:var(--text)}
    #tl-overlay.open{display:flex}
    #tl-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 12px;background:var(--bar);border-bottom:1px solid var(--bar-border);flex-shrink:0}
    #tl-head .tl-title{color:var(--gold);font-style:italic;font-weight:bold;letter-spacing:1px;font-size:13px;margin-right:6px}
    .tl-btn{background:var(--btn-inactive-bg);color:var(--btn-inactive-text);border:1px solid var(--btn-inactive-border);border-radius:5px;padding:5px 10px;font:inherit;font-size:12px;cursor:pointer}
    .tl-btn.on{background:var(--btn-active-bg);color:var(--btn-active-text);border-color:transparent}
    .tl-btn:disabled{opacity:.4;cursor:default}
    .tl-grp{display:flex;gap:0}.tl-grp .tl-btn{border-radius:0}.tl-grp .tl-btn:first-child{border-radius:5px 0 0 5px}.tl-grp .tl-btn:last-child{border-radius:0 5px 5px 0}
    #tl-search{background:var(--input-bg);color:var(--text);border:1px solid var(--gold-border);border-radius:5px;padding:5px 8px;font:inherit;font-size:12px;width:150px;min-width:0}
    #tl-count{font-size:11px;color:var(--muted);font-style:italic}
    #tl-spacer{flex:1}
    #tl-body{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}
    #tl-time{flex:1;min-height:0;overflow:auto;position:relative;cursor:grab}
    #tl-time.drag{cursor:grabbing;user-select:none}
    #tl-canvas{position:relative}
    #tl-axis{position:sticky;top:0;z-index:5;height:26px;background:var(--bar);border-bottom:1px solid var(--bar-border)}
    .tl-tick{position:absolute;top:0;height:26px;border-left:1px solid var(--gold-border);padding:6px 0 0 4px;font-size:10px;color:var(--muted);white-space:nowrap}
    .tl-grid{position:absolute;top:26px;bottom:0;border-left:1px dashed var(--divider);pointer-events:none}
    .tl-lane{position:relative;border-bottom:1px solid var(--divider)}
    .tl-lane-label{position:sticky;left:0;z-index:4;width:${LABEL_W}px;height:100%;background:var(--bar);border-right:1px solid var(--bar-border);padding:6px 8px;font-size:11px;font-style:italic;color:var(--gold);box-sizing:border-box}
    .tl-item{position:absolute;height:20px;font-size:11px;line-height:20px;white-space:nowrap;cursor:pointer;color:var(--verse)}
    .tl-item.ev:before{content:'';display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--lc);margin-right:5px;vertical-align:-1px}
    .tl-item.sp{background:color-mix(in srgb,var(--lc) 28%,transparent);border-left:3px solid var(--lc);padding-left:5px;border-radius:0 3px 3px 0;box-sizing:border-box}
    .tl-item.trad.ev:before{background:transparent;border:2px dashed var(--lc);box-sizing:border-box}
    .tl-item.dim{opacity:.18}
    .tl-item.hit{outline:2px solid var(--gold);outline-offset:1px;border-radius:3px}
    .tl-item.sel{outline:2px solid var(--verse);outline-offset:1px;border-radius:3px}
    #tl-sticky-labels{position:absolute}
    #tl-detail{flex-shrink:0;background:var(--modal-bg);border-top:1px solid var(--modal-border);padding:10px 14px;display:none;max-height:38%;overflow:auto}
    #tl-detail.open{display:block}
    #tl-detail h3{font-size:15px;color:var(--gold);margin-bottom:2px}
    #tl-detail .dts{font-size:12px;color:var(--muted);margin-bottom:6px}
    #tl-detail p{font-size:13px;line-height:1.5;margin-bottom:8px}
    #tl-detail .row{display:flex;gap:8px;flex-wrap:wrap}
    #tl-books{flex:1;min-height:0;overflow:auto;padding:6px 8px 20px;display:none}
    #tl-books svg{display:block;width:100%}
    .tl-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--muted);padding:2px 4px 6px}
    .tl-legend i{display:inline-block;width:14px;height:8px;margin-right:4px;vertical-align:middle}
    #tl-foot{font-size:10px;color:var(--muted);padding:4px 12px;border-top:1px solid var(--divider);flex-shrink:0}
    #tl-btn-open{background:var(--btn-inactive-bg);color:var(--btn-inactive-text);border:1px solid var(--btn-inactive-border);border-radius:5px;padding:3px 10px;font:inherit;font-size:12px;cursor:pointer}
    @media (max-width:640px){#tl-search{width:110px}.tl-lane-label{font-size:10px}}
    `;
    document.head.appendChild(st);
  }

  // ── build shell ────────────────────────────────────────────────────────────
  function build() {
    injectCSS();
    // range across all data
    let lo = 0, hi = 0;
    EVENTS.forEach(e => [e.c, e.u].forEach(d => { const n = norm(d); if (n) { lo = Math.min(lo, n[0]); hi = Math.max(hi, n[1]); } }));
    minY = lo - PAD_YEARS; maxY = hi + PAD_YEARS;

    const o = h('div'); o.id = 'tl-overlay';
    const head = h('div'); head.id = 'tl-head';
    head.appendChild(h('span', 'tl-title', '⏳ Bible Timeline'));

    const tabs = h('div', 'tl-grp');
    el.tabTime = h('button', 'tl-btn on', 'Timeline'); el.tabBooks = h('button', 'tl-btn', '66 Books');
    el.tabTime.onclick = () => setTab('time'); el.tabBooks.onclick = () => setTab('books');
    tabs.append(el.tabTime, el.tabBooks); head.appendChild(tabs);

    const modes = h('div', 'tl-grp');
    el.mConv = h('button', 'tl-btn on', 'Conventional'); el.mUss = h('button', 'tl-btn', 'Ussher');
    el.mConv.title = 'Modern scholarly dates'; el.mUss.title = 'Ussher\'s chronology, as on Adams\' 1881 chart';
    el.mConv.onclick = () => setMode('conv'); el.mUss.onclick = () => setMode('ussher');
    modes.append(el.mConv, el.mUss); el.modes = modes; head.appendChild(modes);

    const zoom = h('div', 'tl-grp'); el.zoom = zoom;
    const zo = h('button', 'tl-btn', '−'), zi = h('button', 'tl-btn', '+');
    zo.title = 'Zoom out'; zi.title = 'Zoom in';
    zo.onclick = () => zoomBy(1 / 1.5); zi.onclick = () => zoomBy(1.5);
    zoom.append(zo, zi); head.appendChild(zoom);

    el.rangeGrp = h('div', 'tl-grp');
    RANGES.forEach(r => { const b = h('button', 'tl-btn' + (r.id === S.range ? ' on' : ''), r.label); b.dataset.r = r.id; b.onclick = () => setRange(r.id); el.rangeGrp.appendChild(b); });
    el.rangeGrp.style.display = 'none'; head.appendChild(el.rangeGrp);

    el.search = h('input'); el.search.id = 'tl-search'; el.search.type = 'search'; el.search.placeholder = 'Search…';
    el.search.addEventListener('input', () => { S.q = el.search.value.trim(); refresh(true); });
    head.appendChild(el.search);
    el.count = h('span'); el.count.id = 'tl-count'; head.appendChild(el.count);
    head.appendChild(h('span')).id = 'tl-spacer';

    el.here = h('button', 'tl-btn', '📍 This book'); el.here.title = 'Show the book you are reading'; el.here.onclick = showCurrentBook;
    head.appendChild(el.here);
    const close = h('button', 'tl-btn', '✕ Close'); close.onclick = closeTL; head.appendChild(close);
    o.appendChild(head);

    const body = h('div'); body.id = 'tl-body';
    el.time = h('div'); el.time.id = 'tl-time'; el.canvas = h('div'); el.canvas.id = 'tl-canvas'; el.time.appendChild(el.canvas);
    el.books = h('div'); el.books.id = 'tl-books';
    el.detail = h('div'); el.detail.id = 'tl-detail';
    body.append(el.time, el.books, el.detail);
    o.appendChild(body);
    const foot = h('div', null, 'Dates are approximate. Conventional = modern scholarly dating (early-date Exodus). Ussher = chronology printed on Adams\' 1881 chart. Dashed marker = no conventional date, shown at the traditional date.');
    foot.id = 'tl-foot'; o.appendChild(foot);
    document.body.appendChild(o);
    el.overlay = o;

    // drag-to-pan (mouse only; touch uses native scrolling)
    let down = null, moved = false;
    el.time.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = { x: e.clientX, y: e.clientY, sl: el.time.scrollLeft, st: el.time.scrollTop }; moved = false;
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) { moved = true; el.time.classList.add('drag'); }
      if (moved) { el.time.scrollLeft = down.sl - dx; el.time.scrollTop = down.st - dy; }
    });
    window.addEventListener('pointerup', () => { down = null; setTimeout(() => el.time.classList.remove('drag'), 0); });
    el.time.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    el.time.addEventListener('wheel', e => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - el.time.getBoundingClientRect().left);
    }, { passive: false });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && el.overlay.classList.contains('open')) closeTL(); });
    window.addEventListener('resize', () => { if (el.overlay.classList.contains('open') && S.tab === 'books') renderBooks(); });
    S.built = true;
  }

  // ── state changes ──────────────────────────────────────────────────────────
  function setTab(t) {
    S.tab = t;
    el.tabTime.classList.toggle('on', t === 'time'); el.tabBooks.classList.toggle('on', t === 'books');
    el.time.style.display = t === 'time' ? '' : 'none';
    el.books.style.display = t === 'books' ? 'block' : 'none';
    el.zoom.style.display = t === 'time' ? '' : 'none';
    el.modes.style.display = t === 'time' ? '' : 'none';
    el.rangeGrp.style.display = t === 'books' ? '' : 'none';
    closeDetail();
    refresh(true);
  }
  function setMode(m) { S.mode = m; el.mConv.classList.toggle('on', m === 'conv'); el.mUss.classList.toggle('on', m === 'ussher'); refresh(false); }
  function setRange(id) { S.range = id; el.rangeGrp.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.r === id)); renderBooks(); }
  function zoomBy(f, anchorPx) {
    const old = S.scale, ns = Math.min(24, Math.max(0.12, old * f));
    if (ns === old) return;
    const cw = el.time.clientWidth, ax = anchorPx == null ? cw / 2 : anchorPx;
    const yAt = minY + (el.time.scrollLeft + ax - LABEL_W) / old;
    S.scale = ns; renderTime();
    el.time.scrollLeft = LABEL_W + (yAt - minY) * ns - ax;
  }
  function refresh(scrollToHit) { if (S.tab === 'time') renderTime(scrollToHit) ; else renderBooks(); }

  // ── timeline tab ───────────────────────────────────────────────────────────
  function niceStep() {
    const steps = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];
    return steps.find(s => s * S.scale >= 70) || 1000;
  }
  function renderTime(scrollToHit) {
    const c = el.canvas; c.innerHTML = '';
    const W = LABEL_W + (maxY - minY) * S.scale + 160;
    c.style.width = W + 'px';

    // axis + grid
    const axis = h('div'); axis.id = 'tl-axis'; axis.style.width = W + 'px'; c.appendChild(axis);
    const step = niceStep();
    const first = Math.ceil(minY / step) * step;
    const grid = h('div'); grid.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:100%;pointer-events:none';
    for (let y = first; y <= maxY; y += step) {
      if (y === 0) continue;
      const x = xOf(y);
      const t = h('div', 'tl-tick', fy(y)); t.style.left = x + 'px'; axis.appendChild(t);
      const g = h('div', 'tl-grid'); g.style.left = x + 'px'; grid.appendChild(g);
    }
    c.appendChild(grid);

    let hits = [], total = 0, firstHit = null;
    LANES.forEach(lane => {
      const items = EVENTS.filter(e => e.lane === lane.id).map(e => ({ e, dt: dates(e) })).filter(o => o.dt.d)
        .sort((a, b) => a.dt.d[0] - b.dt.d[0] || a.dt.d[1] - b.dt.d[1]);
      const rowEnds = [];
      const laneEl = h('div', 'tl-lane'); laneEl.style.setProperty('--lc', LANE_COLORS[lane.id]);
      const placed = [];
      items.forEach(({ e, dt }) => {
        const x1 = xOf(dt.d[0]), spanPx = (dt.d[1] - dt.d[0]) * S.scale, isSpan = dt.d[1] > dt.d[0];
        const lblW = e.label.length * 6.3 + (isSpan ? 14 : 22);
        const w = isSpan ? Math.max(spanPx, 8) : lblW;
        const end = x1 + Math.max(w, lblW) + 6;
        let r = rowEnds.findIndex(en => en < x1);
        if (r < 0) { r = rowEnds.length; rowEnds.push(0); }
        rowEnds[r] = end;
        placed.push({ e, dt, x1, w, isSpan, r });
      });
      const rows = Math.max(1, rowEnds.length);
      laneEl.style.height = (rows * ROW_H + 12) + 'px';
      const lab = h('div', 'tl-lane-label', lane.name); laneEl.appendChild(lab);
      placed.forEach(p => {
        total++;
        const it = h('div', 'tl-item ' + (p.isSpan ? 'sp' : 'ev') + (p.dt.trad ? ' trad' : ''), p.e.label);
        it.style.left = p.x1 + 'px'; it.style.top = (6 + p.r * ROW_H) + 'px';
        if (p.isSpan) it.style.minWidth = p.w + 'px';
        it.title = p.e.label + ' — ' + fmtRange(p.dt.d) + (p.dt.trad ? ' (traditional date)' : '');
        const hay = p.e.label + ' ' + p.e.note + ' ' + (p.e.ref ? p.e.ref[0] : '');
        if (S.q) { if (matches(hay)) { it.classList.add('hit'); hits.push(p); if (!firstHit) firstHit = p; } else it.classList.add('dim'); }
        if (S.sel === p.e) it.classList.add('sel');
        it.onclick = () => showDetail(p.e, it);
        laneEl.appendChild(it);
      });
      c.appendChild(laneEl);
    });
    el.count.textContent = S.q ? hits.length + ' of ' + total + ' match' : total + ' entries';
    if (scrollToHit && firstHit) el.time.scrollLeft = Math.max(0, firstHit.x1 - el.time.clientWidth / 3);
  }
  function focusYear(y) { el.time.scrollLeft = Math.max(0, xOf(y) - el.time.clientWidth / 3); }

  // ── detail card ────────────────────────────────────────────────────────────
  function closeDetail() { S.sel = null; el.detail.classList.remove('open'); el.detail.innerHTML = ''; }
  function showDetail(e, itemEl) {
    S.sel = e;
    el.canvas.querySelectorAll('.tl-item.sel').forEach(x => x.classList.remove('sel'));
    if (itemEl) itemEl.classList.add('sel');
    const d = el.detail; d.innerHTML = '';
    d.appendChild(h('h3', null, e.label));
    const cc = norm(e.c), uu = norm(e.u);
    let line = cc ? 'Conventional: ' + fmtRange(cc) : 'Conventional: undated';
    if (uu) line += '   ·   Ussher: ' + fmtRange(uu);
    d.appendChild(h('div', 'dts', line));
    if (e.note) d.appendChild(h('p', null, e.note));
    const row = h('div', 'row');
    if (e.ref) {
      const b = h('button', 'tl-btn on', '📖 Read ' + e.ref[0] + ' ' + e.ref[1] + ':' + e.ref[2]);
      b.onclick = () => openInReader(e.ref[0], e.ref[1], e.ref[2]); row.appendChild(b);
    }
    const x = h('button', 'tl-btn', 'Dismiss'); x.onclick = closeDetail; row.appendChild(x);
    d.appendChild(row); d.classList.add('open');
  }
  function showBookDetail(bk) {
    const d = el.detail; d.innerHTML = '';
    d.appendChild(h('h3', null, bk.n + '. ' + bk.name));
    const parts = [bk.group];
    parts.push(bk.cover ? 'Covers: ' + fmtRange(bk.cover) : 'Covers: undated');
    if (bk.written) parts.push('Written (traditional): ' + fmtRange(bk.written));
    d.appendChild(h('div', 'dts', parts.join('   ·   ')));
    if (bk.note) d.appendChild(h('p', null, bk.note));
    const row = h('div', 'row');
    const b = h('button', 'tl-btn on', '📖 Open ' + bk.name + ' in reader'); b.onclick = () => openInReader(bk.name, 1, 1); row.appendChild(b);
    const x = h('button', 'tl-btn', 'Dismiss'); x.onclick = closeDetail; row.appendChild(x);
    d.appendChild(row); d.classList.add('open');
  }

  // ── books tab ──────────────────────────────────────────────────────────────
  function niceTicks(a, b, pxW) {
    const span = b - a, target = Math.max(4, Math.floor(pxW / 90)), raw = span / target;
    const steps = [10, 25, 50, 100, 200, 250, 500, 1000];
    const step = steps.find(s => s >= raw) || 1000, out = [];
    for (let y = Math.ceil(a / step) * step; y <= b; y += step) if (y !== 0) out.push(y);
    return out;
  }
  function renderBooks() {
    const rg = RANGES.find(r => r.id === S.range), a = rg.a, b = rg.b;
    const wrap = el.books; wrap.innerHTML = '';
    const total = Math.max(320, wrap.clientWidth - 16);
    const labW = total < 480 ? 96 : 132, rowH = 22, headH = 22, axisH = 26, W = total;
    const plotW = W - labW - 10;
    const X = y => labW + Math.max(0, Math.min(1, (y - a) / (b - a))) * plotW;

    const leg = h('div', 'tl-legend');
    Object.keys(GROUP_COLORS).forEach(g => { const s = h('span'); const i = h('i'); i.style.background = GROUP_COLORS[g]; s.append(i, document.createTextNode(g)); leg.appendChild(s); });
    const w = h('span'); const dm = h('i'); dm.style.cssText = 'width:8px;height:8px;background:var(--verse);transform:rotate(45deg)'; w.append(dm, document.createTextNode('written (traditional)')); leg.appendChild(w);
    wrap.appendChild(leg);

    // layout rows
    const groups = []; BOOKS.forEach(bk => { let g = groups[groups.length - 1]; if (!g || g.name !== bk.group) { g = { name: bk.group, items: [] }; groups.push(g); } g.items.push(bk); });
    let H = axisH; groups.forEach(g => { H += headH + g.items.length * rowH; });
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H);
    const add = (tag, attrs, text, parent) => { const n = document.createElementNS(NS, tag); Object.keys(attrs).forEach(k => n.setAttribute(k, attrs[k])); if (text != null) n.textContent = text; (parent || svg).appendChild(n); return n; };

    // axis + vertical grid
    niceTicks(a, b, plotW).forEach(y => {
      const x = X(y);
      add('line', { x1: x, x2: x, y1: axisH - 4, y2: H, stroke: 'currentColor', 'stroke-opacity': .12, 'stroke-dasharray': '3 3' });
      add('text', { x, y: 14, 'text-anchor': 'middle', 'font-size': 10, fill: 'currentColor', 'fill-opacity': .6 }, fy(y));
    });

    let yy = axisH, shown = 0;
    groups.forEach(g => {
      add('text', { x: 4, y: yy + 15, 'font-size': 11, 'font-style': 'italic', fill: GROUP_COLORS[g.name] || '#c9a84c', 'font-weight': 'bold' }, g.name);
      yy += headH;
      g.items.forEach(bk => {
        const rowY = yy, midY = rowY + rowH / 2;
        const inRange = bk.cover && bk.cover[1] >= a && bk.cover[0] <= b;
        const hay = bk.name + ' ' + bk.group;
        const isHit = !S.q || matches(hay);
        const gEl = add('g', { style: 'cursor:pointer', opacity: isHit ? (inRange || !bk.cover ? 1 : .35) : .15 });
        gEl.dataset.book = bk.name;
        add('rect', { x: 0, y: rowY, width: W, height: rowH, fill: 'transparent' }, null, gEl);
        add('text', { x: 8, y: midY + 4, 'font-size': 11, fill: 'currentColor' }, bk.n + '. ' + bk.name, gEl);
        if (!bk.cover) {
          add('text', { x: labW + 4, y: midY + 4, 'font-size': 10, 'font-style': 'italic', fill: 'currentColor', 'fill-opacity': .5 }, 'undated', gEl);
        } else if (inRange) {
          const x1 = X(bk.cover[0]), x2 = Math.max(X(bk.cover[1]), x1 + 4);
          add('rect', { x: x1, y: rowY + 4, width: x2 - x1, height: rowH - 8, rx: 3, fill: GROUP_COLORS[bk.group] || '#c9a84c', 'fill-opacity': .85 }, null, gEl);
        }
        if (bk.written && bk.written[1] >= a && bk.written[0] <= b) {
          const wx1 = X(bk.written[0]), wx2 = X(bk.written[1]), cx = (wx1 + wx2) / 2;
          if (wx2 - wx1 > 3) add('line', { x1: wx1, x2: wx2, y1: midY, y2: midY, stroke: 'currentColor', 'stroke-width': 2, 'stroke-opacity': .85 }, null, gEl);
          add('path', { d: `M${cx} ${midY - 5} L${cx + 5} ${midY} L${cx} ${midY + 5} L${cx - 5} ${midY} Z`, fill: 'currentColor', stroke: 'var(--bg)', 'stroke-width': 1 }, null, gEl);
        }
        gEl.addEventListener('click', () => { document.querySelectorAll('#tl-books g.sel-row rect').forEach(r => r.setAttribute('fill', 'transparent')); showBookDetail(bk); });
        if (S.sel === bk.name) { gEl.querySelector('rect').setAttribute('fill', 'rgba(201,168,76,.18)'); }
        shown++;
        yy += rowH;
      });
    });
    svg.style.color = 'var(--text)';
    wrap.appendChild(svg);
    el.count.textContent = S.q ? BOOKS.filter(bk => matches(bk.name + ' ' + bk.group)).length + ' of 66 match' : '66 books';
  }

  // ── reader integration ─────────────────────────────────────────────────────
  function currentBookName() {
    try {
      const books = getBooks();
      if (!state.book) return null;
      const idx = books.indexOf(state.book);
      if (books.length === 66 && idx >= 0) return BIBLE_BOOKS[idx];
      const hit = BIBLE_BOOKS.find(n => findBookKeyInData(n, state.leftData) === state.book);
      return hit || null;
    } catch (_) { return null; }
  }
  function showCurrentBook() {
    const name = currentBookName();
    if (!name) { toast('Open a book in the reader first'); return; }
    S.q = ''; el.search.value = '';
    S.range = 'all'; el.rangeGrp.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.r === 'all'));
    S.sel = name; setTab('books');
    const g = el.books.querySelector(`g[data-book="${CSS.escape(name)}"]`);
    if (g) { g.scrollIntoView({ block: 'center' }); const bk = BOOKS.find(b => b.name === name); showBookDetail(bk); }
  }
  function toast(msg) { try { showCopyToast(msg); } catch (_) { alert(msg); } }
  function openInReader(bookName, ch, v) {
    if (!state.leftData || !state.rightData) { toast('Bible text is still loading'); return; }
    const idx = BIBLE_BOOKS.indexOf(bookName);
    let key = findBookKeyInData(bookName, state.leftData);
    if (!key) { const bs = getBooks(); if (bs.length === 66 && idx >= 0) key = bs[idx]; }
    if (!key) { toast(bookName + ' is not in the loaded Bible'); return; }
    closeTL();
    selectBook(key);
    selectChap(String(ch));
    readChap();
    if (v && v > 1) setTimeout(() => scrollToVerse(String(v)), 180);
  }

  // ── open / close ───────────────────────────────────────────────────────────
  function openTL() {
    if (!S.built) build();
    el.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTab(S.tab);
    if (S.tab === 'time' && !el.time.dataset.init) { el.time.dataset.init = '1'; focusYear(-2100); }
    el.here.disabled = !currentBookName();
  }
  function closeTL() { if (el.overlay) el.overlay.classList.remove('open'); document.body.style.overflow = ''; }

  window.openTimeline = openTL;
  window.closeTimeline = closeTL;
})();
