/*
 * All training content lives in this file so instructors can edit it
 * without touching the app code. Simple HTML (<em>, <strong>, <code>)
 * is allowed inside text fields.
 *
 * Chamber terms used throughout: the "House," presided over by the
 * "Speaker," with members called "Delegates." Change them to match
 * your simulation if needed.
 */
window.CONTENT = {

  /* ------------------------------------------------------------------
   * REFERENCE: motions chart, glossary, and chair's scripts
   * ------------------------------------------------------------------ */
  motions: [
    { group: "Privileged motions", note: "Concern the needs of the body itself. They outrank all other motions, listed here from highest rank to lowest." , items: [
      { name: "Fix the time to which to adjourn", say: "I move that when we adjourn, we adjourn to meet at 9 a.m. tomorrow.", interrupt: "No", second: "Yes", debate: "No", amend: "Yes", vote: "Majority" },
      { name: "Adjourn", say: "I move to adjourn.", interrupt: "No", second: "Yes", debate: "No", amend: "No", vote: "Majority" },
      { name: "Recess", say: "I move to recess for 15 minutes.", interrupt: "No", second: "Yes", debate: "No", amend: "Yes", vote: "Majority" },
      { name: "Raise a question of privilege", say: "Point of personal privilege! (or) I rise to a question of privilege.", interrupt: "Yes", second: "No", debate: "No", amend: "No", vote: "Chair decides" },
      { name: "Call for the orders of the day", say: "I call for the orders of the day.", interrupt: "Yes", second: "No", debate: "No", amend: "No", vote: "None (2/3 to set aside the agenda)" }
    ]},
    { group: "Subsidiary motions", note: "Help the body deal with the main motion (the bill). Listed from highest rank to lowest.", items: [
      { name: "Lay on the table", say: "I move to lay the bill on the table.", interrupt: "No", second: "Yes", debate: "No", amend: "No", vote: "Majority" },
      { name: "Previous question (close debate)", say: "I move the previous question.", interrupt: "No", second: "Yes", debate: "No", amend: "No", vote: "2/3" },
      { name: "Limit or extend debate", say: "I move to limit debate to two minutes per speaker.", interrupt: "No", second: "Yes", debate: "No", amend: "Yes", vote: "2/3" },
      { name: "Postpone to a certain time", say: "I move to postpone the bill until Thursday's session.", interrupt: "No", second: "Yes", debate: "Yes", amend: "Yes", vote: "Majority" },
      { name: "Commit / refer to committee", say: "I move to refer the bill to the Committee on Appropriations.", interrupt: "No", second: "Yes", debate: "Yes", amend: "Yes", vote: "Majority" },
      { name: "Amend", say: "I move to amend by striking \"8:30\" and inserting \"8:00.\"", interrupt: "No", second: "Yes", debate: "If the motion it changes is debatable", amend: "Yes (one level only)", vote: "Majority" },
      { name: "Postpone indefinitely", say: "I move to postpone the bill indefinitely.", interrupt: "No", second: "Yes", debate: "Yes (opens the whole bill to debate)", amend: "No", vote: "Majority" }
    ]},
    { group: "Main motion", note: "Brings business (such as a bill) before the body. It has the lowest rank and can be made only when nothing else is pending.", items: [
      { name: "Main motion / pass a bill", say: "I move that the House pass House Bill 12.", interrupt: "No", second: "Yes*", debate: "Yes", amend: "Yes", vote: "Majority" }
    ]},
    { group: "Incidental motions", note: "Deal with procedure as questions come up. They have no rank among themselves.", items: [
      { name: "Point of order", say: "Point of order!", interrupt: "Yes", second: "No", debate: "No", amend: "No", vote: "Chair rules" },
      { name: "Appeal the decision of the chair", say: "I appeal the decision of the Chair.", interrupt: "Yes", second: "Yes", debate: "Usually", amend: "No", vote: "Majority against reverses; a tie sustains the chair" },
      { name: "Parliamentary inquiry", say: "Parliamentary inquiry: is a motion to refer in order now?", interrupt: "Yes, if urgent", second: "No", debate: "No", amend: "No", vote: "None; chair answers" },
      { name: "Request for information", say: "Point of information: will the delegate yield for a question?", interrupt: "Yes, if urgent", second: "No", debate: "No", amend: "No", vote: "None" },
      { name: "Division of the assembly", say: "Division!", interrupt: "Yes", second: "No", debate: "No", amend: "No", vote: "None; one member can demand it" },
      { name: "Division of a question", say: "I move to divide the question so Section 3 is voted on separately.", interrupt: "No", second: "Yes", debate: "No", amend: "Yes", vote: "Majority" },
      { name: "Suspend the rules", say: "I move to suspend the rules to allow a guest to address the House.", interrupt: "No", second: "Yes", debate: "No", amend: "No", vote: "2/3" },
      { name: "Objection to consideration", say: "I object to the consideration of the question.", interrupt: "Yes, before debate begins", second: "No", debate: "No", amend: "No", vote: "2/3 against consideration" },
      { name: "Withdraw a motion", say: "I ask permission to withdraw my motion.", interrupt: "No", second: "No (if the maker asks)", debate: "No", amend: "No", vote: "Unanimous consent or majority" }
    ]},
    { group: "Motions that bring a question back", note: "Let the body revisit something it already handled.", items: [
      { name: "Take from the table", say: "I move to take House Bill 12 from the table.", interrupt: "No", second: "Yes", debate: "No", amend: "No", vote: "Majority" },
      { name: "Reconsider", say: "Having voted on the prevailing side, I move to reconsider the vote on House Bill 12.", interrupt: "Yes, to make it", second: "Yes", debate: "If the original motion was debatable", amend: "No", vote: "Majority" },
      { name: "Rescind / amend something previously adopted", say: "I move to rescind the resolution adopted on Monday.", interrupt: "No", second: "Yes", debate: "Yes", amend: "Yes", vote: "2/3; or majority with notice; or majority of all members" }
    ]}
  ],
  motionsFootnote: "* Under Robert's Rules, a motion that comes from a committee does not need a second, and many legislatures do not require seconds on bills. Follow your simulation's rules.",

  glossary: [
    ["Assembly / the body", "The whole group of members meeting together, such as the House."],
    ["Chair / presiding officer", "The person running the meeting. In the House, this is the Speaker."],
    ["Floor", "The right to speak. You \"have the floor\" once the chair recognizes you."],
    ["Recognize", "What the chair does to give a member the floor: \"The Chair recognizes the Delegate from Fairfax.\""],
    ["Pending question", "A motion that has been stated by the chair and not yet disposed of."],
    ["Germane", "Closely related to the subject of the motion being amended. Amendments must be germane."],
    ["Quorum", "The minimum number of members who must be present for business to be valid. Unless the rules say otherwise, it is a majority of the members."],
    ["Majority vote", "More than half of the votes cast. Abstentions and blank ballots don't count."],
    ["Two-thirds vote", "At least two-thirds of the votes cast. Quick check: are the \"yes\" votes at least double the \"no\" votes?"],
    ["Unanimous consent", "Adopting something without a formal vote: \"If there is no objection...\" A single objection means a vote must be taken."],
    ["Patron", "In Virginia's General Assembly, the member who introduces a bill."],
    ["Yield", "When a speaker allows another member to ask a question during their time. \"Will the delegate yield?\""],
    ["Dilatory", "Meant only to delay or obstruct. The chair may rule dilatory motions out of order."],
    ["Prevailing side", "The side that won a vote. Only a member who voted on it may move to reconsider."]
  ],

  scripts: [
    { title: "Calling the House to order", lines: [
      "(One tap of the gavel.) The House will come to order.",
      "The Clerk will call the roll.",
      "A quorum being present, the House is ready to proceed to business."
    ]},
    { title: "Handling a motion: the six steps", lines: [
      "1. A member rises and is recognized: \"The Chair recognizes the Delegate from Richmond.\"",
      "2. The member makes the motion: \"I move that...\"",
      "3. Another member seconds it: \"Second!\" (Chair, if needed: \"Is there a second?\")",
      "4. The chair states the question: \"It is moved and seconded that... Is there debate?\"",
      "5. Members debate. The chair alternates between speakers for and against.",
      "6. The chair puts the question and announces the result: \"All those in favor, say 'aye.'... Those opposed, 'no.'... The ayes have it, and the bill is passed.\""
    ]},
    { title: "Ruling on a point of order", lines: [
      "Member: \"Point of order!\"",
      "Chair: \"The delegate will state the point.\"",
      "Chair: \"The Chair rules that the point is well taken. The amendment is not germane and is out of order.\" (or) \"The Chair rules that the point is not well taken. Debate will continue.\""
    ]},
    { title: "Handling an appeal", lines: [
      "Member: \"I appeal the decision of the Chair.\" Another member: \"Second.\"",
      "Chair: \"The decision of the Chair has been appealed. The question is: Shall the decision of the Chair be sustained?\"",
      "Chair (after any debate): \"Those in favor of sustaining the Chair's decision, say 'aye.'... Those opposed, 'no.'... The ayes have it, and the decision of the Chair is sustained.\""
    ]},
    { title: "Unanimous consent", lines: [
      "Chair: \"If there is no objection, the House will recess for ten minutes.\" (Pause.)",
      "Chair: \"Hearing no objection, the House stands in recess for ten minutes.\"",
      "If anyone objects, the chair says: \"Objection is heard,\" and takes a vote."
    ]}
  ],

  /* ------------------------------------------------------------------
   * QUIZ
   * type: "mc" (default) or "order"
   * For "mc", answer is the index of the correct option.
   * For "order", items are listed in the CORRECT order; the app shuffles them.
   * ------------------------------------------------------------------ */
  quiz: [
    { topic: "Basics", q: "In most cases, what must happen before the chair can state a main motion and open debate on it?",
      options: ["It must be seconded by another member", "It must be approved by the Clerk", "It must be read aloud three times", "It must receive a majority vote to be considered"],
      answer: 0,
      explain: "A second shows that at least one other member wants the body to discuss the motion. If no one seconds it, the chair says, \"The motion is not before the House for lack of a second.\" (Motions from a committee don't need a second.)" },

    { topic: "Basics", q: "What is the correct way for a delegate to get the floor?",
      options: ["Begin speaking loudly so the chair notices", "Rise, address the chair (\"Mr./Madam Speaker\"), and wait to be recognized", "Pass a note to the Clerk", "Ask the delegate who is speaking to give up their time"],
      answer: 1,
      explain: "You can't speak in debate until the chair recognizes you. Address the presiding officer by title, then wait. Speaking without recognition is out of order." },

    { topic: "Basics", type: "order", q: "Put the steps for handling a motion in the correct order.",
      items: ["A member is recognized and makes the motion", "Another member seconds the motion", "The chair states the question", "Members debate the motion", "The chair puts the question to a vote", "The chair announces the result"],
      explain: "Recognize, move, second, state, debate, vote, announce. A motion doesn't belong to the body until the chair <em>states</em> it, so debate can't begin before step 3." },

    { topic: "Debate", q: "During debate, to whom should a delegate direct their remarks?",
      options: ["The delegate they disagree with", "The public gallery", "The chair", "Whoever spoke last"],
      answer: 2,
      explain: "All remarks go through the chair. Members also refer to one another by title (\"the Delegate from Norfolk\") and never question one another's motives. These habits keep debate about ideas, not people." },

    { topic: "Debate", q: "Two delegates rise at the same time. Delegate Chen has not spoken on this bill yet; Delegate Brooks already has. Whom should the chair recognize?",
      options: ["Delegate Brooks, who is more senior", "Delegate Chen, who has not yet spoken on this question", "Whoever is louder", "Neither; the chair should call a vote"],
      answer: 1,
      explain: "A member who hasn't spoken on the pending question gets priority over one who has. The chair should also try to alternate between speakers for and against." },

    { topic: "Debate", q: "The Speaker wants to argue in favor of a bill. Under Robert's Rules, what should they do?",
      options: ["Speak from the chair, since the Speaker is also a member", "Hand the gavel to another member (such as the Speaker pro tempore) until the bill is disposed of", "Ask the Clerk to read the Speaker's speech", "Nothing. The Speaker may never take a position"],
      answer: 1,
      explain: "The chair must stay impartial. A presiding officer who wants to join debate gives up the chair and doesn't return until the pending question has been decided." },

    { topic: "Closing debate", q: "Which of these motions requires a two-thirds vote?",
      options: ["Amend", "Refer to committee", "Previous question (close debate)", "Adjourn"],
      answer: 2,
      explain: "Any motion that cuts off or limits members' right to debate needs a two-thirds vote. That protects the minority's right to be heard. Amend, refer, and adjourn each need a majority." },

    { topic: "Closing debate", q: "A delegate shouts, \"Call the question!\" from their seat without being recognized. What happens?",
      options: ["Debate ends immediately and the vote is taken", "Nothing automatically. The member must be recognized and move the previous question, which needs a second and a two-thirds vote", "The chair must hold a majority vote on ending debate", "The bill is withdrawn"],
      answer: 1,
      explain: "One member can't end debate by shouting. Closing debate takes the motion for the previous question, made by a recognized member, seconded, and adopted by two-thirds without debate. The chair may also ask, \"Is there any objection to closing debate?\"" },

    { topic: "Closing debate", q: "The vote on the previous question is 54 in favor and 29 opposed. What is the result?",
      options: ["Adopted: it has a majority", "Adopted: 54 is more than half of 100", "Fails: 54 is less than two-thirds of the votes cast", "It's a tie, so the Speaker decides"],
      answer: 2,
      explain: "Two-thirds of 83 votes cast is about 55.3, so 56 \"yes\" votes are needed. Quick check: are the \"yes\" votes at least double the \"no\" votes? 2 × 29 = 58, and 54 is less than that. The motion fails and debate continues." },

    { topic: "Amendments", q: "Pending are: a bill, an amendment to the bill, and an amendment to that amendment. Which is voted on first?",
      options: ["The bill", "The first (primary) amendment", "The amendment to the amendment (secondary)", "All three at once"],
      answer: 2,
      explain: "Motions are voted on in reverse order from how they were made. That means the secondary amendment first, then the primary amendment (as changed), and then the bill." },

    { topic: "Amendments", q: "A secondary amendment (an amendment to an amendment) is pending. A delegate moves to amend the secondary amendment. The chair should rule:",
      options: ["In order; there is no limit", "Out of order; amendments can go only two levels deep", "In order if it's seconded twice", "In order only with unanimous consent"],
      answer: 1,
      explain: "There can be a primary amendment and a secondary amendment, but no third level. A member who dislikes the secondary amendment can argue and vote against it, then offer their own version afterward." },

    { topic: "Amendments", q: "The House is debating a bill about school bus safety. A delegate moves to amend it by adding a gas tax increase. A member says \"Point of order!\" What is the most likely ruling?",
      options: ["Point not well taken; any amendment is allowed", "Point well taken; the amendment is not germane", "The bill must be withdrawn", "The amendment passes automatically"],
      answer: 1,
      explain: "Amendments must be <em>germane</em>, meaning closely related to the subject of the bill. A tax increase in a bus-safety bill brings in a new question and is out of order." },

    { topic: "Amendments", q: "Which is the best way to word an amendment?",
      options: ["\"I think the bill should be more reasonable.\"", "\"I move to amend Section 1 by striking '8:30 a.m.' and inserting '8:00 a.m.'\"", "\"I object to the start time.\"", "\"Can we change this to something better?\""],
      answer: 1,
      explain: "A good amendment names the exact place and change: <em>insert</em>, <em>strike out</em>, or <em>strike out and insert</em>. Members and the Clerk need to know exactly what they are voting on." },

    { topic: "Disposing of bills", q: "What is the effect of adopting a motion to postpone indefinitely?",
      options: ["The bill is delayed to the next session", "The bill is killed without a direct vote on it", "The bill is sent to committee", "The bill passes without debate"],
      answer: 1,
      explain: "Despite its name, postpone indefinitely kills the main motion for the rest of the session. It needs only a majority, and because it would kill the bill, debate on it can cover the bill's merits." },

    { topic: "Disposing of bills", q: "Under Robert's Rules, what is the proper use of the motion to lay on the table?",
      options: ["To kill a bill quietly", "To set a bill aside temporarily so something urgent can be handled", "To end debate", "To send a bill to committee"],
      answer: 1,
      explain: "Tabling is meant for temporarily setting business aside. Using it to kill a bill is improper because it does so by majority vote with no debate. (Some legislatures use \"table\" differently, so check your simulation's rules.)" },

    { topic: "Disposing of bills", q: "A bill needs more study and a cost estimate before the House votes on it. Which motion fits best?",
      options: ["Adjourn", "Commit (refer) to a committee", "Previous question", "Division of the assembly"],
      answer: 1,
      explain: "Referring a bill to committee sends it to a smaller group to study and report back. You can add instructions, for example: \"...with instructions to report a fiscal impact statement by Thursday.\"" },

    { topic: "Chair & rules", q: "A delegate believes the Speaker has made a mistake applying the rules. What should the delegate say?",
      options: ["\"Point of order!\"", "\"Point of information!\"", "\"Division!\"", "\"I move to adjourn.\""],
      answer: 0,
      explain: "A point of order calls attention to a breach of the rules. It can interrupt a speaker, needs no second, and the chair rules on it right away." },

    { topic: "Chair & rules", q: "The chair rules on a point of order. A delegate disagrees. On an appeal, the vote is 42 to sustain the chair and 42 against. What happens?",
      options: ["The chair's ruling is reversed", "The chair's ruling stands", "The Clerk breaks the tie", "The vote is taken again until someone wins"],
      answer: 1,
      explain: "Reversing the chair takes a majority voting against the ruling. A tie isn't a majority, so the decision of the chair is sustained." },

    { topic: "Chair & rules", q: "You are confused about which motion is in order right now. What should you say?",
      options: ["\"Point of order!\"", "\"Parliamentary inquiry.\"", "\"I appeal the decision of the Chair.\"", "\"Division!\""],
      answer: 1,
      explain: "A parliamentary inquiry is a question to the chair about procedure. The chair's answer is an opinion, not a ruling, so it can't be appealed." },

    { topic: "Voting", q: "After a voice vote, the Speaker announces \"The ayes have it,\" but you think it was close. What can you do?",
      options: ["Nothing; the chair's announcement is final", "Call \"Division!\", which requires a rising or counted vote", "Move to reconsider immediately", "Ask for a second on your objection"],
      answer: 1,
      explain: "Any single member can demand a division. It needs no second and no vote, and the chair must retake the vote by a rising or counted method." },

    { topic: "Voting", q: "Under Robert's Rules, what is a majority vote?",
      options: ["More than half of all members", "More than half of the votes cast, not counting abstentions", "Half of the members present", "Whatever the chair decides"],
      answer: 1,
      explain: "A majority is more than half of the votes cast by members present and voting. Abstentions don't count. Some votes in real legislatures use a different base, such as a majority of all members elected." },

    { topic: "Voting", q: "If 43 of 100 delegates are present and the quorum is a majority of members, what may the House do?",
      options: ["Debate bills but not vote", "Pass bills only by unanimous consent", "Only a few things, such as adjourn, recess, or take steps to get a quorum", "Vote to waive the quorum requirement"],
      answer: 2,
      explain: "Without a quorum, the House can't do business. It may only fix the time to which to adjourn, adjourn, recess, or take steps to get a quorum. The quorum requirement can't be waived, even by unanimous consent." },

    { topic: "Bringing back", q: "A bill passed 51–49 earlier today. Who may move to reconsider the vote?",
      options: ["Any delegate", "Only a delegate who voted against the bill", "Only a delegate who voted for the bill (the prevailing side)", "Only the Speaker"],
      answer: 2,
      explain: "Only a member who voted on the winning side may move to reconsider. This prevents the losing side from forcing the same vote over and over. Under Robert's Rules, the motion must be made the same day or the next meeting day of the session." },

    { topic: "Special motions", q: "A delegate moves to suspend the rules so a former governor can address the House. The vote is 60 yes and 32 no. What is the result?",
      options: ["Adopted: majority in favor", "Fails: suspending the rules requires two-thirds", "Adopted: the Speaker decides guest speakers", "Fails: this motion can't be made"],
      answer: 1,
      explain: "Suspending the rules takes two-thirds. Two-thirds of 92 votes cast is about 61.3, so 62 \"yes\" votes are needed. Quick check: 2 × 32 = 64, and 60 is less than that. It fails." },

    { topic: "Special motions", q: "In the middle of debate, the microphones in the back of the chamber stop working. What should a delegate there say?",
      options: ["\"Point of personal privilege!\" (a question of privilege)", "\"I move the previous question.\"", "\"I move to lay the bill on the table.\"", "\"I appeal the decision of the Chair.\""],
      answer: 0,
      explain: "A question of privilege deals with the comfort, safety, or rights of the members, such as not being able to hear. It can interrupt a speaker and is handled right away." }
  ],

  /* ------------------------------------------------------------------
   * ROLE-PLAY SCENARIOS
   * Step types:
   *   choice: pick the best option; feedback shown; must find correct to continue
   *   script: student writes their own line, then compares with a model
   * ------------------------------------------------------------------ */
  scenarios: [
    {
      id: "first-bill",
      title: "Presiding Over Your First Bill",
      role: "Speaker of the House",
      minutes: 12,
      summary: "Gavel the House to order, deal with a missing quorum, and guide House Bill 12 from the motion to the final vote.",
      steps: [
        { type: "script",
          narration: "It's 9:00 a.m. on the first day of session. Delegates are standing in the aisles, talking. You walk to the rostrum and pick up the gavel.",
          prompt: "Write exactly what you say to open the session.",
          model: "(One firm tap of the gavel.) The House will come to order. The Clerk will call the roll.",
          tips: ["One tap of the gavel is enough. Wait for quiet instead of shouting over the noise.", "Your first job is to find out whether a quorum is present, so ask the Clerk to call the roll."] },

        { type: "choice",
          narration: "The Clerk reports: \"Mr./Madam Speaker, 43 of 100 delegates are present.\" Your rules set the quorum as a majority of members.",
          prompt: "What do you do?",
          options: [
            { text: "Proceed with debate but hold off on votes until more delegates arrive.", correct: false, feedback: "Debating a bill is still business, and business without a quorum isn't valid." },
            { text: "Announce that no quorum is present, and recess briefly while members are found.", correct: true, feedback: "Right. Without a quorum, the House may only adjourn, recess, fix the time to adjourn, or take steps to get a quorum." },
            { text: "Ask the delegates present to vote to waive the quorum.", correct: false, feedback: "A quorum requirement can't be waived, even by unanimous consent. It protects the members who are absent." },
            { text: "Count the pages and visitors in the gallery toward the quorum.", correct: false, feedback: "Only members count toward a quorum." }
          ] },

        { type: "choice",
          narration: "After a short recess, 88 delegates are present. First on the calendar is <strong>HB 12</strong>, which would require one semester of personal finance for high school graduation. Delegate Alvarez is recognized: \"Mr./Madam Speaker, I move that the House pass House Bill 12.\" The chamber is silent.",
          prompt: "What do you say? (For this simulation, assume bills need a second.)",
          options: [
            { text: "\"Is there a second?\"", correct: true, feedback: "Right. Give members a chance to second. If no one does, announce, \"The motion is not before the House for lack of a second,\" and move on." },
            { text: "\"The motion fails.\"", correct: false, feedback: "Too fast. You haven't asked for a second yet, and a motion isn't voted on before it's stated." },
            { text: "\"Debate is now open.\"", correct: false, feedback: "Debate can't start until the motion has been seconded and you have stated it." },
            { text: "\"All those in favor, say 'aye.'\"", correct: false, feedback: "A vote comes at the end, after the motion is seconded, stated, and debated." }
          ] },

        { type: "choice",
          narration: "Delegate Baker calls out, \"Second!\"",
          prompt: "What comes next?",
          options: [
            { text: "\"It is moved and seconded that House Bill 12 be passed. The Chair recognizes the patron, Delegate Alvarez, to open debate.\"", correct: true, feedback: "Right. Stating the question formally puts the bill before the House. The member who made the motion is entitled to speak first." },
            { text: "\"The Chair recognizes Delegate Baker, who seconded the bill.\"", correct: false, feedback: "Seconding a motion gives no special right to speak. The maker of the motion (here, the patron) speaks first." },
            { text: "\"We'll vote right away since it was seconded.\"", correct: false, feedback: "Members have a right to debate a debatable motion. You need to state the question and open debate first." },
            { text: "\"Delegate Alvarez, please explain why you made this motion before I accept it.\"", correct: false, feedback: "The chair doesn't decide whether to accept an in-order motion. State it, then let the patron explain it in debate." }
          ] },

        { type: "choice",
          narration: "Debate is underway. Delegate Brooks, who already spoke on HB 12, and Delegate Chen, who has not, rise at the same moment.",
          prompt: "Whom do you recognize?",
          options: [
            { text: "Delegate Brooks, who rose first last time.", correct: false, feedback: "Members who haven't spoken on the question get priority over those who have." },
            { text: "Delegate Chen, who hasn't spoken on this bill yet.", correct: true, feedback: "Right. Give priority to members who haven't spoken yet, and try to alternate between speakers for and against." },
            { text: "Neither. Call a vote, since two people want to speak.", correct: false, feedback: "Members who want to debate have a right to be heard. Recognize one of them." }
          ] },

        { type: "choice",
          narration: "Later, Delegate Brooks gets the floor again and says: \"Delegate Alvarez only filed this bill because his brother sells financial-planning software!\" The chamber erupts.",
          prompt: "How do you respond?",
          options: [
            { text: "Let it go. Debate should be free.", correct: false, feedback: "Free debate still has limits. Attacking a member's motives is out of order, and the chair has to step in." },
            { text: "Gavel and say: \"The delegate will suspend. Members will address the Chair and will not question the motives of other members. The delegate may continue on the merits of the bill.\"", correct: true, feedback: "Right. Stay calm and firm, remind members of the rule, and steer debate back to the bill itself." },
            { text: "Recognize Delegate Alvarez to respond right away.", correct: false, feedback: "That turns debate into a personal exchange. Enforce decorum first." },
            { text: "Order Delegate Brooks removed from the chamber.", correct: false, feedback: "That's far too strong for a first offense. Start with a call to order, and save stronger steps for members who keep it up." }
          ] },

        { type: "choice",
          narration: "Delegate Dunn shouts from their seat without being recognized: \"Call the question!\"",
          prompt: "What do you do?",
          options: [
            { text: "\"Debate is closed. We'll now vote on the bill.\"", correct: false, feedback: "One member can't close debate. That takes a two-thirds vote." },
            { text: "\"The delegate is not recognized.\" Then, if Dunn properly gets the floor and moves the previous question with a second: \"The previous question is moved. It is not debatable and requires a two-thirds vote.\"", correct: true, feedback: "Right. Closing debate takes a recognized member, a second, and a two-thirds vote with no debate." },
            { text: "\"Is there objection? Hearing some, we'll take a majority vote on ending debate.\"", correct: false, feedback: "Asking for unanimous consent is fine, but once someone objects, ending debate needs two-thirds, not a majority." },
            { text: "\"Debate is now open on whether to close debate.\"", correct: false, feedback: "The previous question isn't debatable. Debating it would defeat its purpose." }
          ] },

        { type: "choice",
          narration: "Dunn properly moves the previous question, and it is seconded. The vote: <strong>54 in favor, 29 opposed</strong>.",
          prompt: "What do you announce?",
          options: [
            { text: "\"The motion is adopted. Debate is closed.\"", correct: false, feedback: "54 is a majority, but this motion needs two-thirds. Is 54 at least double 29?" },
            { text: "\"There being less than two-thirds in the affirmative, the motion fails. Debate continues.\"", correct: true, feedback: "Right. 2 × 29 = 58, and 54 is less than 58, so the motion fails. Debate continues." },
            { text: "\"It's too close to call. The Speaker will break the tie.\"", correct: false, feedback: "It isn't a tie. Count the votes against the two-thirds requirement." }
          ] },

        { type: "script",
          narration: "Eventually, no one else seeks recognition.",
          prompt: "Write what you say to close debate and take a voice vote on HB 12, including the result. (Assume the ayes win.)",
          model: "Is there any further debate? (Pause.) Hearing none, the question is on the passage of House Bill 12. All those in favor, say \"aye.\" (Pause.) All those opposed, say \"no.\" (Pause.) The ayes have it, and House Bill 12 is passed.",
          tips: ["Always call for both the ayes and the nos.", "Announce who won <em>and</em> the effect: \"...and House Bill 12 is passed.\"", "Many real legislatures require a recorded vote on final passage. Use whatever method your simulation requires."] },

        { type: "choice",
          narration: "Before you move on, Delegate Ellis rises: \"Division!\"",
          prompt: "What do you do?",
          options: [
            { text: "\"Is there a second for the division?\"", correct: false, feedback: "A division needs no second. One member can demand it." },
            { text: "Take the vote again by a rising or counted vote.", correct: true, feedback: "Right. \"A division has been called. Those in favor will rise and remain standing until counted...\"" },
            { text: "\"The voice vote was clear, so the request is denied.\"", correct: false, feedback: "Any single member may demand a division on a voice vote. The chair may refuse only if it's clearly being used to stall." },
            { text: "\"We'll vote on whether to have a division.\"", correct: false, feedback: "No vote is needed. The demand of one member is enough." }
          ] }
      ],
      debrief: [
        "Which moment felt hardest to handle as Speaker, and why?",
        "How did enforcing rules (quorum, second, two-thirds) protect members who were outnumbered?"
      ]
    },

    {
      id: "amendment",
      title: "The Amendment Game",
      role: "Delegate (floor member)",
      minutes: 12,
      summary: "Propose a change to a bill, deal with amendments stacked on top of yours, and defend the House against an off-topic amendment.",
      steps: [
        { type: "choice",
          narration: "The House is debating <strong>HB 30, the School Start Time Act</strong>. <em>Section 1</em>: \"Public high schools shall begin instruction no earlier than 8:30 a.m.\" <em>Section 2</em>: \"This act takes effect July 1, 2027.\" You support the idea but think 8:30 is too late for families. You want to propose 8:00 a.m.",
          prompt: "How do you start?",
          options: [
            { text: "Stand up and call out your amendment while another delegate is speaking.", correct: false, feedback: "You can't interrupt a speaker to make an amendment. Wait for the floor." },
            { text: "Rise when the floor is open, say \"Mr./Madam Speaker,\" and wait to be recognized.", correct: true, feedback: "Right. Address the chair and wait until the chair recognizes you by name or district." },
            { text: "Walk to the Clerk and ask them to add your amendment to the bill.", correct: false, feedback: "The Clerk records the House's decisions but can't change a bill. Only the House can, by voting on an amendment." }
          ] },

        { type: "choice",
          narration: "\"The Chair recognizes the Delegate from Roanoke.\"",
          prompt: "Which wording is best?",
          options: [
            { text: "\"I move that we make the bill more reasonable for families.\"", correct: false, feedback: "Too vague. Members need to know exactly which words change." },
            { text: "\"I move to amend House Bill 30, Section 1, by striking '8:30 a.m.' and inserting '8:00 a.m.'\"", correct: true, feedback: "Right. It's precise: it names the place, the words to strike, and the words to insert." },
            { text: "\"I object to Section 1.\"", correct: false, feedback: "An objection isn't a motion. If you want to change the text, move to amend it." },
            { text: "\"I move to substitute an entirely new bill.\"", correct: false, feedback: "A substitute replaces the whole text, which is far more than you need to change one time." }
          ] },

        { type: "script",
          narration: "Practice it out loud.",
          prompt: "Write your amendment motion in your own words, as you would say it on the floor.",
          model: "Mr./Madam Speaker, I move to amend House Bill 30, Section 1, by striking \"8:30 a.m.\" and inserting \"8:00 a.m.\"",
          tips: ["Use one of the three forms: <em>insert</em>, <em>strike out</em>, or <em>strike out and insert</em>.", "Hand a written copy to the Clerk if your simulation allows it."] },

        { type: "choice",
          narration: "Your amendment is seconded and stated. Delegate Fox is recognized: \"I move to amend the amendment by striking '8:00' and inserting '8:15.'\"",
          prompt: "Is Fox's motion in order?",
          options: [
            { text: "Yes. It's a secondary amendment, an amendment to your amendment.", correct: true, feedback: "Right. Amendments can go two levels deep: a primary amendment to the bill and a secondary amendment to the primary." },
            { text: "No. Only one amendment can be pending at a time.", correct: false, feedback: "One primary and one secondary amendment can be pending at once." },
            { text: "No. Only the patron of the bill may amend it.", correct: false, feedback: "Any member may offer an amendment." }
          ] },

        { type: "choice",
          narration: "While Fox's amendment is pending, Delegate Grant moves \"to amend Delegate Fox's amendment by striking '8:15' and inserting '8:10.'\"",
          prompt: "How should the Speaker rule?",
          options: [
            { text: "In order. It's another secondary amendment.", correct: false, feedback: "Grant is amending the secondary amendment. That would be a third level, which isn't allowed." },
            { text: "Out of order. A third-level amendment isn't allowed. Grant can vote against Fox's amendment and offer a new one afterward.", correct: true, feedback: "Right. Once Fox's amendment is decided, a new secondary amendment (such as 8:10) can be offered." }
          ] },

        { type: "choice",
          narration: "Delegate Hill rises: \"I'd like to amend Section 2 to change the effective date to 2028.\"",
          prompt: "What should happen?",
          options: [
            { text: "Hill's amendment is added to the stack immediately.", correct: false, feedback: "Only one primary amendment can be pending at a time, and yours is already pending." },
            { text: "Hill must wait until your amendment (and Fox's) is decided, then can offer the date change.", correct: true, feedback: "Right. Amendments are handled one at a time. Hill's turn comes once the current amendments are decided." }
          ] },

        { type: "choice",
          narration: "Debate on the amendments winds down.",
          prompt: "In what order will the House vote?",
          options: [
            { text: "Your amendment, then Fox's amendment, then the bill.", correct: false, feedback: "Votes go in reverse order. The last motion made is decided first." },
            { text: "Fox's amendment (8:15), then your amendment (as changed or not), then later the bill.", correct: true, feedback: "Right. The secondary amendment comes first, then the primary. After that, more amendments can be offered before the final vote on the bill." },
            { text: "The bill first; amendments only if the bill passes.", correct: false, feedback: "Amendments are decided before the bill, so members know what they're passing." }
          ] },

        { type: "choice",
          narration: "Later, Delegate Ivy moves to amend HB 30 by adding a new Section 3: \"Cell phones are prohibited in all state government buildings.\"",
          prompt: "What do you do?",
          options: [
            { text: "Vote no and say nothing.", correct: false, feedback: "Voting no is allowed, but the amendment shouldn't be before the House at all. Members should say so." },
            { text: "Rise to a point of order that the amendment is not germane.", correct: true, feedback: "Right. Cell phones in state buildings have nothing to do with school start times. A point of order asks the chair to rule it out of order." },
            { text: "Move to adjourn so the amendment can't be voted on.", correct: false, feedback: "That's a blunt tool that stops all business. A point of order targets the actual problem." }
          ] },

        { type: "script",
          narration: "You rise immediately.",
          prompt: "Write your point of order.",
          model: "Point of order, Mr./Madam Speaker. The amendment is not germane. House Bill 30 deals with school start times, and the amendment concerns cell phones in state buildings.",
          tips: ["State the rule being broken and why. Keep it short.", "A point of order can interrupt a speaker and needs no second."] },

        { type: "choice",
          narration: "The Speaker rules: \"The point is not well taken. The amendment is in order.\" You are sure the ruling is wrong.",
          prompt: "What is your best move?",
          options: [
            { text: "Keep arguing with the Speaker until they change their mind.", correct: false, feedback: "Arguing with the chair is out of order. The rules give you a formal way to challenge a ruling." },
            { text: "\"I appeal the decision of the Chair.\"", correct: true, feedback: "Right. With a second, the House votes on whether to sustain the ruling. An appeal must be made right away, before other business intervenes." },
            { text: "Walk out in protest.", correct: false, feedback: "Leaving takes away your vote and doesn't fix the ruling." },
            { text: "Move to remove the Speaker from office.", correct: false, feedback: "That's an extreme step for one disputed ruling. An appeal is the right tool." }
          ] },

        { type: "choice",
          narration: "Your appeal is seconded. The question is \"Shall the decision of the Chair be sustained?\" The vote: <strong>42 yes, 42 no</strong>.",
          prompt: "What is the result?",
          options: [
            { text: "The chair's ruling is overturned. Half the House disagreed.", correct: false, feedback: "Overturning takes a majority voting against the chair. A tie isn't a majority." },
            { text: "The chair's ruling stands. A tie sustains the chair.", correct: true, feedback: "Right. The amendment stays in order, but you can still argue and vote against it." }
          ] }
      ],
      debrief: [
        "Why do you think amendments are limited to two levels?",
        "When is it better to vote down an amendment than to raise a point of order against it?"
      ]
    },

    {
      id: "strategy",
      title: "Delay, Refer, or Defeat?",
      role: "Delegate (minority party)",
      minutes: 10,
      summary: "Your side doesn't have the votes. Use the rules wisely to slow down, improve, or stop a bill you oppose.",
      steps: [
        { type: "choice",
          narration: "<strong>HB 77</strong> would move all state agencies to a four-day work week. You think the idea deserves study, but no one knows what it would cost.",
          prompt: "What motion fits your goal best?",
          options: [
            { text: "Refer the bill to the Committee on Appropriations.", correct: true, feedback: "Right. Committees exist to study details. Sending the bill there doesn't kill it." },
            { text: "Move the previous question.", correct: false, feedback: "That ends debate and forces a vote, which is the opposite of more study." },
            { text: "Move to adjourn.", correct: false, feedback: "That only ends today's meeting. The bill will still be there next time." },
            { text: "Call for a division.", correct: false, feedback: "A division retakes a vote that was just held. It isn't a way to handle a bill." }
          ] },

        { type: "script",
          narration: "You're recognized.",
          prompt: "Write a motion to refer HB 77 to committee, with instructions to report back with a cost estimate.",
          model: "Mr./Madam Speaker, I move that House Bill 77 be referred to the Committee on Appropriations, with instructions to report back with a fiscal impact statement by Thursday.",
          tips: ["Name the committee.", "Instructions (such as a deadline or a specific task) make the referral more useful and more likely to pass."] },

        { type: "choice",
          narration: "The motion to refer fails, 45 to 50. Debate on HB 77 continues, and you now want to stop the bill this session.",
          prompt: "Which motion kills the bill without a direct vote on it?",
          options: [
            { text: "Lay on the table", correct: false, feedback: "Robert's Rules says tabling is only for temporarily setting business aside. Using it to kill a bill is improper." },
            { text: "Postpone indefinitely", correct: true, feedback: "Right. It needs only a majority, and if adopted, the bill is dead for the session." },
            { text: "Previous question", correct: false, feedback: "That only ends debate. The bill still gets voted on." },
            { text: "Recess", correct: false, feedback: "A recess is just a short break." }
          ] },

        { type: "choice",
          narration: "Your motion to postpone indefinitely is seconded. A teammate whispers: \"Can we still talk about why the bill is bad, or only about postponing?\"",
          prompt: "What do you tell them?",
          options: [
            { text: "Only about whether to postpone.", correct: false, feedback: "For most motions that's true, but this one is different." },
            { text: "The whole bill is open to debate, since this motion would kill it.", correct: true, feedback: "Right. Debate on postpone indefinitely can cover the merits of the bill itself." }
          ] },

        { type: "choice",
          narration: "Postponing fails. Supporters move the previous question to end debate. All 100 delegates are present and will vote. You count your allies.",
          prompt: "What is the smallest number of \"no\" votes that will block the previous question?",
          options: [
            { text: "51", correct: false, feedback: "That's a majority, but you don't need one to block a two-thirds vote." },
            { text: "34", correct: true, feedback: "Right. With 34 no, the most yes votes is 66. 66 is less than double 34 (68), so the motion fails. With only 33 no, yes would be 67, which is more than double 33 (66), so it passes." },
            { text: "67", correct: false, feedback: "67 would be the yes votes needed to pass it. You're blocking it." },
            { text: "50", correct: false, feedback: "That's more than you need. Two-thirds rules let a large minority (just over one-third) block." }
          ] },

        { type: "choice",
          narration: "Debate continues for a while, but HB 77 eventually passes, 51 to 49. You voted no. Delegate Kim, who voted yes, tells you after the vote that they now have doubts.",
          prompt: "Who can move to reconsider the vote?",
          options: [
            { text: "You, because you lost.", correct: false, feedback: "Only a member who voted on the prevailing (winning) side may move to reconsider." },
            { text: "Delegate Kim, because they voted on the prevailing side.", correct: true, feedback: "Right. Kim must make the motion the same day or the next meeting day of the session (under Robert's Rules)." },
            { text: "Any member, at any time.", correct: false, feedback: "Without limits on who can make it and when, losers could force the same vote over and over." }
          ] },

        { type: "choice",
          narration: "Kim moves to reconsider, and the motion is seconded and adopted.",
          prompt: "What happens to HB 77 now?",
          options: [
            { text: "It's defeated automatically.", correct: false, feedback: "Reconsidering doesn't reverse the vote. It reopens the question." },
            { text: "It returns to where it was right before the vote, and the House debates and votes on it again.", correct: true, feedback: "Right. Now you have another chance to persuade the House." }
          ] }
      ],
      debrief: [
        "Which tool did the most to protect the minority in this scenario?",
        "Is there a point where using procedure to delay becomes unfair? Where would you draw the line?"
      ]
    },

    {
      id: "rapid-fire",
      title: "Rapid Fire: Interruptions",
      role: "Speaker of the House",
      minutes: 8,
      summary: "Privileges, inquiries, recesses, stalling, and adjournment: handle the interruptions that come up in every session.",
      steps: [
        { type: "choice",
          narration: "In the middle of a speech, Delegate Lopez jumps up: \"Point of personal privilege! The microphones in the back aren't working, and we can't hear the debate.\"",
          prompt: "What do you do?",
          options: [
            { text: "Rule Lopez out of order for interrupting.", correct: false, feedback: "A question of privilege about members being able to hear is allowed to interrupt." },
            { text: "Handle it right away: ask staff to fix the microphones and ask speakers to speak up, then return to debate.", correct: true, feedback: "Right. Questions of privilege about members' comfort and ability to take part are dealt with at once." },
            { text: "Ask for a second and a vote.", correct: false, feedback: "A question of privilege needs no second. The chair usually just takes care of it." }
          ] },

        { type: "choice",
          narration: "Delegate Moore rises: \"Parliamentary inquiry. If we refer this bill to committee, can it still come back this session?\"",
          prompt: "How do you respond?",
          options: [
            { text: "Answer the procedural question briefly and neutrally.", correct: true, feedback: "Right. Answering parliamentary inquiries is part of the chair's job. The answer is an opinion, not a ruling, so it can't be appealed." },
            { text: "\"Is there a second?\"", correct: false, feedback: "An inquiry isn't a motion and needs no second." },
            { text: "Refuse. The chair doesn't give advice.", correct: false, feedback: "The chair should help members understand procedure. Just don't give advice on strategy or on the merits of the bill." }
          ] },

        { type: "choice",
          narration: "Delegate Nash interrupts a speaker: \"Will the delegate yield for a question?\"",
          prompt: "What do you say?",
          options: [
            { text: "\"The delegate must yield.\"", correct: false, feedback: "The speaker controls their own time and may decline." },
            { text: "\"Does the delegate yield?\" Then follow the speaker's answer.", correct: true, feedback: "Right. All questions go through the chair, and the speaker decides whether to answer." },
            { text: "\"Delegate Nash, you may now speak.\"", correct: false, feedback: "Nash hasn't been given the floor. They can ask one question only if the speaker agrees." }
          ] },

        { type: "choice",
          narration: "At 11:55, with a bill still pending, Delegate Ortiz moves \"to recess until 1:00 p.m.\" It is seconded. Someone else wants to debate whether lunch should be shorter.",
          prompt: "How do you handle it?",
          options: [
            { text: "\"The motion to recess is not debatable, but the length may be amended. Is there an amendment? ... All those in favor of recessing until 1:00...\"", correct: true, feedback: "Right. A privileged motion to recess isn't debatable but can be amended (for example, changing the time). It needs a majority." },
            { text: "\"Out of order. We can't recess while a bill is pending.\"", correct: false, feedback: "Privileged motions like recess outrank the pending bill and are in order." },
            { text: "\"Debate on the recess is open.\"", correct: false, feedback: "A motion to recess made while business is pending isn't debatable." }
          ] },

        { type: "choice",
          narration: "After lunch, Delegate Park moves to suspend the rules so a former governor visiting the gallery can address the House. The vote: <strong>60 yes, 32 no</strong>.",
          prompt: "What do you announce?",
          options: [
            { text: "\"The motion is adopted.\"", correct: false, feedback: "Suspending the rules needs two-thirds. Is 60 at least double 32?" },
            { text: "\"There being less than two-thirds in the affirmative, the motion fails.\"", correct: true, feedback: "Right. 2 × 32 = 64, and 60 is less than 64. (Tip: a chair could ask for unanimous consent first, since many members may happily agree.)" }
          ] },

        { type: "choice",
          narration: "Delegate Reyes has made five points of order in ten minutes. Each one is clearly frivolous, and the House is getting nothing done.",
          prompt: "What should you do?",
          options: [
            { text: "Keep ruling on each one; members always have this right.", correct: false, feedback: "Members do have this right, but not to abuse it. The chair is expected to protect the House from stalling." },
            { text: "Calmly rule further frivolous points dilatory and out of order, and warn the delegate.", correct: true, feedback: "Right. The chair may refuse to entertain motions made only to delay. Be fair: if you're wrong, members can appeal." },
            { text: "Turn off the delegate's microphone for the rest of the session.", correct: false, feedback: "That's too severe and denies a member their rights. Start by ruling dilatory points out of order." }
          ] },

        { type: "script",
          narration: "It's 4:00 p.m. Delegate Quinn moves to adjourn; it is seconded and adopted by voice vote. Tomorrow's session begins at 9:00 a.m.",
          prompt: "Write what you say to announce the result and close the session.",
          model: "The ayes have it, and the House stands adjourned until 9:00 a.m. tomorrow. (One tap of the gavel.)",
          tips: ["Before taking the vote, make sure important announcements (committee meetings, tomorrow's schedule) have been made.", "The session isn't over until the chair announces it."] }
      ],
      debrief: [
        "Which interruptions are allowed to stop a speaker mid-sentence, and why those?",
        "How can a chair be firm about stalling without being unfair to the minority?"
      ]
    }
  ],

  /* ------------------------------------------------------------------
   * LIVE SESSION (in-class role-play)
   * ------------------------------------------------------------------ */
  live: {
    intro: "Run a 30 to 45 minute mock floor session with your class. Print the bill and the role cards, hand the cards out (some are secret), and let the Speaker run the House. Swap roles and repeat with the second bill.",
    bills: [
      { number: "HB 101", title: "Virginia School Food Donation Act",
        patron: "Patron: Delegate ______",
        sections: [
          "<strong>§ 1.</strong> Each public school cafeteria shall donate edible, unserved food to a local food bank or nonprofit at least once per week, when such food is available.",
          "<strong>§ 2.</strong> No school division or employee shall be liable for any injury from donated food given in good faith, except for gross negligence.",
          "<strong>§ 3.</strong> Each school division shall report the pounds of food donated to the Department of Education by June 30 of each year.",
          "<strong>§ 4.</strong> This act shall take effect July 1, 2027."
        ] },
      { number: "HB 102", title: "Virginia Permanent Standard Time Act",
        patron: "Patron: Delegate ______",
        sections: [
          "<strong>§ 1.</strong> The Commonwealth of Virginia shall observe standard time year-round and shall not observe daylight saving time.",
          "<strong>§ 2.</strong> The Governor shall notify the U.S. Department of Transportation of this change.",
          "<strong>§ 3.</strong> This act shall take effect on the first Sunday of November 2027."
        ] }
    ],
    roles: [
      { name: "Speaker", secret: false, card: "Run the session fairly. Call to order, check the quorum, recognize speakers (alternate for and against), enforce decorum, rule on points of order, and announce every result clearly. Keep the Reference page open." },
      { name: "Clerk", secret: false, card: "Call the roll, read each bill by number and title, keep a written record of every motion and its result, and count votes when asked." },
      { name: "Patron", secret: false, card: "You introduced the bill. Move its passage, give the opening speech (1 minute), and defend it. Decide which amendments you can accept." },
      { name: "Opposition Leader", secret: true, card: "SECRET: Defeat the bill. First try to refer it to committee. If that fails, move to postpone indefinitely. Organize your allies to block the previous question (you need just over one-third)." },
      { name: "Amender", secret: true, card: "SECRET: You support the bill only if it changes. Offer one amendment (change the effective date, or add or strike a section). Write it in proper strike-and-insert form first." },
      { name: "Rules Hawk", secret: true, card: "SECRET: Watch closely for mistakes: no second, speaking without recognition, non-germane amendments, a wrong vote count. Raise at least one valid point of order. If the Speaker rules wrongly, appeal." },
      { name: "Off-Topic Amender", secret: true, card: "SECRET: Offer an amendment that is NOT germane (for example, adding a new state holiday). See whether the House catches it." },
      { name: "Debate Closer", secret: true, card: "SECRET: When you think debate has gone on long enough, get recognized and move the previous question. Remember it needs two-thirds." },
      { name: "Undecided Delegate", secret: true, card: "SECRET: You're undecided. Ask at least two questions using \"Will the delegate yield for a question?\" Announce your decision in a short speech before the vote." },
      { name: "Privilege Seeker", secret: true, card: "SECRET: At some point, raise a question of privilege (you can't hear, the room is too hot, and so on). Later, make one parliamentary inquiry." },
      { name: "Floor Delegate (for)", secret: false, card: "You lean toward supporting the bill. Make at least one short speech or second a motion. You may change your mind if persuaded." },
      { name: "Floor Delegate (against)", secret: false, card: "You lean toward opposing the bill. Make at least one short speech or second a motion. You may change your mind if persuaded." }
    ],
    runOfShow: [
      ["2 min", "Speaker calls the House to order; Clerk calls the roll; Speaker announces the quorum."],
      ["1 min", "Clerk reads the bill by number and title."],
      ["2 min", "Patron is recognized, moves passage, and gives the opening speech."],
      ["15–20 min", "Debate, amendments, and motions. Secret roles carry out their objectives."],
      ["2 min", "Final vote and announcement of the result."],
      ["10 min", "Debrief, then swap roles and run the second bill."]
    ],
    debrief: [
      "Which secret roles did you spot? How?",
      "Did the Speaker make any rulings you'd challenge now? What should they have said?",
      "Did procedure change the outcome of the bill? How?",
      "What would you do differently in the real simulation?"
    ]
  },

  /* ------------------------------------------------------------------
   * OPEN-ENDED / REFLECTION
   * ------------------------------------------------------------------ */
  reflections: [
    { group: "Understanding the rules", items: [
      { id: "r1", title: "Why a second?",
        prompt: "Most motions need a second before the body discusses them. What problem does this rule solve? Can you think of any downside to it?",
        consider: ["It keeps the body from spending time on ideas only one person supports.", "A second doesn't mean agreement, only that the idea is worth discussing.", "Downside: an unpopular member or minority view may struggle to find a second."] },
      { id: "r2", title: "Majority rule vs. minority rights",
        prompt: "Closing or limiting debate requires a two-thirds vote, while most other decisions need only a majority. Explain why. Is this a fair balance?",
        consider: ["Debate is how the minority tries to persuade, so cutting it off takes away a right.", "Just over one-third can block closing debate, but the majority still decides the final vote.", "Compare this with real tools like the U.S. Senate filibuster and cloture."] },
      { id: "r3", title: "Three ways to stop a bill",
        prompt: "Compare three ways to oppose a bill: referring it to committee, postponing it indefinitely, and voting it down. When would you choose each one?",
        consider: ["Refer: the bill might be fixable, or the body needs more information.", "Postpone indefinitely: kills it without a direct vote, and can test your strength before the final vote.", "Vote no: the most direct and transparent option, putting every member on record."] }
    ]},
    { group: "Leadership and fairness", items: [
      { id: "r4", title: "The impartial Speaker",
        prompt: "The Speaker is supposed to be impartial, but in real legislatures Speakers come from the majority party. Describe how a biased Speaker could misuse their power, and which tools members have to check them.",
        consider: ["Possible abuses: whom they recognize, rulings on points of order, how they count close voice votes.", "Checks: points of order, appeals, division of the assembly, and ultimately removal under the rules.", "Discuss why an appeal needs a majority to overturn."] },
      { id: "r5", title: "Handling a staller",
        prompt: "A delegate keeps raising frivolous points of order and motions to delay a vote. As Speaker, how would you respond in a way that is firm but fair?",
        consider: ["The chair may rule dilatory motions out of order.", "Warn the member first and explain the ruling.", "Remember members can appeal, so your rulings must be defensible."] },
      { id: "r6", title: "Civility rules",
        prompt: "Members must address the chair, refer to one another by title, and never question one another's motives. Do these rules improve debate, or do they make it artificial? Use an example.",
        consider: ["Third-person address lowers the temperature and keeps debate on ideas.", "Rules about motives protect working relationships across party lines.", "Some argue that too much formality hides real disagreement."] }
    ]},
    { group: "Applying it", items: [
      { id: "r7", title: "Your floor speech",
        prompt: "Choose a bill you might introduce in the simulation. Write a one-minute opening floor speech (about 130 words). Then name two motions opponents might use against it and how you would respond.",
        consider: ["Begin by addressing the chair.", "Say what the bill does, why it matters, and what it costs.", "Prepare for a referral to committee or a hostile amendment."] },
      { id: "r8", title: "Legislatures vs. clubs",
        prompt: "Real legislatures, such as Virginia's General Assembly, adopt their own rules instead of relying only on Robert's Rules. Why might a legislature need different rules than a club or student council?",
        consider: ["Size: 100 delegates vs. a handful of members.", "Public accountability: recorded votes, constitutional requirements for passing bills.", "Time limits on sessions and the large number of bills."] },
      { id: "r9", title: "After the simulation",
        prompt: "Describe a moment in the simulation when procedure (a motion, ruling, or vote) changed what happened. What did you learn from it?",
        consider: ["What happened, who acted, and what rule applied?", "Was the outcome fair?", "What would you do differently next time?"] }
    ]}
  ]
};
