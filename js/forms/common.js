/* Contribution page: type chooser, profile gate, shared "Basics" step, review and submit. */
(function () {
  const USE = window.USE;
  const F = USE.F;
  const esc = USE.esc;
  USE.forms = USE.forms || {};

  // Fields shared by every resource type.
  USE.basicsStep = (opts = {}) => ({
    title: 'Basics',
    intro: 'These details appear on the listing card and at the top of the resource page, and power search and filters.',
    render(b, d) {
      const me = USE.store.me();
      if (me) {
        b.appendChild(USE.el(`<div class="field"><div class="label">Contributing as</div><div class="me-card">${USE.avatar(me, 'md')}<div><b>${esc(me.name)}</b><div class="small muted">${esc([me.designation, me.institution].filter(Boolean).join(' · '))}</div></div><a class="btn-link" style="margin-left:auto" href="profile-edit.html" target="_blank">Edit profile</a></div></div>`));
        USE.hydrateSrc(b);
      } else {
        d.guest = d.guest || { name: '', institution: '' };
        b.appendChild(USE.el(`<div class="field"><div class="label">About you</div><div class="hint" style="margin:0 0 8px">No login needed. Optionally <a href="profile-edit.html?return=${encodeURIComponent('contribute.html' + location.search)}">create a profile</a> so colleagues can find all your work.</div></div>`));
        const gg = USE.el('<div class="grid-2"></div>');
        gg.appendChild(F.text(d.guest, 'name', { label: 'Your name', required: true, placeholder: 'e.g. Dr. Asha Rao' }));
        gg.appendChild(F.text(d.guest, 'institution', { label: 'Institution', required: true, placeholder: 'e.g. St. Joseph’s College, Bengaluru' }));
        b.appendChild(gg);
      }
      b.appendChild(F.text(d, 'title', { label: 'Title', required: true, max: 120, placeholder: opts.titlePh || '' }));
      b.appendChild(F.area(d, 'overview', { label: 'Overview', required: true, max: 220, rows: 2, hint: 'One or two sentences. Shown on the card and under the title.' }));
      b.appendChild(F.chips(d, 'disciplines', { label: opts.subjectLabel || 'Discipline(s)', required: true, options: USE.TAX.disciplines }));
      const g = USE.el('<div class="grid-3"></div>');
      g.appendChild(F.text(d, 'topic', { label: 'Topic (optional)', placeholder: 'e.g. Polymer structures' }));
      g.appendChild(F.select(d, 'level', { label: 'Level', required: true, placeholder: 'Choose level', options: USE.TAX.levels }));
      g.appendChild(F.select(d, 'language', { label: 'Language', required: true, options: USE.TAX.languages }));
      b.appendChild(g);
      b.appendChild(F.file(d, 'thumbFile', { label: 'Thumbnail image', image: true, accept: 'image/*', hint: 'A photo of the set-up, activity or material. Landscape images look best.' }));
      b.appendChild(F.tags(d, 'keywords', { label: 'Keywords', hint: 'Press Enter after each keyword. Used for search.' }));
      d.co = d.co || [];
      b.appendChild(F.repeater(d.co, {
        label: 'Co-contributors (optional)', hint: 'Add colleagues who developed this with you.',
        title: (c, i) => 'Co-contributor ' + (i + 1), add: '+ Add co-contributor', make: () => ({ id: '', name: '' }),
        render(box, c) {
          const others = USE.store.profiles().filter((p) => !me || p.id !== me.id);
          const g2 = USE.el('<div class="grid-2"></div>');
          g2.appendChild(F.select(c, 'id', { label: 'Existing profile', placeholder: '— not on the repository —', options: others.map((p) => [p.id, p.name]) }));
          g2.appendChild(F.text(c, 'name', { label: 'Or type a name', placeholder: 'Name, Institution' }));
          box.appendChild(g2);
        }
      }));
    }
  });

  USE.reviewStep = (type) => ({
    title: 'Review & submit',
    intro: 'This is how your resource will look. Use Back to change anything. Use the Student/Teacher toggle at the top to check both views.',
    render(b, d) {
      const item = USE.buildItem(type, d);
      const frame = USE.el(`<div class="review-frame"><div class="rf-bar"><span>Preview</span><span>Licence: ${esc(USE.TAX.licence)}</span></div><div data-pv></div></div>`);
      b.appendChild(frame);
      const pv = frame.querySelector('[data-pv]');
      const draw = () => {
        USE.views[type].render(item, pv);
        USE.qsa('[data-share]', pv).forEach((el) => el.classList.toggle('share-hidden', USE.role() === 'student' && el.dataset.student === 'off'));
        USE.hydrateSrc(pv);
      };
      draw();
      document.addEventListener('rolechange', draw);
      b.appendChild(USE.el(`<label class="switch" style="margin-top:18px"><input type="checkbox" checked disabled><span class="track"></span><span>I agree to share this resource under ${esc(USE.TAX.licence)}.</span></label>`));
    }
  });

  USE.buildItem = (type, d) => {
    const me = USE.store.me();
    const base = {
      id: d._id || USE.uid(type), type, created: d._created || new Date().toISOString(),
      title: d.title || 'Untitled', overview: d.overview || '', disciplines: d.disciplines || [], topic: d.topic || '',
      level: d.level || '', language: d.language || '', keywords: d.keywords || [],
      thumbnail: d.thumbFile && d.thumbFile.src ? d.thumbFile.src : '',
      contributors: [me ? { id: me.id } : { name: (d.guest || {}).name || 'Anonymous', institution: (d.guest || {}).institution || '' }, ...(d.co || []).filter((c) => c.id || c.name).map((c) => (c.id ? { id: c.id } : { name: c.name }))],
      licence: USE.TAX.licence
    };
    return Object.assign(base, USE.forms[type].toItem(d));
  };

  USE.contributePage = () => {
    USE.layout(null);
    const root = USE.qs('#app');
    const type = USE.param('type');

    const head = (t, sub) => `<section class="page-hero"><div class="container"><div class="crumbs"><a href="index.html">Home</a> › Contribute</div><h1>${esc(t)}</h1><p class="lede">${esc(sub)}</p></div></section>`;

    function draw() {
      if (!type || !USE.forms[type]) {
        root.innerHTML = head('Contribute a resource', 'Share what works in your classroom with educators across India.') +
          `<div class="container detail"><h2>What would you like to share?</h2><div class="type-cards">${Object.values(USE.TYPES).map((T) =>
            `<a class="card type-card" href="contribute.html?type=${T.key}"><span class="ico">${T.icon}</span><h3>${T.single}</h3><p>${T.blurb}</p><span class="count">Start →</span></a>`).join('')}</div></div>`;
        return;
      }
      const T = USE.TYPES[type];
      const form = USE.forms[type];
      const key = 'draft.' + type;
      const draft = USE.LS.get(key, null);
      root.innerHTML = head('Contribute: ' + T.single, form.blurb || T.blurb) + '<div data-w></div>';
      const start = (data, step) => {
        USE.Wizard({
          root: USE.qs('[data-w]'), steps: form.steps(), data, draftKey: key, startStep: step,
          onSubmit(d) {
            const item = USE.buildItem(type, d);
            if (!USE.store.save(item)) return;
            root.innerHTML = head('Thank you!', 'Your resource has been added to the repository.') +
              `<div class="container detail"><div class="card success-box"><div class="big">🎉</div><h2>${esc(item.title)}</h2>
              <p class="muted">It now appears in ${esc(T.label)} with a “New” badge. In this prototype it is saved in this browser only.</p>
              <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="${T.detail}?id=${encodeURIComponent(item.id)}">View resource</a><a class="btn btn-ghost" href="${T.list}">Go to ${esc(T.label)}</a><a class="btn btn-ghost" href="contribute.html">Contribute another</a></div></div></div>`;
            window.scrollTo(0, 0);
          }
        });
      };
      if (draft && draft.data) {
        USE.modal(`<h3>Continue your draft?</h3><p class="muted">You have an unfinished ${esc(T.single.toLowerCase())} draft${draft.data.title ? ': <b>' + esc(draft.data.title) + '</b>' : ''}, saved ${esc(USE.fmtDate(draft.at))}.</p>
          <div class="actions"><button class="btn btn-ghost" data-new>Start over</button><button class="btn btn-primary" data-cont>Continue draft</button></div>`,
        (m, close) => {
          m.querySelector('[data-cont]').onclick = () => { close(); start(draft.data, draft.step || 0); };
          m.querySelector('[data-new]').onclick = () => { USE.LS.del(key); close(); start(form.blank(), 0); };
        });
        start(draft.data, draft.step || 0);
      } else start(form.blank(), 0);
    }
    draw();
  };
})();
