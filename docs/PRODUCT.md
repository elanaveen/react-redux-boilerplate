# VSB Forums: Product Ideation

> **Stuck on something? Ask VSB.** A student-run Q&A hangout for VSB College of Engineering Technical Campus.

_Unofficial student project; not affiliated with or endorsed by the college._

VSB Forums is a campus Q&A and community app for the college's students. Students **raise queries**
that peers answer. They also **create public or private forums** around a course, club, hostel or
interest. Other students can **follow** public forums or **request to join** private ones.

---

## 1. Problem

| Pain today | Where it happens |
| --- | --- |
| Doubts get lost in 400-message WhatsApp/Discord groups | Course & batch groups |
| Students hesitate to ask "basic" questions publicly | Lectures, large group chats |
| Seniors' knowledge (placements, electives, professors) is never written down | Word of mouth |
| Generic Q&A sites don't know your syllabus, your bus route or your campus | Stack Overflow, Quora, Reddit |
| Helping others feels thankless, so seniors stop answering | Everywhere |
| Study groups have no simple, private space that stays organized | Ad‑hoc chats |

## 2. Target users (personas)

1. **The Asker – "Stuck Sam"** (1st/2nd year): has lots of doubts before exams and wants fast answers without being judged. Uses *anonymous asking*.
2. **The Helper – "Senior Priya"** (3rd/4th year): enjoys helping and wants credit for it on her profile (XP, badges, a spot on the leaderboard).
3. **The Organizer – "Club Lead Arjun"**: runs a club or study group and needs a private space where he controls who joins.
4. **The Lurker – "Follower Fatima"**: follows forums such as *Placement Prep* and *Hostel Life* to stay informed.

## 3. Core concepts

| Concept | Description |
| --- | --- |
| **Query** | A question: a title (the first line), details, tags, and an optional forum. It can be posted anonymously. It is *Open* until the asker accepts an answer, then it becomes *Solved*. |
| **Answer** | A reply to a query. Students can upvote answers, and the asker can accept one. |
| **Open Campus** | The default board. It needs no forum and every student can see it. |
| **Forum** | A space for a course, club or topic, with an owner, a description, tags and a visibility setting. |
| **Public forum** | Anyone can read it and **follow** it. Following adds its queries to your *For you* feed. |
| **Private forum** | Anyone can find its name and description in Discover, but only members see its content. Students **request to join** and the owner approves or declines. |
| **XP & levels** | Ask +2, answer +5, accepted answer +15, helpful vote +2, reaction +1. Levels: Fresher (0), Explorer (20), Helper (60), Mentor (150), Legend (300). |
| **Streak & quests** | A day counts when you ask, answer or react. Three daily quests: answer a query, react to 3 answers, ask something. |
| **Badges** | Curious Mind, Helping Hand, Problem Solver, Forum Founder, Crowd Favourite, On Fire. |

## 4. MVP feature set (built in this repo)

