/* Worksheet detail view: a topic made of one or more worksheet modules. */
(function () {
  const USE = window.USE;
  const esc = USE.esc;
  USE.views = USE.views || {};

  USE.views.worksheet = {
    render(item, root) {
      const mods = item.modules || [];
      const ideas = (list, key) => (list || []).filter((g) => g.title || g.text);
      const ideaCards = (list, prefix) => `<div class="mod-grid">${list.map((g, i) => `<div class="card idea"><h3><span class="k">${prefix} ${String.fromCharCode(65 + i)}</span>${esc(g.title || '')}</h3><div class="prose small">${USE.prose(g.text)}</div></div>`).join('')}</div>`;
      const gl = ideas(item.guidelines), alt = ideas(item.alternates);

      root.innerHTML = `
        ${USE.hero(item, { meta: [['Modules', String(mods.length)]] })}
        <div class="container detail">
          ${item.note ? `<div class="callout note" style="margin-bottom:20px"><p>${esc(item.note)}</p></div>` : ''}
          <div class="cols">
            <section class="card card-pad" data-share="about">${USE.sectionTitle('💡', 'About this Worksheet')}<div class="prose">${USE.prose(item.about)}</div></section>
            <div class="stack">
              ${item.pedagogy ? `<section class="card card-pad quote" data-share="pedagogy" data-student="off"><div class="eyebrow" style="color:var(--navy);margin-bottom:8px">Pedagogical approach</div><div class="prose">${USE.prose(item.pedagogy)}</div></section>` : ''}
              ${USE.contributorCard(item)}
            </div>
          </div>

          <section class="section" data-share="modules">
            <div class="list-head" style="margin-bottom:14px">${USE.sectionTitle('🗂️', 'Worksheet Modules')}<span class="tag">${mods.length} module${mods.length === 1 ? '' : 's'}</span></div>
            <div class="mod-grid">${mods.map((m, i) => `
              <article class="card mod-card" data-share="mod-${i}" data-share-label="Module">
                <div class="eyebrow">Module ${i + 1}</div>
                <h3>${esc(m.name)}</h3>
                ${m.subtitle ? `<div class="sub">${esc(m.subtitle)}</div>` : ''}
                ${m.description ? `<div class="focus prose">${USE.prose(m.description)}</div>` : ''}
                <div class="kv small">
                  ${m.course ? `<span><b>Course:</b>${esc(m.course)}</span>` : ''}
                  ${m.reference ? `<span><b>Textbook:</b>${esc(m.reference)}</span>` : ''}
                  ${m.time ? `<span><b>Time:</b>${esc(m.time)}</span>` : ''}
                  ${m.skill ? `<span><b>Skill focus:</b>${esc(m.skill)}</span>` : ''}
                </div>
                <div class="foot" style="display:block">
                  <div class="eyebrow" style="color:var(--navy);margin-bottom:4px">Worksheets</div>
                  ${USE.resourceList(m.files, 'mod-' + i + '-f')}
                  ${(m.resources || []).length ? `<div class="eyebrow" style="color:var(--navy);margin:10px 0 4px">Additional resources</div>${USE.resourceList(m.resources, 'mod-' + i + '-r')}` : ''}
                </div>
              </article>`).join('')}</div>
          </section>

          ${gl.length || alt.length ? `<section class="card card-pad" data-share="guidelines" data-student="off">
            ${USE.sectionTitle('🧭', 'Implementation Guidelines')}
            ${gl.length ? ideaCards(gl, 'Idea') : ''}
            ${alt.length ? `<h3 style="margin-top:22px">Alternate approaches</h3>${ideaCards(alt, 'Alt')}` : ''}
          </section>` : ''}
        </div>`;
      return {};
    }
  };
})();
