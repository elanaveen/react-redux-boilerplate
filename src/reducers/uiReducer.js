import { readLocal, writeLocal } from '../utils/storage';

const THEME_KEY = 'vsbforums:theme';

const initial = { theme: readLocal(THEME_KEY) || 'system', sidebarOpen: false, forumModal: false, toasts: [], confetti: 0, confirm: null, report: null };

export default function uiReducer(state = initial, action) {
    switch (action.type) {
        case 'SET_THEME':
            writeLocal(THEME_KEY, action.payload);
            return { ...state, theme: action.payload };
        case 'SET_SIDEBAR':
            return { ...state, sidebarOpen: action.payload };
        case 'SET_FORUM_MODAL':
            return { ...state, forumModal: action.payload };
        case 'PUSH_TOAST':
            return { ...state, toasts: [...state.toasts.slice(-2), action.payload] };
        case 'DISMISS_TOAST':
            return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
        case 'CONFETTI':
            return { ...state, confetti: state.confetti + 1 };
        case 'SET_REPORT':
            return { ...state, report: action.payload };
        case 'SET_CONFIRM':
            return { ...state, confirm: action.payload };
        default:
            return state;
    }
}
