/* Classroom Activity detail view. */
(function () {
  const USE = window.USE;
  const esc = USE.esc;
  USE.views = USE.views || {};

  // Slideshow of images / videos / YouTube links.
  USE.slideshow = (media, box) => {
    const list = (media || []).filter((m) => m && m.src);
    if (!list.length) { box.innerHTML = `<div class="slideshow"><div class="stage" style="color:#7F92AA">No images or videos added.</div></div>`; return; }
    let i = 0;
    box.innerHTML = `<div class="slideshow" aria-roledescription="carousel">
      <div class="stage" data-stage></div>
      ${list.length > 1 ? '<button class="nav prev" aria-label="Previous slide">‹</button><button class="nav next" aria-label="Next slide">›</button>' : ''}
      <div class="caption" data-cap></div>
      ${list.length > 1 ? `<div class="thumbs">${list.map((m, j) => {
        const yt = USE.youtubeId(m.src);
        const k = USE.kindOf(m);
        const inner = yt ? `<img src="https://i.ytimg.com/vi/${yt}/mqdefault.jpg" alt="" onerror="this.replaceWith('▶ Video')">` : k === 'image' ? `<img ${String(m.src).startsWith('idb:') ? 'data-src' : 'src'}="${esc(m.src)}" alt="">` : '▶';
        return `<button data-j="${j}" aria-label="Slide ${j + 1}">${inner}</button>`;
      }).join('')}</div>` : ''}
    </div>`;
    const show = (j) => {
      i = (j + list.length) % list.length;
      const stage = box.querySelector('[data-stage]');
      stage.innerHTML = USE.mediaEmbed(list[i]);
      USE.hydrateSrc(stage);
      box.querySelector('[data-cap]').textContent = (list.length > 1 ? `${i + 1} / ${list.length} · ` : '') + (list[i].caption || '');
      USE.qsa('.thumbs button', box).forEach((b) => b.setAttribute('aria-current', String(+b.dataset.j === i)));
    };
    const prev = box.querySelector('.prev'), next = box.querySelector('.next');
    if (prev) { prev.onclick = () => show(i - 1); next.onclick = () => show(i + 1); }
    USE.qsa('.thumbs button', box).forEach((b) => (b.onclick = () => show(+b.dataset.j)));
    USE.hydrateSrc(box);
    show(0);
  };

  // Ordered guideline blocks: text steps are numbered, media blocks shown as figures.
  USE.blocks = (list) => {
    let n = 0;
    return `<div class="blocks">${(list || []).map((b) => {
      if (b.kind === 'text') {
        if (!b.text && !b.title) return '';
        n++;
        return `<div class="gstep"><span class="n">${n}</span><div>${b.title ? `<h3 style="margin-bottom:4px">${esc(b.title)}</h3>` : ''}<div class="prose">${USE.prose(b.text)}</div></div></div>`;
      }
      if (!b.src) return '';
      return `<figure>${USE.mediaEmbed(b)}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`;
    }).join('')}</div>`;
  };

  USE.views.activity = {
    render(item, root) {
      root.innerHTML = `
        ${USE.hero(item)}
        <div class="container detail">
          ${item.note ? `<div class="callout note" style="margin-bottom:20px"><p>${esc(item.note)}</p></div>` : ''}
          <div class="cols">
            <div data-share="media"><div data-slides></div></div>
            <div class="stack">
              <section class="card card-pad" data-share="abstract">${USE.sectionTitle('📄', 'Abstract')}<div class="prose">${USE.prose(item.abstract)}</div></section>
              ${USE.contributorCard(item)}
            </div>
          </div>
          <div class="stack section">
            ${item.theory ? `<section class="card card-pad" data-share="theory">${USE.sectionTitle('📐', 'Brief Theory')}<div class="prose">${USE.prose(item.theory)}</div></section>` : ''}
            ${item.pedagogy ? `<section class="card card-pad" data-share="pedagogy" data-student="off">${USE.sectionTitle('🎓', 'Pedagogical Utility')}<div class="prose">${USE.prose(item.pedagogy)}</div></section>` : ''}
            ${(item.guidelines || []).length ? `<section class="card card-pad" data-share="guidelines" data-student="off">${USE.sectionTitle('🧭', 'Guidelines for Classroom Use')}${USE.blocks(item.guidelines)}</section>` : ''}
            <section class="card card-pad" data-share="resources">${USE.sectionTitle('📎', 'Additional Resources')}${USE.resourceList(item.resources, 'res')}</section>
          </div>
        </div>`;
      USE.slideshow(item.media, USE.qs('[data-slides]', root));
      return {};
    }
  };
})();
