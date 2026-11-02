/* Course / Module contribution form. The first step decides between a full course and a single module. */
(function () {
  const USE = window.USE;
  const F = USE.F;
  const esc = USE.esc;
  USE.forms = USE.forms || {};

  const blankModule = () => ({ title: '', description: '', time: '', readings: [''], resources: [] });

  USE.forms.course = {
    blurb: 'Present a new course, or a single module, so that other educators can adapt it.',
    blank: () => ({ format: '', language: 'English', keywords: [], disciplines: [], co: [], abstract: '', outcomes: [''], modules: [blankModule()] }),
    toItem: (d) => ({
      format: d.format || 'course', abstract: d.abstract,
      outcomes: (d.outcomes || []).map((o) => (o || '').trim()).filter(Boolean),
      modules: (d.format === 'module' ? d.modules.slice(0, 1) : d.modules).filter((m) => m.title)
        .map((m) => Object.assign({}, m, { readings: (m.readings || []).filter((r) => (r || '').trim()), resources: m.resources.filter((r) => r.title) }))
    }),
    steps: () => [
      {
        title: 'Course or module?',
        intro: 'Are you sharing a whole course with several modules, or one stand-alone module?',
        validate: (d) => (d.format ? null : 'Choose Course or Single module.'),
        render(b, d) {
          const box = USE.el(`<div class="method-pick" style="grid-template-columns:1fr 1fr">
            <button type="button" class="pick-card big" data-f="course"><span class="pt">📚 Course</span><span class="pd">A complete course made of several modules, e.g. a semester course.</span></button>
            <button type="button" class="pick-card big" data-f="module"><span class="pt">📘 Single module</span><span class="pd">One stand-alone module or unit that can slot into someone else’s course.</span></button></div>`);
          const sync = () => USE.qsa('.pick-card', box).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.f === d.format)));
          USE.qsa('.pick-card', box).forEach((c) => (c.onclick = () => { d.format = c.dataset.f; if (d.format === 'module') d.modules = d.modules.slice(0, 1); sync(); }));
          sync();
          b.appendChild(box);
        }
      },
      Object.assign(USE.basicsStep({ titlePh: 'e.g. Chemicals in the Community', subjectLabel: 'Subject(s)' }), {}),
      {
        title: 'Abstract & outcomes',
        render(b, d) {
          b.appendChild(F.area(d, 'abstract', { label: 'Abstract', required: true, rows: 7, max: 2000, hint: 'What the course is about, its approach and who it is for.' }));
          b.appendChild(F.repeater(d.outcomes, {
            label: 'Learning outcomes', hint: 'One outcome per item, e.g. “Explain how molecular structure determines the properties of everyday materials.”',
            title: (o, i) => 'Outcome ' + (i + 1), add: '+ Add outcome', make: () => '', min: 1, minMsg: 'Add at least one learning outcome.',
            render(ob, o, i) { ob.appendChild(F.text(d.outcomes, i, { required: true, placeholder: 'Students will be able to…' })); }
          }));
        }
      },
      {
        title: 'Module details',
        intro: '',
        render(b, d) {
          const single = d.format === 'module';
          b.parentElement.querySelector('[data-intro]').textContent = single
            ? 'Describe your module.'
            : 'Add each module of the course. Modules appear as expandable sections, in this order.';
          const renderModule = (mb, m) => {
            mb.appendChild(F.text(m, 'title', { label: 'Module title', required: true, placeholder: 'e.g. Kitchen Chemistry: Cooking and Baking' }));
            mb.appendChild(F.area(m, 'description', { label: 'Description', rows: 4 }));
            mb.appendChild(F.text(m, 'time', { label: 'Estimated time', placeholder: 'e.g. 2 weeks · 4 sessions' }));
            mb.appendChild(F.repeater(m.readings, {
              label: 'Suggested readings & textbooks', title: (r, i) => 'Reading ' + (i + 1), add: '+ Add reading', make: () => '',
              render(rb, r, i) { rb.appendChild(F.text(m.readings, i, { placeholder: 'Author, Title, Chapter / pages' })); }
            }));
            mb.appendChild(USE.el('<div style="height:8px"></div>'));
            mb.appendChild(F.resources(m.resources, { label: 'Additional resources (files or links)' }));
          };
          if (single) {
            const wrap = USE.el('<div class="rep-item"></div>');
            renderModule(wrap, d.modules[0] || (d.modules[0] = blankModule()));
            b.appendChild(wrap);
          } else {
            b.appendChild(F.repeater(d.modules, {
              min: 1, minMsg: 'Add at least one module.', title: (m, i) => 'Module ' + (i + 1) + (m.title ? ': ' + m.title : ''),
              add: '+ Add module', make: blankModule, confirmDelete: 'module', render: renderModule
            }));
          }
        }
      },
      USE.reviewStep('course')
    ]
  };
})();
