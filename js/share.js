/* "Share with students" engine.
   Any element with data-share="<id>" is a shareable section; data-student="off" marks
   sections hidden from students by default (e.g. answer keys, faculty-only files).
   A teacher toggles sections on/off and creates a named link. In this prototype the
   choices are encoded in the link itself (?share=...); phase 2 stores them in Firestore. */

(function () {
  const USE = window.USE;
  const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = (s) => { try { return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))); } catch (e) { return null; } };

  USE.share = {
    init(opts) {
      const S = { opts, mode: 'normal', state: null, item: opts.item };
      const ids = () => USE.qsa('[data-share]').map((e) => e.dataset.share);
      const defaults = () => ({
        v: USE.qsa('[data-share]').filter((e) => e.dataset.student !== 'off').map((e) => e.dataset.share),
        m: opts.defaultMethod ? opts.defaultMethod() : null, n: ''
      });

      const linkParam = USE.param('share');
      if (linkParam) {
        S.state = dec(linkParam);
        if (S.state) S.mode = 'link';
      }

      function forceStudent(on) {
        if (on) { document.body.classList.add('role-student'); document.body.classList.remove('role-teacher'); USE.qsa('.role-toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.role === 'student'))); }
        else USE.applyRole();
      }

      function apply() {
        const role = USE.role();
        const st = S.state || defaults();
        const showOnlyChosen = S.mode === 'link' || S.mode === 'preview';
        USE.qsa('[data-share]').forEach((el) => {
          const id = el.dataset.share;
          let visible;
          if (showOnlyChosen) visible = st.v.includes(id);
          else if (S.mode === 'edit' || role === 'teacher') visible = true;
          else visible = el.dataset.student !== 'off';
          el.classList.toggle('share-hidden', !visible);
          el.classList.toggle('share-off', S.mode === 'edit' && !st.v.includes(id));
          const cb = el.querySelector(':scope > .share-ctl input');
          if (cb) cb.checked = st.v.includes(id);
        });
        if (opts.onApply) opts.onApply({ mode: S.mode, role, state: st });
      }
      S.apply = apply;

      /* ---- link mode (student opened a shared link) ---- */
      function linkBanner() {
        const by = S.state.by ? USE.store.profile(S.state.by) : null;
        const bar = USE.el(`<div class="student-banner"><div class="container">
          <span>📌 <b>Student link</b>${S.state.n ? ': “' + USE.esc(S.state.n) + '”' : ''}${by ? ' · shared by ' + USE.esc(by.name) : ''}</span>
          <span class="spacer"></span>
          <a class="btn btn-sm btn-ghost teacher-link-exit" href="?id=${encodeURIComponent(S.item.id)}">Exit student link</a>
        </div></div>`);
        USE.qs('.site-header').after(bar);
      }

      /* ---- teacher tools in hero ---- */
      function teacherBar() {
        const tb = USE.qs('[data-teacher-bar]');
        if (!tb) return;
        tb.innerHTML = `<button class="btn btn-primary btn-sm" data-act="share">🔗 Share with students</button>
          <button class="btn btn-ghost btn-sm" data-act="preview">👁 Preview default student view</button>`;
        tb.querySelector('[data-act=share]').onclick = () => enterEdit();
        tb.querySelector('[data-act=preview]').onclick = () => USE.setRole('student');
      }

      /* ---- edit mode ---- */
      let editingLink = null;
      function enterEdit(link) {
        editingLink = link || null;
        S.state = link ? JSON.parse(JSON.stringify(link.state)) : defaults();
        S.mode = 'edit';
        document.body.classList.add('share-on', 'sharing');
        USE.qsa('[data-share]').forEach((el) => {
          if (el.querySelector(':scope > .share-ctl')) return;
          const label = el.dataset.shareLabel || 'Students';
          const ctl = USE.el(`<div class="share-ctl"><label class="switch"><input type="checkbox"><span class="track"></span><span>${USE.esc(label)}</span></label></div>`);
          ctl.querySelector('input').onchange = (e) => {
            const v = new Set(S.state.v);
            e.target.checked ? v.add(el.dataset.share) : v.delete(el.dataset.share);
            S.state.v = [...v]; apply();
          };
          el.prepend(ctl);
        });
        const bar = USE.el(`<div class="share-bar" role="region" aria-label="Share with students"><div class="container">
          <span class="t">Share with students</span>
          <input class="input" data-name placeholder="Link name, e.g. BSc Chem Y2 – Section A" value="${USE.esc(link ? link.name : '')}">
          <span data-extra></span>
          <label class="switch"><input type="checkbox" data-preview><span class="track"></span><span>Preview as student</span></label>
          <span class="spacer"></span>
          <button class="btn btn-ghost btn-sm" data-cancel>Cancel</button>
          <button class="btn btn-primary btn-sm" data-create>${link ? 'Update link' : 'Create student link'}</button>
        </div></div>`);
        document.body.appendChild(bar);
        if (opts.extraControls) opts.extraControls(bar.querySelector('[data-extra]'), S.state, apply);
        bar.querySelector('[data-preview]').onchange = (e) => {
          S.mode = e.target.checked ? 'preview' : 'edit';
          document.body.classList.toggle('share-on', !e.target.checked);
          forceStudent(e.target.checked);
          apply();
        };
        bar.querySelector('[data-cancel]').onclick = exitEdit;
        bar.querySelector('[data-create]').onclick = () => createLink(bar.querySelector('[data-name]').value.trim());
        USE.toast('Use the switches on each section to choose what students see.');
        apply();
      }

      function exitEdit() {
        S.mode = 'normal'; S.state = null;
        document.body.classList.remove('share-on', 'sharing');
        USE.qsa('.share-ctl').forEach((e) => e.remove());
        const bar = USE.qs('.share-bar'); if (bar) bar.remove();
        forceStudent(false);
        apply();
      }

      function createLink(name) {
        if (!name) { USE.toast('Give the link a name so you can find it later.'); USE.qs('.share-bar [data-name]').focus(); return; }
        const me = USE.store.me();
        const state = { v: S.state.v, m: S.state.m || null, n: name, by: me ? me.id : null };
        const url = location.origin + location.pathname + '?id=' + encodeURIComponent(S.item.id) + '&share=' + enc(state);
        const link = {
          id: editingLink ? editingLink.id : USE.uid('lnk'), name, url, state,
          type: S.item.type, resourceId: S.item.id, title: S.item.title,
          created: editingLink ? editingLink.created : new Date().toISOString(), updated: new Date().toISOString()
        };
        USE.store.saveLink(link);
        exitEdit();
        USE.modal(`<h3>${editingLink ? 'Link updated' : 'Student link created'}</h3>
          <p class="muted small">Send this link to your students on WhatsApp, email or your LMS. They will only see the sections you switched on.${editingLink ? ' Because this prototype stores the choices inside the link, send the updated link again.' : ''}</p>
          <div class="copy-row"><input class="input" readonly value="${USE.esc(url)}"><button class="btn btn-navy" data-copy>Copy</button></div>
          <div class="actions"><a class="btn btn-ghost" href="my-links.html">My student links</a><a class="btn btn-ghost" href="${USE.esc(url)}" target="_blank" rel="noopener">Open as student</a><button class="btn btn-primary" data-close>Done</button></div>`,
        (m) => {
          m.querySelector('[data-copy]').onclick = async () => USE.toast((await USE.copy(url)) ? 'Link copied' : 'Select the link and copy it');
          m.querySelector('input').select();
        });
      }

      /* ---- boot ---- */
      if (S.mode === 'link') {
        forceStudent(true);
        linkBanner();
        document.addEventListener('rolechange', () => { location.href = '?id=' + encodeURIComponent(S.item.id); });
      } else {
        teacherBar();
        document.addEventListener('rolechange', () => { if (S.mode !== 'normal') exitEdit(); else apply(); });
        const lid = USE.param('editlink');
        if (lid) {
          const l = USE.store.links().find((x) => x.id === lid);
          if (l && USE.role() === 'teacher') setTimeout(() => enterEdit(l), 0);
        }
      }
      apply();
      return S;
    }
  };
})();
