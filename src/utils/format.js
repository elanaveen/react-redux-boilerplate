export const uid = (prefix = 'id') =>
    `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const userIdFromEmail = (email = '') =>
    'u_' + email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');

export function timeAgo(ts) {
    const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function greeting() {
    const h = new Date().getHours();
    if (h < 5) return 'Burning the midnight oil';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export const initials = (name = '?') =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?';

const AVATAR_TONES = ['#16307A', '#E07A1F', '#2A7DE1', '#C2417A', '#1B8A6B', '#7A4FD1', '#D14F3F'];
export function toneFor(key = '') {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return AVATAR_TONES[h % AVATAR_TONES.length];
}

export const plural = (n, word) =>
    `${n} ${n === 1 ? word : /[^aeiou]y$/.test(word) ? word.slice(0, -1) + 'ies' : word + 's'}`;

export const normalizeTag = (t) => t.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9+#.-]+/g, '-').slice(0, 24);
