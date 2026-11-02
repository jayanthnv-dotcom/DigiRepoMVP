/* Sample Classroom Activities. */
window.USE_SEED = window.USE_SEED || { resources: [], profiles: [] };

window.USE_SEED.resources.push(
  {
    id: 'act-forget-me-knot', type: 'activity', sample: true, created: '2026-10-28T10:00:00Z',
    title: 'Forget Me Knot: Tactile Mathematics with Knots, Crochet and Origami',
    overview: 'Using wire knots, crochet and origami to make topology and geometry visible, and to free students from the fear of mathematics.',
    disciplines: ['Mathematics'], topic: 'Topology & knot theory', level: 'All levels', language: 'English',
    keywords: ['knot theory', 'topology', 'origami', 'crochet', 'negative curvature', 'hands-on', 'maths anxiety'],
    thumbnail: 'assets/img/origami-collage.jpg',
    contributors: [{ id: 'p-shantha' }, { id: 'p-divakaran' }], licence: 'CC BY-SA 4.0',
    note: 'Sample entry adapted from the Azim Premji University article “Forget Me Knot: A Mathematician’s Lasting Tryst with Knot Theory”. Classroom guidelines are a demonstration write-up.',
    media: [
      { kind: 'youtube', src: 'https://www.youtube.com/watch?v=Ovgl91GJuFQ', caption: 'Classroom video' },
      { kind: 'image', src: 'assets/img/origami-tetrahedron.jpg', caption: 'A folded origami tetrahedron held up against kinetic theory equations on the blackboard.' },
      { kind: 'image', src: 'assets/img/origami-group.jpg', caption: 'Students folding together on the classroom floor, working from instruction sheets.' },
      { kind: 'image', src: 'assets/img/origami-polyhedron.jpg', caption: 'A finished modular origami polyhedron.' },
      { kind: 'image', src: 'assets/img/origami-modules.jpg', caption: 'Folded units being assembled into a larger model.' }
    ],
    abstract: 'Many undergraduate students, especially those who take mathematics only because it may lead to a job, see it as “a bunch of formulae and symbols that only very smart people can deal with”. In Shantha Bhushan and Divakaran’s classes at Azim Premji University, students meet deep ideas from topology and geometry through their hands first: knotting and welding wires, crocheting surfaces with negative curvature, and folding modular origami polyhedra.\n\nThe activities do not replace formal mathematics, but they remove barriers. The mathematics group has seen a clear shift in how students relate to the subject. It becomes something they can play with and enjoy, and the shift is especially visible among students from disadvantaged backgrounds.',
    theory: 'Knot theory is a branch of topology, the study of objects that can be twisted, stretched or deformed without cutting. Everyday knots in shoelaces or ropes are open knots with free ends. Mathematicians study closed knots, where the ends are joined, like a knotted wire whose ends are welded together.\n\nTwo knots are equivalent if one can be deformed into the other by stretching and passing strands over and under, without cutting. Knots are classified by their crossing number, the fewest crossings in any 2-D diagram:\n- the unknot (a simple loop) has 0 crossings\n- there are no knots with 1 or 2 crossings\n- one knot each with 3 and 4 crossings, 2 with 5, 3 with 6 and 7 with 7\n\nPeter Guthrie Tait built the first knot tables in the 19th century. Two knots can share a crossing number and still be different, and telling them apart is hard. The Jones polynomial (Vaughan Jones and Joan Birman, 1984) gave mathematicians a powerful tool to distinguish knots. It opened the way to other invariants, such as HOMFLYPT and Khovanov homology.\n\nCrochet makes another abstract idea concrete: surfaces with negative curvature, which bend inwards like coral reefs, can be crocheted by steadily increasing stitches in each row.',
    pedagogy: 'Embodied, tactile learning. Students build and manipulate physical models (wires, crocheted surfaces, origami units) before or alongside the formal definitions. When an abstract object can be held and deformed, students can test their own conjectures (“are these two knots the same?”) instead of relying on someone else’s diagram.\n\nWhy it is innovative:\n- Arts and crafts become a gateway to higher mathematics, an idea recognised by the mathematical community (for example AMS sessions on mathematics and fibre arts) but still rarely used in undergraduate classrooms.\n- It directly addresses maths anxiety: “I see anything tactile and visual as a way of freeing students from this anxiety and fear.” (Shantha Bhushan)\n- It is very low-cost: wire, yarn and coloured paper.\n- It works well in groups, so students talk mathematics while they make.',
    guidelines: [
      { kind: 'text', title: 'Open with everyday knots', text: 'Ask students where they meet knots: shoelaces, gift-wrapping, sailors, crochet, surgical stitches. Point out that these are all open knots, and introduce the idea of a closed knot.' },
      { kind: 'text', title: 'Make closed knots', text: 'Give each pair two pieces of soft wire. Each student ties a simple knot and joins the ends (twist or tape them). Now there is “less wiggle room”.' },
      { kind: 'text', title: 'Are the two knots the same?', text: 'Pairs try to transform one knot into the other by stretching and moving strands over and under, without cutting. Collect claims on the board: same, different or not sure, and why.' },
      { kind: 'text', title: 'Count crossings', text: 'Students flatten their knots into 2-D diagrams and count crossings. Compare with Tait’s table (0, 3, 4, 5, 6, 7 crossings) and discuss why a smaller crossing number may be possible.' },
      { kind: 'image', src: 'assets/img/origami-group.jpg', caption: 'Group work on the floor keeps everyone’s hands busy and the conversation going.' },
      { kind: 'text', title: 'Extend with origami or crochet', text: 'Follow up with modular origami polyhedra (vertices, edges, faces and Euler’s formula) or a crocheted hyperbolic surface (negative curvature). End with a short reflection: what did your hands help you understand?' }
    ],
    resources: [
      { title: 'Joan Birman recalls the discovery of the Jones polynomial (YouTube)', kind: 'link', src: 'https://www.youtube.com/watch?v=95R9OXHelF8', audience: 'Both' },
      { title: 'Joan Birman’s tribute to Vaughan Jones (arXiv)', kind: 'link', src: 'https://arxiv.org/pdf/2210.01920.pdf', audience: 'Faculty' },
      { title: 'Vaughan Jones obituary (Nature)', kind: 'link', src: 'https://www.nature.com/articles/d41586-020-02752-0', audience: 'Both' },
      { title: 'Mathematical knots: it’s not what you’d expect (the-gist.org)', kind: 'link', src: 'https://the-gist.org/2018/04/mathematical-knots-its-not-what-youd-expect/', audience: 'Student' },
      { title: 'Why knots matter in math and science (Quanta Magazine)', kind: 'link', src: 'https://www.quantamagazine.org/why-knots-matter-in-math-and-science-20220406/', audience: 'Both' },
      { title: 'AMS Mathematical Imagery gallery', kind: 'link', src: 'https://www.ams.org/publicoutreach/math-imagery/math-imagery', audience: 'Both' },
      { title: 'Original article: Forget Me Knot (Azim Premji University)', kind: 'link', src: 'https://azimpremjiuniversity.edu.in/pedagogical-tool/forget-me-knot-a-mathematicians-lasting-tryst-with-knot-theory', audience: 'Both' }
    ]
  },
  {
    id: 'act-peer-instruction-mechanics', type: 'activity', sample: true, created: '2026-09-02T10:00:00Z',
    title: 'Peer Instruction with Concept Questions in Mechanics',
    overview: 'A think–vote–discuss–revote routine that turns a lecture on Newton’s laws into an active discussion, using only paper voting cards.',
    disciplines: ['Physics'], topic: 'Newton’s laws', level: 'Year 1', language: 'English',
    keywords: ['peer instruction', 'concept questions', 'active learning', 'low-cost'],
    thumbnail: '', contributors: [{ id: 'p-use-team' }], licence: 'CC BY-SA 4.0',
    note: 'Illustrative sample entry for the prototype.',
    media: [],
    abstract: 'Students answer a conceptual multiple-choice question individually using A/B/C/D paper cards, discuss with a neighbour, and vote again. The teacher uses the vote distribution to decide whether to move on or explain further.',
    theory: 'Common intuitive ideas, such as “motion needs a force”, persist even after students can solve textbook problems. Concept questions target these ideas directly.',
    pedagogy: 'Peer instruction makes students commit to an answer and then explain their reasoning to a peer, which surfaces misconceptions quickly. Paper cards make it work in any classroom without clickers or phones.',
    guidelines: [
      { kind: 'text', title: 'Prepare', text: 'Write 3–4 concept questions with plausible wrong answers based on common misconceptions. Print A/B/C/D cards for every student.' },
      { kind: 'text', title: 'Run each question', text: 'Think (1 min), vote, discuss with a neighbour (2–3 min), revote. If 30–70% are correct on the first vote, peer discussion works best.' },
      { kind: 'text', title: 'Close', text: 'Explain the correct answer, and why the most popular wrong answer is tempting.' }
    ],
    resources: [{ title: 'A/B/C/D voting cards (print)', kind: 'file', name: 'cards.pdf', src: '', audience: 'Faculty' }]
  }
);
