import { memo, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar, { ForumMark } from '../../components/Avatar';
import Icon from '../../components/Icon';
import QueryCard from '../../components/QueryCard';
import { updateProfile } from '../../actions/auth';
import { followedForums, userStats, visibleQueries } from '../../utils/selectors';

function Profile(props) {
    const { user, board, saveprofile } = props;
    const [editing, setediting] = useState(false);
    const [form, setform] = useState(user);
    const stats = userStats(board, user.id);
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
                <Avatar user={user} size={72} />
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
                        <h1 className="serif">{user.name}</h1>
                        <p className="muted">{[user.major, user.college].filter(Boolean).join(' · ')}</p>
                        <p className="muted small">{user.email}</p>
                    </div>
                )}
                {!editing && <button className="btn btn-secondary" onClick={() => { setform(user); setediting(true); }}><Icon name="edit" size={15} />Edit</button>}
            </header>

            <div className="stats">
                <div className="stat stat-accent"><b>{stats.points}</b><span>Helpfulness points</span></div>
                <div className="stat"><b>{stats.answers}</b><span>Answers</span></div>
                <div className="stat"><b>{stats.accepted}</b><span>Accepted</span></div>
                <div className="stat"><b>{stats.queries}</b><span>Queries</span></div>
            </div>
            <p className="muted small">+10 points for each accepted answer and +2 for each "helpful" vote your answers get.</p>

            <div className="nav-section">Your forums</div>
            {forums.length === 0 ? <div className="empty">Not in any forums yet. <Link to="/forums">Discover some</Link></div> : (
                <div className="forum-pills">
                    {forums.map((f) => (
                        <Link key={f.id} to={`/forum/${f.id}`} className="pill"><ForumMark forum={f} size={18} />{f.name}</Link>
                    ))}
                </div>
            )}

            <div className="nav-section">Your queries</div>
            <section className="feed">
                {myQueries.length === 0 ? <div className="empty">You haven't asked anything yet. <Link to="/home">Ask your first query</Link></div>
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
