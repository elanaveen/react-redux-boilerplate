const HOUR = 60 * 60 * 1000;
const ago = (hours) => Date.now() - hours * HOUR;

export const seedUsers = {
    u_priya: { id: 'u_priya', name: 'Priya Raman', email: 'priya@vsb.student', college: 'VSB College of Engineering Technical Campus', major: 'CSE · 4th year', joinedAt: ago(24 * 300) },
    u_arjun: { id: 'u_arjun', name: 'Arjun Kumar', email: 'arjun@vsb.student', college: 'VSB College of Engineering Technical Campus', major: 'ECE · 3rd year', joinedAt: ago(24 * 200) },
    u_fathima: { id: 'u_fathima', name: 'Fathima Begum', email: 'fathima@vsb.student', college: 'VSB College of Engineering Technical Campus', major: 'AI & DS · 2nd year', joinedAt: ago(24 * 120) },
    u_karthik: { id: 'u_karthik', name: 'Karthik S', email: 'karthik@vsb.student', college: 'VSB College of Engineering Technical Campus', major: 'Mechanical · 1st year', joinedAt: ago(24 * 40) },
    u_divya: { id: 'u_divya', name: 'Divya Lakshmi', email: 'divya@vsb.student', college: 'VSB College of Engineering Technical Campus', major: 'IT · 3rd year', joinedAt: ago(24 * 90) },
    u_quickcash: { id: 'u_quickcash', name: 'Quick Cash Deals', email: 'deals4u@mailbox.example', college: 'Unknown', major: '', joinedAt: ago(26) },
};

export const seedForums = {
    f_dsa: {
        id: 'f_dsa', name: 'CSE · DSA Doubts', emoji: '🌳', visibility: 'public', ownerId: 'u_priya',
        description: 'Data structures, algorithms and lab record doubts. Hints welcome; please don\'t post full assignment solutions.',
        tags: ['cse', 'dsa', 'coding'], members: ['u_priya', 'u_arjun', 'u_karthik'], requests: [], createdAt: ago(24 * 60),
    },
    f_placements: {
        id: 'f_placements', name: 'Placement Prep 2027', emoji: '💼', visibility: 'public', ownerId: 'u_arjun',
        description: 'Aptitude, OA patterns, interview experiences and resume reviews from seniors who got placed.',
        tags: ['career', 'aptitude', 'interviews'], members: ['u_arjun', 'u_priya', 'u_fathima', 'u_divya'], requests: [], createdAt: ago(24 * 45),
    },
    f_bus: {
        id: 'f_bus', name: 'College Bus Routes', emoji: '🚌', visibility: 'public', ownerId: 'u_karthik',
        description: 'Route changes, timings and "is bus 12 late today?" updates. Help each other get to first hour on time.',
        tags: ['transport', 'campus'], members: ['u_karthik', 'u_divya', 'u_arjun'], requests: [], createdAt: ago(24 * 30),
    },
    f_hostel: {
        id: 'f_hostel', name: 'Hostel & Mess', emoji: '🍛', visibility: 'public', ownerId: 'u_divya',
        description: 'Mess menu reviews, laundry tips, roommate etiquette and weekend outing plans.',
        tags: ['hostel', 'life'], members: ['u_divya', 'u_fathima'], requests: [], createdAt: ago(24 * 20),
    },
    f_events: {
        id: 'f_events', name: 'Symposium & Events', emoji: '🎤', visibility: 'public', ownerId: 'u_fathima',
        description: 'Symposiums, hackathons, workshops and cultural fests. Find teammates and share event updates.',
        tags: ['events', 'hackathon'], members: ['u_fathima', 'u_priya', 'u_divya'], requests: [], createdAt: ago(24 * 16),
    },
    f_aids: {
        id: 'f_aids', name: 'AI & DS Study Circle', emoji: '🧠', visibility: 'private', ownerId: 'u_fathima',
        description: 'A small study group for ML and statistics. We meet Thursdays in the library. Request to join.',
        tags: ['ai', 'ml', 'study-group'], members: ['u_fathima', 'u_priya'], requests: ['u_karthik'], createdAt: ago(24 * 14),
    },
    f_coding: {
        id: 'f_coding', name: 'Coding Club Core', emoji: '💻', visibility: 'private', ownerId: 'u_divya',
        description: 'Core team space for the coding club: contest planning, problem setting and workshop prep.',
        tags: ['club', 'cp'], members: ['u_divya', 'u_arjun'], requests: [], createdAt: ago(24 * 10),
    },
};

