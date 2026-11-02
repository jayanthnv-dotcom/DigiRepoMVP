/* Worksheet contribution form: a topic with one or more worksheet modules. */
(function () {
  const USE = window.USE;
  const F = USE.F;
  USE.forms = USE.forms || {};

  const blankModule = () => ({ name: '', subtitle: '', description: '', course: '', reference: '', time: '', skill: '', files: [], resources: [] });
  const ideaList = (arr, label, hint, add) => F.repeater(arr, {
    label, hint, title: (g, i) => (add.includes('alternate') ? 'Alternate ' : 'Idea ') + String.fromCharCode(65 + i), add, make: () => ({ title: '', text: '' }), empty: 'None added.',
    render(b, g) {
      b.appendChild(F.text(g, 'title', { label: 'Title', required: true, placeholder: 'e.g. In-class “live audit” in teams' }));
      b.appendChild(F.area(g, 'text', { label: 'How to run it', rows: 3 }));
    }
  });

  USE.forms.worksheet = {
    blurb: 'Share worksheets on a topic. Add one module per worksheet, each with its own description and files.',
    blank: () => ({ language: 'English', keywords: [], disciplines: [], co: [], about: '', pedagogy: '', modules: [blankModule()], guidelines: [], alternates: [] }),
    toItem: (d) => ({
      about: d.about, pedagogy: d.pedagogy,
      modules: (d.modules || []).filter((m) => m.name).map((m) => Object.assign({}, m, { files: m.files.filter((f) => f.title), resources: m.resources.filter((r) => r.title) })),
      guidelines: d.guidelines.filter((g) => g.title), alternates: d.alternates.filter((g) => g.title)
    }),
    steps: () => [
      USE.basicsStep({ titlePh: 'e.g. Textbook Decoding Workspaces' }),
      {
        title: 'About & pedagogy',
        render(b, d) {
          b.appendChild(F.area(d, 'about', { label: 'About this worksheet', required: true, rows: 6, hint: 'What the worksheets are, the problem they address and how students use them.' }));
          b.appendChild(F.area(d, 'pedagogy', { label: 'Pedagogical approach', rows: 5, hint: 'The method or philosophy behind the design. Shown to teachers by default.' }));
        }
      },
      {
        title: 'Worksheet modules',
        intro: 'Add each worksheet as a module, with its own description, files and resources. A topic can have one module or many.',
        render(b, d) {
          b.appendChild(F.repeater(d.modules, {
            min: 1, minMsg: 'Add at least one module.', title: (m, i) => 'Module ' + (i + 1) + (m.name ? ': ' + m.name : ''), add: '+ Add module', make: blankModule, confirmDelete: 'module',
            render(mb, m) {
              const g = USE.el('<div class="grid-2"></div>');
              g.appendChild(F.text(m, 'name', { label: 'Worksheet name', required: true, placeholder: 'e.g. Particle in a 1D Box' }));
              g.appendChild(F.text(m, 'subtitle', { label: 'Subtitle (optional)', placeholder: 'e.g. Reading a derivation line by line' }));
              mb.appendChild(g);
              mb.appendChild(F.area(m, 'description', { label: 'Description / key focus', rows: 3 }));
              const g2 = USE.el('<div class="grid-2"></div>');
              g2.appendChild(F.text(m, 'course', { label: 'Course (optional)', placeholder: 'e.g. Structure–Property Relationships' }));
              g2.appendChild(F.text(m, 'reference', { label: 'Textbook / reference needed (optional)', placeholder: 'e.g. Atkins, Quanta, Ch. 2' }));
              g2.appendChild(F.text(m, 'time', { label: 'Estimated time (optional)', placeholder: 'e.g. 60–90 minutes' }));
              g2.appendChild(F.text(m, 'skill', { label: 'Skill focus (optional)', placeholder: 'e.g. Graph reading' }));
              mb.appendChild(g2);
              mb.appendChild(F.resources(m.files, { label: 'Worksheet files', hint: 'The worksheet itself, plus answer keys if any. Mark answer keys as Faculty only.' }));
              mb.appendChild(USE.el('<div style="height:8px"></div>'));
              mb.appendChild(F.resources(m.resources, { label: 'Additional resources (optional)' }));
            }
          }));
        }
      },
      {
        title: 'Implementation guidelines',
        intro: 'Ideas for using the worksheets in class, and alternate ways to run them.',
        render(b, d) {
          b.appendChild(ideaList(d.guidelines, 'Ideas / guidelines to run it', '', '+ Add idea'));
          b.appendChild(USE.el('<div style="height:12px"></div>'));
          b.appendChild(ideaList(d.alternates, 'Alternate approaches (optional)', 'Other ways you or colleagues have used the worksheets.', '+ Add alternate approach'));
        }
      },
      USE.reviewStep('worksheet')
    ]
  };
})();
