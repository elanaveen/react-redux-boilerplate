import { seedUsers, seedForums, seedQueries, seedReports } from '../data/seed';
import { readLocal } from '../utils/storage';

export const STORAGE_KEY = 'vsbforums:board:v2';

const seed = () => ({ users: seedUsers, forums: seedForums, queries: seedQueries, activity: [], reports: seedReports, modlog: [] });

function load() {
    const saved = readLocal(STORAGE_KEY);
    if (saved && saved.forums && saved.queries && saved.users) return { activity: [], reports: [], modlog: [], ...saved };
    return seed();
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

        case 'REACT_ANSWER':
            return updateQuery(state, p.queryId, (q) => ({
                ...q,
                answers: q.answers.map((a) => {
                    if (a.id !== p.answerId) return a;
                    const reactions = a.reactions || {};
                    return { ...a, reactions: { ...reactions, [p.emoji]: toggle(reactions[p.emoji] || [], p.userId) } };
                }),
            }));

        case 'LOG_ACTIVITY':
            // Keep the log short; it only powers streaks and today's quests.
            return { ...state, activity: [...state.activity.slice(-300), p] };

        case 'SUBMIT_REPORT':
            return { ...state, reports: [...state.reports, p] };

        case 'RESOLVE_REPORTS':
            // Closes every open report on the same target at once.
            return {
                ...state,
                reports: state.reports.map((r) => (r.status === 'open' && r.targetType === p.targetType && r.targetId === p.targetId
                    ? { ...r, status: p.status, resolvedAt: p.at, resolvedBy: p.adminId } : r)),
            };

        case 'SET_STATUS': {
            const patch = { status: p.status, moderatedAt: p.at };
            if (p.kind === 'user') {
                if (!state.users[p.id]) return state;
                return { ...state, users: { ...state.users, [p.id]: { ...state.users[p.id], ...patch } } };
            }
            if (p.kind === 'forum') return updateForum(state, p.id, (f) => ({ ...f, ...patch }));
            if (p.kind === 'query') return updateQuery(state, p.id, (q) => ({ ...q, ...patch }));
            if (p.kind === 'answer') {
                return updateQuery(state, p.queryId, (q) => ({ ...q, answers: q.answers.map((a) => (a.id === p.id ? { ...a, ...patch } : a)) }));
            }
            return state;
        }

        case 'LOG_MODERATION':
            return { ...state, modlog: [p, ...state.modlog].slice(0, 200) };

        case 'RESET_BOARD':
            return seed();

        default:
            return state;
    }
}
