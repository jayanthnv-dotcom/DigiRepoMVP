/* Lab Experiment detail view. */
(function () {
  const USE = window.USE;
  const esc = USE.esc;
  USE.views = USE.views || {};

  const METHODS = {
    cookbook: { label: 'Cookbook', note: 'Structured, clear steps that are easy to complete in a standard lab session. Good for introductory classes.' },
    guided: { label: 'Guided Inquiry', note: 'Students are given a question and partial procedure, and decide parts of the method themselves.' },
    cure: { label: 'CURE-Aligned', note: 'Course-Based Undergraduate Research Experience: an open question with no pre-known answer, emphasising data collection, iteration and peer discussion.' }
  };
  USE.LAB_METHODS = METHODS;

  const available = (item) => Object.keys(METHODS).filter((k) => item.methods && item.methods[k] && (item.methods[k].steps || []).length);

  function fmtQty(q, unit) {
    const n = Number(q);
    if (!isFinite(n)) return '';
    const discrete = /^(pcs?|pieces?|nos?\.?|units?|sets?|bags?|sheets?|beakers?|tubes?|plates?|slides?|)$/i.test(String(unit || '').trim());
    const v = discrete ? Math.ceil(n) : n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
    return v.toLocaleString('en-IN') + (unit ? ' ' + unit : '');
  }

  function questions(list, key, title, icon) {
    if (!list || !list.length) return '';
    return `<section class="card card-pad" data-share="${key}">
      ${USE.sectionTitle(icon, title)}
      ${list.map((q, i) => `<div class="qa"><div class="q">${i + 1}. ${esc(q.q)}</div>
        ${q.guide ? `<div class="guide" data-share="${key}-g${i}" data-student="off" data-share-label="Answer">
          <h5>Guidelines / answer key</h5>${USE.prose(q.guide)}</div>` : ''}</div>`).join('')}
    </section>`;
  }

  USE.views.lab = {
    render(item, root) {
      const meths = available(item);
      let current = meths[0];
      const hasCalc = item.calculator && (item.materials || []).length;

      root.innerHTML = `
        ${USE.hero(item)}
        <div class="container detail">
          <div class="cols stretch">
            <div class="stack">
              <section class="card fill" data-share="protocol">
                <div class="panel-head">
                  <div><div class="eyebrow">🔬 Dynamic Lab Protocol</div><div class="small muted" data-method-hint>Choose a teaching style</div></div>
                  <div class="tabs" role="tablist" data-tabs>${meths.map((k) => `<button role="tab" data-m="${k}">${METHODS[k].label}</button>`).join('')}</div>
                </div>
                <div class="panel-body">
                  <div data-protocol></div>
                  ${item.safety ? `<div class="callout warn" data-share="safety" style="margin-top:18px"><h4>⚠️ Safety protocol</h4>${USE.prose(item.safety)}</div>` : ''}
                </div>
              </section>
            </div>
            <div class="stack">
              <section class="video-panel" data-share="video">
                <div class="head"><span>▶ Technique video</span><span class="pill" data-vstep>Select a step</span></div>
                <div class="screen" data-screen>Select a step with a video to play it here.</div>
                <div class="cap" data-vcap></div>
              </section>
              ${(item.materials || []).length ? `<section class="card card-pad" data-share="materials">
                ${USE.sectionTitle('🧾', 'Materials Required')}
                <table class="mat-table"><thead><tr><th>Material</th><th>Per student</th></tr></thead><tbody>
                ${item.materials.map((m) => `<tr><td>${esc(m.name)}</td><td>${esc(fmtQty(m.qty, m.unit))}</td></tr>`).join('')}</tbody></table>
              </section>` : ''}
              ${hasCalc ? `<section class="card card-pad calc" data-share="calc" data-student="off">
                ${USE.sectionTitle('⚖️', 'Materials Calculator')}
                <div class="row"><label for="cls">Number of students</label><input id="cls" class="input" type="number" min="1" value="30">
                  <label class="switch small"><input type="checkbox" id="extra"><span class="track"></span><span>+10% extra</span></label></div>
                <table><thead><tr><th>Material</th><th>Per student</th><th>Total</th></tr></thead><tbody data-calc></tbody></table>
              </section>` : ''}
            </div>
          </div>

          <div class="cols even section">
            <section class="card card-pad" data-share="resources">
              ${USE.sectionTitle('📥', 'Resources')}
              ${USE.resourceList(item.resources, 'res')}
            </section>
            ${item.misconception ? `<section class="card card-pad" data-share="misconception" data-student="off">
              ${USE.sectionTitle('💡', 'Misconception Alert')}
              <div class="prose">${USE.prose(item.misconception)}</div>
            </section>` : ''}
          </div>

          <div class="stack">
            ${questions(item.prelab, 'prelab', 'Pre-Lab Questions', '📋')}
            ${questions(item.postlab, 'postlab', 'Post-Lab Inquiry Questions', '❓')}
          </div>
          ${USE.contributorCard(item)}
        </div>`;

      const tabs = USE.qs('[data-tabs]', root);
      const proto = USE.qs('[data-protocol]', root);

      function showMedia(step, idx) {
        const screen = USE.qs('[data-screen]', root);
        USE.qs('[data-vstep]', root).textContent = step ? 'Step ' + (idx + 1) : 'Select a step';
        if (step && step.media && step.media.src) {
          screen.innerHTML = USE.mediaEmbed(step.media);
          USE.qs('[data-vcap]', root).textContent = step.media.caption || step.title || '';
          USE.hydrateSrc(screen);
        } else {
          screen.textContent = step ? 'No video for this step.' : 'Select a step with a video to play it here.';
          USE.qs('[data-vcap]', root).textContent = '';
        }
      }

      function renderMethod() {
        USE.qsa('button', tabs).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.m === current)));
        if (!current) { proto.innerHTML = '<p class="muted">No protocol added yet.</p>'; return; }
        const m = item.methods[current];
        proto.innerHTML = `
          <div class="style-note"><b>${METHODS[current].label}:</b> ${esc(m.note || METHODS[current].note)}</div>
          ${m.part ? `<h3 style="margin-bottom:8px">${esc(m.part)}</h3>` : ''}
          <ol class="steps">${(m.steps || []).map((s, i) => `
            <li class="step" data-i="${i}">
              <input type="checkbox" aria-label="Mark step ${i + 1} done">
              <div><h4><span>Step ${i + 1}: ${esc(s.title)}</span>${s.media && s.media.src ? `<span class="media-flag">▶ ${USE.kindOf(s.media) === 'image' ? 'Image' : USE.kindOf(s.media) === 'pdf' || USE.kindOf(s.media) === 'file' ? 'File' : 'Video'}</span>` : ''}</h4>
              <div class="prose small">${USE.prose(s.details)}</div></div>
            </li>`).join('')}</ol>`;
        USE.qsa('.step', proto).forEach((li) => {
          const i = +li.dataset.i, step = m.steps[i];
          li.onclick = (e) => {
            if (e.target.matches('input')) { li.classList.toggle('done', e.target.checked); return; }
            USE.qsa('.step', proto).forEach((x) => x.classList.remove('active'));
            li.classList.add('active');
            showMedia(step, i);
          };
        });
        const first = (m.steps || []).findIndex((s) => s.media && s.media.src);
        if (first >= 0) { USE.qsa('.step', proto)[first].classList.add('active'); showMedia(m.steps[first], first); }
        else showMedia(null);
      }
      USE.qsa('button', tabs).forEach((b) => (b.onclick = () => { current = b.dataset.m; renderMethod(); }));
      renderMethod();

      if (hasCalc) {
        const calc = () => {
          const n = Math.max(0, +USE.qs('#cls', root).value || 0) * (USE.qs('#extra', root).checked ? 1.1 : 1);
          USE.qs('[data-calc]', root).innerHTML = item.materials.map((m) => `<tr><td>${esc(m.name)}</td><td>${esc(fmtQty(m.qty, m.unit))}</td><td class="total">${esc(fmtQty(m.qty * n, m.unit))}</td></tr>`).join('');
        };
        USE.qs('#cls', root).oninput = calc; USE.qs('#extra', root).onchange = calc; calc();
      }

      return {
        share: {
          defaultMethod: () => current,
          extraControls(box, state, apply) {
            if (meths.length < 2) { state.m = meths[0]; return; }
            box.innerHTML = `<select class="input" aria-label="Method for students">${meths.map((k) => `<option value="${k}">${METHODS[k].label} only</option>`).join('')}</select>`;
            const sel = box.firstElementChild;
            sel.value = state.m || current;
            state.m = sel.value;
            sel.onchange = () => { state.m = sel.value; current = sel.value; renderMethod(); apply(); };
          },
          onApply({ mode, state }) {
            const lock = (mode === 'link' || mode === 'preview') && state.m && meths.includes(state.m);
            if (lock && current !== state.m) { current = state.m; renderMethod(); }
            if (mode === 'edit' && state.m && current !== state.m) { current = state.m; renderMethod(); }
            tabs.classList.toggle('hidden', !!lock || meths.length < 2);
            USE.qs('[data-method-hint]', root).textContent = lock ? 'Method chosen by your teacher: ' + METHODS[state.m].label : 'Choose a teaching style';
          }
        }
      };
    }
  };
})();
