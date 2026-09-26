import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Composer from '../../components/Composer';
import QueryCard from '../../components/QueryCard';
import ForumAction from '../../components/ForumAction';
import Icon from '../../components/Icon';
import Avatar, { ForumMark } from '../../components/Avatar';
import { createQuery, leaveForum, resolveRequest, updateForum } from '../../actions/board';
import { canPost, canView, isOwner } from '../../utils/selectors';
import { plural, timeAgo } from '../../utils/format';

function Requests({ forum }) {
    const dispatch = useDispatch();
    const users = useSelector((s) => s.board.users);
    if (forum.requests.length === 0) return null;
    return (
        <section className="card requests">
            <div className="requests-head"><Icon name="inbox" size={16} /><b>{plural(forum.requests.length, 'join request')}</b></div>
            {forum.requests.map((id) => {
                const u = users[id];
                return (
                    <div className="person" key={id}>
                        <Avatar user={u} size={32} />
                        <span className="grow"><b>{u ? u.name : 'Student'}</b><br /><span className="muted small">{u && u.major}</span></span>
                        <button className="btn btn-sm btn-ghost" onClick={() => dispatch(resolveRequest(forum.id, id, false))}>Decline</button>
                        <button className="btn btn-sm btn-primary" onClick={() => dispatch(resolveRequest(forum.id, id, true))}>Approve</button>
                    </div>
                );
            })}
        </section>
    );
}

function Members({ forum }) {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const users = useSelector((s) => s.board.users);
    const owner = isOwner(forum, me.id);
    return (
        <div className="card list">
            {forum.members.map((id) => {
                const u = users[id];
                return (
                    <div className="person" key={id}>
                        <Avatar user={u} size={32} />
                        <span className="grow"><b>{u ? u.name : 'Student'}</b>{id === me.id && <span className="muted"> (you)</span>}<br /><span className="muted small">{u && u.major}</span></span>
                        {id === forum.ownerId ? <span className="vis">Owner</span>
                            : owner && <button className="btn btn-sm btn-ghost" onClick={() => dispatch(leaveForum(forum.id, id))}>Remove</button>}
                    </div>
                );
            })}
        </div>
    );
}

function About({ forum }) {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const owner = useSelector((s) => s.board.users[forum.ownerId]);
    const isMine = isOwner(forum, me.id);

    const switchVisibility = () => {
        const next = forum.visibility === 'public' ? 'private' : 'public';
        const msg = next === 'public'
            ? 'Make this forum public? Anyone will be able to read it, and pending requests will be approved.'
            : 'Make this forum private? Current followers stay as members, and new students will need your approval.';
        if (!window.confirm(msg)) return;
        dispatch(updateForum(forum.id, next === 'public'
            ? { visibility: next, members: [...forum.members, ...forum.requests], requests: [] }
            : { visibility: next }));
    };

    return (
        <div className="card about">
            <p className="serif-text">{forum.description}</p>
            <dl>
                <dt>Created</dt><dd>{timeAgo(forum.createdAt)} by {owner ? owner.name : 'a student'}</dd>
                <dt>Visibility</dt><dd>{forum.visibility === 'private' ? 'Private: members only, joining needs approval' : 'Public: anyone can read and follow'}</dd>
                {forum.tags.length > 0 && <><dt>Tags</dt><dd>{forum.tags.map((t) => <span key={t} className="tag">#{t}</span>)}</dd></>}
            </dl>
            {isMine && (
                <div className="about-owner">
                    <button className="btn btn-secondary" onClick={switchVisibility}>
                        <Icon name={forum.visibility === 'public' ? 'lock' : 'globe'} size={15} />
                        Make {forum.visibility === 'public' ? 'private' : 'public'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Forum() {
    const { forumId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const me = useSelector((s) => s.user);
    const forum = useSelector((s) => s.board.forums[forumId]);
    const queries = useSelector((s) => Object.values(s.board.queries)
        .filter((q) => q.forumId === forumId).sort((a, b) => b.createdAt - a.createdAt));
    const [tab, setTab] = useState('queries');

    if (!forum) {
        return <div className="page"><div className="empty">Forum not found. <Link to="/forums">Browse forums</Link></div></div>;
    }

    const visible = canView(forum, me.id);
    const ask = (draft) => {
        const q = dispatch(createQuery(draft, me.id));
        navigate(`/query/${q.id}`);
    };

    return (
        <div className="page">
            <header className="forum-head">
                <ForumMark forum={forum} size={56} />
                <div className="grow">
                    <div className="forum-title-row">
                        <h1 className="serif">{forum.name}</h1>
                        <span className={`vis vis-${forum.visibility}`}>
                            <Icon name={forum.visibility === 'private' ? 'lock' : 'globe'} size={12} />{forum.visibility === 'private' ? 'Private' : 'Public'}
                        </span>
                    </div>
                    <p className="muted forum-desc">{forum.description}</p>
                    <div className="forum-stats muted small">
                        {plural(forum.members.length, forum.visibility === 'private' ? 'member' : 'follower')} · {plural(queries.length, 'query')}
                    </div>
                </div>
                <ForumAction forum={forum} />
            </header>

            {isOwner(forum, me.id) && <Requests forum={forum} />}

            {!visible ? (
                <div className="locked card">
                    <Icon name="lock" size={28} />
                    <h2 className="serif">This is a private forum</h2>
                    <p className="muted">Queries here are only visible to members. Request to join and the owner will review it.</p>
                    <ForumAction forum={forum} />
                </div>
            ) : (
                <>
                    {canPost(forum, me.id) && (
                        <Composer mode="ask" forumId={forum.id} lockForum placeholder={`Ask ${forum.name}…`} onSubmit={ask} />
                    )}
                    <div className="tabs tabs-line" role="tablist">
                        {[['queries', 'Queries'], ['members', forum.visibility === 'private' ? 'Members' : 'Followers'], ['about', 'About']].map(([id, label]) => (
                            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
                        ))}
                    </div>
                    {tab === 'queries' && (
                        <section className="feed">
                            {queries.length === 0 ? <div className="empty">No queries here yet. Start the conversation!</div>
                                : queries.map((q) => <QueryCard key={q.id} query={q} showForum={false} />)}
                        </section>
                    )}
                    {tab === 'members' && <Members forum={forum} />}
                    {tab === 'about' && <About forum={forum} />}
                </>
            )}
        </div>
    );
}
