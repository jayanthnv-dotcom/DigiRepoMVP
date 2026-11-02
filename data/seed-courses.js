/* Sample Courses & Modules. */
window.USE_SEED = window.USE_SEED || { resources: [], profiles: [] };

window.USE_SEED.resources.push(
  {
    id: 'course-chemicals-in-the-community', type: 'course', format: 'course', sample: true, created: '2026-10-15T10:00:00Z',
    title: 'Chemicals in the Community',
    overview: 'This course looks at themes that delineate chemistry as a human activity.',
    disciplines: ['Chemistry'], topic: 'Chemistry and society', level: 'Year 1', language: 'English',
    keywords: ['everyday chemistry', 'materials', 'medicines', 'pollution', 'chemistry and society', 'BSc Chemistry'],
    thumbnail: '', contributors: [{ id: 'p-use-team' }], licence: 'CC BY-SA 4.0',
    note: 'Abstract taken from the Azim Premji University course page (BSc in Chemistry; BSc BEd up to 2024). Learning outcomes and the module breakdown are illustrative, written for this prototype.',
    abstract: 'Humans became chemists the moment they mastered their first chemical reaction: creating and controlling fire. Since then, the science of chemicals and the changes they can undergo has enabled the advance of humankind through the ages. The science of chemicals continues to embrace everything in the world around us and power our lives.\n\nThis course shows how the science and technology of materials move out of the laboratory and intersect with society, using examples from everyday life such as medicines, electronic devices, cosmetics, dyes, cooking and baking, and water and air pollution. The goal is to build an appreciation of the scientific and technical features of everyday life. It also looks at how our ability to manipulate materials has brought us to a point where we have irreversibly altered the planet we live on.\n\nThe course shows students the chemistry concepts they met in high school applied in the real world, outside the textbook. Through experiments in the laboratory and in the field, it aims to build an appreciation of how chemical structure relates to the properties of substances, how we use them, and their effect on the planet.',
    outcomes: [
      'Recognise chemistry as a human activity that has shaped history, technology and society.',
      'Explain how chemical structure relates to the properties and uses of everyday materials.',
      'Apply high-school chemistry concepts to real-life contexts such as medicines, cosmetics, food and electronics.',
      'Design and carry out simple laboratory and field investigations on everyday substances.',
      'Evaluate the environmental impact of chemicals, including water and air pollution.'
    ],
    modules: [
      { title: 'Fire: Humanity’s First Chemistry', time: '1 week', description: 'Combustion, energy and the control of fire as the start of chemistry as a human activity. Fuels used in Indian households and their efficiency.', readings: ['Penny Le Couteur & Jay Burreson, Napoleon’s Buttons: How 17 Molecules Changed History'], resources: [{ title: 'Course page – Azim Premji University', kind: 'link', src: 'https://azimpremjiuniversity.edu.in/courses/chemicals-in-the-community', audience: 'Both' }] },
      { title: 'Medicines', time: '2 weeks', description: 'From traditional remedies to modern drugs: functional groups, how structure affects activity, and dosage.', readings: ['American Chemical Society, Chemistry in Context (chapter on drug design)'], resources: [] },
      { title: 'Materials for Electronic Devices', time: '2 weeks', description: 'Metals, semiconductors and polymers inside a mobile phone, and where they come from.', readings: [], resources: [] },
      { title: 'Cosmetics and Dyes', time: '2 weeks', description: 'Colour, solubility and safety. Natural and synthetic dyes, with a field visit or a kitchen dyeing activity.', readings: [], resources: [] },
      { title: 'Kitchen Chemistry: Cooking and Baking', time: '2 weeks', description: 'Maillard reactions, leavening agents, emulsions and pH in the kitchen, with simple experiments using local ingredients.', readings: ['Harold McGee, On Food and Cooking'], resources: [] },
      { title: 'Water and Air Pollution', time: '2 weeks', description: 'Testing local water samples and discussing air quality data. How chemicals we manipulate change the planet.', readings: [], resources: [] }
    ]
  },
  {
    id: 'module-origami-polyhedra', type: 'course', format: 'module', sample: true, created: '2026-09-25T10:00:00Z',
    title: 'Origami and Polyhedra: A Hands-on Geometry Module',
    overview: 'A two-week module in which students fold modular origami to discover polyhedra, symmetry and Euler’s formula.',
    disciplines: ['Mathematics'], topic: 'Geometry of polyhedra', level: 'Year 1', language: 'English',
    keywords: ['origami', 'polyhedra', 'Euler characteristic', 'symmetry', 'hands-on'],
    thumbnail: 'assets/img/origami-polyhedron.jpg', contributors: [{ id: 'p-use-team' }], licence: 'CC BY-SA 4.0',
    note: 'Illustrative sample module for the prototype.',
    abstract: 'Students build tetrahedra, cubes and more complex modular polyhedra from folded paper units. From their own models they count vertices, edges and faces, conjecture V − E + F = 2, and explore symmetry groups. The module can slot into a first-year geometry or discrete mathematics course.',
    outcomes: [
      'Construct regular and semi-regular polyhedra from modular origami units.',
      'Verify Euler’s formula on physical models and explain why it holds for convex polyhedra.',
      'Describe the rotational symmetries of the Platonic solids.'
    ],
    modules: [
      { title: 'Folding Polyhedra and Euler’s Formula', time: '2 weeks · 4 sessions', description: 'Session 1: fold units and build a tetrahedron and a cube.\nSession 2: count V, E and F in groups and conjecture a relationship.\nSession 3: prove Euler’s formula for convex polyhedra.\nSession 4: symmetries of the Platonic solids, and a mini-project.', readings: ['Thomas Hull, Project Origami: Activities for Exploring Mathematics'], resources: [{ title: 'Classroom photos (see Forget Me Knot activity)', kind: 'link', src: 'activity.html?id=act-forget-me-knot', audience: 'Both' }] }
    ]
  }
);
