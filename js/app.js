(function () {
  "use strict";

  var C = window.CONTENT;
  var main = document.getElementById("main");

  /* ---------- Saved progress (this browser only) ---------- */
  var STORE_KEY = "floorReady.v1";
  var state = loadState();

  function loadState() {
    var fallback = { name: "", quizBest: null, quizLast: null, scenarios: {}, reflections: {} };
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return Object.assign(fallback, parsed);
    } catch (e) {
      return fallback;
    }
  }

  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function stripTags(s) {
    var d = document.createElement("div");
    d.innerHTML = s;
    return d.textContent || "";
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function wordCount(s) {
    var m = String(s).trim().match(/\S+/g);
    return m ? m.length : 0;
  }

  function render(html) {
    main.innerHTML = html;
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }

  /* ---------- Router ---------- */
  var routes = {
    home: renderHome,
    reference: renderReference,
    quiz: renderQuizStart,
    roleplay: renderScenarioList,
    live: renderLive,
    reflect: renderReflect
  };

  function route() {
    var hash = (location.hash || "#home").slice(1);
    var parts = hash.split("/");
    var name = parts[0];

    document.querySelectorAll(".site-nav a").forEach(function (a) {
      if (a.dataset.route === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    closeMenu();

    if (name === "roleplay" && parts[1]) return renderScenario(parts[1]);
    (routes[name] || renderHome)();
  }

  window.addEventListener("hashchange", route);

  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  function closeMenu() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  /* ---------- Home ---------- */
  function renderHome() {
    var done = C.scenarios.filter(function (s) { return state.scenarios[s.id] && state.scenarios[s.id].done; }).length;
    var allRefl = [];
    C.reflections.forEach(function (g) { allRefl = allRefl.concat(g.items); });
    var written = allRefl.filter(function (r) { return wordCount(state.reflections[r.id] || "") > 0; }).length;
    var best = state.quizBest;

    render(
      '<section class="hero">' +
        '<p class="eyebrow">Virginia Government Simulation</p>' +
        '<h1>Get floor ready.</h1>' +
        '<p class="lede">In the simulation you\'ll make motions, debate bills, and maybe hold the Speaker\'s gavel. ' +
        'This training gets you comfortable with the rules first, so you can focus on the arguments.</p>' +
        '<div class="hero-actions">' +
          '<a class="btn btn-primary" href="#quiz">Start the quiz</a>' +
          '<a class="btn" href="#reference">Open the cheat sheet</a>' +
        '</div>' +
      '</section>' +

      '<section class="cards" aria-label="Training sections">' +
        card("#reference", "1", "Reference", "Motions chart, key terms, and word-for-word scripts for the Speaker. Keep it open during the simulation.", "") +
        card("#quiz", "2", "Quiz", C.quiz.length + " questions with an explanation for every answer.", best ? "Best score: " + best.score + "/" + best.total : "Not started") +
        card("#roleplay", "3", "Role-Play", "Step into the Speaker's chair or onto the floor and decide what to do in realistic situations.", done + " of " + C.scenarios.length + " scenarios complete") +
        card("#live", "4", "Live Session", "Printable bills and secret role cards to run a mock floor session with your class.", "") +
        card("#reflect", "5", "Reflect", "Open-ended questions you can save, print, or download for your instructor.", written + " of " + allRefl.length + " answered") +
      '</section>' +

      '<section class="panel">' +
        '<h2>Five habits of a good delegate</h2>' +
        '<ol class="habits">' +
          '<li><strong>Get recognized first.</strong> Rise, say "Mr./Madam Speaker," and wait.</li>' +
          '<li><strong>Talk to the chair, not to each other.</strong> Refer to members by title: "the Delegate from Fairfax."</li>' +
          '<li><strong>Say "I move..."</strong> rather than "I think we should..."</li>' +
          '<li><strong>Debate ideas, not people.</strong> Never question another member\'s motives.</li>' +
          '<li><strong>When in doubt, ask.</strong> "Parliamentary inquiry" is always allowed.</li>' +
        '</ol>' +
      '</section>' +

      '<section class="panel subtle">' +
        '<h2>Where these rules come from</h2>' +
        '<p>This training follows <em>Robert\'s Rules of Order Newly Revised</em>, the most widely used guide to parliamentary procedure. ' +
        'Real legislatures, including Virginia\'s House of Delegates and Senate, adopt their own rules on top of it, and so may your simulation. ' +
        '<strong>If your simulation\'s rules say something different, follow them.</strong></p>' +
      '</section>'
    );
  }

  function card(href, num, title, text, status) {
    return '<a class="card" href="' + href + '">' +
      '<span class="card-num" aria-hidden="true">' + num + '</span>' +
      '<h2>' + title + '</h2>' +
      '<p>' + text + '</p>' +
      (status ? '<span class="card-status">' + esc(status) + '</span>' : '') +
      '</a>';
  }

  /* ---------- Reference ---------- */
  function renderReference() {
    var rows = C.motions.map(function (g) {
      return '<tbody class="motion-group">' +
        '<tr class="group-row"><th colspan="7" scope="colgroup">' + g.group + '<span>' + g.note + '</span></th></tr>' +
        g.items.map(function (m) {
          return '<tr class="motion-row" data-search="' + esc((m.name + " " + m.say).toLowerCase()) + '">' +
            '<th scope="row" data-label="Motion">' + m.name + '</th>' +
            '<td data-label="What you say"><q>' + m.say + '</q></td>' +
            '<td data-label="Interrupt speaker?">' + yn(m.interrupt) + '</td>' +
            '<td data-label="Second?">' + yn(m.second) + '</td>' +
            '<td data-label="Debatable?">' + yn(m.debate) + '</td>' +
            '<td data-label="Amendable?">' + yn(m.amend) + '</td>' +
            '<td data-label="Vote needed">' + m.vote + '</td>' +
          '</tr>';
        }).join("") +
      '</tbody>';
    }).join("");

    render(
      '<header class="page-head">' +
        '<p class="eyebrow">Section 1</p>' +
        '<h1>Reference</h1>' +
        '<p class="lede">Everything you need on one page. <button class="link-btn" data-action="print">Print this page</button></p>' +
        '<nav class="jump" aria-label="On this page"><a href="#ref-motions">Motions chart</a><a href="#ref-precedence">Rank of motions</a><a href="#ref-scripts">Chair\'s scripts</a><a href="#ref-glossary">Key terms</a></nav>' +
      '</header>' +

      '<section class="panel" id="ref-motions">' +
        '<h2>Motions chart</h2>' +
        '<label class="search"><span>Filter motions</span><input type="search" id="motion-filter" placeholder="Try: amend, debate, adjourn"></label>' +
        '<div class="table-wrap"><table class="motions">' +
          '<thead><tr><th scope="col">Motion</th><th scope="col">What you say</th><th scope="col">Interrupt speaker?</th><th scope="col">Second?</th><th scope="col">Debatable?</th><th scope="col">Amendable?</th><th scope="col">Vote needed</th></tr></thead>' +
          rows +
        '</table></div>' +
        '<p class="footnote">' + C.motionsFootnote + '</p>' +
      '</section>' +

      '<section class="panel" id="ref-precedence">' +
        '<h2>Rank of motions</h2>' +
        '<p>When a motion is pending, you may make only a motion that <strong>ranks higher</strong>. Votes are taken from the top down: the last motion made is the first one decided.</p>' +
        '<ol class="ladder">' +
          ['Fix the time to which to adjourn', 'Adjourn', 'Recess', 'Raise a question of privilege', 'Call for the orders of the day', 'Lay on the table', 'Previous question', 'Limit or extend debate', 'Postpone to a certain time', 'Commit / refer', 'Amend', 'Postpone indefinitely', 'Main motion (the bill)']
            .map(function (m, i) { return '<li style="--step:' + i + '">' + m + '</li>'; }).join("") +
        '</ol>' +
        '<p class="footnote">Incidental motions, such as a point of order or an appeal, have no rank. They are in order whenever the issue they deal with comes up.</p>' +
      '</section>' +

      '<section class="panel" id="ref-scripts">' +
        '<h2>Chair\'s scripts</h2>' +
        '<div class="script-grid">' +
          C.scripts.map(function (s) {
            return '<article class="script-card"><h3>' + s.title + '</h3>' +
              s.lines.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join("") + '</article>';
          }).join("") +
        '</div>' +
      '</section>' +

      '<section class="panel" id="ref-glossary">' +
        '<h2>Key terms</h2>' +
        '<dl class="glossary">' +
          C.glossary.map(function (g) { return '<div><dt>' + g[0] + '</dt><dd>' + g[1] + '</dd></div>'; }).join("") +
        '</dl>' +
      '</section>'
    );

    var filter = document.getElementById("motion-filter");
    filter.addEventListener("input", function () {
      var q = filter.value.trim().toLowerCase();
      document.querySelectorAll(".motion-group").forEach(function (tb) {
        var any = false;
        tb.querySelectorAll(".motion-row").forEach(function (r) {
          var show = !q || r.dataset.search.indexOf(q) !== -1 || r.textContent.toLowerCase().indexOf(q) !== -1;
          r.hidden = !show;
          if (show) any = true;
        });
        tb.hidden = !any;
      });
    });
    main.querySelector('[data-action="print"]').addEventListener("click", function () { window.print(); });
  }

  function yn(v) {
    var cls = /^yes/i.test(v) ? "yes" : /^no\b/i.test(v) ? "no" : "maybe";
    return '<span class="yn ' + cls + '">' + v + '</span>';
  }

  /* ---------- Quiz ---------- */
  var quiz = null;

  function renderQuizStart() {
    var topics = [];
    C.quiz.forEach(function (q) { if (topics.indexOf(q.topic) === -1) topics.push(q.topic); });
    var best = state.quizBest;

    render(
      '<header class="page-head">' +
        '<p class="eyebrow">Section 2</p>' +
        '<h1>Quiz</h1>' +
        '<p class="lede">Each answer comes with an explanation, so you learn from every question, right or wrong.</p>' +
      '</header>' +
      '<section class="panel quiz-start">' +
        (best ? '<p class="stat">Your best score: <strong>' + best.score + ' / ' + best.total + '</strong> (' + pct(best.score, best.total) + '%)</p>' : '') +
        '<fieldset><legend>Choose a quiz</legend>' +
          '<label class="radio-card"><input type="radio" name="mode" value="all" checked><span><strong>Full quiz</strong> All ' + C.quiz.length + ' questions</span></label>' +
          '<label class="radio-card"><input type="radio" name="mode" value="quick"><span><strong>Quick check</strong> 10 random questions</span></label>' +
          '<label class="radio-card"><input type="radio" name="mode" value="topic"><span><strong>One topic</strong> ' +
            '<select id="topic-select" aria-label="Topic">' + topics.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join("") + '</select></span></label>' +
        '</fieldset>' +
        '<label class="check"><input type="checkbox" id="shuffle" checked> Shuffle question order</label>' +
        '<button class="btn btn-primary" id="start-quiz">Begin</button>' +
      '</section>'
    );

    document.getElementById("topic-select").addEventListener("change", function () {
      main.querySelector('input[value="topic"]').checked = true;
    });
    document.getElementById("start-quiz").addEventListener("click", function () {
      var mode = main.querySelector('input[name="mode"]:checked').value;
      var qs = C.quiz.slice();
      if (mode === "topic") {
        var t = document.getElementById("topic-select").value;
        qs = qs.filter(function (q) { return q.topic === t; });
      }
      if (document.getElementById("shuffle").checked || mode === "quick") qs = shuffle(qs);
      if (mode === "quick") qs = qs.slice(0, 10);
      startQuiz(qs, mode === "all" || mode === "quick");
    });
  }

  function startQuiz(questions, countsForBest) {
    quiz = { questions: questions, i: 0, score: 0, missed: [], countsForBest: countsForBest };
    renderQuestion();
  }

  function quizHeader() {
    var n = quiz.questions.length;
    return '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + quiz.i + '" aria-label="Quiz progress">' +
      '<div class="progress-bar" style="width:' + pct(quiz.i, n) + '%"></div></div>' +
      '<p class="progress-label">Question ' + (quiz.i + 1) + ' of ' + n + ' <span class="score-pill">Score: ' + quiz.score + '</span></p>';
  }

  function renderQuestion() {
    var q = quiz.questions[quiz.i];
    if (q.type === "order") return renderOrderQuestion(q);

    var order = shuffle(q.options.map(function (_, i) { return i; }));
    render(
      '<section class="panel quiz">' + quizHeader() +
        '<p class="topic-tag">' + esc(q.topic) + '</p>' +
        '<h1 class="question">' + q.q + '</h1>' +
        '<div class="options" role="group" aria-label="Answer choices">' +
          order.map(function (oi, k) {
            return '<button class="option" data-i="' + oi + '"><span class="letter">' + "ABCD"[k] + '</span><span>' + q.options[oi] + '</span></button>';
          }).join("") +
        '</div>' +
        '<div class="feedback" aria-live="polite"></div>' +
      '</section>'
    );

    main.querySelectorAll(".option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var chosen = Number(btn.dataset.i);
        var right = chosen === q.answer;
        main.querySelectorAll(".option").forEach(function (b) {
          b.disabled = true;
          if (Number(b.dataset.i) === q.answer) b.classList.add("correct");
        });
        if (!right) btn.classList.add("wrong");
        answered(q, right);
      });
    });
  }

  function renderOrderQuestion(q) {
    var current = shuffle(q.items);
    // Avoid presenting it already solved.
    if (current.join() === q.items.join()) current.reverse();

    render(
      '<section class="panel quiz">' + quizHeader() +
        '<p class="topic-tag">' + esc(q.topic) + '</p>' +
        '<h1 class="question">' + q.q + '</h1>' +
        '<p class="hint">Use the arrow buttons to move each step up or down.</p>' +
        '<ol class="order-list"></ol>' +
        '<button class="btn btn-primary" id="check-order">Check order</button>' +
        '<div class="feedback" aria-live="polite"></div>' +
      '</section>'
    );

    var list = main.querySelector(".order-list");
    function draw(focusIdx, focusDir) {
      list.innerHTML = current.map(function (item, i) {
        return '<li data-item="' + esc(item) + '"><span class="order-text">' + esc(item) + '</span>' +
          '<span class="order-btns">' +
            '<button class="icon-btn" data-move="-1" data-i="' + i + '" aria-label="Move up: ' + esc(item) + '"' + (i === 0 ? ' disabled' : '') + '>&#9650;</button>' +
            '<button class="icon-btn" data-move="1" data-i="' + i + '" aria-label="Move down: ' + esc(item) + '"' + (i === current.length - 1 ? ' disabled' : '') + '>&#9660;</button>' +
          '</span></li>';
      }).join("");
      if (focusIdx != null) {
        var b = list.querySelector('[data-i="' + focusIdx + '"][data-move="' + focusDir + '"]') ||
                list.querySelector('[data-i="' + focusIdx + '"]:not([disabled])');
        if (b) b.focus();
      }
    }
    draw();
    list.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-move]");
      if (!b || b.disabled) return;
      var i = Number(b.dataset.i), d = Number(b.dataset.move), j = i + d;
      var t = current[i]; current[i] = current[j]; current[j] = t;
      draw(j, d);
    });

    document.getElementById("check-order").addEventListener("click", function () {
      var right = current.join("|") === q.items.join("|");
      list.querySelectorAll("li").forEach(function (li, i) {
        li.classList.add(li.dataset.item === q.items[i] ? "correct" : "wrong");
      });
      list.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
      this.remove();
      var extra = right ? "" : '<ol class="answer-key">' + q.items.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join("") + '</ol>';
      answered(q, right, extra);
    });
  }

  function answered(q, right, extra) {
    if (right) quiz.score++;
    else quiz.missed.push(q);
    var last = quiz.i === quiz.questions.length - 1;
    var fb = main.querySelector(".feedback");
    fb.className = "feedback show " + (right ? "is-right" : "is-wrong");
    fb.innerHTML = '<p class="verdict">' + (right ? "Correct." : "Not quite.") + '</p>' +
      (extra ? '<p>The correct order:</p>' + extra : '') +
      '<p>' + q.explain + '</p>' +
      '<button class="btn btn-primary" id="next-q">' + (last ? "See results" : "Next question") + '</button>';
    var next = document.getElementById("next-q");
    next.focus();
    next.addEventListener("click", function () {
      if (last) return renderQuizResults();
      quiz.i++;
      renderQuestion();
    });
  }

  function renderQuizResults() {
    var total = quiz.questions.length, score = quiz.score, p = pct(score, total);
    var result = { score: score, total: total, date: new Date().toISOString() };
    state.quizLast = result;
    var newBest = false;
    if (quiz.countsForBest && (!state.quizBest || pct(score, total) > pct(state.quizBest.score, state.quizBest.total))) {
      state.quizBest = result;
      newBest = true;
    }
    saveState();

    var msg = p >= 90 ? "Floor ready. You could hold the gavel."
      : p >= 75 ? "Strong work. Review the questions you missed and you'll be set."
      : p >= 50 ? "Good start. Spend some time with the Reference page, then try again."
      : "Keep practicing. Read through the Reference page and take the quiz again.";

    render(
      '<section class="panel results">' +
        '<p class="eyebrow">Quiz complete</p>' +
        '<div class="big-score"><span>' + score + '</span>/<span>' + total + '</span></div>' +
        '<p class="lede">' + p + '% &middot; ' + msg + (newBest ? ' <span class="badge">New best!</span>' : '') + '</p>' +
        '<div class="hero-actions">' +
          (quiz.missed.length ? '<button class="btn btn-primary" id="retry-missed">Retry the ' + quiz.missed.length + ' you missed</button>' : '') +
          '<a class="btn" href="#quiz" id="new-quiz">New quiz</a>' +
          '<a class="btn" href="#roleplay">Try a role-play</a>' +
        '</div>' +
      '</section>' +
      (quiz.missed.length ?
        '<section class="panel"><h2>Review what you missed</h2>' +
          quiz.missed.map(function (q) {
            var ans = q.type === "order"
              ? '<ol>' + q.items.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join("") + '</ol>'
              : '<p class="key">Answer: <strong>' + q.options[q.answer] + '</strong></p>';
            return '<article class="review-item"><h3>' + q.q + '</h3>' + ans + '<p>' + q.explain + '</p></article>';
          }).join("") +
        '</section>' : '')
    );

    var retry = document.getElementById("retry-missed");
    if (retry) {
      var missed = quiz.missed.slice();
      retry.addEventListener("click", function () { startQuiz(shuffle(missed), false); });
    }
    // Clicking "New quiz" while already on #quiz wouldn't fire hashchange.
    document.getElementById("new-quiz").addEventListener("click", function (e) {
      e.preventDefault();
      renderQuizStart();
    });
  }

  /* ---------- Role-play ---------- */
  function renderScenarioList() {
    render(
      '<header class="page-head">' +
        '<p class="eyebrow">Section 3</p>' +
        '<h1>Role-Play</h1>' +
        '<p class="lede">Each scenario puts you in a role on the House floor. Choose what to do, or write out exactly what you would say, and get feedback at every step.</p>' +
      '</header>' +
      '<section class="scenario-list">' +
        C.scenarios.map(function (s) {
          var st = state.scenarios[s.id];
          var status = st && st.done
            ? '<span class="card-status done">Completed &middot; ' + st.firstTry + '/' + st.total + ' on first try</span>'
            : '<span class="card-status">About ' + s.minutes + ' minutes</span>';
          return '<a class="card scenario-card" href="#roleplay/' + s.id + '">' +
            '<span class="role-tag">You are: ' + esc(s.role) + '</span>' +
            '<h2>' + s.title + '</h2><p>' + s.summary + '</p>' + status + '</a>';
        }).join("") +
      '</section>' +
      '<section class="panel subtle"><h2>Want to act it out with real people?</h2><p>The <a href="#live">Live Session</a> page has printable bills and secret role cards for a full mock session with your class.</p></section>'
    );
  }

  function renderScenario(id) {
    var s = C.scenarios.filter(function (x) { return x.id === id; })[0];
    if (!s) return renderScenarioList();

    var run = { step: 0, firstTry: 0, choiceSteps: 0, missedThisStep: false };
    s.steps.forEach(function (st) { if (st.type === "choice") run.choiceSteps++; });

    render(
      '<header class="page-head">' +
        '<p class="eyebrow"><a href="#roleplay">&larr; All scenarios</a></p>' +
        '<h1>' + s.title + '</h1>' +
        '<p class="role-tag big">You are: ' + esc(s.role) + '</p>' +
      '</header>' +
      '<div class="progress" aria-hidden="true"><div class="progress-bar" id="sc-bar" style="width:0%"></div></div>' +
      '<section class="transcript" id="transcript" aria-live="polite"></section>'
    );

    var transcript = document.getElementById("transcript");
    var bar = document.getElementById("sc-bar");

    function showStep() {
      bar.style.width = pct(run.step, s.steps.length) + "%";
      if (run.step >= s.steps.length) return finish();
      var st = s.steps[run.step];
      run.missedThisStep = false;

      var el = document.createElement("article");
      el.className = "step current";
      el.innerHTML =
        '<p class="step-num">Step ' + (run.step + 1) + ' of ' + s.steps.length + '</p>' +
        '<p class="narration">' + st.narration + '</p>' +
        '<h2 class="step-prompt">' + st.prompt + '</h2>' +
        (st.type === "choice" ? choiceHtml(st) : scriptHtml(st));
      transcript.appendChild(el);

      var prev = transcript.querySelectorAll(".step.current");
      for (var i = 0; i < prev.length - 1; i++) prev[i].classList.remove("current");
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      if (st.type === "choice") wireChoice(el, st);
      else wireScript(el, st);
    }

    function choiceHtml(st) {
      var order = shuffle(st.options.map(function (_, i) { return i; }));
      return '<div class="options">' + order.map(function (oi) {
        return '<button class="option" data-i="' + oi + '"><span>' + st.options[oi].text + '</span></button>';
      }).join("") + '</div><div class="feedback" aria-live="polite"></div>';
    }

    function wireChoice(el, st) {
      var fb = el.querySelector(".feedback");
      el.querySelectorAll(".option").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var opt = st.options[Number(btn.dataset.i)];
          if (opt.correct) {
            if (!run.missedThisStep) run.firstTry++;
            el.querySelectorAll(".option").forEach(function (b) {
              b.disabled = true;
              if (b !== btn && !b.classList.contains("wrong")) b.classList.add("faded");
            });
            btn.classList.add("correct");
            fb.className = "feedback show is-right";
            fb.innerHTML = '<p class="verdict">' + (run.missedThisStep ? "That's it." : "Well done.") + '</p><p>' + opt.feedback + '</p>' + continueBtn();
            wireContinue(fb);
          } else {
            run.missedThisStep = true;
            btn.classList.add("wrong");
            btn.disabled = true;
            fb.className = "feedback show is-wrong";
            fb.innerHTML = '<p class="verdict">Not the best move.</p><p>' + opt.feedback + '</p><p class="hint">Try another option.</p>';
          }
        });
      });
    }

    function scriptHtml(st) {
      return '<label class="script-label"><span>Your words:</span>' +
        '<textarea rows="4" placeholder="Type what you would say..."></textarea></label>' +
        '<button class="btn btn-primary compare">Compare with a model answer</button>' +
        '<div class="feedback" aria-live="polite"></div>';
    }

    function wireScript(el, st) {
      var ta = el.querySelector("textarea");
      var btn = el.querySelector(".compare");
      var fb = el.querySelector(".feedback");
      ta.focus({ preventScroll: true });
      btn.addEventListener("click", function () {
        if (!ta.value.trim()) {
          fb.className = "feedback show is-wrong";
          fb.innerHTML = '<p>Give it a try first. Saying it out loud helps, too.</p>';
          ta.focus();
          return;
        }
        ta.readOnly = true;
        btn.remove();
        fb.className = "feedback show is-model";
        fb.innerHTML = '<p class="verdict">Model answer</p><blockquote>' + esc(st.model) + '</blockquote>' +
          '<p class="hint">Compare: did you include the same key parts? Your wording can differ.</p>' +
          (st.tips ? '<ul class="tips">' + st.tips.map(function (t) { return '<li>' + t + '</li>'; }).join("") + '</ul>' : '') +
          continueBtn();
        wireContinue(fb);
      });
    }

    function continueBtn() {
      return '<button class="btn btn-primary continue">' + (run.step === s.steps.length - 1 ? "Finish scenario" : "Continue") + '</button>';
    }

    function wireContinue(fb) {
      var b = fb.querySelector(".continue");
      b.focus({ preventScroll: true });
      b.addEventListener("click", function () {
        b.remove();
        run.step++;
        showStep();
      });
    }

    function finish() {
      var prev = state.scenarios[s.id];
      state.scenarios[s.id] = {
        done: true,
        firstTry: Math.max(run.firstTry, prev && prev.done ? prev.firstTry : 0),
        total: run.choiceSteps
      };
      saveState();
      transcript.querySelectorAll(".step.current").forEach(function (x) { x.classList.remove("current"); });

      var el = document.createElement("article");
      el.className = "step finish";
      var next = C.scenarios[(C.scenarios.indexOf(s) + 1) % C.scenarios.length];
      el.innerHTML =
        '<p class="eyebrow">Scenario complete</p>' +
        '<h2>You got ' + run.firstTry + ' of ' + run.choiceSteps + ' decisions right on the first try.</h2>' +
        '<h3>Think it over</h3><ul>' + s.debrief.map(function (d) { return '<li>' + d + '</li>'; }).join("") + '</ul>' +
        '<div class="hero-actions">' +
          '<button class="btn" id="replay">Replay</button>' +
          '<a class="btn btn-primary" href="#roleplay/' + next.id + '">Next: ' + next.title + '</a>' +
          '<a class="btn" href="#roleplay">All scenarios</a>' +
        '</div>';
      transcript.appendChild(el);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("replay").addEventListener("click", function () { renderScenario(s.id); });
    }

    showStep();
  }

  /* ---------- Live session ---------- */
  function renderLive() {
    var L = C.live;
    render(
      '<header class="page-head">' +
        '<p class="eyebrow">Section 4</p>' +
        '<h1>Live Session</h1>' +
        '<p class="lede">' + L.intro + '</p>' +
        '<div class="hero-actions no-print">' +
          '<button class="btn btn-primary" data-print="cards">Print role cards</button>' +
          '<button class="btn" data-print="bills">Print bills</button>' +
          '<button class="btn" data-print="all">Print everything</button>' +
        '</div>' +
      '</header>' +

      '<section class="panel print-guide">' +
        '<h2>Run of show</h2>' +
        '<table class="simple"><thead><tr><th scope="col">Time</th><th scope="col">What happens</th></tr></thead><tbody>' +
          L.runOfShow.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join("") +
        '</tbody></table>' +
        '<p class="footnote">With a large class, give extra students the Floor Delegate cards. With a small class, drop the Off-Topic Amender and Privilege Seeker cards.</p>' +
      '</section>' +

      '<section class="panel print-bills">' +
        '<h2>Bills</h2>' +
        '<div class="bills">' +
          L.bills.map(function (b) {
            return '<article class="bill">' +
              '<p class="bill-head">HOUSE OF DELEGATES &middot; SIMULATION SESSION</p>' +
              '<h3>' + b.number + '</h3><p class="bill-title">' + b.title + '</p>' +
              '<p class="bill-patron">' + b.patron + '</p>' +
              '<p class="bill-enact">Be it enacted by the General Assembly of Virginia:</p>' +
              b.sections.map(function (sec) { return '<p>' + sec + '</p>'; }).join("") +
            '</article>';
          }).join("") +
        '</div>' +
        '<p class="footnote">These bills are fictional and written for practice.</p>' +
      '</section>' +

      '<section class="panel print-cards">' +
        '<h2>Role cards</h2>' +
        '<p class="no-print">Cards marked <span class="secret-tag">Secret</span> shouldn\'t be shown to other players. Fold them before handing them out.</p>' +
        '<div class="role-cards">' +
          L.roles.map(function (r) {
            return '<article class="role-card' + (r.secret ? ' secret' : '') + '">' +
              '<p class="role-card-top">ROLE' + (r.secret ? ' <span class="secret-tag">Secret</span>' : '') + '</p>' +
              '<h3>' + r.name + '</h3><p>' + r.card + '</p></article>';
          }).join("") +
        '</div>' +
      '</section>' +

      '<section class="panel print-guide">' +
        '<h2>Debrief questions</h2>' +
        '<ol>' + L.debrief.map(function (d) { return '<li>' + d + '</li>'; }).join("") + '</ol>' +
        '<p>Then have students write a response to a <a href="#reflect">Reflect</a> question.</p>' +
      '</section>'
    );

    main.querySelectorAll("[data-print]").forEach(function (b) {
      b.addEventListener("click", function () {
        var mode = b.dataset.print;
        document.body.dataset.print = mode;
        window.print();
      });
    });
  }

  window.addEventListener("afterprint", function () { delete document.body.dataset.print; });

  /* ---------- Reflect ---------- */
  function renderReflect() {
    var all = [];
    C.reflections.forEach(function (g) { all = all.concat(g.items); });

    render(
      '<header class="page-head">' +
        '<p class="eyebrow">Section 5</p>' +
        '<h1>Reflect</h1>' +
        '<p class="lede">There are no single right answers here. Write your thinking, then open <em>Points to consider</em> to check what you might have missed. ' +
        'Your answers save automatically in this browser. Download or print them to turn in.</p>' +
      '</header>' +

      '<section class="panel reflect-tools no-print">' +
        '<label class="name-field"><span>Your name</span><input type="text" id="student-name" autocomplete="name" value="' + esc(state.name || "") + '"></label>' +
        '<div class="hero-actions">' +
          '<button class="btn btn-primary" id="download">Download answers (.txt)</button>' +
          '<button class="btn" id="print-refl">Print</button>' +
          '<button class="btn" id="copy-refl">Copy all</button>' +
          '<button class="btn btn-danger" id="clear-refl">Clear all</button>' +
        '</div>' +
        '<p class="status" id="refl-status" aria-live="polite"></p>' +
      '</section>' +

      '<p class="print-only print-name">Name: ' + esc(state.name || "____________________") + '</p>' +

      C.reflections.map(function (g) {
        return '<section class="panel"><h2>' + g.group + '</h2>' +
          g.items.map(function (r) {
            var val = state.reflections[r.id] || "";
            return '<article class="reflection" data-id="' + r.id + '">' +
              '<h3>' + r.title + '</h3>' +
              '<p class="prompt" id="p-' + r.id + '">' + r.prompt + '</p>' +
              '<textarea rows="6" aria-labelledby="p-' + r.id + '">' + esc(val) + '</textarea>' +
              '<div class="print-only print-answer">' + (esc(val) || '&nbsp;') + '</div>' +
              '<div class="reflection-foot no-print">' +
                '<span class="wc">' + wordCount(val) + ' words</span>' +
                '<button class="link-btn consider-btn" aria-expanded="false">Points to consider</button>' +
              '</div>' +
              '<div class="consider" hidden></div>' +
            '</article>';
          }).join("") +
        '</section>';
      }).join("")
    );

    var status = document.getElementById("refl-status");
    var timer = null;
    function flashSaved() {
      status.textContent = "Saved.";
      clearTimeout(timer);
      timer = setTimeout(function () { status.textContent = ""; }, 1500);
    }

    document.getElementById("student-name").addEventListener("input", function (e) {
      state.name = e.target.value;
      saveState();
      main.querySelector(".print-name").textContent = "Name: " + (state.name || "____________________");
    });

    main.querySelectorAll(".reflection").forEach(function (art) {
      var id = art.dataset.id;
      var ta = art.querySelector("textarea");
      var wc = art.querySelector(".wc");
      var printCopy = art.querySelector(".print-answer");
      var btn = art.querySelector(".consider-btn");
      var box = art.querySelector(".consider");

      ta.addEventListener("input", function () {
        state.reflections[id] = ta.value;
        saveState();
        wc.textContent = wordCount(ta.value) + " words";
        printCopy.textContent = ta.value;
        flashSaved();
      });

      var r = all.filter(function (x) { return x.id === id; })[0];
      btn.addEventListener("click", function () {
        if (!box.hidden) {
          box.hidden = true;
          btn.setAttribute("aria-expanded", "false");
          return;
        }
        // Ask for an honest attempt before revealing the key points.
        box.innerHTML = wordCount(ta.value) < 15
          ? '<p class="hint">Write at least 15 words of your own first, then come back.</p>'
          : '<ul>' + r.consider.map(function (c) { return '<li>' + c + '</li>'; }).join("") + '</ul>';
        box.hidden = false;
        btn.setAttribute("aria-expanded", "true");
      });
    });

    function exportText() {
      var lines = [
        "Parliamentary Procedure: Reflection Responses",
        "Virginia Government Simulation",
        "Name: " + (state.name || ""),
        "Date: " + new Date().toLocaleDateString(),
        ""
      ];
      C.reflections.forEach(function (g) {
        lines.push("== " + g.group.toUpperCase() + " ==", "");
        g.items.forEach(function (r) {
          lines.push(r.title, "Q: " + stripTags(r.prompt), "", (state.reflections[r.id] || "(no response)").trim(), "", "");
        });
      });
      return lines.join("\n");
    }

    document.getElementById("download").addEventListener("click", function () {
      var blob = new Blob([exportText()], { type: "text/plain" });
      var a = document.createElement("a");
      var who = (state.name || "student").trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "student";
      a.href = URL.createObjectURL(blob);
      a.download = "reflections-" + who + ".txt";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    });

    document.getElementById("print-refl").addEventListener("click", function () { window.print(); });

    document.getElementById("copy-refl").addEventListener("click", function () {
      var text = exportText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { status.textContent = "Copied to clipboard."; },
          function () { status.textContent = "Couldn't copy. Use Download instead."; });
      } else {
        status.textContent = "Copying isn't supported here. Use Download instead.";
      }
    });

    document.getElementById("clear-refl").addEventListener("click", function () {
      if (!confirm("Erase all of your written answers on this device? This can't be undone.")) return;
      state.reflections = {};
      saveState();
      renderReflect();
    });
  }

  route();
})();
