# Can Forums — Product Ideation

> **"Can anyone help with…?"** — the question every student asks. Can Forums is where they get an answer.

Can Forums is a campus Q&A and community app for college students. Students **raise queries**
that peers answer. They also **create public or private forums** around a course, club, hostel or
interest. Other students can **follow** public forums or **request to join** private ones.

---

## 1. Problem

| Pain today | Where it happens |
| --- | --- |
| Doubts get lost in 400-message WhatsApp/Discord groups | Course & batch groups |
| Students hesitate to ask "basic" questions publicly | Lectures, large group chats |
| Seniors' knowledge (placements, electives, professors) is never written down | Word of mouth |
| Generic Q&A sites don't know your syllabus, your professor or your campus | Stack Overflow, Quora, Reddit |
| Study groups have no simple, private space that stays organized | Ad‑hoc chats |

## 2. Target users (personas)

1. **The Asker – "Stuck Sam"** (1st/2nd year): has lots of doubts before exams and wants fast answers without being judged. Uses *anonymous asking*.
2. **The Helper – "Senior Priya"** (3rd/4th year): enjoys helping and wants credit for it on her profile (helpfulness points, accepted answers).
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
| **Helpfulness points** | Reputation: +10 for each accepted answer and +2 for each upvote on your answers. |

## 4. MVP feature set (built in this repo)

- **Sign in** with name, college email, college and branch/year (mocked auth kept on the boilerplate's cookie flow).
- **Home ("Ask")**: Claude-style greeting and a large composer asking *"What are you stuck on?"*. The first line becomes the title. You can pick a forum, add tags and toggle anonymous posting.
- **Feed filters**: For you · Latest · Unanswered · Solved · Saved.
- **Query thread**: the question appears as a chat bubble with answers below it, like a conversation. You can upvote, accept an answer, save the query, and reply from the sticky composer.
- **Forums**: Discover, Following and Created-by-me tabs, plus search and a public/private filter.
- **Create forum** modal: name, emoji, description, tags, and a visibility choice between Public and Private cards.
- **Forum page**: Follow/Unfollow for public forums. For private forums: Request, Cancel request, Leave, or a locked view. The owner gets a **join-requests panel** with Approve/Decline, plus Queries, Members and About tabs.
- **Search** across the queries and forums you are allowed to see.
- **Profile**: stats (queries, answers, accepted answers, helpfulness points), editable details, your queries and your forums.
- **Sidebar** with a pending-requests badge, followed forums and recent queries. **Light/dark theme**, a responsive mobile drawer, and an offline banner.
- Data persists in `localStorage` through the Redux store. Seed data makes the demo feel real.

## 5. UX principles ("Claude-style")

- **Calm and warm**: ivory background (`#FAF9F5`), soft borders, terracotta/clay accent (`#D97757`), and generous whitespace.
- **Serif for voice, sans for UI**: greetings, titles and answers use a serif. Controls use a clean sans.
- **The composer is the hero**: one big, rounded input box is the main action on every page.
- **Conversation layout** for threads: the asker's message appears in a bubble and answers read like responses.
- **Collapsible left sidebar** for navigation and recents. The content column is narrow (≈720px) for easy reading.
- **Dark mode** uses warm charcoal (`#262624`) rather than pure black.

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

1. **Real backend**: Node/Postgres (or Firebase), with college email (.edu/.ac.in) OTP verification and one tenant per campus.
2. **AI study buddy**: an optional AI draft answer on new queries, clearly labelled, that peers can improve. It also flags duplicate queries before posting ("Similar queries already solved").
3. **Notifications**: new answers, accepted answers, join approvals, and digests of followed forums (push through the existing PWA service worker).
4. **Rich content**: images (photo of a notebook problem), LaTeX, code blocks, and PDF attachments.
5. **Moderation**: report, forum moderators, rate limits, and a profanity filter. Anonymous posts stay traceable by admins only.
6. **Events & polls** inside forums (study sessions, club meetups).
7. **Leaderboards & badges** per forum and per campus; a "Top helper of the week" award.
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
