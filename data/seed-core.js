/* Sample data: profiles. Resource seeds live in data/seed-*.js and push into USE_SEED.resources.
   Phase 2: this data moves to Firestore. */
window.USE_SEED = window.USE_SEED || { resources: [], profiles: [] };

window.USE_SEED.profiles.push(
  {
    id: 'p-use-team', name: 'USE Network Team', designation: 'Repository curators',
    department: 'School of Arts and Sciences', institution: 'Azim Premji University', location: 'Bengaluru, Karnataka',
    disciplines: ['Chemistry', 'Physics', 'Biology', 'Mathematics'],
    bio: 'Curators of the USE Network digital repository. This profile holds sample resources used to demonstrate the prototype.',
    interests: 'Low-cost laboratory work, active learning, open educational resources',
    email: 'usenetwork@apu.edu.in', showEmail: true, phone: '', showPhone: false, sample: true
  },
  {
    id: 'p-shantha', name: 'Shantha Bhushan', designation: 'Faculty, Mathematics',
    department: 'School of Arts and Sciences', institution: 'Azim Premji University', location: 'Bengaluru, Karnataka',
    disciplines: ['Mathematics'],
    bio: 'Topologist who completed her PhD at IIT Bombay and now teaches mathematics at Azim Premji University. Uses crochet, knitting and origami to make abstract ideas in topology and geometry tangible, and to help students lose their fear of mathematics.',
    interests: 'Knot theory, topology, mathematics and fibre arts, origami in the classroom',
    showEmail: false, showPhone: false, sample: true
  },
  {
    id: 'p-divakaran', name: 'Divakaran D', designation: 'Faculty, Mathematics',
    department: 'School of Arts and Sciences', institution: 'Azim Premji University', location: 'Bengaluru, Karnataka',
    disciplines: ['Mathematics'],
    bio: 'Teaches undergraduate mathematics and co-runs origami-based classroom activities with the mathematics group.',
    interests: 'Geometry, hands-on mathematics',
    showEmail: false, showPhone: false, sample: true
  }
);
