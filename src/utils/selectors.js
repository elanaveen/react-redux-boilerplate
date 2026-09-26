// Access rules for forums and queries. `forum` is null for the Open Campus board.

export const isMember = (forum, userId) => !!forum && forum.members.includes(userId);
export const isOwner = (forum, userId) => !!forum && forum.ownerId === userId;
export const hasRequested = (forum, userId) => !!forum && forum.requests.includes(userId);

export const canView = (forum, userId) =>
    !forum || forum.visibility === 'public' || isMember(forum, userId);

// Public forums accept posts from anyone (posting auto-follows); private ones need membership.
export const canPost = canView;

export function visibleQueries(board, userId) {
    return Object.values(board.queries)
        .filter((q) => canView(q.forumId ? board.forums[q.forumId] : null, userId))
        .sort((a, b) => b.createdAt - a.createdAt);
}

export const followedForums = (board, userId) =>
    Object.values(board.forums)
        .filter((f) => isMember(f, userId))
        .sort((a, b) => a.name.localeCompare(b.name));

export const pendingRequestCount = (board, userId) =>
    Object.values(board.forums)
        .filter((f) => isOwner(f, userId))
        .reduce((n, f) => n + f.requests.length, 0);

// XP rules shown to students on their profile.
export const XP = { query: 2, answer: 5, accepted: 15, helpful: 2, reaction: 1 };

export function userStats(board, userId) {
    let queries = 0, answers = 0, accepted = 0, helpful = 0, reactions = 0;
    Object.values(board.queries).forEach((q) => {
        if ((q.ownerId || q.authorId) === userId) queries++;
        q.answers.forEach((a) => {
            if (a.authorId !== userId) return;
            answers++;
            if (a.accepted) accepted++;
            helpful += a.upvotes.length;
            reactions += Object.values(a.reactions || {}).reduce((n, list) => n + list.length, 0);
        });
    });
    const points = queries * XP.query + answers * XP.answer + accepted * XP.accepted + helpful * XP.helpful + reactions * XP.reaction;
    const forums = Object.values(board.forums).filter((f) => f.ownerId === userId).length;
    return { queries, answers, accepted, helpful, reactions, forums, points };
}

export const LEVELS = [
    { name: 'Fresher', min: 0 },
    { name: 'Explorer', min: 20 },
    { name: 'Helper', min: 60 },
    { name: 'Mentor', min: 150 },
    { name: 'Legend', min: 300 },
];

export function levelFor(points) {
    let i = 0;
    while (i < LEVELS.length - 1 && points >= LEVELS[i + 1].min) i++;
    const level = LEVELS[i];
    const next = LEVELS[i + 1] || null;
    const progress = next ? (points - level.min) / (next.min - level.min) : 1;
    return { ...level, index: i + 1, next, progress, toNext: next ? next.min - points : 0 };
}

const dayKey = (ts) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

function activeDays(board, userId) {
    const days = new Set(board.activity.filter((a) => a.userId === userId).map((a) => dayKey(a.at)));
    Object.values(board.queries).forEach((q) => {
        if ((q.ownerId || q.authorId) === userId) days.add(dayKey(q.createdAt));
        q.answers.forEach((a) => { if (a.authorId === userId) days.add(dayKey(a.createdAt)); });
    });
    return days;
}

// Consecutive active days, counting back from today (or yesterday if today is still empty).
export function streakFor(board, userId) {
    const days = activeDays(board, userId);
    const cursor = new Date();
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let n = 0;
    while (days.has(dayKey(cursor))) { n++; cursor.setDate(cursor.getDate() - 1); }
    return { days: n, activeToday: days.has(dayKey(Date.now())) };
}

export function todayQuests(board, userId) {
    const today = dayKey(Date.now());
    const mine = board.activity.filter((a) => a.userId === userId && dayKey(a.at) === today);
    const count = (type) => mine.filter((a) => a.type === type).length;
    return [
        { id: 'answer', label: 'Answer a classmate\'s query', done: Math.min(count('answer'), 1), goal: 1, xp: XP.answer },
        { id: 'react', label: 'React to 3 answers', done: Math.min(count('react'), 3), goal: 3, xp: 3 },
        { id: 'ask', label: 'Ask what you\'re stuck on', done: Math.min(count('ask'), 1), goal: 1, xp: XP.query },
    ];
}

export function badgesFor(board, userId) {
    const s = userStats(board, userId);
    const streak = streakFor(board, userId).days;
    return [
        { id: 'first-query', icon: '🙋', name: 'Curious Mind', desc: 'Ask your first query', earned: s.queries >= 1 },
        { id: 'first-answer', icon: '🤝', name: 'Helping Hand', desc: 'Post your first answer', earned: s.answers >= 1 },
        { id: 'solver', icon: '🏆', name: 'Problem Solver', desc: 'Get an answer accepted', earned: s.accepted >= 1 },
        { id: 'founder', icon: '🏗️', name: 'Forum Founder', desc: 'Start a forum', earned: s.forums >= 1 },
        { id: 'favourite', icon: '⭐', name: 'Crowd Favourite', desc: 'Collect 5 helpful votes', earned: s.helpful >= 5 },
        { id: 'streak', icon: '🔥', name: 'On Fire', desc: 'Keep a 3-day streak', earned: streak >= 3 },
    ];
}

export function leaderboard(board, limit = 5) {
    return Object.values(board.users)
        .map((u) => ({ user: u, points: userStats(board, u.id).points }))
        .filter((r) => r.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, limit);
}

export const isSolved = (q) => q.answers.some((a) => a.accepted);

export function feedFor(board, userId, filter) {
    const all = visibleQueries(board, userId);
    switch (filter) {
        case 'foryou': {
            // New students follow nothing yet, so show them the whole campus until they do.
            if (!Object.values(board.forums).some((f) => isMember(f, userId))) return all;
            return all.filter((q) => !q.forumId || isMember(board.forums[q.forumId], userId));
        }
        case 'unanswered':
            return all.filter((q) => q.answers.length === 0);
        case 'solved':
            return all.filter(isSolved);
        case 'saved':
            return all.filter((q) => q.savedBy.includes(userId));
        default:
            return all;
    }
}
