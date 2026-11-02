/* Sample Worksheets. */
window.USE_SEED = window.USE_SEED || { resources: [], profiles: [] };

window.USE_SEED.resources.push(
  {
    id: 'ws-textbook-decoding', type: 'worksheet', sample: true, created: '2026-10-25T10:00:00Z',
    title: 'Textbook Decoding Workspaces',
    overview: 'Structured matrices that make students read the textbook actively, translating each line of a derivation or each feature of a graph into its physical meaning.',
    disciplines: ['Chemistry', 'Biology'], topic: 'Active reading of scientific texts', level: 'Year 2', language: 'English',
    keywords: ['active reading', 'textbook', 'derivation', 'graph reading', 'quantum chemistry', 'enzymes', 'matrix'],
    thumbnail: 'assets/img/ws-pib.jpg', contributors: [{ id: 'p-use-team' }], licence: 'CC BY-SA 4.0',
    about: 'Students often skim a textbook derivation or a diagram and assume they have understood it. Each Textbook Decoding Workspace gives students a matrix to fill in while they work through one specific section of a standard textbook. For every step or feature they record three things:\n- the mathematical action or visual feature (what is happening on the page)\n- the physical or molecular reality (what it means for the particle or molecule)\n- the text verdict: an exact definition or quote from the textbook\n\nThe textbook is the sole authority, and students are asked not to use external websites. Each workspace ends with an application or misconception section.',
    pedagogy: 'Active reading. Passive reading and watching videos let students feel they understand without doing the work. Filling a matrix by hand makes students decode every line and connect symbols to meaning, using the textbook as their reference.\n\nThe worksheets are deliberately low-stakes, and work well with peer review or private instructor feedback.',
    modules: [
      {
        name: 'Particle in a 1D Box', subtitle: 'The Derivation Translation Matrix',
        description: 'Students follow the derivation from the set-up V(x) to quantised energy Eₙ = n²h²/8mL², completing a 7-step matrix (set-up, Schrödinger equation, general solution, two boundary conditions, normalisation, quantised energy). Part 2 asks them to sketch ψₙ and |ψₙ|² for n = 1–3 and to explain, with a baseball in a 1 m box, why we don’t see quantisation in everyday life.',
        course: 'Structure–Property Relationships in Chemistry', reference: 'Atkins, Quanta, Ch. 2 (§2.2)', time: '90 minutes', skill: 'Derivation reading',
        files: [{ title: 'Particle in a 1D Box: decoding workspace (PDF, 4 pages)', kind: 'file', name: 'particle-in-a-1d-box.pdf', src: 'assets/files/particle-in-a-1d-box.pdf', audience: 'Both' }],
        resources: []
      },
      {
        name: 'Reading a Reaction Coordinate Diagram for Enzyme Catalysis', subtitle: 'The Visual-to-Conceptual Decoding Matrix',
        description: 'Students work across Figure 6-3 from left to right (ground state, transition state, ES/EP intermediates, activation energy, ΔG°) and record what they see, what the molecules are doing, and the textbook definition. Part 2 deals with two common misconceptions: the “unstable valley” and whether a catalyst can drive an unfavourable reaction.',
        course: 'Introduction to Chemical Thinking-II / Methods in Chemical Biology', reference: 'Lehninger, Principles of Biochemistry, Ch. 6, Fig. 6-3', time: '60–75 minutes', skill: 'Graph reading',
        files: [{ title: 'Reaction coordinate diagram: decoding workspace (PDF, 3 pages)', kind: 'file', name: 'reaction-coordinate-enzyme.pdf', src: 'assets/files/reaction-coordinate-enzyme.pdf', audience: 'Both' }],
        resources: []
      }
    ],
    guidelines: [
      { title: 'Pair reading in class', text: 'Students work in pairs with one textbook open between them. Give 10 minutes per row, then ask one pair to read out their “text verdict” before moving on.' },
      { title: 'Pre-class preparation', text: 'Set Part 1 as homework before the lecture on the topic. Use the lecture to resolve the cells students found hardest.' }
    ],
    alternates: [
      { title: 'Peer review', text: 'Pairs swap completed matrices and mark each cell as “clear”, “partly” or “missing” before the instructor gives feedback.' }
    ]
  },
  {
    id: 'ws-organic-csi', type: 'worksheet', sample: true, created: '2026-09-18T10:00:00Z',
    title: 'Active Organic Chemistry CSI: Decoding Matrices',
    overview: 'Turning reaction mechanisms from passive decorative art into structured, cognitively demanding “forensic audits” filled in with a pencil.',
    disciplines: ['Chemistry'], topic: 'Reaction mechanisms', level: 'Year 2', language: 'English',
    keywords: ['organic chemistry', 'reaction mechanisms', 'E2', 'SN2', 'Hückel', 'active reading'],
    thumbnail: '', contributors: [{ id: 'p-use-team' }], licence: 'CC BY-SA 4.0',
    note: 'Illustrative sample entry. Worksheet files are not attached in the prototype.',
    about: 'Traditional learning often relies on fast animations or passive textbook skimming. Real mastery of organic chemistry needs spatial translation.\n\nWhen students reach reaction mechanisms and conjugation/Hückel theory, passive reading and video watching often fail them. These decoding matrices make students align their textbooks, analyse orbital geometries and audit electron flow by hand.\n\nWorksheet strategy: assessments are low-stakes, highly active, and built around peer review or private instructor feedback.',
    pedagogy: '“Videos move fast; a 3D molecule spins on a screen for 3 seconds and it’s gone. A textbook forces the student to look at a static, 2D representation of a 3D object and decode it. By making them manually fill out these matrices with a pencil, you are forcing their brain to do the heavy lifting of spatial translation.”',
    modules: [
      { name: 'The E2 “Crime Scene” Audit', subtitle: 'Elimination of 2-chloropropane using bulky DBU', description: 'Auditing transition states, tracking DBU’s steric shielding, and checking anti-periplanar geometry by hand.', course: '', reference: '', time: '', skill: 'Mechanism reading', files: [{ title: 'Worksheet (PDF)', kind: 'file', name: 'module-1.pdf', src: '', audience: 'Both' }], resources: [] },
      { name: 'Bimolecular Substitution (SN2)', subtitle: 'Backside attack on primary vs. secondary alkyl halides', description: 'Visualising Walden inversion, tracking stereochemical switches and finding steric hindrance thresholds.', course: '', reference: '', time: '', skill: 'Stereochemistry', files: [{ title: 'Worksheet (PDF)', kind: 'file', name: 'module-2.pdf', src: '', audience: 'Both' }], resources: [] },
      { name: 'Electrophilic Addition to Alkenes', subtitle: 'Hydrohalogenation and Markovnikov’s rule', description: 'Tracking carbocation intermediates, identifying hydride and alkyl shifts, and auditing empty p-orbitals.', course: '', reference: '', time: '', skill: 'Mechanism reading', files: [{ title: 'Worksheet (PDF)', kind: 'file', name: 'module-3.pdf', src: '', audience: 'Both' }], resources: [] },
      { name: 'Conjugation & Hückel Theory', subtitle: 'Aromaticity vs. anti-aromaticity', description: 'Mapping cyclic π networks, counting delocalised electrons and decoding Frost diagrams by hand.', course: '', reference: '', time: '', skill: 'Orbital reasoning', files: [{ title: 'Worksheet (PDF)', kind: 'file', name: 'module-4.pdf', src: '', audience: 'Both' }, { title: 'Answer key', kind: 'file', name: 'module-4-key.pdf', src: '', audience: 'Faculty' }], resources: [] }
    ],
    guidelines: [
      { title: 'In-class “live audit”', text: 'Split the class into forensic teams of two or three. The textbook is the “reference database”. Teams identify starting structures, follow the curved arrows and work out the final charges step by step.' },
      { title: 'Pre-lab structural alignment', text: 'Before an elimination or substitution experiment, set the worksheet as preparation. Students analyse why the bulky DBU blocks backside SN2 attack and forces E2 elimination instead.' }
    ],
    alternates: []
  }
);
