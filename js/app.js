/* Elio — bilingual learning for toddlers. No build step, no dependencies. */
(() => {
  'use strict';

  const D = window.ELIO;
  const app = document.getElementById('app');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('elio:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('elio:' + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };
  const DEFAULTS = { lang: 'both', rate: 0.9, limit: 15, choices: 2 };
  const settings = Object.assign({}, DEFAULTS, store.get('settings', {}));
  const progress = store.get('progress', {});
  const saveSettings = () => store.set('settings', settings);

  const lessonMap = {}, worldOf = {};
  D.worlds.forEach((w) => w.lessons.forEach((l) => { lessonMap[l.id] = l; worldOf[l.id] = w; }));

  // ---------- speech ----------
  const synth = window.speechSynthesis;
  let voices = [];
  const voiceCache = {};
  const loadVoices = () => { voices = synth ? synth.getVoices() : []; for (const k in voiceCache) delete voiceCache[k]; };
  if (synth) { loadVoices(); synth.addEventListener?.('voiceschanged', loadVoices); }

  function pickVoice(lang) {
    if (lang in voiceCache) return voiceCache[lang];
    const norm = (v) => v.lang.replace('_', '-').toLowerCase();
    const L = lang.toLowerCase(), base = L.split('-')[0];
    const notDialect = (v) => base !== 'zh' || !/hk|tw|yue/.test(norm(v));
    const exact = voices.filter((v) => norm(v) === L);
    const pool = (exact.length ? exact : voices.filter((v) => norm(v).startsWith(base))).filter(notDialect);
    const nice = /Tingting|Ting-Ting|Xiaoxiao|Yunxi|Samantha|Karen|Google|Natural|Enhanced|Premium/i;
    return (voiceCache[lang] = pool.find((v) => nice.test(v.name)) || pool.find((v) => v.localService) || pool[0] || null);
  }

  let sayId = 0;
  /** Speak parts [{text, lang}] in order. Resolves true when finished, false if interrupted. */
  function say(parts) {
    const id = ++sayId;
    parts = (parts || []).filter((p) => p && p.text);
    if (!synth || !parts.length) return wait(600).then(() => id === sayId);
    synth.cancel();
    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (id !== sayId) return resolve(false);
        if (i >= parts.length) return resolve(true);
        const p = parts[i++];
        const u = new SpeechSynthesisUtterance(p.text);
        u.lang = p.lang;
        const v = pickVoice(p.lang);
        if (v) u.voice = v;
        u.rate = settings.rate * (p.lang.startsWith('zh') ? 1 : 0.92);
        u.pitch = 1.1;
        let done = false;
        const fin = () => { if (done) return; done = true; clearTimeout(guard); setTimeout(next, 220); };
        // Some browsers never fire onend; don't hang forever.
        const guard = setTimeout(fin, 2000 + p.text.length * 300);
        u.onend = fin; u.onerror = fin;
        synth.speak(u);
      };
      next();
    });
  }
  const stopSpeech = () => { sayId++; synth && synth.cancel(); };

  /** Bilingual parts honoring the language setting; English-first worlds swap the order. */
  function bi(zh, en, enFirst) {
    const Z = zh && { text: zh, lang: 'zh-CN' }, E = en && { text: en, lang: 'en-US' };
    if (settings.lang === 'zh') return [Z || E];
    if (settings.lang === 'en') return [E || Z];
    return enFirst ? [E, Z] : [Z, E];
  }
  function itemParts(it, w) {
    const zh = [it.zh, it.szh].filter(Boolean).join('，');
    const en = [it.en, it.sen].filter(Boolean).join(', ');
    const parts = bi(zh, en, w?.enFirst);
    if (it.word) parts.push(it.word);
    return parts;
  }
  const primaryLang = (w) => (settings.lang === 'en' || (settings.lang === 'both' && w?.enFirst) ? 'en' : 'zh');

  // ---------- sound effects ----------
  let actx;
  function tone(seq) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      let t = actx.currentTime;
      for (const [f, d, type = 'sine', vol = 0.16] of seq) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(actx.destination);
        o.start(t); o.stop(t + d + 0.05);
        t += d * 0.8;
      }
    } catch { /* audio unavailable */ }
  }
  const sfx = {
    tap: () => tone([[880, 0.07, 'sine', 0.08]]),
    pop: () => tone([[620, 0.1, 'triangle'], [930, 0.12, 'triangle']]),
    yay: () => tone([[523, 0.13], [659, 0.13], [784, 0.13], [1047, 0.32]]),
    oops: () => tone([[330, 0.14, 'triangle', 0.1], [262, 0.2, 'triangle', 0.1]]),
  };

  // ---------- visuals ----------
  const SHAPES = {
    circle: '<circle cx="50" cy="50" r="42" fill="#FF7A6B"/>',
    square: '<rect x="12" y="12" width="76" height="76" rx="6" fill="#4FA3F7"/>',
    triangle: '<path d="M50 10 L92 86 H8 Z" fill="#FFC23D" stroke="#FFC23D" stroke-width="6" stroke-linejoin="round"/>',
    rectangle: '<rect x="4" y="26" width="92" height="48" rx="6" fill="#6CCB74"/>',
    star: '<path d="M50 6l12.6 27.3 29.9 3.4-22.2 20.3 6.1 29.5L50 71.6 23.6 86.5l6.1-29.5L7.5 36.7l29.9-3.4z" fill="#FFC23D" stroke="#FFC23D" stroke-width="4" stroke-linejoin="round"/>',
    heart: '<path d="M50 88S8 62 8 34a21 21 0 0 1 42-6 21 21 0 0 1 42 6c0 28-42 54-42 54z" fill="#FF6F91"/>',
    oval: '<ellipse cx="50" cy="50" rx="30" ry="42" fill="#B07CF0"/>',
    diamond: '<path d="M50 6 L88 50 L50 94 L12 50 Z" fill="#26C6B9" stroke="#26C6B9" stroke-width="4" stroke-linejoin="round"/>',
  };
  function visual(it, cls = '') {
    if (it.svg) return `<div class="vis vis-svg ${cls}"><svg viewBox="0 0 100 100" aria-hidden="true">${SHAPES[it.svg]}</svg></div>`;
    const emo = it.rep ? `<span class="emo emo-rep r${Math.min(it.rep, 10)}">${it.e.repeat(it.rep)}</span>` : `<span class="emo">${esc(it.e)}</span>`;
    return `<div class="vis ${it.t ? 'has-t' : ''} ${cls}"${it.scale ? ` style="--s:${it.scale}"` : ''}>${it.t ? `<span class="big-t">${esc(it.t)}</span>` : ''}${it.e ? emo : ''}</div>`;
  }
  function labelsOf(it, w) {
    const zh = it.label ?? it.zh, en = it.sub ?? it.en;
    return w?.enFirst && !it.label ? [en, zh] : [zh, en];
  }
  const ICON = {
    back: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    prev: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    speak: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  const TYPE_BADGE = { cards: '👀', choose: '🎯', count: '👆', story: '📖', sort: '🧺' };

  // ---------- routing ----------
  let view = 0;           // bumps on every screen change so stale async work can bail
  let pendingSay = null;  // speech requested by the tap that triggered navigation
  function go(hash, speak) { pendingSay = speak || null; if (location.hash === '#' + hash) route(); else location.hash = hash; }
  function route() {
    stopSpeech(); view++;
    closeOverlay();
    const [, a, b] = (location.hash.slice(1) || '/').split('/');
    if (a === 'w' && D.worlds.some((w) => w.id === b)) renderWorld(D.worlds.find((w) => w.id === b));
    else if (a === 'l' && lessonMap[b]) renderLesson(lessonMap[b]);
    else renderHome();
    if (pendingSay) { const p = pendingSay; pendingSay = null; say(p); }
  }
  window.addEventListener('hashchange', route);

  // ---------- screens ----------
  const worldDone = (w) => w.lessons.filter((l) => progress[l.id]).length;

  function renderHome() {
    document.body.style.setProperty('--theme', '#FFD27A');
    app.innerHTML = `
      <header class="topbar">
        <div class="brand"><span class="brand-logo">🌱</span><span class="brand-name">Elio</span><small>宝宝的双语小世界 · Little Bilingual World</small></div>
        ${gearBtn()}
      </header>
      <main class="grid home-grid">
        ${D.worlds.map((w, i) => `
          <button class="tile world-tile" style="--c:${w.color};--d:${i * 60}ms" data-w="${w.id}">
            <span class="tile-e">${w.e}</span>
            <span class="tile-zh">${w.zh}</span>
            <span class="tile-en">${w.en}</span>
            <span class="tile-meter"><i style="width:${(worldDone(w) / w.lessons.length) * 100}%"></i></span>
          </button>`).join('')}
      </main>`;
    $$('[data-w]').forEach((b) => b.addEventListener('click', () => {
      const w = D.worlds.find((x) => x.id === b.dataset.w);
      sfx.tap(); go('/w/' + w.id, bi(w.zh, w.en, w.enFirst));
    }));
    bindGear();
  }

  function renderWorld(w) {
    document.body.style.setProperty('--theme', w.color);
    app.innerHTML = `
      <header class="topbar">
        <button class="btn-round" data-nav="/" aria-label="返回首页">${ICON.back}</button>
        <div class="title"><span>${w.e} ${w.enFirst ? w.en : w.zh}</span><small>${w.enFirst ? w.zh : w.en}</small></div>
        ${gearBtn()}
      </header>
      <main class="grid lesson-grid">
        ${w.lessons.map((l, i) => `
          <button class="tile lesson-tile ${progress[l.id] ? 'done' : ''}" style="--c:${w.color};--d:${i * 40}ms" data-l="${l.id}">
            <span class="badge">${TYPE_BADGE[l.type]}</span>
            ${progress[l.id] ? '<span class="star">⭐</span>' : ''}
            <span class="tile-e ${/^[一-鿿]$/.test(l.e) ? 'tile-hanzi' : ''}">${l.e}</span>
            <span class="tile-zh">${w.enFirst ? l.en : l.zh}</span>
            <span class="tile-en">${w.enFirst ? l.zh : l.en}</span>
          </button>`).join('')}
      </main>`;
    bindNav();
    $$('[data-l]').forEach((b) => b.addEventListener('click', () => {
      const l = lessonMap[b.dataset.l];
      sfx.tap(); go('/l/' + l.id, bi(l.zh, l.en, w.enFirst));
    }));
    bindGear();
  }

  function renderLesson(L) {
    const w = worldOf[L.id];
    document.body.style.setProperty('--theme', w.color);
    app.innerHTML = `
      <header class="topbar">
        <button class="btn-round" data-nav="/w/${w.id}" aria-label="返回">${ICON.back}</button>
        <div class="title"><span>${w.enFirst ? L.en : L.zh}</span><small>${w.enFirst ? L.zh : L.en}</small></div>
        <div class="progress" aria-hidden="true"><i id="bar"></i></div>
      </header>
      ${L.tip ? `<div class="tip">💡 ${esc(L.tip)}</div>` : ''}
      <main class="stage" id="stage"></main>
      <footer class="nav" id="nav"></footer>`;
    bindNav();
    ENGINES[L.type](L, w, view);
  }

  function bindNav() {
    $$('[data-nav]').forEach((b) => b.addEventListener('click', () => { sfx.tap(); go(b.dataset.nav); }));
  }
  const setBar = (i, n) => { const b = $('#bar'); if (b) b.style.width = `${Math.round((i / n) * 100)}%`; };
  function navButtons(onPrev, onNext) {
    const nav = $('#nav');
    nav.innerHTML = `<button class="arrow" id="prev" aria-label="上一个">${ICON.prev}</button><button class="arrow next" id="next" aria-label="下一个">${ICON.next}</button>`;
    $('#prev').onclick = () => { sfx.tap(); onPrev(); };
    $('#next').onclick = () => { sfx.tap(); onNext(); };
    return { prev: $('#prev'), next: $('#next') };
  }
  function swipe(el, onLeft, onRight) {
    let x0 = null, y0 = 0;
    el.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
    el.addEventListener('pointerup', (e) => {
      if (x0 == null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { el.dataset.swiped = '1'; (dx < 0 ? onLeft : onRight)(); }
    });
  }
  const PRAISE = [['真棒！', 'Great job!'], ['对啦！', 'Yes!'], ['太厉害了！', 'Awesome!'], ['好聪明！', 'So smart!']];
  const praise = (w) => { const [zh, en] = PRAISE[Math.floor(Math.random() * PRAISE.length)]; return bi(zh, en, w.enFirst); };
  function burst(el, emojis = ['⭐', '✨', '🌟']) {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('span');
      s.className = 'spark'; s.textContent = emojis[i % emojis.length];
      const a = (Math.PI * 2 * i) / 8;
      s.style.left = r.left + r.width / 2 + 'px'; s.style.top = r.top + r.height / 2 + 'px';
      s.style.setProperty('--dx', Math.cos(a) * 120 + 'px'); s.style.setProperty('--dy', Math.sin(a) * 120 + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }
  const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  // ---------- engines ----------
  const ENGINES = {
    cards(L, w, v) {
      let i = 0;
      const stage = $('#stage');
      const show = (dir = 0) => {
        const it = L.items[i];
        const [l1, l2] = labelsOf(it, w);
        stage.innerHTML = `
          <button class="flash ${dir > 0 ? 'in-r' : dir < 0 ? 'in-l' : 'in'}" id="flash">
            ${visual(it, 'flash-vis')}
            <span class="label"><b>${esc(l1)}</b><span>${esc(l2)}</span></span>
          </button>`;
        const card = $('#flash');
        card.onclick = () => { if (card.dataset.swiped) { delete card.dataset.swiped; return; } sfx.pop(); replay(card, 'wiggle'); say(itemParts(it, w)); };
        swipe(card, () => nb.next.click(), () => nb.prev.click());
        nb.prev.disabled = i === 0;
        setBar(i + 1, L.items.length);
        say(itemParts(it, w));
      };
      const nb = navButtons(() => { if (i > 0) { i--; show(-1); } }, () => { if (i < L.items.length - 1) { i++; show(1); } else finish(L, w); });
      show();
    },

    choose(L, w, v) {
      const n = L.n || settings.choices;
      const rounds = L.rounds || genRounds(L, n);
      let r = 0;
      $('#nav').innerHTML = '';
      const show = () => {
        const R = rounds[r];
        let locked = false;
        const opts = shuffle(R.options.map((o, k) => ({ ...o, ok: k === R.a })));
        const [q1, q2] = w.enFirst ? [R.q.en, R.q.zh] : [R.q.zh, R.q.en];
        $('#stage').innerHTML = `
          <div class="ask"><button class="btn-round speak" id="again" aria-label="再听一遍">${ICON.speak}</button><div class="ask-text">${esc(q1)}<small>${esc(q2)}</small></div></div>
          ${R.show ? `<div class="show">${esc(R.show)}</div>` : ''}
          <div class="opts n${opts.length} ${R.show ? 'compact' : ''}">
            ${opts.map((o, k) => `<button class="opt" data-k="${k}" style="--d:${k * 80}ms">${visual(o)}${o.zh ? `<span class="opt-cap">${esc(w.enFirst ? o.en : o.zh)}</span>` : ''}</button>`).join('')}
          </div>`;
        const ask = () => say(bi(R.q.zh, R.q.en, w.enFirst));
        $('#again').onclick = () => { sfx.tap(); ask(); };
        ask();
        setBar(r, rounds.length);
        $$('.opt').forEach((b) => b.addEventListener('click', async () => {
          if (locked) return;
          const o = opts[+b.dataset.k];
          if (o.ok) {
            locked = true;
            b.classList.add('right'); $$('.opt').forEach((x) => x !== b && x.classList.add('dim'));
            sfx.yay(); burst(b);
            await say([...praise(w), ...(R.ok ? bi(R.ok.zh, R.ok.en, w.enFirst) : [])]);
            if (v !== view) return;
            await wait(250);
            if (v !== view) return;
            r++; r < rounds.length ? show() : finish(L, w);
          } else {
            replay(b, 'wrong'); sfx.oops();
            say(bi('再找找看', 'Try again', w.enFirst));
          }
        }));
      };
      show();
    },

    count(L, w, v) {
      let r = 0;
      $('#nav').innerHTML = '';
      const nums = { zh: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'], en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'] };
      const show = () => {
        const R = L.rounds[r];
        let c = 0, locked = false;
        $('#stage').innerHTML = `
          <div class="ask"><button class="btn-round speak" id="again" aria-label="再听一遍">${ICON.speak}</button><div class="ask-text">点一点，数一数<small>Tap and count</small></div><div class="counter" id="ctr">0</div></div>
          <div class="count-field c${R.n > 6 ? 'l' : R.n > 3 ? 'm' : 's'}">
            ${Array.from({ length: R.n }, (_, k) => `<button class="cnt" style="--d:${k * 50}ms">${R.e}</button>`).join('')}
          </div>`;
        const ask = () => say(bi(`数一数，有几个${R.zh}？`, `Let's count the ${R.en}!`, w.enFirst));
        $('#again').onclick = () => { sfx.tap(); ask(); };
        ask();
        setBar(r, L.rounds.length);
        $$('.cnt').forEach((b) => b.addEventListener('click', async () => {
          if (locked || b.classList.contains('counted')) return;
          c++;
          b.classList.add('counted'); b.dataset.num = c;
          const ctr = $('#ctr'); ctr.textContent = c; replay(ctr, 'pulse');
          sfx.pop();
          const lang = primaryLang(w);
          say([{ text: nums[lang][c], lang: lang === 'zh' ? 'zh-CN' : 'en-US' }]);
          if (c < R.n) return;
          locked = true;
          await wait(750);
          if (v !== view) return;
          sfx.yay(); burst($('#ctr'));
          const zh = R.n === 1 ? `一个${R.zh}！` : `一共${R.n === 2 ? '两' : nums.zh[R.n]}个${R.zh}！`;
          const en = `${nums.en[R.n][0].toUpperCase() + nums.en[R.n].slice(1)} ${R.en}!`;
          await say(bi(zh, en, w.enFirst));
          if (v !== view) return;
          await wait(300);
          if (v !== view) return;
          r++; r < L.rounds.length ? show() : finish(L, w);
        }));
      };
      show();
    },

    story(L, w, v) {
      let i = 0;
      const stage = $('#stage');
      const show = (dir = 0) => {
        const p = L.pages[i];
        const [c1, c2] = w.enFirst ? [p.en, p.zh] : [p.zh, p.en];
        stage.innerHTML = `
          <div class="story ${dir > 0 ? 'in-r' : dir < 0 ? 'in-l' : 'in'}">
            <button class="scene" id="scene"><span class="scene-e">${esc(p.e)}</span></button>
            <div class="caption"><p class="c1">${esc(c1)}</p><p class="c2">${esc(c2)}</p></div>
          </div>`;
        const scene = $('#scene');
        scene.onclick = () => { if (scene.dataset.swiped) { delete scene.dataset.swiped; return; } sfx.pop(); replay(scene, 'wiggle'); narrate(); };
        swipe(scene, () => nb.next.click(), () => nb.prev.click());
        nb.prev.disabled = i === 0;
        nb.next.classList.remove('nudge');
        setBar(i + 1, L.pages.length);
        const narrate = () => say(bi(p.zh, p.en, w.enFirst)).then((ok) => { if (ok && v === view) nb.next.classList.add('nudge'); });
        narrate();
      };
      const nb = navButtons(() => { if (i > 0) { i--; show(-1); } }, () => { if (i < L.pages.length - 1) { i++; show(1); } else finish(L, w); });
      show();
    },

    sort(L, w, v) {
      const items = shuffle(L.items).slice(0, L.count || 8);
      let i = 0;
      $('#nav').innerHTML = '';
      const show = () => {
        const it = items[i];
        let locked = false;
        const name = (lang) => it[lang];
        $('#stage').innerHTML = `
          <div class="ask"><button class="btn-round speak" id="again" aria-label="再听一遍">${ICON.speak}</button><div class="ask-text">${esc(w.enFirst ? it.en : it.zh)}<small>${esc(w.enFirst ? it.zh : it.en)}</small></div></div>
          <div class="sort-item in" id="item">${visual(it)}</div>
          <div class="bins">
            ${L.bins.map((b, k) => `<button class="bin" data-k="${k}"><span class="bin-e">${b.e}</span><span class="bin-cap">${esc(w.enFirst ? b.en : b.zh)}<small>${esc(w.enFirst ? b.zh : b.en)}</small></span></button>`).join('')}
          </div>`;
        const ask = () => say(bi(L.q.zh.replace('{x}', name('zh')), L.q.en.replace('{x}', name('en')), w.enFirst));
        $('#again').onclick = () => { sfx.tap(); ask(); };
        ask();
        setBar(i, items.length);
        $$('.bin').forEach((b) => b.addEventListener('click', async () => {
          if (locked) return;
          if (+b.dataset.k === it.b) {
            locked = true;
            const item = $('#item'), a = item.getBoundingClientRect(), t = b.getBoundingClientRect();
            item.style.setProperty('--tx', `${t.left + t.width / 2 - (a.left + a.width / 2)}px`);
            item.style.setProperty('--ty', `${t.top + t.height / 2 - (a.top + a.height / 2)}px`);
            item.classList.add('fly');
            sfx.yay(); setTimeout(() => { replay(b, 'gulp'); burst(b); }, 380);
            await say(praise(w));
            if (v !== view) return;
            await wait(200);
            if (v !== view) return;
            i++; i < items.length ? show() : finish(L, w);
          } else {
            replay(b, 'wrong'); sfx.oops();
            say(bi('再想想', 'Try again', w.enFirst));
          }
        }));
      };
      show();
    },
  };

  function genRounds(L, n) {
    const pool = [].concat(...L.from.map((id) => lessonMap[id].items));
    return shuffle(pool).slice(0, L.count || 6).map((ans) => {
      const key = (x) => x.svg || x.t || x.e;
      const others = shuffle(pool.filter((x) => key(x) !== key(ans))).slice(0, n - 1);
      const strip = ({ e, t, svg, rep }) => ({ e, t, svg, rep });
      const x = ans.qx || ans.label || ans.zh;
      return {
        q: { zh: (L.qzh || '{x}在哪里？').replace('{x}', x), en: (L.qen || 'Find the {x}!').replace('{x}', ans.en) },
        options: [ans, ...others].map(strip), a: 0,
      };
    });
  }

  // ---------- finish / overlays ----------
  let overlayEl = null;
  function openOverlay(html, cls = '') {
    closeOverlay();
    overlayEl = document.createElement('div');
    overlayEl.className = 'overlay ' + cls;
    overlayEl.innerHTML = `<div class="sheet">${html}</div>`;
    document.body.appendChild(overlayEl);
    return overlayEl;
  }
  function closeOverlay() { overlayEl?.remove(); overlayEl = null; }

  function finish(L, w) {
    progress[L.id] = (progress[L.id] || 0) + 1;
    store.set('progress', progress);
    setBar(1, 1);
    const idx = w.lessons.indexOf(L), nextL = w.lessons[idx + 1];
    const ov = openOverlay(`
      <div class="confetti">${Array.from({ length: 18 }, (_, k) => `<i style="--x:${Math.random() * 100}%;--d:${Math.random() * 0.6}s;--r:${Math.random() * 360}deg">${['⭐', '🎉', '🌟', '🎈', '💖'][k % 5]}</i>`).join('')}</div>
      <div class="win-star">⭐</div>
      <h2>${w.enFirst ? 'Great job!' : '真棒！'}<small>${w.enFirst ? '真棒！' : 'Great job!'}</small></h2>
      <div class="win-actions">
        <button class="btn-big" data-a="again" aria-label="再来一次">🔁</button>
        ${nextL ? `<button class="btn-big primary" data-a="next" aria-label="下一课">${nextL.e}</button>` : ''}
        <button class="btn-big" data-a="home" aria-label="回到主题">🏠</button>
      </div>`, 'win');
    sfx.yay();
    say(bi('真棒！你完成啦！', 'Great job! You did it!', w.enFirst));
    $$('[data-a]', ov).forEach((b) => b.addEventListener('click', () => {
      sfx.tap();
      const a = b.dataset.a;
      if (a === 'again') route();
      else if (a === 'next') go('/l/' + nextL.id, bi(nextL.zh, nextL.en, w.enFirst));
      else go('/w/' + w.id);
    }));
  }

  // ---------- parent gate & settings ----------
  const gearBtn = () => `<button class="btn-round gear" id="gear" aria-label="家长设置（长按 2 秒）"><span>⚙️</span></button>`;
  function holdToOpen(el, fn, ms = 2000) {
    let t = null;
    const start = (e) => { e.preventDefault(); el.classList.add('holding'); t = setTimeout(() => { t = null; el.classList.remove('holding'); fn(); }, ms); };
    const end = () => { if (t) { clearTimeout(t); t = null; el.classList.remove('holding'); } };
    el.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => el.addEventListener(ev, end));
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  function bindGear() {
    const g = $('#gear');
    if (!g) return;
    holdToOpen(g, openSettings);
    g.addEventListener('click', () => toast('家长请长按 2 秒 · Parents: press & hold'));
  }
  function toast(msg) {
    document.querySelector('.toast')?.remove();
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function seg(name, opts) {
    return `<div class="seg" data-name="${name}">${opts.map(([val, txt]) => `<button data-v="${val}" class="${String(settings[name]) === String(val) ? 'on' : ''}">${txt}</button>`).join('')}</div>`;
  }
  function openSettings() {
    stopSpeech();
    const zhV = pickVoice('zh-CN'), enV = pickVoice('en-US');
    const done = Object.keys(progress).length, total = Object.keys(lessonMap).length;
    const ov = openOverlay(`
      <h3>家长设置 <small>Parent settings</small></h3>
      <label>语言 Language</label>${seg('lang', [['both', '中英双语'], ['zh', '只说中文'], ['en', 'English only']])}
      <label>语速 Speed</label>${seg('rate', [[0.75, '慢'], [0.9, '正常'], [1.05, '快']])}
      <label>选择题 Choices</label>${seg('choices', [[2, '2 选 1（2 岁）'], [3, '3 选 1（3 岁）']])}
      <label>单次使用时长 Session limit</label>${seg('limit', [[10, '10 分钟'], [15, '15 分钟'], [20, '20 分钟'], [0, '不限']])}
      <label>语音检测 Voices</label>
      <div class="voices">
        <span>${zhV ? '✅' : '⚠️'} 中文：${esc(zhV?.name || '未找到中文语音')}</span>
        <span>${enV ? '✅' : '⚠️'} English: ${esc(enV?.name || 'not found')}</span>
        <button class="btn-small" id="test-voice">🔊 试听</button>
      </div>
      <div class="parent-notes">
        <p><b>已完成 ${done} / ${total} 课</b></p>
        <p>💡 建议家长陪着宝宝一起玩，跟着说、跟着做；2–3 岁每次 10–15 分钟，每天总屏幕时间不超过 1 小时。</p>
        <p>💡 没有声音？请打开手机静音键、调大音量；安卓手机可在"设置 → 文字转语音"中安装中文语音，推荐使用 Chrome / Safari。</p>
        <p>💡 用浏览器"添加到主屏幕"，可以像 App 一样全屏打开。</p>
      </div>
      <div class="sheet-actions">
        <button class="btn-small danger" id="reset">清除学习记录</button>
        <button class="btn-small primary" id="close">完成 ✓</button>
      </div>`, 'settings');
    $$('.seg', ov).forEach((s) => s.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const name = s.dataset.name, raw = b.dataset.v;
      settings[name] = name === 'lang' ? raw : Number(raw);
      saveSettings();
      $$('button', s).forEach((x) => x.classList.toggle('on', x === b));
      if (name === 'limit') resetTimer();
    }));
    $('#test-voice', ov).onclick = () => say(bi('你好，宝宝！', 'Hello, baby!'));
    $('#reset', ov).onclick = () => {
      if (!confirm('确定清除所有学习记录吗？')) return;
      for (const k in progress) delete progress[k];
      store.set('progress', progress);
      closeOverlay(); route();
    };
    $('#close', ov).onclick = () => { closeOverlay(); route(); };
  }

  // ---------- screen-time break ----------
  let used = Number(sessionStorage.getItem('elio:used') || 0), resting = false;
  const resetTimer = () => { used = 0; sessionStorage.setItem('elio:used', '0'); };
  setInterval(() => {
    if (document.visibilityState !== 'visible' || resting) return;
    used += 5;
    sessionStorage.setItem('elio:used', String(used));
    if (settings.limit && used >= settings.limit * 60) showRest();
  }, 5000);
  function showRest() {
    resting = true;
    stopSpeech();
    const ov = openOverlay(`
      <div class="rest-e">😴</div>
      <h2>休息一下吧！<small>Time for a break!</small></h2>
      <p class="rest-p">👀 看看窗外 · 💧 喝点水 · 🤸 动一动</p>
      <button class="btn-round gear" id="rest-gate" aria-label="家长长按继续"><span>🔓</span></button>
      <p class="rest-hint">家长长按 🔓 2 秒继续</p>`, 'rest');
    say(bi('宝宝，休息一下吧！看看远处，喝点水。', "Time for a break! Let's rest our eyes."));
    holdToOpen($('#rest-gate', ov), () => { resting = false; resetTimer(); closeOverlay(); route(); });
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeech(); });

  // ---------- boot ----------
  route();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