- **Sign in** with name, college email, college and branch/year (mocked auth kept on the boilerplate's cookie flow).
- **Home**: a "Vanakkam" greeting, a composer with rotating example prompts, today's quests and the Top helpers leaderboard. The first line of a query becomes the title. You can pick a forum, add tags and toggle anonymous posting.
- **Feed filters**: For you · Latest · Needs help · Solved · Saved.
- **Query thread**: the question appears as a chat bubble with answers below it, like a conversation. You can upvote, accept an answer, save the query, and reply from the sticky composer.
- **Forums**: Discover, Following and Created-by-me tabs, plus search and a public/private filter.
- **Create forum** modal: name, emoji, description, tags, and a visibility choice between Public and Private cards.
- **Forum page**: Follow/Unfollow for public forums. For private forums: Request, Cancel request, Leave, or a locked view. The owner gets a **join-requests panel** with Approve/Decline, plus Queries, Members and About tabs.
- **Search** across the queries and forums you are allowed to see.
- **Profile**: level ring, XP bar and rules, stats, badges, editable details, your queries and your forums.
- **Sidebar** with a pending-requests badge, followed forums and recent queries. **Light/dark theme**, a responsive mobile drawer, and an offline banner.
- Data persists in `localStorage` through the Redux store. Seed data makes the demo feel real.

## 5. UX principles

- **College colors, playful tone**: a navy brand color with an amber accent for rewards (XP, streaks, confetti), on cool neutrals. The palette lives in CSS tokens so the official hex values can be dropped in.
- **Bold, friendly type**: Bricolage Grotesque for headings, Figtree for reading, and JetBrains Mono for tags and code.
- **Local voice**: a "Vanakkam" greeting, bus routes, mess menus, symposiums and placement prep.
- **Every tap answers back**: springy buttons, "+1" bursts, reaction pops, a send button that flies off, confetti on solved queries and new badges, and toasts that name the XP earned.
- **Motion with restraint**: nothing blocks reading, and everything turns off under `prefers-reduced-motion`.
- **Navy sidebar** for navigation, level and streak. On phones, a drawer plus a swipeable row of today's quests and the leaderboard.

## 5a. Engagement loop

```
Ask (+2) ─► classmates answer (+5 each) ─► asker accepts (+15, confetti)
   ▲                                              │
   └── streak & daily quests ◄── reactions/helpful votes (+1/+2) ◄──┘
```

- **Streak**: the flame in the sidebar lights up once you do anything today.
- **Quests** give a small daily goal, so a quick visit is always worth something.
- **Leaderboard and badges** give helpers visible status, which is the main reason seniors keep answering.
- **Anonymous asking** removes the fear of looking "dumb", which is the biggest blocker for juniors.

## 5b. Safety & moderation

**Students report**
- There is a Report action on every query, answer and forum. It is hidden on your own content and becomes "Reported" once filed.
- Reasons: spam, scam/cheating/leaked papers, bullying, hate speech, sexual or violent content, misinformation, or other. An optional note can be added.
- The reporter can also report the author's account in the same step. Anonymous askers can't be reported by account from the thread, so their identity is never revealed.

**Moderators review (admin console)**
- The queue is grouped by item, with the most-reported and newest first. Each card shows the content, author, forum, reasons, and reporter notes.
- Actions are Deactivate item, Suspend author, or Dismiss (no violation). Every open report on that item closes together.
- The Accounts, Posts and Forums tabs let a moderator switch anything active or inactive, with or without a report.
- Every action goes into the activity log.

**What "inactive" means**
| Item | Effect for students |
| --- | --- |
| Account | Can't sign in; signed out on next action; all their queries and answers hidden |
| Query / answer | Hidden from feeds, search, counts; direct link shows "removed by moderators" |
| Forum | Hidden from Discover and search; its queries hidden; page shows "unavailable" |

**Before going live**
- Server-side admin authentication and role checks (the demo passcode is a front-end mock).
- Auto-hide after N reports pending review.
- Notify reporters of the outcome, and let authors appeal.
- Rate-limit reports to prevent report brigading.

## 6. Key flows

```
Ask:     Home → type question → (pick forum / tags / anonymous) → Ask → thread page
Help:    Feed → open query → write answer → asker accepts → +10 points
Follow:  Forums → Discover → public forum → Follow → its queries appear in "For you"
Join:    Forums → private forum (locked) → Request to join → owner approves → content unlocked
Create:  Sidebar "+ New forum" → name/emoji/description/visibility → forum page (you are owner)
```

## 7. Permissions matrix

| Action | Open Campus | Public forum | Private forum (non-member) | Private forum (member) | Owner |
| --- | --- | --- | --- | --- | --- |
| See name/description | ✅ | ✅ | ✅ | ✅ | ✅ |
| Read queries | ✅ | ✅ | ❌ | ✅ | ✅ |
| Ask / answer | ✅ | ✅ (asking auto-follows) | ❌ | ✅ | ✅ |
| Follow / join | – | Follow instantly | Request → approval | Leave | – |
| Approve requests | – | – | – | – | ✅ |

## 8. Roadmap (post-MVP)

1. **Real backend**: Node/Postgres (or Firebase), with college-email OTP verification.
2. **AI study buddy**: an optional AI draft answer on new queries, clearly labelled, that peers can improve. It also flags duplicate queries before posting ("Similar queries already solved").
3. **Notifications**: new answers, accepted answers, join approvals, and digests of followed forums (push through the existing PWA service worker).
4. **Rich content**: images (photo of a notebook problem), LaTeX, code blocks, and PDF attachments.
5. **Moderation**: report, forum moderators, rate limits, and a profanity filter. Anonymous posts stay traceable by admins only.
6. **Events & polls** inside forums (study sessions, club meetups).
7. **Weekly leaderboards** per forum and department; a "Top helper of the week" shout-out.
8. **Faculty/TA verified answers** with a badge.

## 9. Success metrics

- **Time to first answer** (target: under 30 min median during term)
- **% queries solved** (answer accepted) within 48h
- Weekly active askers and helpers, and the helper-to-asker ratio
- Forums created per campus, and the follow/join conversion rate
- D7 / D30 retention

## 10. Monetization ideas (later)

- Free for students, always.
- **Campus plan** for institutions: an official verified forum, analytics on common doubts per course, and moderation tools.
- **Placement/partner forums** sponsored by companies, clearly labelled.
