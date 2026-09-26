import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { ForumMark } from '../../components/Avatar';
import ForumAction from '../../components/ForumAction';
import { setForumModal } from '../../actions/board';
import { isActive, isMember, isOwner, queryVisible } from '../../utils/selectors';
import { plural } from '../../utils/format';

const TABS = [
    { id: 'discover', label: 'Discover' },
    { id: 'following', label: 'Following' },
    { id: 'mine', label: 'Created by you' },
];

function ForumCard({ forum }) {
    const me = useSelector((s) => s.user);
    const queryCount = useSelector((s) => Object.values(s.board.queries).filter((q) => q.forumId === forum.id && queryVisible(s.board, q)).length);
    const owner = useSelector((s) => s.board.users[forum.ownerId]);
    const requests = isOwner(forum, me.id) ? forum.requests.length : 0;

    return (
        <article className="fcard">
            <Link to={`/forum/${forum.id}`} className="fcard-link" aria-label={forum.name} />
            <div className="fcard-top">
                <ForumMark forum={forum} size={40} />
                <span className={`vis vis-${forum.visibility}`}>
                    <Icon name={forum.visibility === 'private' ? 'lock' : 'globe'} size={12} />{forum.visibility === 'private' ? 'Private' : 'Public'}
                </span>
            </div>
            <h3 className="fcard-name">{forum.name}</h3>
            <p className="fcard-desc">{forum.description}</p>
            <div className="fcard-stats">
                <span>{plural(forum.members.length, forum.visibility === 'private' ? 'member' : 'follower')}</span>
                <span className="dot">·</span>
                <span>{plural(queryCount, 'query')}</span>
                {owner && <><span className="dot">·</span><span className="truncate">by {owner.name.split(' ')[0]}</span></>}
            </div>
            <div className="fcard-foot">
                <ForumAction forum={forum} size="btn-sm" />
                {requests > 0 && <Link to={`/forum/${forum.id}`} className="badge badge-lg">{plural(requests, 'request')}</Link>}
            </div>
        </article>
    );
}

export default function Forums() {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const forums = useSelector((s) => s.board.forums);
    const [tab, setTab] = useState('discover');
    const [vis, setVis] = useState('all');
    const [q, setQ] = useState('');

    const needle = q.trim().toLowerCase();
    const list = Object.values(forums)
        .filter(isActive)
        .filter((f) => tab === 'discover' || (tab === 'following' ? isMember(f, me.id) && !isOwner(f, me.id) : isOwner(f, me.id)))
        .filter((f) => vis === 'all' || f.visibility === vis)
        .filter((f) => !needle || `${f.name} ${f.description} ${f.tags.join(' ')}`.toLowerCase().includes(needle))
        .sort((a, b) => b.members.length - a.members.length);

    return (
        <div className="page page-wide">
            <header className="page-head">
                <div>
                    <h1 className="display">Forums</h1>
                    <p className="muted">Find your people: courses, clubs, hostels and study circles.</p>
                </div>
                <button className="btn btn-primary" onClick={() => dispatch(setForumModal(true))}><Icon name="plus" size={16} />New forum</button>
            </header>

            <div className="toolbar">
                <div className="tabs" role="tablist">
                    {TABS.map((t) => (
                        <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
                    ))}
                </div>
                <div className="searchbox">
                    <Icon name="search" size={16} />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search forums" aria-label="Search forums" />
                </div>
                <div className="segmented" role="radiogroup" aria-label="Visibility">
                    {['all', 'public', 'private'].map((v) => (
                        <button key={v} role="radio" aria-checked={vis === v} className={vis === v ? 'on' : ''} onClick={() => setVis(v)}>
                            {v[0].toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {list.length === 0 ? (
                <div className="empty">
                    {tab === 'mine' ? 'You haven\'t created a forum yet.' : tab === 'following' ? 'You aren\'t following any forums yet.' : 'No forums match that search.'}
                    {' '}<button className="linklike" onClick={() => dispatch(setForumModal(true))}>Start one</button>
                </div>
            ) : (
                <div className="grid">{list.map((f) => <ForumCard key={f.id} forum={f} />)}</div>
            )}
        </div>
    );
}
