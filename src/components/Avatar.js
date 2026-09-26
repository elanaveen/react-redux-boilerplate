import Icon from './Icon';
import { initials, toneFor } from '../utils/format';

export default function Avatar({ user, size = 32, anonymous = false }) {
    const style = { width: size, height: size, fontSize: Math.round(size * 0.4) };
    if (anonymous || !user) {
        return <span className="avatar avatar-anon" style={style} title="Anonymous student"><Icon name="ghost" size={Math.round(size * 0.55)} /></span>;
    }
    return (
        <span className="avatar" style={{ ...style, background: toneFor(user.id) }} title={user.name}>
            {initials(user.name)}
        </span>
    );
}

export function ForumMark({ forum, size = 32 }) {
    const style = { width: size, height: size, fontSize: Math.round(size * 0.5) };
    if (!forum) return <span className="forum-mark" style={style}><Icon name="globe" size={Math.round(size * 0.55)} /></span>;
    return <span className="forum-mark" style={style}>{forum.emoji}</span>;
}
