# Floor Ready: Parliamentary Procedure Training

An interactive, browser-based training for students preparing for the **Virginia Government Simulation**. It needs no installation or accounts, and it works on phones, tablets, and laptops.

## What's inside

| Section | What students do |
|---|---|
| **Reference** | Searchable motions chart (second? debatable? vote needed?), rank of motions, word-for-word scripts for the Speaker, and key terms. Printable. |
| **Quiz** | 25 questions (multiple choice plus one put-the-steps-in-order question). Every answer comes with an explanation. Full, quick (10 random), or single-topic modes, and a retry of missed questions. |
| **Role-Play** | Four step-by-step scenarios. Students play the Speaker or a delegate and choose what to do, or type exactly what they would say and compare it with a model answer. |
| **Live Session** | Two printable mock bills, twelve role cards (several with secret objectives), a run of show, and debrief questions for an in-class mock floor session. |
| **Reflect** | Nine open-ended questions. Answers save automatically in the student's browser and can be downloaded as a `.txt` file, copied, or printed to turn in. "Points to consider" opens only after the student has written at least 15 words. |

Progress and written answers are stored only in each student's own browser (`localStorage`). Nothing is sent to a server.

## Publishing it with GitHub Pages

1. On GitHub, open the repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, and click **Save**.
3. After a minute or two, the site will be live at
   `https://chapmanrackaway.github.io/parliamentaryprocedure/`

Share that link with students.

## Editing the content

All questions, scenarios, bills, role cards, and reflection prompts are in **`js/content.js`**. You can edit them directly on GitHub (open the file and click the pencil icon). You don't need to change any other file.

- **Quiz question:** add an object to `quiz` with `topic`, `q`, `options`, `answer` (the index of the correct option, starting at 0), and `explain`.
- **Role-play step:** each scenario has `steps`. A `choice` step has `options` (each with `text`, `correct`, `feedback`). A `script` step has a `prompt`, a `model` answer, and optional `tips`.
- **Reflection question:** add an item with a unique `id`, a `title`, a `prompt`, and a `consider` list.

The content follows *Robert's Rules of Order Newly Revised* (12th ed.) general practice and uses the terms House, Speaker, and Delegate. If your simulation's rules differ (for example, whether bills need a second, how "table" works, or speaking limits), update the matching questions so students practice the rules they'll actually use.

## Running locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

## Files

```
index.html        page shell and navigation
css/styles.css    styling (light/dark mode, mobile layout, print layouts)
js/content.js     all training content (edit this)
js/app.js         app logic
```
