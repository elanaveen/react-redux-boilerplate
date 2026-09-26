const HOUR = 60 * 60 * 1000;
const ago = (hours) => Date.now() - hours * HOUR;

export const seedUsers = {
    u_priya: { id: 'u_priya', name: 'Priya Raman', email: 'priya@campus.edu', college: 'State Institute of Technology', major: 'CSE · 4th year', joinedAt: ago(24 * 300) },
    u_arjun: { id: 'u_arjun', name: 'Arjun Mehta', email: 'arjun@campus.edu', college: 'State Institute of Technology', major: 'ECE · 3rd year', joinedAt: ago(24 * 200) },
    u_fatima: { id: 'u_fatima', name: 'Fatima Khan', email: 'fatima@campus.edu', college: 'State Institute of Technology', major: 'Chemistry · 2nd year', joinedAt: ago(24 * 120) },
    u_leo: { id: 'u_leo', name: 'Leo Thomas', email: 'leo@campus.edu', college: 'State Institute of Technology', major: 'Mechanical · 1st year', joinedAt: ago(24 * 40) },
    u_sara: { id: 'u_sara', name: 'Sara Iyer', email: 'sara@campus.edu', college: 'State Institute of Technology', major: 'Design · 3rd year', joinedAt: ago(24 * 90) },
};

export const seedForums = {
    f_dsa: {
        id: 'f_dsa', name: 'CS201 · Data Structures', emoji: '🌳', visibility: 'public', ownerId: 'u_priya',
        description: 'Doubts, hints and past papers for Data Structures & Algorithms. No full assignment solutions please.',
        tags: ['cse', 'dsa', 'coding'], members: ['u_priya', 'u_arjun', 'u_leo'], requests: [], createdAt: ago(24 * 60),
    },
    f_placements: {
        id: 'f_placements', name: 'Placement Prep 2027', emoji: '💼', visibility: 'public', ownerId: 'u_arjun',
        description: 'Interview experiences, resume reviews, OA patterns and referral threads from seniors.',
        tags: ['career', 'interviews'], members: ['u_arjun', 'u_priya', 'u_fatima', 'u_sara'], requests: [], createdAt: ago(24 * 45),
    },
    f_orgo: {
        id: 'f_orgo', name: 'Organic Chemistry Survivors', emoji: '🧪', visibility: 'public', ownerId: 'u_fatima',
        description: 'Reaction mechanisms, lab report help and memory tricks. We survive together.',
        tags: ['chemistry', 'labs'], members: ['u_fatima', 'u_leo'], requests: [], createdAt: ago(24 * 30),
    },
    f_hostel: {
        id: 'f_hostel', name: 'Hostel Life', emoji: '🏠', visibility: 'public', ownerId: 'u_leo',
        description: 'Mess menus, laundry hacks, roommate etiquette and where to find the best late-night maggi.',
        tags: ['campus', 'life'], members: ['u_leo', 'u_sara', 'u_arjun'], requests: [], createdAt: ago(24 * 20),
    },
    f_calc: {
        id: 'f_calc', name: 'Calculus II Study Circle', emoji: '∫', visibility: 'private', ownerId: 'u_priya',
        description: 'A small, focused study group for MA102. We meet Thursdays at the library. Request to join.',
        tags: ['math', 'study-group'], members: ['u_priya', 'u_fatima'], requests: ['u_leo'], createdAt: ago(24 * 14),
    },
    f_design: {
        id: 'f_design', name: 'Design Club Core', emoji: '🎨', visibility: 'private', ownerId: 'u_sara',
        description: 'Planning space for Design Club core members: events, portfolio reviews and critiques.',
        tags: ['design', 'club'], members: ['u_sara', 'u_arjun'], requests: [], createdAt: ago(24 * 10),
    },
};

