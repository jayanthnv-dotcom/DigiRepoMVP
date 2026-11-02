/* Shared listing page: search, filters, sort, card grid, "Load more". */
(function () {
  const USE = window.USE;
  const PAGE = 12;

  USE.listPage = (type, cfg) => {
    cfg = cfg || {};
    const T = USE.TYPES[type];
    USE.layout(type);
    const root = USE.qs('#app');
    const opt = (arr, all) => `<option value="">${all}</option>` + arr.map((v) => `<option>${USE.esc(v)}</option>`).join('');
    const extra = cfg.extraFilter;

    root.innerHTML = `
      <section class="page-hero"><div class="container" style="padding-bottom:56px">
        <div class="list-head">
          <div><div class="crumbs"><a href="index.html">Home</a> › ${T.label}</div>
            <h1>${T.label}</h1><p class="lede">${USE.esc(cfg.intro || T.blurb)}</p></div>
          <a class="btn btn-primary" href="contribute.html?type=${type}">＋ Contribute Resource</a>
        </div>
      </div></section>
      <div class="container">
        <form class="toolbar" role="search" onsubmit="return false">
          <div class="search"><label for="q">Search</label><input id="q" class="input" type="search" placeholder="Search title, overview, keywords…"></div>
          <div><label for="f-disc">Discipline</label><select id="f-disc" class="input">${opt(USE.TAX.disciplines, 'All disciplines')}</select></div>
          <div><label for="f-level">Level</label><select id="f-level" class="input">${opt(USE.TAX.levels, 'All levels')}</select></div>
          <div><label for="f-lang">Language</label><select id="f-lang" class="input">${opt(USE.TAX.languages, 'All languages')}</select></div>
          ${extra ? `<div><label for="f-extra">${extra.label}</label><select id="f-extra" class="input">${extra.options.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></div>`
                  : `<div></div>`}
          <div><label for="f-sort">Sort</label><select id="f-sort" class="input"><option value="new">Newest</option><option value="old">Oldest</option><option value="az">Title A–Z</option></select></div>
        </form>
        <div class="result-meta"><span id="count"></span><button class="btn-link" id="clear" type="button">Clear filters</button></div>
        <div class="cards" id="grid"></div>
        <div style="text-align:center;margin-top:24px"><button class="btn btn-ghost hidden" id="more">Load more</button></div>
      </div>`;

    const $ = (id) => USE.qs('#' + id);
    const P = new URLSearchParams(location.search);
    $('q').value = P.get('q') || '';
    $('f-disc').value = P.get('discipline') || '';
    $('f-level').value = P.get('level') || '';
    $('f-lang').value = P.get('language') || '';
    let shown = PAGE;

    function filtered() {
      const q = $('q').value.trim().toLowerCase();
      const d = $('f-disc').value, l = $('f-level').value, g = $('f-lang').value;
      const x = extra ? $('f-extra').value : '';
      let list = USE.store.all(type).filter((r) => {
        if (d && !(r.disciplines || []).includes(d)) return false;
        if (l && r.level !== l && r.level !== 'All levels') return false;
        if (g && r.language !== g) return false;
        if (x && !extra.test(r, x)) return false;
        if (q) {
          const hay = [r.title, r.overview, r.topic, ...(r.keywords || []), ...(r.disciplines || []), ...USE.contributorNames(r)].join(' ').toLowerCase();
          if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        return true;
      });
      const s = $('f-sort').value;
      list.sort((a, b) => s === 'az' ? a.title.localeCompare(b.title)
        : s === 'old' ? (a.created || '').localeCompare(b.created || '')
        : (b.created || '').localeCompare(a.created || ''));
      return list;
    }

    function render() {
      const list = filtered();
      $('count').textContent = list.length + (list.length === 1 ? ' resource' : ' resources');
      $('grid').innerHTML = list.length
        ? list.slice(0, shown).map(USE.card).join('')
        : `<div class="empty card" style="grid-column:1/-1"><h3>No matching resources</h3><p>Try a different search or clear the filters.</p></div>`;
      $('more').classList.toggle('hidden', list.length <= shown);
      USE.hydrateSrc($('grid'));
    }

    USE.qsa('.toolbar input, .toolbar select').forEach((i) => i.addEventListener('input', () => { shown = PAGE; render(); }));
    $('more').onclick = () => { shown += PAGE; render(); };
    $('clear').onclick = () => { USE.qsa('.toolbar input, .toolbar select').forEach((i) => (i.value = i.id === 'f-sort' ? 'new' : '')); shown = PAGE; render(); };
    render();
  };
})();
