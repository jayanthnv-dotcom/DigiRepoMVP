/* USE Network – Digital Repository
   Core: taxonomy, storage/data layer, roles, profiles, layout, shared renderers.
   All data access goes through USE.store so it can later be swapped for Firestore. */

(function () {
  const USE = (window.USE = window.USE || {});

  /* ---------- Taxonomy ---------- */
  USE.TAX = {
    disciplines: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'Earth & Environmental Sciences', 'Interdisciplinary'],
    levels: ['Year 1', 'Year 2', 'Year 3', 'All levels'],
    languages: ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Other'],
    audiences: ['Both', 'Student', 'Faculty'],
    licence: 'CC BY-SA 4.0'
  };

  USE.TYPES = {
    lab: { key: 'lab', label: 'Lab Experiments', single: 'Lab Experiment', list: 'labs.html', detail: 'lab.html', icon: '🧪',
      blurb: 'Low-cost experiments with step-by-step protocols in Cookbook, Guided Inquiry and CURE styles.' },
    activity: { key: 'activity', label: 'Classroom Activities', single: 'Classroom Activity', list: 'activities.html', detail: 'activity.html', icon: '🧩',
      blurb: 'Teaching practices from real classrooms: hands-on, visual and engaging ways to teach concepts.' },
    worksheet: { key: 'worksheet', label: 'Worksheets', single: 'Worksheet', list: 'worksheets.html', detail: 'worksheet.html', icon: '📝',
      blurb: 'Learning materials, exercises and guided activities, organised as modules under a topic.' },
    course: { key: 'course', label: 'Courses & Modules', single: 'Course / Module', list: 'courses.html', detail: 'course.html', icon: '📚',
      blurb: 'Innovative course designs and stand-alone modules that others can adapt to their context.' }
  };

  /* ---------- Utilities ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  USE.esc = esc;
  USE.qs = (sel, root) => (root || document).querySelector(sel);
  USE.qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  USE.param = (k) => new URLSearchParams(location.search).get(k);
  USE.uid = (p) => (p || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  USE.el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  USE.fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
  USE.initials = (name) => String(name || '?').replace(/^(Dr\.?|Prof\.?)\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

  // Plain text → paragraphs. Lines starting with "- " become bullet lists.
  USE.prose = (text) => {
    if (!text) return '';
    return String(text).trim().split(/\n\s*\n/).map((block) => {
      let html = '', para = [], items = [];
      const flushP = () => { if (para.length) html += '<p>' + para.map(esc).join('<br>') + '</p>'; para = []; };
      const flushL = () => { if (items.length) html += '<ul>' + items.map((l) => '<li>' + esc(l) + '</li>').join('') + '</ul>'; items = []; };
      block.split('\n').forEach((l) => {
        if (/^\s*[-•]\s+/.test(l)) { flushP(); items.push(l.replace(/^\s*[-•]\s+/, '')); }
        else { flushL(); para.push(l); }
      });
      flushP(); flushL();
      return html;
    }).join('');
  };

  let toastTimer;
  USE.toast = (msg) => {
    let t = USE.qs('.toast');
    if (!t) { t = USE.el('<div class="toast" role="status" aria-live="polite"></div>'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  };

  USE.modal = (html, onMount) => {
    const back = USE.el('<div class="modal-back"><div class="modal" role="dialog" aria-modal="true"></div></div>');
    back.firstElementChild.innerHTML = html;
    const close = () => back.remove();
    back.addEventListener('click', (e) => { if (e.target === back || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    document.body.appendChild(back);
    if (onMount) onMount(back.firstElementChild, close);
    return close;
  };

  USE.copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
  };

  /* ---------- Local storage (safe) ---------- */
  const LS = {
    get(k, d) { try { const v = localStorage.getItem('use.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('use.' + k, JSON.stringify(v)); return true; } catch (e) { USE.toast('Could not save – browser storage is full or blocked.'); return false; } },
    del(k) { try { localStorage.removeItem('use.' + k); } catch (e) {} }
  };
  USE.LS = LS;

  /* ---------- File store (IndexedDB) ----------
     Uploaded files are kept in the browser for the demo and referenced as "idb:<id>".
     Phase 2: replace with Firebase Storage URLs. */
  const FILES = (() => {
    let dbp;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('use-files', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('files');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
    const urlCache = {};
    return {
      async save(file) {
        const id = USE.uid('f');
        const db = await open();
        await new Promise((res, rej) => {
          const tx = db.transaction('files', 'readwrite');
          tx.objectStore('files').put({ blob: file, name: file.name, type: file.type }, id);
          tx.oncomplete = res; tx.onerror = () => rej(tx.error);
        });
        return 'idb:' + id;
      },
      async url(src) {
        if (!src) return '';
        if (!String(src).startsWith('idb:')) return src;
        if (urlCache[src]) return urlCache[src];
        try {
          const db = await open();
          const rec = await new Promise((res, rej) => {
            const r = db.transaction('files').objectStore('files').get(src.slice(4));
            r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
          });
          if (!rec) return '';
          return (urlCache[src] = URL.createObjectURL(rec.blob));
        } catch (e) { return ''; }
      }
    };
  })();
  USE.files = FILES;

  // Resolve every [data-src] inside root (img/video/a/iframe) to a usable URL.
  USE.hydrateSrc = async (root) => {
    for (const node of USE.qsa('[data-src]', root || document)) {
      const u = await FILES.url(node.getAttribute('data-src'));
      if (!u) continue;
      if (node.tagName === 'A') node.href = u; else node.src = u;
      node.removeAttribute('data-src');
    }
  };

  /* ---------- Data layer ---------- */
  const SEED = () => window.USE_SEED || { resources: [], profiles: [] };
  USE.store = {
    all(type) {
      const seeds = SEED().resources.filter((r) => !type || r.type === type);
      const mine = LS.get('contrib', []).filter((r) => !type || r.type === type);
      return [...mine, ...seeds];
    },
    get(type, id) { return this.all(type).find((r) => r.id === id); },
    save(item) {
      const list = LS.get('contrib', []);
      const i = list.findIndex((r) => r.id === item.id);
      if (i >= 0) list[i] = item; else list.unshift(item);
      return LS.set('contrib', list);
    },
    remove(id) { LS.set('contrib', LS.get('contrib', []).filter((r) => r.id !== id)); },
    isLocal(id) { return LS.get('contrib', []).some((r) => r.id === id); },
    byContributor(pid) { return this.all().filter((r) => (r.contributors || []).some((c) => c.id === pid)); },

    profiles() { return [...LS.get('profiles', []), ...SEED().profiles]; },
    profile(id) { return this.profiles().find((p) => p.id === id); },
    saveProfile(p) {
      const list = LS.get('profiles', []);
      const i = list.findIndex((x) => x.id === p.id);
      if (i >= 0) list[i] = p; else list.unshift(p);
      return LS.set('profiles', list);
    },
    me() { const id = LS.get('me', null); return id ? this.profile(id) : null; },
    setMe(id) { LS.set('me', id); },

    links() { return LS.get('links', []); },
    saveLink(l) { const list = this.links(); const i = list.findIndex((x) => x.id === l.id); if (i >= 0) list[i] = l; else list.unshift(l); LS.set('links', list); },
    removeLink(id) { LS.set('links', this.links().filter((l) => l.id !== id)); }
  };

  /* ---------- Role (Student / Teacher) ---------- */
  USE.role = () => LS.get('role', 'teacher');
  USE.setRole = (r) => { LS.set('role', r); applyRole(); document.dispatchEvent(new CustomEvent('rolechange', { detail: r })); };
  function applyRole() {
    document.body.classList.toggle('role-teacher', USE.role() === 'teacher');
    document.body.classList.toggle('role-student', USE.role() === 'student');
    USE.qsa('.role-toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.role === USE.role())));
  }
  USE.applyRole = applyRole;

  /* ---------- Layout ---------- */
  USE.avatar = (p, cls) => {
    if (!p) return `<span class="avatar ${cls || ''}">?</span>`;
    return p.photo
      ? `<span class="avatar ${cls || ''}"><img data-src="${esc(p.photo)}" alt=""></span>`
      : `<span class="avatar ${cls || ''}">${esc(USE.initials(p.name))}</span>`;
  };

  USE.layout = (active) => {
    const nav = [
      ['index.html', 'Home', 'home'],
      ['labs.html', 'Lab Experiments', 'lab'],
      ['activities.html', 'Classroom Activities', 'activity'],
      ['worksheets.html', 'Worksheets', 'worksheet'],
      ['courses.html', 'Courses & Modules', 'course']
    ];
    const header = USE.el(`
      <header class="site-header"><div class="container bar">
        <a class="brand" href="index.html"><span class="w1">USE <b>Network</b></span><span class="w2">Digital Repository</span></a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
        <nav class="main-nav" aria-label="Main">${nav.map(([h, t, k]) => `<a href="${h}" class="${k === active ? 'active' : ''}">${t}</a>`).join('')}</nav>
        <div class="header-tools">
          <div class="role-toggle" role="group" aria-label="View as">
            <button data-role="student">Student</button><button data-role="teacher">Teacher</button>
          </div>
          <div class="profile-menu teacher-only"></div>
        </div>
      </div></header>`);
    document.body.prepend(header);
    header.querySelector('.nav-toggle').onclick = (e) => {
      const n = header.querySelector('.main-nav'); n.classList.toggle('open');
      e.currentTarget.setAttribute('aria-expanded', n.classList.contains('open'));
    };
    USE.qsa('.role-toggle button', header).forEach((b) => (b.onclick = () => USE.setRole(b.dataset.role)));
    renderProfileMenu(header.querySelector('.profile-menu'));

    document.body.appendChild(USE.el(`
      <footer class="site-footer"><div class="container">
        <div><div class="fname">USE Network · Digital Repository</div>
          <div>Undergraduate Science Educators' Network, Azim Premji University, Bengaluru</div>
          <div style="margin-top:6px">Open educational resources shared under ${USE.TAX.licence} unless stated otherwise.</div></div>
        <div><div>Contact: <a href="mailto:usenetwork@apu.edu.in">usenetwork@apu.edu.in</a></div>
          <div style="margin-top:6px">Prototype v1 · sample content for demonstration</div></div>
      </div></footer>`));
    applyRole();
    USE.hydrateSrc(header);
  };

  function renderProfileMenu(box) {
    const me = USE.store.me();
    box.innerHTML = `
      <button class="avatar" aria-haspopup="true" aria-label="Profile menu">${me ? (me.photo ? `<img data-src="${esc(me.photo)}" alt="">` : esc(USE.initials(me.name))) : '👤'}</button>
      <div class="dropdown">
        ${me ? `<div class="who"><b>${esc(me.name)}</b><br><span class="muted">${esc(me.institution || '')}</span></div>
          <a href="profile.html?id=${esc(me.id)}">My profile & contributions</a>
          <a href="profile-edit.html">Edit profile</a>
          <a href="my-links.html">My student links</a>`
        : `<div class="who">You don't have a profile yet.</div><a href="profile-edit.html">Create your profile</a><a href="my-links.html">My student links</a>`}
        <button data-switch>Switch demo profile…</button>
      </div>`;
    const btn = box.querySelector('.avatar'), dd = box.querySelector('.dropdown');
    btn.onclick = (e) => { e.stopPropagation(); dd.classList.toggle('open'); };
    document.addEventListener('click', () => dd.classList.remove('open'));
    box.querySelector('[data-switch]').onclick = () => {
      const ps = USE.store.profiles();
      USE.modal(`<h3>Switch demo profile</h3><p class="muted small">There's no real login in this prototype. Pick whose profile you're acting as.</p>
        <div class="stack" style="--g:8px">${ps.map((p) => `<button class="btn btn-ghost" style="width:100%;justify-content:flex-start;margin-top:8px" data-id="${esc(p.id)}">${esc(p.name)} <span class="muted small">· ${esc(p.institution || '')}</span></button>`).join('')}</div>
        <div class="actions"><a class="btn btn-primary" href="profile-edit.html?new=1">Create a new profile</a><button class="btn btn-ghost" data-close>Cancel</button></div>`,
      (m, close) => USE.qsa('[data-id]', m).forEach((b) => (b.onclick = () => { USE.store.setMe(b.dataset.id); close(); location.reload(); })));
    };
  }

  /* ---------- Shared renderers ---------- */
  USE.contributorNames = (item) => (item.contributors || []).map((c) => (c.id ? (USE.store.profile(c.id) || {}).name : c.name)).filter(Boolean);

  USE.card = (item) => {
    const T = USE.TYPES[item.type];
    const isNew = USE.store.isLocal(item.id);
    const extra = item.type === 'course' ? `<span class="badge">${item.format === 'module' ? 'Module' : 'Course'}</span>` : '';
    const thumb = item.thumbnail ? `<img data-src="${esc(item.thumbnail)}" alt="" loading="lazy">` : USE.placeholderThumb(item);
    return `
      <a class="r-card" href="${T.detail}?id=${encodeURIComponent(item.id)}">
        <div class="thumb">${thumb}<div class="badge" style="background:none;padding:0;display:flex;gap:6px">${isNew ? '<span class="badge new">New</span>' : ''}${extra}</div></div>
        <div class="body">
          <div class="tags">${(item.disciplines || []).map((d) => `<span class="tag">${esc(d)}</span>`).join('')}<span class="tag orange">${esc(item.level || '')}</span></div>
          <h3>${esc(item.title)}</h3>
          <p class="ov">${esc(item.overview)}</p>
          <div class="by"><span>${esc(USE.contributorNames(item).join(', '))}</span><span>${esc(item.language || '')}</span></div>
        </div>
      </a>`;
  };

  USE.placeholderThumb = (item) => {
    const T = USE.TYPES[item.type] || {};
    return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0E2A47,#16395F);color:#fff;font-size:2.4rem">${T.icon || '📄'}</div>`;
  };

  USE.metaLine = (item, extras) => {
    const parts = [
      ['Subject', (item.disciplines || []).join(', ')],
      item.topic ? ['Topic', item.topic] : null,
      ['Level', item.level],
      ['Language', item.language],
      ...(extras || [])
    ].filter((p) => p && p[1] !== undefined && p[1] !== '');
    return `<div class="meta-line">${parts.map(([k, v]) => `<span><b>${esc(k)}:</b>${esc(v)}</span>`).join('')}</div>`;
  };

  USE.hero = (item, opts) => {
    const T = USE.TYPES[item.type];
    return `
      <section class="page-hero"><div class="container">
        <div class="crumbs"><a href="index.html">Home</a> › <a href="${T.list}">${T.label}</a></div>
        <span class="type-label">${esc((opts && opts.label) || T.single)}</span>
        <h1>${esc(item.title)}</h1>
        <p class="lede">${esc(item.overview)}</p>
        ${USE.metaLine(item, opts && opts.meta)}
        <div class="teacher-bar"><span class="teacher-only" data-teacher-bar style="display:contents"></span>
          <a class="btn btn-ghost btn-sm" href="contribute.html?type=${item.type}">＋ Contribute a ${esc(T.single.toLowerCase())}</a></div>
      </div></section>`;
  };

  USE.contributorCard = (item) => {
    const cs = item.contributors || [];
    if (!cs.length) return '';
    return `<div class="card">
      <div style="padding:14px 18px 0" class="eyebrow">Contributed by</div>
      ${cs.map((c) => {
        const p = c.id ? USE.store.profile(c.id) : null;
        if (!p) return `<div class="contributor"><span class="avatar md">${esc(USE.initials(c.name))}</span><div><div class="name">${esc(c.name)}</div><div class="sub">${esc(c.institution || '')}</div></div></div>`;
        return `<a class="contributor" href="profile.html?id=${esc(p.id)}">${USE.avatar(p, 'md')}<div><div class="name">${esc(p.name)}</div><div class="sub">${esc([p.designation, p.institution].filter(Boolean).join(' · '))}</div></div></a>`;
      }).join('')}
      <div style="padding:0 18px 14px" class="licence">Shared under ${esc(item.licence || USE.TAX.licence)}${item.created ? ' · Added ' + esc(USE.fmtDate(item.created)) : ''}${item.sample ? ' · Sample content' : ''}</div>
    </div>`;
  };

  USE.kindOf = (r) => {
    if (r.kind === 'link' || r.kind === 'youtube') return /youtu/.test(r.src || '') ? 'video' : 'link';
    const n = (r.name || r.src || '').toLowerCase();
    if (r.kind === 'video' || /\.(mp4|webm|mov)$/.test(n)) return 'video';
    if (r.kind === 'image' || /\.(png|jpe?g|gif|webp|svg)$/.test(n)) return 'image';
    if (/\.pdf$/.test(n)) return 'pdf';
    return 'file';
  };
  const KIND_LABEL = { pdf: 'PDF', link: 'LINK', video: 'VIDEO', image: 'IMG', file: 'DOC' };

  // A list of resources; each item becomes individually shareable.
  USE.resourceList = (list, prefix) => {
    if (!list || !list.length) return '<p class="muted small">No resources added.</p>';
    return `<ul class="res-list">${list.map((r, i) => {
      const k = USE.kindOf(r);
      const aud = r.audience || 'Both';
      const studentDefault = aud === 'Faculty' ? 'off' : 'on';
      const label = esc(r.title || r.name || 'Resource');
      const link = r.src
        ? `<a ${String(r.src).startsWith('idb:') ? `data-src="${esc(r.src)}" href="#"` : `href="${esc(r.src)}"`} target="_blank" rel="noopener" ${r.kind !== 'link' ? `download="${esc(r.name || '')}"` : ''}>${label}</a>`
        : `<span class="title">${label}</span>`;
      return `<li data-share="${prefix}-${i}" data-student="${studentDefault}" class="inline-share">
        <span class="res-ico ${k}">${KIND_LABEL[k]}</span>
        <div class="t">${link}<span class="aud ${aud === 'Faculty' ? 'faculty' : ''}">${aud === 'Both' ? 'Students & faculty' : aud === 'Faculty' ? 'Faculty only' : 'For students'}${r.src ? '' : ' · file not attached in demo'}</span></div>
      </li>`;
    }).join('')}</ul>`;
  };

  USE.youtubeId = (url) => {
    const m = String(url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  };

  // Media object {kind: 'youtube'|'video'|'image'|'file', src, name}
  USE.mediaEmbed = (m, cls) => {
    if (!m || !m.src) return '';
    const yt = USE.youtubeId(m.src);
    if (yt) return `<iframe class="${cls || ''}" src="https://www.youtube-nocookie.com/embed/${yt}" title="Video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    const k = USE.kindOf(m);
    const srcAttr = String(m.src).startsWith('idb:') ? `data-src="${esc(m.src)}"` : `src="${esc(m.src)}"`;
    if (k === 'video') return `<video class="${cls || ''}" ${srcAttr} controls playsinline></video>`;
    if (k === 'image') return `<img class="${cls || ''}" ${srcAttr} alt="${esc(m.caption || m.name || '')}">`;
    return `<a class="btn btn-ghost btn-sm" ${String(m.src).startsWith('idb:') ? `data-src="${esc(m.src)}" href="#"` : `href="${esc(m.src)}"`} target="_blank" rel="noopener">Open attachment${m.name ? ': ' + esc(m.name) : ''}</a>`;
  };

  USE.sectionTitle = (icon, title) => `<div class="section-title"><span class="ico" aria-hidden="true">${icon}</span><h2>${esc(title)}</h2></div>`;

  USE.notFound = (root, type) => {
    const T = USE.TYPES[type];
    root.innerHTML = `<div class="container detail"><div class="card card-pad empty"><h2>Resource not found</h2><p>It may have been removed, or it was added in a different browser.</p><a class="btn btn-primary" href="${T.list}">Back to ${T.label}</a></div></div>`;
  };
})();