export const seedQueries = {
    q1: {
        id: 'q1', forumId: 'f_dsa', authorId: 'u_karthik', anonymous: false, createdAt: ago(3),
        title: 'Why is my recursive Fibonacci so slow for n = 45?',
        body: 'It takes almost a minute to run. My code:\n\n```\nint fib(int n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}\n```\n\nIs something wrong with my compiler?',
        tags: ['recursion', 'c++'], upvotes: ['u_arjun'], savedBy: [],
        answers: [
            {
                id: 'a1', authorId: 'u_priya', createdAt: ago(2.5), upvotes: ['u_karthik', 'u_arjun'], accepted: true,
                reactions: { '🔥': ['u_karthik', 'u_arjun'], '💡': ['u_divya'] },
                body: 'Nothing wrong with the compiler 🙂 Your function recomputes the same values again and again, so it runs in roughly `O(2^n)` time.\n\nAdd memoization (store answers in an array) or loop from the bottom up. Both are `O(n)`:\n\n```\nlong long a = 0, b = 1;\nfor (int i = 0; i < n; i++) { long long t = a + b; a = b; b = t; }\nreturn a;\n```',
            },
        ],
    },
    q2: {
        id: 'q2', forumId: 'f_placements', authorId: 'u_divya', anonymous: false, createdAt: ago(8),
        title: 'How many projects should a 3rd year put on their resume?',
        body: 'I have 5 small projects and 1 bigger internship project. Should I list all of them or keep it to one page?',
        tags: ['resume'], upvotes: ['u_priya', 'u_fathima', 'u_arjun'], savedBy: [],
        answers: [
            {
                id: 'a2', authorId: 'u_arjun', createdAt: ago(7), upvotes: ['u_divya'], accepted: false,
                reactions: { '🙏': ['u_divya'] },
                body: 'One page, always. Pick the 2–3 projects that match the role and give each one a result ("reduced load time by 40%"). The internship project goes first.',
            },
            {
                id: 'a3', authorId: 'u_priya', createdAt: ago(6), upvotes: [], accepted: false, reactions: {},
                body: 'Agree with Arjun. Also put a GitHub link next to each project so interviewers can see the code.',
            },
            {
                id: 'a6', authorId: 'u_quickcash', createdAt: ago(5), upvotes: [], accepted: false, reactions: {},
                body: 'Resumes are useless. Buy my ready-made "placement kit" for ₹999 and skip all this. Link in bio.',
            },
        ],
    },
    q3: {
        id: 'q3', forumId: 'f_bus', authorId: null, anonymous: true, createdAt: ago(20),
        title: 'Does the Pollachi route bus still leave at 7:10?',
        body: 'Heard the timing changed after the semester started. Don\'t want to miss the first hour again 😅',
        tags: ['timings'], upvotes: ['u_karthik'], savedBy: [],
        answers: [
            {
                id: 'a4', authorId: 'u_karthik', createdAt: ago(18), upvotes: ['u_divya'], accepted: false,
                reactions: { '🙏': ['u_divya', 'u_arjun'] },
                body: 'It moved to 7:00 this week. The driver said it stays that way until the end of the month.',
            },
        ],
    },
    q4: {
        id: 'q4', forumId: 'f_hostel', authorId: 'u_fathima', anonymous: false, createdAt: ago(30),
        title: 'Is there a laundry service near the hostel that does pickup?',
        body: 'Exam week, no time to wash anything. Any numbers that work?',
        tags: ['laundry'], upvotes: [], savedBy: [], answers: [],
    },
    q5: {
        id: 'q5', forumId: null, authorId: 'u_arjun', anonymous: false, createdAt: ago(1),
        title: 'Which library section is the quietest during model exams?',
        body: 'The reference section is packed every afternoon.',
        tags: ['library', 'exams'], upvotes: ['u_divya'], savedBy: [], answers: [],
    },
    q6: {
        id: 'q6', forumId: 'f_aids', authorId: 'u_fathima', anonymous: false, createdAt: ago(5),
        title: 'When should I use precision instead of accuracy?',
        body: 'My spam classifier has 97% accuracy but still flags important mails.',
        tags: ['ml', 'metrics'], upvotes: [], savedBy: [],
        answers: [
            {
                id: 'a5', authorId: 'u_priya', createdAt: ago(4), upvotes: ['u_fathima'], accepted: true,
                reactions: { '💡': ['u_fathima'] },
                body: 'Accuracy looks good on imbalanced data even when the model is bad. Use precision when false positives hurt (like flagging real mail as spam), and recall when false negatives hurt.',
            },
        ],
    },
    q7: {
        id: 'q7', forumId: 'f_events', authorId: 'u_divya', anonymous: false, createdAt: ago(12),
        title: 'Looking for 2 teammates for the Smart India Hackathon',
        body: 'Need one frontend person and one person comfortable with ML. Problem statement is on campus sustainability.',
        tags: ['hackathon', 'team'], upvotes: ['u_priya', 'u_karthik'], savedBy: [], answers: [],
    },
    q9: {
        id: 'q9', forumId: 'f_placements', authorId: 'u_quickcash', anonymous: false, createdAt: ago(9),
        title: 'Earn ₹5000/day from your hostel room!! Guaranteed placement shortcut',
        body: 'Pay ₹999 registration fee and get leaked OA answers for every company. DM me on WhatsApp now, only 10 slots left!!!',
        tags: ['placements'], upvotes: [], savedBy: [], answers: [],
    },
    q8: {
        id: 'q8', forumId: 'f_placements', authorId: 'u_karthik', anonymous: false, createdAt: ago(50),
        title: 'Best way to practice aptitude in 30 days?',
        body: 'Placements start next semester. Where should a first year even begin?',
        tags: ['aptitude'], upvotes: ['u_arjun', 'u_priya'], savedBy: [], answers: [],
    },
};

// Example reports so the moderation console opens with real work in it.
export const seedReports = [
    { id: 'r1', targetType: 'query', targetId: 'q9', queryId: 'q9', reporterId: 'u_priya', reason: 'spam', note: 'Selling "leaked" OA answers.', status: 'open', createdAt: ago(8) },
    { id: 'r2', targetType: 'query', targetId: 'q9', queryId: 'q9', reporterId: 'u_arjun', reason: 'scam', note: '', status: 'open', createdAt: ago(7) },
    { id: 'r3', targetType: 'user', targetId: 'u_quickcash', queryId: null, reporterId: 'u_divya', reason: 'spam', note: 'Posting the same paid link in every forum.', status: 'open', createdAt: ago(4.5) },
    { id: 'r4', targetType: 'answer', targetId: 'a6', queryId: 'q2', reporterId: 'u_divya', reason: 'spam', note: '', status: 'open', createdAt: ago(4) },
    { id: 'r5', targetType: 'answer', targetId: 'a4', queryId: 'q3', reporterId: 'u_arjun', reason: 'misinformation', note: 'I think the bus still leaves at 7:10.', status: 'open', createdAt: ago(3) },
];
