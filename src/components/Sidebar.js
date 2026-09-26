import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Icon, { Logo } from './Icon';
import Avatar, { ForumMark } from './Avatar';
import { followedForums, levelFor, pendingRequestCount, streakFor, userStats, visibleQueries } from '../utils/selectors';
import { setForumModal, setSidebar, setTheme } from '../actions/board';
import { logout } from '../actions/auth';

const THEMES = [
    { id: 'light', icon: 'sun', label: 'Light' },
    { id: 'dark', icon: 'moon', label: 'Dark' },
    { id: 'system', icon: 'monitor', label: 'System' },
];

function UserMenu({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useSelector((s) => s.ui.theme);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    return (
        <div className="popover-wrap usermenu" ref={ref}>
            {open && (
                <div className="popover popover-up">
                    <div className="popover-title">{user.email}</div>
                    <Link className="popover-item" to="/profile" onClick={() => setOpen(false)}><Icon name="user" size={16} />Profile</Link>
                    <div className="theme-switch" role="radiogroup" aria-label="Theme">
                        {THEMES.map((t) => (
                            <button key={t.id} role="radio" aria-checked={theme === t.id} className={theme === t.id ? 'on' : ''}
                                onClick={() => dispatch(setTheme(t.id))} title={t.label}>
                                <Icon name={t.icon} size={15} />
                            </button>
                        ))}
                    </div>
                    <button className="popover-item" onClick={() => dispatch(logout()).then(() => navigate('/'))}>
                        <Icon name="logout" size={16} />Log out
                    </button>
                </div>
            )}
            <button className="userchip" onClick={() => setOpen(!open)} aria-expanded={open}>
                <Avatar user={user} size={30} />
                <span className="grow">
                    <span className="userchip-name">{user.name}</span>
                    <span className="userchip-sub">{user.college}</span>
                </span>
                <Icon name="chevronUp" size={14} />
            </button>
        </div>
    );
}

function XpCard({ board, user }) {
    const { points } = userStats(board, user.id);
    const level = levelFor(points);
    const streak = streakFor(board, user.id);
    return (
        <Link to="/profile" className="xpcard" aria-label={`Level ${level.index} ${level.name}, ${points} XP, ${streak.days} day streak`}>
            <div className="xpcard-row">
                <span className="lvl">Lv {level.index}</span>
                <span className="xpcard-name">{level.name}</span>
                <span className={`streak ${streak.activeToday ? 'streak-on' : ''}`} title={streak.activeToday ? 'Streak kept today' : 'Do something today to keep your streak'}>
                    <Icon name="flame" size={15} />{streak.days}
                </span>
            </div>
            <div className="xpbar"><span style={{ width: `${Math.max(4, level.progress * 100)}%` }} /></div>
            <div className="xpcard-sub">{level.next ? `${points} XP · ${level.toNext} to ${level.next.name}` : `${points} XP · max level`}</div>
        </Link>
    );
}

export default function Sidebar() {
    const dispatch = useDispatch();
    const user = useSelector((s) => s.user);
    const board = useSelector((s) => s.board);
    const open = useSelector((s) => s.ui.sidebarOpen);
    const following = followedForums(board, user.id);
    const pending = pendingRequestCount(board, user.id);
    const recents = visibleQueries(board, user.id)
        .filter((q) => (q.ownerId || q.authorId) === user.id || q.answers.some((a) => a.authorId === user.id))
        .slice(0, 6);
    const close = () => dispatch(setSidebar(false));

    return (
        <>
            <div className={`scrim ${open ? 'show' : ''}`} onClick={close} />
            <aside className={`sidebar ${open ? 'open' : ''}`} onClick={(e) => { if (e.target.closest('a')) close(); }}>
                <div className="sidebar-head">
                    <Link to="/home" className="brand"><Logo size={28} /><span>VSB <em>Forums</em></span></Link>
                    <button className="icon-btn only-mobile" onClick={close} aria-label="Close menu"><Icon name="x" /></button>
                </div>

                <XpCard board={board} user={user} />

                <Link to="/home" className="new-query"><span className="new-query-icon"><Icon name="plus" size={16} strokeWidth={2.25} /></span>New query</Link>

                <nav className="nav">
                    <NavLink to="/home"><Icon name="home" />Home</NavLink>
                    <NavLink to="/forums"><Icon name="compass" />Forums
                        {pending > 0 && <span className="badge" title="Pending join requests">{pending}</span>}
                    </NavLink>
                    <NavLink to="/search"><Icon name="search" />Search</NavLink>
                    <button onClick={() => { close(); dispatch(setForumModal(true)); }}><Icon name="users" />New forum</button>
                </nav>

                <div className="sidebar-scroll">
                    <div className="nav-section">Following</div>
                    {following.length === 0 && <div className="nav-empty">Follow forums to see them here.</div>}
                    <nav className="nav nav-sub">
                        {following.map((f) => (
                            <NavLink key={f.id} to={`/forum/${f.id}`}>
                                <ForumMark forum={f} size={20} /><span className="truncate">{f.name}</span>
                                {f.visibility === 'private' && <Icon name="lock" size={13} className="muted" />}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="nav-section">Your activity</div>
                    {recents.length === 0 && <div className="nav-empty">Your queries and answers will show up here.</div>}
                    <nav className="nav nav-sub">
                        {recents.map((q) => (
                            <NavLink key={q.id} to={`/query/${q.id}`}><span className="truncate">{q.title}</span></NavLink>
                        ))}
                    </nav>
                </div>

                <UserMenu user={user} />
                <div className="unofficial">Student-run · not an official college site</div>
            </aside>
        </>
    );
}
