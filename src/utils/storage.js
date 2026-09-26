import Cookies from 'js-cookie';

// Cookie and localStorage access can throw in sandboxed frames or private windows,
// so every read and write goes through these guards.

export function readCookie(key) {
    try {
        const raw = Cookies.get(key);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

export function writeCookie(key, value) {
    try {
        if (value) Cookies.set(key, JSON.stringify(value), { expires: 30 });
        else Cookies.remove(key);
    } catch (e) { /* cookies unavailable */ }
}

export function readLocal(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        return null;
    }
}

export function writeLocal(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* storage full or unavailable */ }
}
