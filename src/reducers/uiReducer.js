const THEME_KEY = 'canforums:theme';

function initialTheme() {
    try {
        return localStorage.getItem(THEME_KEY) || 'system';
    } catch (e) {
        return 'system';
    }
}

export default function uiReducer(state = { theme: initialTheme(), sidebarOpen: false, forumModal: false }, action) {
    switch (action.type) {
        case 'SET_THEME':
            try { localStorage.setItem(THEME_KEY, action.payload); } catch (e) { /* ignore */ }
            return { ...state, theme: action.payload };
        case 'SET_SIDEBAR':
            return { ...state, sidebarOpen: action.payload };
        case 'SET_FORUM_MODAL':
            return { ...state, forumModal: action.payload };
        default:
            return state;
    }
}
