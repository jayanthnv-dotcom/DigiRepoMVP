/* Lab Experiment contribution form. */
(function () {
  const USE = window.USE;
  const F = USE.F;
  const esc = USE.esc;
  USE.forms = USE.forms || {};

  const blankMethod = () => ({ part: '', note: '', steps: [{ title: '', details: '', media: null }] });
  const qa = () => ({ q: '', guide: '' });

  function questionList(arr, label, hint) {
    return F.repeater(arr, {
      label, hint, title: (q, i) => 'Question ' + (i + 1), add: '+ Add question', make: qa, empty: 'No questions added.',
      render(b, q) {
        b.appendChild(F.area(q, 'q', { label: 'Question', required: true, rows: 2 }));
        b.appendChild(F.area(q, 'guide', { label: 'Guidelines / answer key (optional)', rows: 3, hint: 'Hidden from students unless a teacher chooses to share it.' }));
      }
    });
  }

  USE.forms.lab = {
    blurb: 'Share a low-cost experiment with a protocol in one or more teaching styles.',
    blank: () => ({
      language: 'English', keywords: [], disciplines: [], co: [],
      selected: [], methods: { cookbook: blankMethod(), guided: blankMethod(), cure: blankMethod() },
      safety: '', misconception: '', calculator: false, materials: [], prelab: [], postlab: [qa()], resources: []
    }),
    toItem(d) {
      const methods = {};
      (d.selected || []).forEach((k) => { methods[k] = d.methods[k]; });
      return {
        methods, safety: d.safety, misconception: d.misconception,
        calculator: !!d.calculator, materials: (d.materials || []).filter((m) => m.name),
        prelab: (d.prelab || []).filter((q) => q.q), postlab: (d.postlab || []).filter((q) => q.q),
        resources: (d.resources || []).filter((r) => r.title)
      };
    },
    steps: () => [
      USE.basicsStep({ titlePh: 'e.g. Superabsorbing Polymers in Diapers' }),
      {
        title: 'Lab protocol',
        intro: 'Choose which teaching styles you are providing. One is enough; add more if you have them. Each step can have a video, image or file. It plays in the video panel when a student clicks that step.',
        validate: (d) => {
          if (!d.selected.length) return 'Choose at least one teaching style.';
          for (const k of d.selected) if (!d.methods[k].steps.some((s) => s.title.trim())) return 'Add at least one step for ' + USE.LAB_METHODS[k].label + '.';
          return null;
        },
        render(b, d) {
          const M = USE.LAB_METHODS;
          const pick = USE.el(`<div class="method-pick">${Object.keys(M).map((k) => `<button type="button" class="pick-card" data-k="${k}"><span class="pt">${M[k].label}</span><span class="pd">${esc(M[k].note)}</span></button>`).join('')}</div>`);
          const sections = USE.el('<div></div>');
          b.append(pick, sections);
          const draw = () => {
            USE.qsa('.pick-card', pick).forEach((c) => c.setAttribute('aria-pressed', String(d.selected.includes(c.dataset.k))));
            sections.innerHTML = '';
            Object.keys(M).filter((k) => d.selected.includes(k)).forEach((k) => {
              const m = d.methods[k];
              const s = USE.el(`<div class="method-section"><h3>${esc(M[k].label)}</h3></div>`);
              const g = USE.el('<div class="grid-2"></div>');
              g.appendChild(F.text(m, 'part', { label: 'Section heading (optional)', placeholder: 'e.g. Part 1.2 · Isolating the polymer' }));
              g.appendChild(F.text(m, 'note', { label: 'Style note (optional)', placeholder: M[k].note.slice(0, 60) + '…' }));
              s.appendChild(g);
              s.appendChild(F.repeater(m.steps, {
                title: (st, i) => 'Step ' + (i + 1), add: '+ Add step', make: () => ({ title: '', details: '', media: null }), confirmDelete: 'step',
                render(sb, st) {
                  sb.appendChild(F.text(st, 'title', { label: 'Step title', required: true, placeholder: 'e.g. Prepare salt solution' }));
                  sb.appendChild(F.area(st, 'details', { label: 'Details', rows: 3 }));
                  sb.appendChild(F.media(st, 'media', { label: 'Video, image or file (optional)', caption: true, hint: 'Upload a short clip or paste a YouTube link.' }));
                }
              }));
              sections.appendChild(s);
            });
          };
          USE.qsa('.pick-card', pick).forEach((c) => (c.onclick = () => {
            const k = c.dataset.k;
            d.selected = d.selected.includes(k) ? d.selected.filter((x) => x !== k) : [...d.selected, k];
            draw();
          }));
          draw();
        }
      },
      {
        title: 'Safety & misconceptions',
        render(b, d) {
          b.appendChild(F.area(d, 'safety', { label: 'Safety protocol', rows: 3, placeholder: 'Protective equipment, hazards, disposal…' }));
          b.appendChild(F.area(d, 'misconception', { label: 'Misconception alert', rows: 3, hint: 'A common student misconception and how to address it. Shown to teachers only by default.' }));
        }
      },
      {
        title: 'Materials',
        intro: 'List what each student needs. If you switch on the Materials Calculator, teachers can enter their class size and get the totals to prepare.',
        render(b, d) {
          b.appendChild(F.toggle(d, 'calculator', { label: 'Show a Materials Calculator for teachers (useful for wet labs in chemistry and biology)' }));
          b.appendChild(F.repeater(d.materials, {
            title: (m, i) => 'Material ' + (i + 1), add: '+ Add material', make: () => ({ name: '', qty: '', unit: '' }), empty: 'No materials added yet.',
            render(mb, m) {
              const g = USE.el('<div class="grid-3"></div>');
              g.appendChild(F.text(m, 'name', { label: 'Material', required: true, placeholder: 'e.g. Sodium chloride' }));
              g.appendChild(F.text(m, 'qty', { label: 'Quantity per student', type: 'number', required: true, placeholder: 'e.g. 5' }));
              g.appendChild(F.text(m, 'unit', { label: 'Unit', placeholder: 'g, mL, pcs…' }));
              mb.appendChild(g);
            }
          }));
        }
      },
      {
        title: 'Questions',
        intro: 'Students see the questions. Guidelines and answer keys are for teachers unless a teacher chooses to share them.',
        render(b, d) {
          b.appendChild(questionList(d.prelab, 'Pre-lab questions (optional)'));
          b.appendChild(USE.el('<div style="height:12px"></div>'));
          b.appendChild(questionList(d.postlab, 'Post-lab questions'));
        }
      },
      {
        title: 'Resources',
        intro: 'Worksheets, rubrics, data sheets or useful links.',
        render(b, d) { b.appendChild(F.resources(d.resources)); }
      },
      USE.reviewStep('lab')
    ]
  };
})();
