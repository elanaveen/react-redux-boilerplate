import { userIdFromEmail } from '../utils/format';
import { upsertUser } from './board';
import { DEMO_ADMINS } from '../data/admins';

export const SUSPENDED_MESSAGE = 'This account is suspended by the moderators. Contact the forum admins if you think this is a mistake.';

export const login = ({ name, email, college, major }) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        // Mocked auth: a real backend would verify the college email with an OTP.
        setTimeout(() => {
            const user = { id: userIdFromEmail(email), name: name.trim(), email: email.trim().toLowerCase(), college: college.trim(), major: major.trim() };
            const existing = getState().board.users[user.id];
            if (existing && existing.status === 'inactive') return reject(SUSPENDED_MESSAGE);
            dispatch(upsertUser({ ...user, joinedAt: existing?.joinedAt ?? Date.now() }));
            dispatch({ type: 'GET_USER', payload: user });
            dispatch({ type: 'GET_ROLE', payload: 'student' });
            resolve(user);
        }, 600);
    })
}

export const adminLogin = ({ email, passcode }) => (dispatch) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const admin = DEMO_ADMINS.find((a) => a.email === email.trim().toLowerCase() && a.passcode === passcode);
            if (!admin) return reject('That email and passcode don\'t match a moderator account.');
            const user = { id: 'admin_' + userIdFromEmail(admin.email), name: admin.name, email: admin.email };
            dispatch({ type: 'GET_USER', payload: user });
            dispatch({ type: 'GET_ROLE', payload: 'admin' });
            resolve(user);
        }, 500);
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
