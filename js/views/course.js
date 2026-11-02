/* Course / Module detail view. */
(function () {
  const USE = window.USE;
  const esc = USE.esc;
  USE.views = USE.views || {};

  USE.views.course = {
    render(item, root) {
      const isModule = item.format === 'module';
      const mods = item.modules || [];
      const meta = isModule ? [] : [['No. of Modules', String(mods.length)]];
      root.innerHTML = `
        ${USE.hero(item, { label: isModule ? 'Module' : 'Course', meta })}
        <div class="container detail">
          ${item.note ? `<div class="callout note" style="margin-bottom:20px"><p>${esc(item.note)}</p></div>` : ''}
          <div class="cols even">
            <section class="card card-pad" data-share="abstract">${USE.sectionTitle('📄', 'Abstract')}<div class="prose">${USE.prose(item.abstract)}</div></section>
            <section class="card card-pad" data-share="outcomes">${USE.sectionTitle('🎯', 'Learning Outcomes')}
              <p class="small muted">By the end of this ${isModule ? 'module' : 'course'}, students will be able to:</p>
              <ol class="prose" style="padding-left:20px">${(item.outcomes || []).filter(Boolean).map((o) => `<li style="margin-bottom:6px">${esc(o)}</li>`).join('')}</ol>
            </section>
          </div>
          <section class="section">
            ${USE.sectionTitle('🗂️', isModule ? 'Module' : 'Modules')}
            ${mods.map((m, i) => `
              <div class="acc ${isModule || mods.length === 1 ? 'open' : ''}" data-share="mod-${i}" data-share-label="Module">
                <button type="button" aria-expanded="${isModule || mods.length === 1}"><span class="num">Module ${i + 1}</span><span class="ttl">${esc(m.title)}</span>${m.time ? `<span class="small muted">${esc(m.time)}</span>` : ''}<span class="chev">▾</span></button>
                <div class="acc-body">
                  <div class="kv">${m.time ? `<span><b>Estimated time:</b>${esc(m.time)}</span>` : ''}</div>
                  <div class="prose">${USE.prose(m.description)}</div>
                  ${(m.readings || []).filter(Boolean).length ? `<h3 style="margin-top:14px">Suggested readings & textbooks</h3><ul class="prose">${m.readings.filter(Boolean).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
                  ${(m.resources || []).length ? `<h3 style="margin-top:14px">Additional resources</h3>${USE.resourceList(m.resources, 'mod-' + i + '-r')}` : ''}
                </div>
              </div>`).join('')}
          </section>
          <div class="cols">
            <div class="callout info"><h4>Adapting this ${isModule ? 'module' : 'course'}</h4><p>Reuse and adapt this ${isModule ? 'module' : 'course'} for your institution under ${esc(item.licence || USE.TAX.licence)}: credit the contributors and share your adaptation under the same licence. Contact the contributor through their profile to learn more.</p></div>
            ${USE.contributorCard(item)}
          </div>
        </div>`;
      USE.qsa('.acc > button', root).forEach((b) => (b.onclick = () => {
        const a = b.parentElement; a.classList.toggle('open'); b.setAttribute('aria-expanded', String(a.classList.contains('open')));
      }));
      return {};
    }
  };
})();
