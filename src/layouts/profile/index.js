import { memo, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar, { ForumMark } from '../../components/Avatar';
import Icon from '../../components/Icon';
import QueryCard from '../../components/QueryCard';
import { updateProfile } from '../../actions/auth';
import { badgesFor, followedForums, levelFor, streakFor, userStats, visibleQueries, XP } from '../../utils/selectors';

function LevelRing({ user, level }) {
    const r = 46;
    const c = 2 * Math.PI * r;
    return (
        <div className="ring" aria-label={`Level ${level.index}`}>
            <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">
                <circle cx="50" cy="50" r={r} className="ring-track" />
                <circle cx="50" cy="50" r={r} className="ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - level.progress)} />
            </svg>
            <Avatar user={user} size={76} />
            <span className="ring-lvl">Lv {level.index}</span>
        </div>
    );
}

function Profile(props) {
    const { user, board, saveprofile } = props;
    const [editing, setediting] = useState(false);
    const [form, setform] = useState(user);
    const stats = userStats(board, user.id);
    const level = levelFor(stats.points);
    const streak = streakFor(board, user.id);
    const badges = badgesFor(board, user.id);
    const myQueries = visibleQueries(board, user.id).filter((q) => (q.ownerId || q.authorId) === user.id);
    const forums = followedForums(board, user.id);

    const save = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        saveprofile({ ...user, name: form.name.trim(), college: (form.college || '').trim(), major: (form.major || '').trim() });
        setediting(false);
    };

    return (
        <div className="page">
            <header className="profile-head">
                <LevelRing user={user} level={level} />
                {editing ? (
                    <form className="grow profile-form" onSubmit={save}>
                        <input className="field" value={form.name} onChange={(e) => setform({ ...form, name: e.target.value })} aria-label="Name" />
                        <input className="field" value={form.college || ''} onChange={(e) => setform({ ...form, college: e.target.value })} aria-label="College" />
                        <input className="field" value={form.major || ''} onChange={(e) => setform({ ...form, major: e.target.value })} aria-label="Branch and year" placeholder="Branch · year" />
                        <div className="row">
                            <button type="button" className="btn btn-ghost" onClick={() => { setform(user); setediting(false); }}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                ) : (
                    <div className="grow">
                        <h1 className="display">{user.name}</h1>
                        <p className="muted">{[user.major, user.college].filter(Boolean).join(' · ')}</p>
                        <div className="profile-chips">
                            <span className="lvl">{level.name}</span>
                            <span className={`streak ${streak.activeToday ? 'streak-on' : ''}`}><Icon name="flame" size={15} />{streak.days}-day streak</span>
                        </div>
                    </div>
                )}
                {!editing && <button className="btn btn-secondary" onClick={() => { setform(user); setediting(true); }}><Icon name="edit" size={15} />Edit</button>}
            </header>

            <section className="panel">
                <div className="panel-label"><span className="tabnum">{stats.points} XP</span><span className="muted">{level.next ? `${level.toNext} XP to ${level.next.name}` : 'Max level reached'}</span></div>
                <div className="xpbar xpbar-lg"><span style={{ width: `${Math.max(3, level.progress * 100)}%` }} /></div>
                <div className="xp-rules">
                    <span>Ask <b>+{XP.query}</b></span>
                    <span>Answer <b>+{XP.answer}</b></span>
                    <span>Accepted <b>+{XP.accepted}</b></span>
                    <span>Helpful vote <b>+{XP.helpful}</b></span>
                    <span>Reaction <b>+{XP.reaction}</b></span>
                </div>
            </section>

            <div className="stats">
                <div className="stat"><b className="tabnum">{stats.answers}</b><span>Answers</span></div>
                <div className="stat"><b className="tabnum">{stats.accepted}</b><span>Accepted</span></div>
                <div className="stat"><b className="tabnum">{stats.helpful}</b><span>Helpful votes</span></div>
                <div className="stat"><b className="tabnum">{stats.queries}</b><span>Queries</span></div>
            </div>

            <div className="section-label">Badges <span className="muted tabnum">{badges.filter((b) => b.earned).length}/{badges.length}</span></div>
            <div className="badges">
                {badges.map((b) => (
                    <div key={b.id} className={`badge-card ${b.earned ? 'earned' : 'locked'}`} title={b.desc}>
                        <span className="badge-icon" aria-hidden="true">{b.icon}</span>
                        <b>{b.name}</b>
                        <span>{b.earned ? 'Unlocked' : b.desc}</span>
                    </div>
                ))}
            </div>

            <div className="section-label">Your forums</div>
            {forums.length === 0 ? <div className="empty">Not in any forums yet. <Link to="/forums">Discover some</Link></div> : (
                <div className="forum-pills">
                    {forums.map((f) => (
                        <Link key={f.id} to={`/forum/${f.id}`} className="pill"><ForumMark forum={f} size={18} />{f.name}</Link>
                    ))}
                </div>
            )}

            <div className="section-label">Your queries</div>
            <section className="feed">
                {myQueries.length === 0 ? <div className="empty">You haven't asked anything yet. <Link to="/home">Ask your first query</Link> to unlock <b>Curious Mind</b>.</div>
                    : myQueries.map((q) => <QueryCard key={q.id} query={q} />)}
            </section>
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user,
    board: state.board,
})

const mapDispatchToProps = dispatch => ({
    saveprofile: (user) => dispatch(updateProfile(user))
})
export default connect(mapStateToProps, mapDispatchToProps)(memo(Profile));
