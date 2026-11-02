/* Home page. */
(function () {
  const USE = window.USE;
  const esc = USE.esc;

  USE.homePage = () => {
    USE.layout('home');
    const root = USE.qs('#app');
    const all = USE.store.all();
    const recent = [...all].sort((a, b) => (b.created || '').localeCompare(a.created || '')).slice(0, 4);
    root.innerHTML = `
      <section class="home-hero"><div class="container">
        <img class="banner" src="assets/img/hero-banner.jpg" alt="Illustration of a teacher at a blackboard with students, lab glassware and a microscope">
        <h1>Undergraduate <span class="o">Science Educators’</span> <span class="b">Network</span></h1>
        <p class="lede">A digital repository of low-cost, Indian-context teaching resources for undergraduate science and mathematics, shared by educators for educators.</p>
        <form class="big-search" role="search" id="hs">
          <input type="search" id="hq" placeholder="Search experiments, activities, worksheets, courses…" aria-label="Search the repository">
          <select id="ht" aria-label="Resource type"><option value="all">All resources</option>${Object.values(USE.TYPES).map((T) => `<option value="${T.list}">${T.label}</option>`).join('')}</select>
          <button class="btn btn-primary" type="submit">Search</button>
        </form>
      </div></section>
      <div class="container">
        <section class="section hidden" id="results" style="margin-top:36px"></section>
        <section class="section" style="margin-top:36px">
          <div class="type-cards">${Object.values(USE.TYPES).map((T) => {
            const n = all.filter((r) => r.type === T.key).length;
            return `<a class="card type-card" href="${T.list}"><span class="ico">${T.icon}</span><h3>${T.label}</h3><p>${esc(T.blurb)}</p><span class="count">${n} resource${n === 1 ? '' : 's'} →</span></a>`;
          }).join('')}</div>
        </section>
        <section class="section">
          <h2>Browse by discipline</h2>
          <div class="disc-row">${USE.TAX.disciplines.map((d) => `<a href="#" data-d="${esc(d)}">${esc(d)}</a>`).join('')}</div>
        </section>
        <section class="section">
          <div class="list-head" style="margin-bottom:14px"><h2 style="margin:0">Recently added</h2></div>
          <div class="cards">${recent.map(USE.card).join('')}</div>
        </section>
        <section class="section teacher-only">
          <div class="cta-band"><div><h2>Share your practice</h2><p>Have an experiment, activity, worksheet or course that works in your classroom? Share it so others can adapt it.</p></div>
            <a class="btn btn-primary" href="contribute.html">＋ Contribute a resource</a></div>
        </section>
      </div>`;
    const search = (q) => {
      const box = USE.qs('#results');
      const words = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.length) { box.classList.add('hidden'); return; }
      const hits = all.filter((r) => {
        const hay = [r.title, r.overview, r.topic, ...(r.keywords || []), ...(r.disciplines || []), ...USE.contributorNames(r)].join(' ').toLowerCase();
        return words.every((w) => hay.includes(w));
      });
      box.classList.remove('hidden');
      box.innerHTML = `<div class="list-head" style="margin-bottom:14px"><h2 style="margin:0">${hits.length} result${hits.length === 1 ? '' : 's'} for “${esc(q)}”</h2><button class="btn-link" id="clr">Clear</button></div>
        ${hits.length ? `<div class="cards">${hits.map((r) => USE.card(r).replace('<div class="tags">', `<div class="tags"><span class="tag" style="background:var(--navy);color:#fff">${esc(USE.TYPES[r.type].single)}</span>`)).join('')}</div>` : '<div class="card empty">No matching resources. Try another word.</div>'}`;
      USE.qs('#clr').onclick = () => { USE.qs('#hq').value = ''; box.classList.add('hidden'); history.replaceState(null, '', 'index.html'); };
      USE.hydrateSrc(box);
      box.scrollIntoView({ behavior: 'smooth' });
    };
    USE.qs('#hs').onsubmit = (e) => {
      e.preventDefault();
      const q = USE.qs('#hq').value.trim(), t = USE.qs('#ht').value;
      if (t === 'all') { history.replaceState(null, '', '?q=' + encodeURIComponent(q)); search(q); }
      else location.href = t + '?q=' + encodeURIComponent(q);
    };
    if (USE.param('q')) { USE.qs('#hq').value = USE.param('q'); search(USE.param('q')); }
    USE.qsa('[data-d]', root).forEach((a) => (a.onclick = (e) => {
      e.preventDefault();
      const d = a.dataset.d;
      USE.modal(`<h3>${esc(d)}</h3><p class="muted small">Choose a resource type.</p>${Object.values(USE.TYPES).map((T) => {
        const n = all.filter((r) => r.type === T.key && (r.disciplines || []).includes(d)).length;
        return `<a class="btn btn-ghost" style="width:100%;justify-content:space-between;margin-top:8px" href="${T.list}?discipline=${encodeURIComponent(d)}">${T.icon} ${T.label}<span class="muted">${n}</span></a>`;
      }).join('')}<div class="actions"><button class="btn btn-ghost" data-close>Close</button></div>`);
    }));
    USE.hydrateSrc(root);
  };
})();
