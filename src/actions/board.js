import { uid } from '../utils/format';
import { XP } from '../utils/selectors';

const logActivity = (userId, type) => ({ type: 'LOG_ACTIVITY', payload: { userId, type, at: Date.now() } });

export const toast = ({ icon = '✨', title, sub = '', tone = 'brand' }) => (dispatch) => {
    dispatch({ type: 'PUSH_TOAST', payload: { id: uid('t'), icon, title, sub, tone } });
};
export const dismissToast = (id) => ({ type: 'DISMISS_TOAST', payload: id });
export const confetti = () => ({ type: 'CONFETTI' });

// In-page confirmation dialog; window.confirm is not available everywhere the app runs.
export const askConfirm = ({ title, body, confirmLabel = 'Confirm', danger = false, onConfirm }) =>
    ({ type: 'SET_CONFIRM', payload: { title, body, confirmLabel, danger, onConfirm } });
export const closeConfirm = () => ({ type: 'SET_CONFIRM', payload: null });

export const createForum = ({ name, emoji, description, visibility, tags }, ownerId) => (dispatch) => {
    const forum = {
        id: uid('f'), name: name.trim(), emoji: emoji || '💬', description: description.trim(),
        visibility, tags, ownerId, members: [ownerId], requests: [], createdAt: Date.now(),
    };
    dispatch({ type: 'CREATE_FORUM', payload: forum });
    dispatch(logActivity(ownerId, 'forum'));
    dispatch(confetti());
    dispatch(toast({ icon: '🏗️', title: `${forum.name} is live`, sub: visibility === 'private' ? 'Share it and approve who joins.' : 'Invite classmates to follow it.' }));
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
    dispatch(logActivity(authorId, 'ask'));
    const forum = forumId && getState().board.forums[forumId];
    if (forum && forum.visibility === 'public') {
        dispatch({ type: 'FOLLOW_FORUM', payload: { forumId, userId: authorId } });
    }
    dispatch(toast({ icon: '🙋', title: `+${XP.query} XP · Query posted`, sub: 'Classmates get notified in the feed.' }));
    return query;
};

export const addAnswer = (queryId, body, authorId) => (dispatch) => {
    dispatch({
        type: 'ADD_ANSWER',
        payload: { queryId, answer: { id: uid('a'), authorId, body: body.trim(), upvotes: [], reactions: {}, accepted: false, createdAt: Date.now() } },
    });
    dispatch(logActivity(authorId, 'answer'));
    dispatch(toast({ icon: '🤝', title: `+${XP.answer} XP · Thanks for helping`, sub: `Get it accepted for +${XP.accepted} more.` }));
};

export const reactToAnswer = (queryId, answerId, emoji, userId) => (dispatch, getState) => {
    const answer = getState().board.queries[queryId].answers.find((a) => a.id === answerId);
    const adding = !((answer.reactions || {})[emoji] || []).includes(userId);
    dispatch({ type: 'REACT_ANSWER', payload: { queryId, answerId, emoji, userId } });
    if (adding) dispatch(logActivity(userId, 'react'));
};

export const acceptAnswer = (queryId, answerId) => (dispatch, getState) => {
    const answer = getState().board.queries[queryId].answers.find((a) => a.id === answerId);
    dispatch({ type: 'ACCEPT_ANSWER', payload: { queryId, answerId } });
    if (!answer.accepted) {
        const author = getState().board.users[answer.authorId];
        dispatch(confetti());
        dispatch(toast({ icon: '🏆', tone: 'amber', title: 'Solved!', sub: `${author ? author.name.split(' ')[0] : 'They'} earned +${XP.accepted} XP.` }));
    }
};

export const followForum = (forumId, userId) => ({ type: 'FOLLOW_FORUM', payload: { forumId, userId } });
export const leaveForum = (forumId, userId) => ({ type: 'LEAVE_FORUM', payload: { forumId, userId } });
export const requestJoin = (forumId, userId) => ({ type: 'REQUEST_JOIN', payload: { forumId, userId } });
export const cancelRequest = (forumId, userId) => ({ type: 'CANCEL_REQUEST', payload: { forumId, userId } });
export const resolveRequest = (forumId, userId, approve) => ({ type: 'RESOLVE_REQUEST', payload: { forumId, userId, approve } });
export const updateForum = (id, patch) => ({ type: 'UPDATE_FORUM', payload: { id, patch } });

export const toggleQueryUpvote = (queryId, userId) => ({ type: 'TOGGLE_QUERY_UPVOTE', payload: { queryId, userId } });
export const toggleSave = (queryId, userId) => ({ type: 'TOGGLE_SAVE', payload: { queryId, userId } });
export const toggleAnswerUpvote = (queryId, answerId, userId) => ({ type: 'TOGGLE_ANSWER_UPVOTE', payload: { queryId, answerId, userId } });
export const deleteQuery = (queryId) => ({ type: 'DELETE_QUERY', payload: { queryId } });

export const upsertUser = (user) => ({ type: 'UPSERT_USER', payload: user });

export const setTheme = (theme) => ({ type: 'SET_THEME', payload: theme });
export const setSidebar = (open) => ({ type: 'SET_SIDEBAR', payload: open });
export const setForumModal = (open) => ({ type: 'SET_FORUM_MODAL', payload: open });
