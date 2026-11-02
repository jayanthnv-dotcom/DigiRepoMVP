/* Profiles (view + edit) and "My student links". */
(function () {
  const USE = window.USE;
  const esc = USE.esc;

  USE.profilePage = () => {
    USE.layout(null);
    const root = USE.qs('#app');
    const p = USE.store.profile(USE.param('id'));
    if (!p) {
      root.innerHTML = `<div class="container detail"><div class="card card-pad empty"><h2>Profile not found</h2><a class="btn btn-primary" href="profile-edit.html">Create a profile</a></div></div>`;
      return;
    }
    document.title = p.name + ' · USE Network';
    const mine = USE.store.me() && USE.store.me().id === p.id;
    const items = USE.store.byContributor(p.id);
    const groups = Object.values(USE.TYPES).map((T) => [T, items.filter((i) => i.type === T.key)]).filter(([, l]) => l.length);
    const contact = [];
    if (p.showEmail && p.email) contact.push(['Email', `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`]);
    if (p.showPhone && p.phone) contact.push(['Phone', `<a href="tel:${esc(p.phone.replace(/\s/g, ''))}">${esc(p.phone)}</a>`]);
    const links = [['Website', p.website], ['ORCID', p.orcid], ['LinkedIn', p.linkedin]].filter(([, v]) => v);

    root.innerHTML = `
      <section class="page-hero"><div class="container">
        <div class="crumbs"><a href="index.html">Home</a> › Contributor profile</div>
        <div class="profile-head">${USE.avatar(p, 'lg')}
          <div><h1>${esc(p.name)}</h1><div class="sub">${esc([p.designation, p.department].filter(Boolean).join(' · '))}</div>
          <div class="sub">${esc([p.institution, p.location].filter(Boolean).join(', '))}</div></div>
          ${mine ? '<a class="btn btn-primary teacher-only" style="margin-left:auto" href="profile-edit.html">Edit profile</a>' : ''}
        </div>
        ${(p.disciplines || []).length ? `<div class="meta-line"><span><b>Disciplines:</b>${esc(p.disciplines.join(', '))}</span></div>` : ''}
      </div></section>
      <div class="container detail"><div class="cols">
        <div class="stack">
          ${p.bio ? `<section class="card card-pad">${USE.sectionTitle('👋', 'About')}<div class="prose">${USE.prose(p.bio)}</div>${p.interests ? `<p class="small"><b>Teaching interests:</b> ${esc(p.interests)}</p>` : ''}</section>` : ''}
          <section class="card card-pad">${USE.sectionTitle('📂', 'Contributions')}
            ${groups.length ? groups.map(([T, l]) => `<h3 style="margin-top:16px">${T.icon} ${T.label} <span class="muted small">(${l.length})</span></h3><div class="cards">${l.map(USE.card).join('')}</div>`).join('')
              : '<p class="muted">No contributions yet.</p>'}
          </section>
        </div>
        <div class="stack">
          <section class="card card-pad">${USE.sectionTitle('✉️', 'Contact')}
            ${contact.length ? `<ul class="contact-list">${contact.map(([k, v]) => `<li><span class="k">${k}</span><span>${v}</span></li>`).join('')}</ul>`
              : '<p class="muted small">This contributor hasn’t shared contact details.</p>'}
          </section>
          ${links.length ? `<section class="card card-pad">${USE.sectionTitle('🔗', 'Links')}<ul class="contact-list">${links.map(([k, v]) => `<li><span class="k">${k}</span><a href="${esc(v)}" target="_blank" rel="noopener">${esc(v.replace(/^https?:\/\//, ''))}</a></li>`).join('')}</ul></section>` : ''}
        </div>
      </div></div>`;
    USE.hydrateSrc(root);
  };

  USE.profileEditPage = () => {
    USE.layout(null);
    const root = USE.qs('#app');
    const F = USE.F;
    const isNew = USE.param('new') === '1' || !USE.store.me();
    const p = isNew ? { id: USE.uid('p'), disciplines: [], showEmail: false, showPhone: false } : JSON.parse(JSON.stringify(USE.store.me()));
    root.innerHTML = `<section class="page-hero"><div class="container"><div class="crumbs"><a href="index.html">Home</a> › Profile</div>
      <h1>${isNew ? 'Create your profile' : 'Edit your profile'}</h1><p class="lede">Your profile appears on every resource you contribute. You decide whether your email and phone are visible.</p></div></section>
      <div class="container detail"><form class="card wz-panel" style="max-width:820px;margin:0 auto" novalidate></form></div>`;
    const f = USE.qs('form', root);
    if (p.sample) f.appendChild(USE.el('<div class="callout note" style="margin-bottom:18px"><p>This is a sample profile. Changes are saved in this browser only.</p></div>'));
    const h = (t) => f.appendChild(USE.el(`<h3 style="margin:8px 0 14px">${t}</h3>`));
    h('About you');
    f.appendChild(F.file(p, '_photo', { label: 'Photo (optional)', image: true, accept: 'image/*' }));
    if (p.photo && !p._photo) p._photo = { src: p.photo, name: 'Current photo' };
    const g = USE.el('<div class="grid-2"></div>');
    g.appendChild(F.text(p, 'name', { label: 'Full name', required: true, placeholder: 'e.g. Dr. Asha Rao' }));
    g.appendChild(F.text(p, 'designation', { label: 'Designation', required: true, placeholder: 'e.g. Assistant Professor, Chemistry' }));
    g.appendChild(F.text(p, 'department', { label: 'Department' }));
    g.appendChild(F.text(p, 'institution', { label: 'Institution', required: true }));
    g.appendChild(F.text(p, 'location', { label: 'City, State' }));
    f.appendChild(g);
    f.appendChild(F.chips(p, 'disciplines', { label: 'Disciplines you teach', options: USE.TAX.disciplines }));
    f.appendChild(F.area(p, 'bio', { label: 'Short bio', rows: 4, max: 800 }));
    f.appendChild(F.text(p, 'interests', { label: 'Teaching interests', placeholder: 'e.g. inquiry-based labs, assessment, low-cost apparatus' }));
    h('Links (optional)');
    const g2 = USE.el('<div class="grid-3"></div>');
    g2.appendChild(F.text(p, 'website', { label: 'Website', type: 'url', placeholder: 'https://' }));
    g2.appendChild(F.text(p, 'orcid', { label: 'ORCID', type: 'url', placeholder: 'https://orcid.org/…' }));
    g2.appendChild(F.text(p, 'linkedin', { label: 'LinkedIn', type: 'url', placeholder: 'https://linkedin.com/in/…' }));
    f.appendChild(g2);
    h('Contact & privacy');
    const g3 = USE.el('<div class="grid-2"></div>');
    const ce = USE.el('<div></div>'); ce.appendChild(F.text(p, 'email', { label: 'Email', type: 'email', required: true })); ce.appendChild(F.toggle(p, 'showEmail', { label: 'Show my email to visitors' }));
    const cp = USE.el('<div></div>'); cp.appendChild(F.text(p, 'phone', { label: 'Phone (optional)', type: 'tel' })); cp.appendChild(F.toggle(p, 'showPhone', { label: 'Show my phone number to visitors' }));
    g3.append(ce, cp);
    f.appendChild(g3);
    f.appendChild(USE.el(`<div class="wz-nav"><a class="btn btn-ghost" href="javascript:history.back()">Cancel</a><span></span><button class="btn btn-primary" type="submit">${isNew ? 'Create profile' : 'Save profile'}</button></div>`));
    f.onsubmit = (e) => {
      e.preventDefault();
      let bad = null;
      USE.qsa('*', f).forEach((el) => {
        if (!el._check) return;
        el.classList.remove('error'); const er = el.querySelector(':scope > .err'); if (er) er.remove();
        const m = el._check(); if (m) { el.classList.add('error'); el.insertAdjacentHTML('beforeend', `<div class="err">${esc(m)}</div>`); bad = bad || el; }
      });
      if (bad) { bad.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      p.photo = p._photo ? p._photo.src : ''; delete p._photo;
      USE.store.saveProfile(p); USE.store.setMe(p.id);
      const ret = USE.param('return');
      location.href = ret && /^[\w.-]+\.html/.test(ret) ? ret : 'profile.html?id=' + encodeURIComponent(p.id);
    };
  };

  USE.myLinksPage = () => {
    USE.layout(null);
    const root = USE.qs('#app');
    const draw = () => {
      const links = USE.store.links();
      root.innerHTML = `<section class="page-hero"><div class="container"><div class="crumbs"><a href="index.html">Home</a> › My student links</div>
        <h1>My student links</h1><p class="lede">Links you have created with “Share with students”. Each one shows students only the sections you chose.</p></div></section>
        <div class="container detail"><div class="card card-pad">
        ${links.length ? `<table class="links-table"><thead><tr><th>Link name</th><th>Resource</th><th>Created</th><th></th></tr></thead><tbody>
          ${links.map((l) => {
            const T = USE.TYPES[l.type];
            return `<tr><td><b>${esc(l.name)}</b>${l.state && l.state.m ? `<div class="small muted">Method: ${esc((USE.LAB_METHODS || {})[l.state.m] ? USE.LAB_METHODS[l.state.m].label : l.state.m)}</div>` : ''}</td>
              <td><a href="${T.detail}?id=${encodeURIComponent(l.resourceId)}">${esc(l.title)}</a><div class="small muted">${esc(T.single)}</div></td>
              <td class="small">${esc(USE.fmtDate(l.updated || l.created))}</td>
              <td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" data-copy="${esc(l.id)}">Copy</button>
                <a class="btn btn-ghost btn-sm" href="${T.detail}?id=${encodeURIComponent(l.resourceId)}&editlink=${esc(l.id)}">Edit</a>
                <a class="btn btn-ghost btn-sm" href="${esc(l.url)}" target="_blank" rel="noopener">Open</a>
                <button class="btn-danger" data-del="${esc(l.id)}">Delete</button></td></tr>`;
          }).join('')}</tbody></table>`
          : `<div class="empty"><h3>No student links yet</h3><p>Open any resource in the Teacher view and click <b>Share with students</b>.</p><a class="btn btn-primary" href="labs.html">Browse Lab Experiments</a></div>`}
        </div></div>`;
      USE.qsa('[data-copy]', root).forEach((b) => (b.onclick = async () => {
        const l = USE.store.links().find((x) => x.id === b.dataset.copy);
        USE.toast((await USE.copy(l.url)) ? 'Link copied' : l.url);
      }));
      USE.qsa('[data-del]', root).forEach((b) => (b.onclick = () => { if (confirm('Delete this link? Students who already have it can still open it in this prototype.')) { USE.store.removeLink(b.dataset.del); draw(); } }));
    };
    draw();
  };
})();