export const seedQueries = {
    q1: {
        id: 'q1', forumId: 'f_dsa', authorId: 'u_leo', anonymous: false, createdAt: ago(3),
        title: 'Why is my recursive Fibonacci so slow for n = 45?',
        body: 'It takes almost a minute to run. My code:\n\n```\nint fib(int n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}\n```\n\nIs there something wrong with my compiler?',
        tags: ['recursion', 'c++'], upvotes: ['u_arjun'], savedBy: [],
        answers: [
            {
                id: 'a1', authorId: 'u_priya', createdAt: ago(2.5), upvotes: ['u_leo', 'u_arjun'], accepted: true,
                body: 'Nothing wrong with the compiler 🙂 Your function recomputes the same values again and again, so it runs in roughly `O(2^n)` time.\n\nAdd memoization (store answers in an array) or loop from the bottom up. Both are `O(n)`:\n\n```\nlong long a = 0, b = 1;\nfor (int i = 0; i < n; i++) { long long t = a + b; a = b; b = t; }\nreturn a;\n```',
            },
        ],
    },
    q2: {
        id: 'q2', forumId: 'f_placements', authorId: 'u_sara', anonymous: false, createdAt: ago(8),
        title: 'How many projects should a 3rd year put on their resume?',
        body: 'I have 5 small projects and 1 bigger internship project. Should I list all of them or keep it to one page?',
        tags: ['resume'], upvotes: ['u_priya', 'u_fatima', 'u_arjun'], savedBy: [],
        answers: [
            {
                id: 'a2', authorId: 'u_arjun', createdAt: ago(7), upvotes: ['u_sara'], accepted: false,
                body: 'One page, always. Pick the 2–3 projects that match the role and give each one a result ("reduced load time by 40%"). The internship project goes first.',
            },
            {
                id: 'a3', authorId: 'u_priya', createdAt: ago(6), upvotes: [], accepted: false,
                body: 'Agree with Arjun. Also put a GitHub link next to each project so interviewers can see the code.',
            },
        ],
    },
    q3: {
        id: 'q3', forumId: 'f_orgo', authorId: null, anonymous: true, createdAt: ago(20),
        title: 'SN1 vs SN2: how do I quickly tell which one happens?',
        body: 'I keep mixing them up in problem sets. Is there a simple checklist?',
        tags: ['mechanisms'], upvotes: ['u_leo'], savedBy: [],
        answers: [
            {
                id: 'a4', authorId: 'u_fatima', createdAt: ago(18), upvotes: ['u_leo'], accepted: false,
                body: 'Quick checklist:\n1. Substrate: 3° → SN1, methyl/1° → SN2\n2. Nucleophile: strong → SN2, weak → SN1\n3. Solvent: polar protic → SN1, polar aprotic → SN2\n\nIf 2 out of 3 point one way, go with it.',
            },
        ],
    },
    q4: {
        id: 'q4', forumId: 'f_hostel', authorId: 'u_arjun', anonymous: false, createdAt: ago(30),
        title: 'Is the laundry room in Block C working again?',
        body: 'The dryers were out last week. Anyone checked recently?',
        tags: ['laundry'], upvotes: [], savedBy: [],
        answers: [],
    },
    q5: {
        id: 'q5', forumId: null, authorId: 'u_fatima', anonymous: false, createdAt: ago(1),
        title: 'Which library floor is the quietest during exam week?',
        body: 'The ground floor is basically a café now 😅',
        tags: ['library', 'exams'], upvotes: ['u_sara'], savedBy: [],
        answers: [],
    },
    q6: {
        id: 'q6', forumId: 'f_calc', authorId: 'u_fatima', anonymous: false, createdAt: ago(5),
        title: 'Integration by parts: how do I choose u?',
        body: 'For ∫ x·eˣ dx I picked u = eˣ and it only got worse.',
        tags: ['integration'], upvotes: [], savedBy: [],
        answers: [
            {
                id: 'a5', authorId: 'u_priya', createdAt: ago(4), upvotes: ['u_fatima'], accepted: true,
                body: 'Use LIATE to choose u: Logarithmic, Inverse trig, Algebraic, Trig, Exponential. Pick whichever comes first. Here x (algebraic) beats eˣ (exponential), so u = x.',
            },
        ],
    },
    q7: {
        id: 'q7', forumId: 'f_dsa', authorId: 'u_arjun', anonymous: false, createdAt: ago(50),
        title: 'When should I use a heap instead of sorting?',
        body: 'For "top k elements" problems, is a heap always better?',
        tags: ['heap'], upvotes: ['u_leo', 'u_priya'], savedBy: [],
        answers: [],
    },
};
