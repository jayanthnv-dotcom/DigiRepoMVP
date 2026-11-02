/* Form building blocks and the step-by-step wizard used by every contribution form.
   Fields write straight into a plain data object, so a draft is just JSON. */
(function () {
  const USE = window.USE;
  const esc = USE.esc;
  const F = (USE.F = {});
  let changed = () => {};
  F.onChange = (fn) => { changed = fn; };
  const fire = () => changed();

  function wrap(o, label, opts, inner) {
    const w = USE.el(`<div class="field">${label ? `<label>${esc(label)}${opts.required ? ' <span class="req">*</span>' : ''}${opts.max ? `<span class="count"></span>` : ''}</label>` : ''}</div>`);
    if (typeof inner === 'string') w.insertAdjacentHTML('beforeend', inner); else w.appendChild(inner);
    if (opts.hint) w.insertAdjacentHTML('beforeend', `<div class="hint">${opts.hint}</div>`);
    return w;
  }
  function requireCheck(w, test, msg) {
    w._check = () => (test() ? null : msg || 'This field is required.');
  }
  let n = 0; const fid = () => 'f' + (++n);

  F.text = (o, k, opts = {}) => {
    const id = fid();
    const w = wrap(o, opts.label, opts, `<input id="${id}" class="input" type="${opts.type || 'text'}" ${opts.max ? `maxlength="${opts.max}"` : ''} placeholder="${esc(opts.placeholder || '')}">`);
    const i = w.querySelector('input'); const lab = w.querySelector('label'); if (lab) lab.htmlFor = id;
    i.value = o[k] == null ? '' : o[k];
    const cnt = w.querySelector('.count');
    const upd = () => { if (cnt) cnt.textContent = i.value.length + ' / ' + opts.max; };
    i.oninput = () => { o[k] = opts.type === 'number' ? (i.value === '' ? '' : +i.value) : i.value; upd(); fire(); };
    upd();
    if (opts.required) requireCheck(w, () => String(o[k] == null ? '' : o[k]).trim() !== '', opts.msg);
    return w;
  };

  F.area = (o, k, opts = {}) => {
    const id = fid();
    const w = wrap(o, opts.label, opts, `<textarea id="${id}" class="input" rows="${opts.rows || 4}" ${opts.max ? `maxlength="${opts.max}"` : ''} placeholder="${esc(opts.placeholder || '')}"></textarea>`);
    const t = w.querySelector('textarea'); const lab = w.querySelector('label'); if (lab) lab.htmlFor = id;
    t.value = o[k] || '';
    const cnt = w.querySelector('.count');
    const upd = () => { if (cnt) cnt.textContent = t.value.length + ' / ' + opts.max; };
    t.oninput = () => { o[k] = t.value; upd(); fire(); };
    upd();
    if (opts.required) requireCheck(w, () => (o[k] || '').trim() !== '', opts.msg);
    return w;
  };

  F.select = (o, k, opts = {}) => {
    const id = fid();
    const w = wrap(o, opts.label, opts, `<select id="${id}" class="input">${opts.placeholder ? `<option value="">${esc(opts.placeholder)}</option>` : ''}${opts.options.map((v) => Array.isArray(v) ? `<option value="${esc(v[0])}">${esc(v[1])}</option>` : `<option>${esc(v)}</option>`).join('')}</select>`);
    const s = w.querySelector('select'); const lab = w.querySelector('label'); if (lab) lab.htmlFor = id;
    if (o[k] != null) s.value = o[k]; else o[k] = s.value;
    s.onchange = () => { o[k] = s.value; fire(); if (opts.onChange) opts.onChange(s.value); };
    if (opts.required) requireCheck(w, () => !!o[k]);
    return w;
  };

  F.chips = (o, k, opts = {}) => {
    o[k] = o[k] || [];
    const w = wrap(o, opts.label, opts, `<div class="chip-select">${opts.options.map((v) => `<button type="button" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`);
    const sync = () => USE.qsa('button', w).forEach((b) => b.setAttribute('aria-pressed', String(o[k].includes(b.dataset.v))));
    USE.qsa('button', w).forEach((b) => (b.onclick = () => {
      const v = b.dataset.v;
      o[k] = o[k].includes(v) ? o[k].filter((x) => x !== v) : [...o[k], v];
      sync(); fire();
    }));
    sync();
    if (opts.required) requireCheck(w, () => o[k].length > 0, 'Choose at least one.');
    return w;
  };

  F.tags = (o, k, opts = {}) => {
    o[k] = o[k] || [];
    const w = wrap(o, opts.label, opts, `<div class="chip-input"><input placeholder="${esc(opts.placeholder || 'Type and press Enter')}"></div>`);
    const box = w.querySelector('.chip-input'), inp = box.querySelector('input');
    const draw = () => {
      USE.qsa('.chip', box).forEach((c) => c.remove());
      o[k].forEach((t, i) => {
        const c = USE.el(`<span class="chip">${esc(t)}<button type="button" aria-label="Remove ${esc(t)}">×</button></span>`);
        c.querySelector('button').onclick = () => { o[k].splice(i, 1); draw(); fire(); };
        box.insertBefore(c, inp);
      });
    };
    const add = () => {
      inp.value.split(',').map((s) => s.trim()).filter(Boolean).forEach((t) => { if (!o[k].includes(t)) o[k].push(t); });
      inp.value = ''; draw(); fire();
    };
    inp.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
      else if (e.key === 'Backspace' && !inp.value && o[k].length) { o[k].pop(); draw(); fire(); }
    };
    inp.onblur = () => inp.value.trim() && add();
    draw();
    return w;
  };

  F.toggle = (o, k, opts = {}) => {
    const w = wrap(o, null, opts, `<label class="switch"><input type="checkbox"><span class="track"></span><span>${esc(opts.label)}</span></label>`);
    const c = w.querySelector('input');
    c.checked = !!o[k];
    c.onchange = () => { o[k] = c.checked; fire(); if (opts.onChange) opts.onChange(c.checked); };
    return w;
  };

  // File upload stored in the browser (IndexedDB). Value: {src, name, kind}
  F.file = (o, k, opts = {}) => {
    const id = fid();
    const w = wrap(o, opts.label, opts, `<div class="file-in">
      ${opts.image ? '<img class="thumb-prev hidden" alt="">' : ''}
      <label class="btn btn-ghost btn-sm" for="${id}">Choose file</label>
      <input id="${id}" type="file" class="sr-only" accept="${esc(opts.accept || '')}">
      <span class="fname"></span>
      <button type="button" class="btn-danger hidden" data-rm>Remove</button></div>`);
    const inp = w.querySelector('input'), nameEl = w.querySelector('.fname'), rm = w.querySelector('[data-rm]'), img = w.querySelector('img');
    const draw = async () => {
      const v = o[k];
      nameEl.textContent = v && v.src ? (v.name || 'File attached') : 'No file chosen';
      rm.classList.toggle('hidden', !(v && v.src));
      if (img) {
        img.classList.toggle('hidden', !(v && v.src));
        if (v && v.src) img.src = await USE.files.url(v.src);
      }
    };
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      if (f.size > 25 * 1024 * 1024) { USE.toast('Files up to 25 MB are supported in this prototype.'); return; }
      nameEl.textContent = 'Saving…';
      o[k] = { src: await USE.files.save(f), name: f.name, kind: f.type.startsWith('image/') ? 'image' : f.type.startsWith('video/') ? 'video' : 'file' };
      draw(); if (opts.onSet) opts.onSet(o[k]); fire();
    };
    rm.onclick = () => { o[k] = null; inp.value = ''; draw(); if (opts.onSet) opts.onSet(null); fire(); };
    draw();
    if (opts.required) requireCheck(w, () => o[k] && o[k].src, 'Please upload a file.');
    return w;
  };

  // Media: upload a file or paste a YouTube/web link. Value: {kind, src, name, caption}
  F.media = (o, k, opts = {}) => {
    const w = USE.el(`<div class="field media-in">${opts.label ? `<div class="label">${esc(opts.label)}</div>` : ''}
      <div class="tabs mode" role="tablist"><button type="button" data-m="upload">Upload file</button><button type="button" data-m="link">Paste link</button>${opts.optional !== false ? '<button type="button" data-m="none">None</button>' : ''}</div>
      <div data-body></div>${opts.hint ? `<div class="hint">${opts.hint}</div>` : ''}</div>`);
    const body = w.querySelector('[data-body]');
    const isLink = (v) => v && (v.kind === 'youtube' || v.kind === 'link');
    const set = (v) => { o[k] = v; if (opts.onSet) opts.onSet(v); fire(); };
    let mode = o[k] && o[k].src ? (isLink(o[k]) ? 'link' : 'upload') : (opts.optional !== false ? 'none' : 'upload');
    const draw = () => {
      USE.qsa('.mode button', w).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.m === mode)));
      body.innerHTML = '';
      if (mode === 'upload') {
        const holder = { f: o[k] && o[k].src && !isLink(o[k]) ? o[k] : null };
        body.appendChild(F.file(holder, 'f', { accept: opts.accept || 'video/*,image/*,application/pdf',
          onSet: (v) => set(v ? Object.assign({}, v, { caption: (o[k] || {}).caption || '' }) : null) }));
      } else if (mode === 'link') {
        const holder = { u: isLink(o[k]) ? o[k].src : '' };
        const lw = F.text(holder, 'u', { placeholder: 'https://www.youtube.com/watch?v=…' });
        lw.querySelector('input').addEventListener('input', () => {
          const u = holder.u.trim();
          set(u ? { kind: USE.youtubeId(u) ? 'youtube' : 'link', src: u, name: '', caption: (o[k] || {}).caption || '' } : null);
        });
        body.appendChild(lw);
      }
      if (opts.caption && mode !== 'none') {
        const cap = { c: (o[k] || {}).caption || '' };
        const cw = F.text(cap, 'c', { placeholder: 'Caption (optional)' });
        cw.querySelector('input').addEventListener('input', () => { if (o[k]) set(Object.assign({}, o[k], { caption: cap.c })); });
        body.appendChild(cw);
      }
    };
    USE.qsa('.mode button', w).forEach((b) => (b.onclick = () => { mode = b.dataset.m; if (mode === 'none') set(null); draw(); }));
    draw();
    if (opts.required) requireCheck(w, () => o[k] && o[k].src, 'Please add a file or link.');
    return w;
  };

  /* Repeater: a list of blocks that can be added, removed and reordered. */
  F.repeater = (arr, opts) => {
    const w = USE.el(`<div class="repeater">${opts.label ? `<div class="field" style="margin-bottom:8px"><div class="label">${esc(opts.label)}${opts.min ? ' <span class="req">*</span>' : ''}</div>${opts.hint ? `<div class="hint">${opts.hint}</div>` : ''}</div>` : ''}<div data-items></div><div class="add-row"></div></div>`);
    const items = w.querySelector('[data-items]');
    const addRow = w.querySelector('.add-row');
    const adders = opts.adders || [{ label: opts.add || '+ Add', make: opts.make }];
    adders.forEach((a) => {
      const b = USE.el(`<button type="button" class="add-btn">${esc(a.label)}</button>`);
      b.onclick = () => { arr.push(a.make()); draw(); fire(); const last = items.lastElementChild; if (last) { const f = last.querySelector('input,textarea'); if (f) f.focus(); } };
      addRow.appendChild(b);
    });
    function draw() {
      items.innerHTML = '';
      arr.forEach((it, i) => {
        const box = USE.el(`<div class="rep-item"><div class="rep-head"><span class="t">${esc(opts.title ? opts.title(it, i) : 'Item ' + (i + 1))}</span>
          <span class="rep-tools"><button type="button" title="Move up" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>↑</button><button type="button" title="Move down" aria-label="Move down" ${i === arr.length - 1 ? 'disabled' : ''}>↓</button><button type="button" class="del" title="Remove" aria-label="Remove">✕</button></span></div><div data-b></div></div>`);
        const [up, down, del] = USE.qsa('.rep-tools button', box);
        up.onclick = () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; draw(); fire(); };
        down.onclick = () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; draw(); fire(); };
        del.onclick = () => { if (opts.confirmDelete && !confirm('Remove this ' + opts.confirmDelete + '?')) return; arr.splice(i, 1); draw(); fire(); };
        opts.render(box.querySelector('[data-b]'), it, i);
        items.appendChild(box);
      });
      if (!arr.length && opts.empty) items.innerHTML = `<p class="muted small">${esc(opts.empty)}</p>`;
    }
    w._check = () => (opts.min && arr.length < opts.min ? (opts.minMsg || 'Add at least one.') : null);
    draw();
    return w;
  };

  // Resources: files or links, each with an audience.
  F.resources = (arr, opts = {}) => F.repeater(arr, {
    label: opts.label, hint: opts.hint || 'Choose who can see each item. Faculty-only items are hidden from students by default.',
    title: (r, i) => (r.kind === 'link' ? 'Link ' : 'File ') + (i + 1),
    empty: 'No resources yet.',
    adders: [
      { label: '+ Add file', make: () => ({ title: '', kind: 'file', src: '', name: '', audience: 'Both' }) },
      { label: '+ Add link', make: () => ({ title: '', kind: 'link', src: '', audience: 'Both' }) }
    ],
    render(b, r) {
      const g = USE.el('<div class="grid-2"></div>');
      g.appendChild(F.text(r, 'title', { label: 'Title', required: true, placeholder: r.kind === 'link' ? 'e.g. Background reading' : 'e.g. Student worksheet' }));
      g.appendChild(F.select(r, 'audience', { label: 'Who can see this?', options: [['Both', 'Students & faculty'], ['Student', 'Students'], ['Faculty', 'Faculty only']] }));
      b.appendChild(g);
      if (r.kind === 'link') b.appendChild(F.text(r, 'src', { label: 'URL', type: 'url', required: true, placeholder: 'https://…' }));
      else {
        const holder = { f: r.src ? { src: r.src, name: r.name } : null };
        b.appendChild(F.file(holder, 'f', { label: 'File', accept: opts.accept || '', required: true,
          onSet: (v) => { r.src = v ? v.src : ''; r.name = v ? v.name : ''; r.kind = v && v.kind !== 'file' ? v.kind : 'file'; } }));
      }
    }
  });

  /* ---------- Wizard ---------- */
  USE.Wizard = function (opts) {
    const { root, steps, data } = opts;
    let cur = 0;
    const done = new Set();
    root.innerHTML = `<div class="container"><div class="wizard">
      <aside><ol class="wz-steps card" aria-label="Form steps">${steps.map((s, i) => `<li><button type="button" data-i="${i}"><span class="n">${i + 1}</span>${esc(s.title)}</button></li>`).join('')}</ol></aside>
      <section class="card wz-panel" aria-live="polite">
        <div class="wz-progress"><div></div></div>
        <div class="eyebrow" data-count></div>
        <h2 data-title></h2><p class="intro" data-intro></p>
        <div data-body></div>
        <div class="wz-nav"><button type="button" class="btn btn-ghost" data-back>← Back</button>
          <span class="saved-note" data-saved></span>
          <div class="right"><button type="button" class="btn btn-ghost" data-draft>Save draft</button><button type="button" class="btn btn-primary" data-next>Next →</button></div></div>
      </section></div></div>`;
    const $ = (s) => root.querySelector(s);
    let saveT;
    const save = (quiet) => {
      if (!opts.draftKey) return;
      USE.LS.set(opts.draftKey, { data, step: cur, at: new Date().toISOString() });
      $('[data-saved]').textContent = 'Draft saved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (!quiet) USE.toast('Draft saved in this browser.');
    };
    F.onChange(() => { clearTimeout(saveT); saveT = setTimeout(() => save(true), 800); });

    function validate() {
      const errs = [];
      USE.qsa('.field.error, .repeater.error', $('[data-body]')).forEach((f) => { f.classList.remove('error'); const e = f.querySelector(':scope > .err'); if (e) e.remove(); });
      USE.qsa('[data-body] *', root).forEach((el) => {
        if (!el._check || el.closest('.hidden')) return;
        const m = el._check();
        if (m) { el.classList.add('error'); el.insertAdjacentHTML('beforeend', `<div class="err">${esc(m)}</div>`); errs.push(el); }
      });
      const extra = steps[cur].validate ? steps[cur].validate(data) : null;
      if (extra) { USE.toast(extra); return false; }
      if (errs.length) { errs[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); USE.toast('Please complete the highlighted fields.'); return false; }
      return true;
    }

    function go(i) {
      cur = i;
      const s = steps[i];
      USE.qsa('.wz-steps li', root).forEach((li, j) => { li.classList.toggle('current', j === i); li.classList.toggle('done', done.has(j) && j !== i); });
      $('.wz-progress div').style.width = ((i + 1) / steps.length) * 100 + '%';
      $('[data-count]').textContent = `Step ${i + 1} of ${steps.length}`;
      $('[data-title]').textContent = s.title;
      $('[data-intro]').innerHTML = s.intro || '';
      const body = $('[data-body]'); body.innerHTML = '';
      s.render(body, data);
      $('[data-back]').style.visibility = i === 0 ? 'hidden' : 'visible';
      const last = i === steps.length - 1;
      $('[data-next]').textContent = last ? 'Submit resource ✓' : 'Next →';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    $('[data-back]').onclick = () => go(cur - 1);
    $('[data-draft]').onclick = () => save(false);
    $('[data-next]').onclick = () => {
      if (!validate()) return;
      done.add(cur);
      if (cur === steps.length - 1) { opts.onSubmit(data); if (opts.draftKey) USE.LS.del(opts.draftKey); }
      else { save(true); go(cur + 1); }
    };
    USE.qsa('.wz-steps button', root).forEach((b) => (b.onclick = () => {
      const i = +b.dataset.i;
      if (i <= cur || [...Array(i).keys()].every((j) => done.has(j))) go(i);
      else USE.toast('Complete the current step first.');
    }));
    if (opts.startStep) { for (let j = 0; j < opts.startStep; j++) done.add(j); }
    go(opts.startStep || 0);
    return { go };
  };
})();
