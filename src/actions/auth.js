import { userIdFromEmail } from '../utils/format';
import { upsertUser } from './board';

export const login = ({ name, email, college, major }) => (dispatch, getState) => {
    return new Promise((resolve) => {
        // Mocked auth: a real backend would verify the college email with an OTP.
        setTimeout(() => {
            const user = { id: userIdFromEmail(email), name: name.trim(), email: email.trim().toLowerCase(), college: college.trim(), major: major.trim() };
            const existing = getState().board.users[user.id];
            dispatch(upsertUser({ ...user, joinedAt: existing?.joinedAt ?? Date.now() }));
            dispatch({ type: 'GET_USER', payload: user });
            dispatch({ type: 'GET_ROLE', payload: 'student' });
            resolve(user);
        }, 600);
    })
}

export const logout = () => dispatch => {
    dispatch({ type: 'GET_USER', payload: null });
    dispatch({ type: 'GET_ROLE', payload: null });
    return Promise.resolve();
}

export const updateProfile = (user) => dispatch => {
    dispatch(upsertUser(user));
    dispatch({ type: 'GET_USER', payload: user });
}
