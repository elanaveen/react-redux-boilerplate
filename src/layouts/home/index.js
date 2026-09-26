import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Composer from '../../components/Composer';
import QueryCard from '../../components/QueryCard';
import Avatar from '../../components/Avatar';
import Icon from '../../components/Icon';
import { createQuery } from '../../actions/board';
import { feedFor, leaderboard, streakFor, todayQuests } from '../../utils/selectors';
import { greeting } from '../../utils/format';

const FILTERS = [
    { id: 'foryou', label: 'For you', icon: 'sparkle' },
    { id: 'latest', label: 'Latest', icon: 'inbox' },
    { id: 'unanswered', label: 'Needs help', icon: 'message' },
    { id: 'solved', label: 'Solved', icon: 'checkCircle' },
    { id: 'saved', label: 'Saved', icon: 'bookmark' },
];

const EMPTY = {
    foryou: 'Follow a few forums and their queries will land here.',
    latest: 'No queries yet. Be the first to ask!',
    unanswered: 'Every query has an answer. Nice work, VSB.',
    solved: 'No solved queries yet.',
    saved: 'Save queries with the bookmark icon to find them later.',
};

function TodayCard({ board, user }) {
    const quests = todayQuests(board, user.id);
    const streak = streakFor(board, user.id);
    const done = quests.filter((q) => q.done >= q.goal).length;

    return (
        <section className="panel today">
            <div className="today-head">
                <span className={`flame ${streak.activeToday ? 'flame-on' : ''}`}><Icon name="flame" size={22} /></span>
                <div>
                    <b className="display today-streak">{streak.days}-day streak</b>
                    <span className="muted small">{streak.activeToday ? 'Streak saved for today.' : 'Finish one quest to keep it alive.'}</span>
                </div>
            </div>
            <div className="panel-label"><span>Today's quests</span><span className="tabnum">{done}/{quests.length}</span></div>
            <ul className="quests">
                {quests.map((q) => {
                    const complete = q.done >= q.goal;
                    return (
                        <li key={q.id} className={complete ? 'done' : ''}>
                            <span className="check" aria-hidden="true">{complete && <Icon name="check" size={13} strokeWidth={3} />}</span>
                            <span className="grow">{q.label}{q.goal > 1 && <span className="muted tabnum"> · {q.done}/{q.goal}</span>}</span>
                            <span className="xp-chip">+{q.xp}</span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function Leaderboard({ board, user }) {
    const rows = leaderboard(board, 5);
    return (
        <section className="panel">
            <div className="panel-label"><span><Icon name="trophy" size={15} /> Top helpers</span><span className="muted">all time</span></div>
            <ol className="leaders">
                {rows.map((r, i) => (
                    <li key={r.user.id} className={r.user.id === user.id ? 'me' : ''}>
                        <span className={`rank rank-${i + 1}`}>{i + 1}</span>
                        <Avatar user={r.user} size={28} />
                        <span className="grow truncate">{r.user.name}{r.user.id === user.id && ' (you)'}</span>
                        <span className="tabnum leader-xp">{r.points} XP</span>
                    </li>
                ))}
            </ol>
            <Link to="/profile" className="panel-link">How XP works →</Link>
        </section>
    );
}

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((s) => s.user);
    const board = useSelector((s) => s.board);
    const [filter, setFilter] = useState('foryou');
    const feed = feedFor(board, user.id, filter);
    const needHelp = feedFor(board, user.id, 'unanswered').length;

    const ask = (draft) => {
        const q = dispatch(createQuery(draft, user.id));
        navigate(`/query/${q.id}`);
    };

    return (
        <div className="page page-home">
            <header className="hero">
                <span className="eyebrow">{greeting()}</span>
                <h1 className="display hero-title">Vanakkam, {user.name.split(' ')[0]} <span className="wave" aria-hidden="true">👋</span></h1>
                <p className="muted hero-sub">
                    {needHelp > 0 ? <>{needHelp} {needHelp === 1 ? 'classmate is' : 'classmates are'} waiting for help. <button className="linklike" onClick={() => setFilter('unanswered')}>Lend a hand</button></> : 'Ask anything. Your seniors and batchmates have your back.'}
                </p>
            </header>

            <Composer mode="ask" onSubmit={ask} />

            <div className="home-grid">
                <aside className="home-rail">
                    <TodayCard board={board} user={user} />
                    <Leaderboard board={board} user={user} />
                </aside>
                <div className="home-main">
                    <div className="chips" role="tablist" aria-label="Feed filter">
                        {FILTERS.map((f) => (
                            <button key={f.id} role="tab" aria-selected={filter === f.id} className={`chip ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
                                <Icon name={f.icon} size={15} />{f.label}
                            </button>
                        ))}
                    </div>
                    <section className="feed" key={filter}>
                        {feed.length === 0 ? <div className="empty">{EMPTY[filter]}</div> : feed.map((q) => <QueryCard key={q.id} query={q} />)}
                    </section>
                </div>
            </div>
        </div>
    );
}
