import { uid } from '../utils/format';

export const createForum = ({ name, emoji, description, visibility, tags }, ownerId) => (dispatch) => {
    const forum = {
        id: uid('f'), name: name.trim(), emoji: emoji || '💬', description: description.trim(),
        visibility, tags, ownerId, members: [ownerId], requests: [], createdAt: Date.now(),
    };
    dispatch({ type: 'CREATE_FORUM', payload: forum });
    return forum;
};

export const createQuery = ({ text, forumId, tags, anonymous }, authorId) => (dispatch, getState) => {
    const [first, ...rest] = text.trim().split('\n');
    const query = {
        id: uid('q'), forumId: forumId || null, authorId: anonymous ? null : authorId, anonymous: !!anonymous,
        // Anonymous queries keep the real author privately so they can still accept answers.
        ownerId: authorId,
        title: first.trim().slice(0, 200), body: rest.join('\n').trim(), tags,
        upvotes: [], savedBy: [], answers: [], createdAt: Date.now(),
    };
    dispatch({ type: 'CREATE_QUERY', payload: query });
    const forum = forumId && getState().board.forums[forumId];
    if (forum && forum.visibility === 'public') {
        dispatch({ type: 'FOLLOW_FORUM', payload: { forumId, userId: authorId } });
    }
    return query;
};

export const addAnswer = (queryId, body, authorId) => ({
    type: 'ADD_ANSWER',
    payload: { queryId, answer: { id: uid('a'), authorId, body: body.trim(), upvotes: [], accepted: false, createdAt: Date.now() } },
});

export const followForum = (forumId, userId) => ({ type: 'FOLLOW_FORUM', payload: { forumId, userId } });
export const leaveForum = (forumId, userId) => ({ type: 'LEAVE_FORUM', payload: { forumId, userId } });
export const requestJoin = (forumId, userId) => ({ type: 'REQUEST_JOIN', payload: { forumId, userId } });
export const cancelRequest = (forumId, userId) => ({ type: 'CANCEL_REQUEST', payload: { forumId, userId } });
export const resolveRequest = (forumId, userId, approve) => ({ type: 'RESOLVE_REQUEST', payload: { forumId, userId, approve } });
export const updateForum = (id, patch) => ({ type: 'UPDATE_FORUM', payload: { id, patch } });

export const toggleQueryUpvote = (queryId, userId) => ({ type: 'TOGGLE_QUERY_UPVOTE', payload: { queryId, userId } });
export const toggleSave = (queryId, userId) => ({ type: 'TOGGLE_SAVE', payload: { queryId, userId } });
export const toggleAnswerUpvote = (queryId, answerId, userId) => ({ type: 'TOGGLE_ANSWER_UPVOTE', payload: { queryId, answerId, userId } });
export const acceptAnswer = (queryId, answerId) => ({ type: 'ACCEPT_ANSWER', payload: { queryId, answerId } });
export const deleteQuery = (queryId) => ({ type: 'DELETE_QUERY', payload: { queryId } });

export const upsertUser = (user) => ({ type: 'UPSERT_USER', payload: user });

export const setTheme = (theme) => ({ type: 'SET_THEME', payload: theme });
export const setSidebar = (open) => ({ type: 'SET_SIDEBAR', payload: open });
export const setForumModal = (open) => ({ type: 'SET_FORUM_MODAL', payload: open });
