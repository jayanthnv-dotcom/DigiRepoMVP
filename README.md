# USE Network – Digital Repository (prototype v1)

A digital repository for the **Undergraduate Science Educators' (USE) Network**, Azim Premji University, Bengaluru.
UG science and mathematics teachers share low-cost, Indian-context teaching resources, and other teachers and students find and use them.

This is an interactive prototype to show the idea to the team. It is a static website (HTML, CSS and JavaScript, no build step) with sample content. Contributions, profiles and student links are saved in the browser.

## What's in it

| Page | What it shows |
|---|---|
| **Home** (`index.html`) | Search across all resources, the four resource types, browse by discipline, recently added |
| **Lab Experiments** (`labs.html`, `lab.html`) | Dynamic lab protocol (Cookbook / Guided Inquiry / CURE), step videos, Materials Calculator, materials, resources, misconception alert, pre-/post-lab questions |
| **Classroom Activities** (`activities.html`, `activity.html`) | Slideshow + abstract, brief theory, pedagogical utility, guidelines (text, images, video), additional resources |
| **Worksheets** (`worksheets.html`, `worksheet.html`) | About, pedagogical approach, worksheet modules with downloads, implementation guidelines and alternate approaches |
| **Courses & Modules** (`courses.html`, `course.html`) | Course/Module label, abstract, learning outcomes, expandable modules (time, readings, resources) |
| **Contribute** (`contribute.html?type=…`) | Step-by-step forms for each type, with draft saving and a live preview before submit |
| **Profiles** (`profile.html`, `profile-edit.html`) | Contributor profile, contributions, contact details shown only if the owner allows |
| **My student links** (`my-links.html`) | Links teachers created with “Share with students” |

### Student and Teacher views
There is no login yet. Use the **Student / Teacher** toggle in the header.

- **Teacher view** shows everything, the Contribute buttons and **Share with students**.
- **Student view** hides teacher-only sections by default: answer keys, Materials Calculator, misconception alerts, pedagogy and guidelines, and files marked *Faculty only*.
- **Share with students**: a teacher switches sections on or off (and picks one lab method), previews the result, and creates a named link. Students who open the link see only those sections.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly from disk also works in most browsers. Uploads need a local server in some browsers.

## Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # choose your project, public directory "." , no SPA rewrite, don't overwrite files
firebase deploy
```

`firebase.json` is already set up to serve the repository root.

## Project structure

```
index.html, labs.html, lab.html, …   page shells (each loads data + scripts)
css/styles.css                       design system (colours, type, components)
js/core.js                           taxonomy, data layer (USE.store), files, roles, layout, shared renderers
js/share.js                          "Share with students" engine
js/list.js                           listing pages: search, filters, sort
js/detail.js                         detail page boot
js/views/*.js                        detail views per resource type
js/forms/wizard.js                   form fields + step-by-step wizard
js/forms/common.js                   contribute page, Basics step, review & submit
js/forms/*.js                        contribution forms per resource type
js/profile.js, js/home.js            profiles, my links, home page
data/seed-*.js                       sample profiles and resources
assets/                              images and sample worksheet PDFs
```

## Phase 2 (after review)

- Firebase Auth for real student and teacher logins.
- Move `USE.store` and `USE.files` (in `js/core.js`) to Firestore and Firebase Storage. Every page reads and writes through these, so nothing else needs to change.
- Store student links as short codes in Firestore, so edits apply to links already sent.
- A review and approval queue for new contributions, plus editing and deleting your own resources.

## Sample content

Sample entries are marked “Sample content”. Notes on each entry say what is taken from real sources (the USE Network deck, uploaded worksheets, the Azim Premji University “Forget Me Knot” article and course page) and what is illustrative.

Licence for contributions: **CC BY-SA 4.0**.
