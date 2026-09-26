import { seedUsers, seedForums, seedQueries } from '../data/seed';

export const STORAGE_KEY = 'canforums:board:v1';

function load() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && saved.forums && saved.queries && saved.users) return saved;
    } catch (e) { /* fall back to seed data */ }
    return { users: seedUsers, forums: seedForums, queries: seedQueries };
}

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
const without = (list, id) => list.filter((x) => x !== id);
const withItem = (list, id) => (list.includes(id) ? list : [...list, id]);

function updateForum(state, id, fn) {
    const forum = state.forums[id];
    if (!forum) return state;
    return { ...state, forums: { ...state.forums, [id]: fn(forum) } };
}

function updateQuery(state, id, fn) {
    const query = state.queries[id];
    if (!query) return state;
    return { ...state, queries: { ...state.queries, [id]: fn(query) } };
}

export default function boardReducer(state = load(), action) {
    const p = action.payload;
    switch (action.type) {
        case 'UPSERT_USER':
            return { ...state, users: { ...state.users, [p.id]: { ...state.users[p.id], ...p } } };

        case 'CREATE_FORUM':
            return { ...state, forums: { ...state.forums, [p.id]: p } };

        case 'UPDATE_FORUM':
            return updateForum(state, p.id, (f) => ({ ...f, ...p.patch }));

        case 'FOLLOW_FORUM':
            return updateForum(state, p.forumId, (f) =>
                f.visibility === 'public' ? { ...f, members: withItem(f.members, p.userId) } : f);

        case 'LEAVE_FORUM':
            return updateForum(state, p.forumId, (f) =>
                f.ownerId === p.userId ? f : { ...f, members: without(f.members, p.userId) });

        case 'REQUEST_JOIN':
            return updateForum(state, p.forumId, (f) => ({ ...f, requests: withItem(f.requests, p.userId) }));

        case 'CANCEL_REQUEST':
            return updateForum(state, p.forumId, (f) => ({ ...f, requests: without(f.requests, p.userId) }));

        case 'RESOLVE_REQUEST':
            return updateForum(state, p.forumId, (f) => ({
                ...f,
                requests: without(f.requests, p.userId),
                members: p.approve ? withItem(f.members, p.userId) : f.members,
            }));

        case 'CREATE_QUERY':
            return { ...state, queries: { ...state.queries, [p.id]: p } };

        case 'DELETE_QUERY': {
            const queries = { ...state.queries };
            delete queries[p.queryId];
            return { ...state, queries };
        }

        case 'ADD_ANSWER':
            return updateQuery(state, p.queryId, (q) => ({ ...q, answers: [...q.answers, p.answer] }));

        case 'TOGGLE_QUERY_UPVOTE':
            return updateQuery(state, p.queryId, (q) => ({ ...q, upvotes: toggle(q.upvotes, p.userId) }));

        case 'TOGGLE_SAVE':
            return updateQuery(state, p.queryId, (q) => ({ ...q, savedBy: toggle(q.savedBy, p.userId) }));

        case 'TOGGLE_ANSWER_UPVOTE':
            return updateQuery(state, p.queryId, (q) => ({
                ...q,
                answers: q.answers.map((a) => (a.id === p.answerId ? { ...a, upvotes: toggle(a.upvotes, p.userId) } : a)),
            }));

        case 'ACCEPT_ANSWER':
            // Only one accepted answer per query; accepting it again un-accepts it.
            return updateQuery(state, p.queryId, (q) => ({
                ...q,
                answers: q.answers.map((a) => ({ ...a, accepted: a.id === p.answerId ? !a.accepted : false })),
            }));

        case 'RESET_BOARD':
            return { users: seedUsers, forums: seedForums, queries: seedQueries };

        default:
            return state;
    }
}
