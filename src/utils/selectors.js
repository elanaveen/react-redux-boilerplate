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

export function userStats(board, userId) {
    let queries = 0, answers = 0, accepted = 0, upvotes = 0;
    Object.values(board.queries).forEach((q) => {
        if (q.authorId === userId && !q.anonymous) queries++;
        q.answers.forEach((a) => {
            if (a.authorId !== userId) return;
            answers++;
            if (a.accepted) accepted++;
            upvotes += a.upvotes.length;
        });
    });
    return { queries, answers, accepted, points: accepted * 10 + upvotes * 2 };
}

export const isSolved = (q) => q.answers.some((a) => a.accepted);

export function feedFor(board, userId, filter) {
    const all = visibleQueries(board, userId);
    switch (filter) {
        case 'foryou':
            return all.filter((q) => !q.forumId || isMember(board.forums[q.forumId], userId));
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
