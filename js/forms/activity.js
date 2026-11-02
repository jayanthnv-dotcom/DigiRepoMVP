/* Classroom Activity contribution form. */
(function () {
  const USE = window.USE;
  const F = USE.F;
  USE.forms = USE.forms || {};

  USE.guidelineEditor = (arr, opts = {}) => F.repeater(arr, {
    label: opts.label, hint: opts.hint,
    title: (b) => ({ text: 'Text', image: 'Image', video: 'Video' }[b.block] || 'Block'),
    empty: 'Add text, images or videos in the order teachers should follow.',
    adders: [
      { label: '+ Add text', make: () => ({ block: 'text', kind: 'text', title: '', text: '' }) },
      { label: '+ Add image', make: () => ({ block: 'image', kind: 'image', src: '', caption: '' }) },
      { label: '+ Add video', make: () => ({ block: 'video', kind: 'video', src: '', caption: '' }) }
    ],
    render(b, it) {
      if (it.block === 'text') {
        b.appendChild(F.text(it, 'title', { label: 'Heading (optional)', placeholder: 'e.g. Set up the groups' }));
        b.appendChild(F.area(it, 'text', { label: 'Text', required: true, rows: 3 }));
        return;
      }
      const holder = { m: it.src ? { kind: it.kind, src: it.src, name: it.name, caption: it.caption } : null };
      b.appendChild(F.media(holder, 'm', {
        optional: false, caption: true, required: true,
        accept: it.block === 'image' ? 'image/*' : 'video/*',
        hint: it.block === 'video' ? 'Upload a clip or paste a YouTube link.' : '',
        onSet: (m) => { it.src = m ? m.src : ''; it.kind = m ? m.kind : it.block; it.name = m ? m.name : ''; it.caption = m ? m.caption : ''; }
      }));
    }
  });

  USE.forms.activity = {
    blurb: 'Share a teaching practice from your classroom so others can try it.',
    blank: () => ({ language: 'English', keywords: [], disciplines: [], co: [], media: [], abstract: '', theory: '', pedagogy: '', guidelines: [], resources: [] }),
    toItem: (d) => ({
      media: (d.media || []).filter((m) => m && m.src),
      abstract: d.abstract, theory: d.theory, pedagogy: d.pedagogy,
      guidelines: (d.guidelines || []).filter((b) => (b.block === 'text' ? b.text || b.title : b.src)),
      resources: (d.resources || []).filter((r) => r.title)
    }),
    steps: () => [
      USE.basicsStep({ titlePh: 'e.g. Learning knot theory with wire and crochet' }),
      {
        title: 'Media & abstract',
        intro: 'Photos and videos appear as a slideshow on the left, with your abstract alongside.',
        validate: (d) => (d.media.some((m) => m && m.src) ? null : 'Add at least one image or video.'),
        render(b, d) {
          b.appendChild(F.repeater(d.media, {
            label: 'Slideshow images & videos', min: 1, minMsg: 'Add at least one image or video.',
            title: (m, i) => 'Slide ' + (i + 1), add: '+ Add slide', make: () => ({}),
            render(sb, m, i) {
              if (!m || !m.src) d.media[i] = null;
              sb.appendChild(F.media(d.media, i, { optional: false, caption: true, accept: 'image/*,video/*', hint: 'Upload an image or video, or paste a YouTube link.' }));
            }
          }));
          b.appendChild(USE.el('<div style="height:10px"></div>'));
          b.appendChild(F.area(d, 'abstract', { label: 'Abstract', required: true, rows: 6, max: 1500, hint: 'What the activity is, who it is for and what students do.' }));
        }
      },
      {
        title: 'Theory & pedagogy',
        render(b, d) {
          b.appendChild(F.area(d, 'theory', { label: 'Brief theory', rows: 6, hint: 'The concept(s) behind the activity. Visible to students by default.' }));
          b.appendChild(F.area(d, 'pedagogy', { label: 'Pedagogical utility', rows: 6, hint: 'What pedagogy is used and why the practice is innovative. Shown to teachers by default.' }));
        }
      },
      {
        title: 'Guidelines',
        intro: 'How should another teacher run this in their classroom? Mix text, images and videos.',
        render(b, d) { b.appendChild(USE.guidelineEditor(d.guidelines)); }
      },
      {
        title: 'Additional resources',
        intro: 'Images, videos, PDFs, documents or links.',
        render(b, d) { b.appendChild(F.resources(d.resources)); }
      },
      USE.reviewStep('activity')
    ]
  };
})();
