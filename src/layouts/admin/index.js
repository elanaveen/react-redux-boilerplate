import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../components/Icon';
import Avatar, { ForumMark } from '../../components/Avatar';
import { askConfirm, resolveReports, setStatus } from '../../actions/board';
import { isActive, reasonLabel } from '../../utils/selectors';
import { plural, timeAgo } from '../../utils/format';

const NOUN = { user: 'Account', query: 'Query', answer: 'Answer', forum: 'Forum' };
const TYPE_ICON = { user: 'user', query: 'message', answer: 'inbox', forum: 'users' };

// Resolves any report target to what a moderator needs to judge it.
function describe(board, targetType, targetId, queryId) {
    if (targetType === 'user') {
        const u = board.users[targetId];
        return { item: u, label: u ? u.name : 'Deleted account', body: u ? [u.email, u.major].filter(Boolean).join(' · ') : '', author: null };
    }
    if (targetType === 'forum') {
        const f = board.forums[targetId];
        return { item: f, label: f ? f.name : 'Deleted forum', body: f ? f.description : '', author: f && board.users[f.ownerId], forum: f };
    }
    const q = board.queries[queryId || targetId];
    if (targetType === 'query') {
        return {
            item: q, label: q ? q.title : 'Deleted query', body: q ? q.body : '',
            author: q && board.users[q.ownerId || q.authorId], anonymous: q && q.anonymous, forum: q && q.forumId && board.forums[q.forumId],
        };
    }
    const a = q && q.answers.find((x) => x.id === targetId);
    return {
        item: a, label: a ? a.body.slice(0, 90) : 'Deleted answer', body: a ? a.body : '', context: q && q.title,
        author: a && board.users[a.authorId], forum: q && q.forumId && board.forums[q.forumId],
    };
}

function StatusPill({ active }) {
    return <span className={`state ${active ? 'state-on' : 'state-off'}`}>{active ? 'Active' : 'Inactive'}</span>;
}

function Switch({ checked, onChange, label }) {
    return (
        <button role="switch" aria-checked={checked} aria-label={label} className={`switch ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}>
            <span className="switch-knob" />
        </button>
    );
}

// Deactivation asks first; reactivation is instant because it only restores access.
function useStatusToggle() {
    const dispatch = useDispatch();
    const admin = useSelector((s) => s.user);
    return (target, active) => {
        const run = () => dispatch(setStatus({ ...target, status: active ? 'active' : 'inactive' }, admin));
        if (active) return run();
        const noun = NOUN[target.kind].toLowerCase();
        dispatch(askConfirm({
            title: `Deactivate this ${noun}?`,
            body: target.kind === 'user'
                ? `${target.label} won't be able to sign in, and their queries and answers will be hidden from students until you reactivate the account.`
                : target.kind === 'forum'
                    ? `${target.label} and all of its queries will be hidden from students until you reactivate it.`
                    : `This ${noun} will be hidden from students until you reactivate it.`,
            confirmLabel: 'Deactivate', danger: true, onConfirm: run,
        }));
    };
}

function ReportGroup({ group, board }) {
    const dispatch = useDispatch();
    const admin = useSelector((s) => s.user);
    const { targetType, targetId, queryId, reports } = group;
    const d = describe(board, targetType, targetId, queryId);
    const active = isActive(d.item);
    const open = reports.some((r) => r.status === 'open');
    const reasons = reports.reduce((m, r) => ({ ...m, [r.reason]: (m[r.reason] || 0) + 1 }), {});
    const kind = targetType;

    const takeDown = () => dispatch(askConfirm({
        title: `Deactivate this ${NOUN[kind].toLowerCase()}?`,
        body: 'It will be hidden from students and the reports will be closed. You can reactivate it later from the tabs above.',
        confirmLabel: 'Deactivate', danger: true,
        onConfirm: () => {
            if (active) dispatch(setStatus({ kind, id: targetId, queryId, status: 'inactive', label: d.label }, admin));
            dispatch(resolveReports({ targetType, targetId, status: 'actioned', label: d.label }, admin));
        },
    }));
    const suspendAuthor = () => dispatch(askConfirm({
        title: `Suspend ${d.author.name}?`,
        body: 'They won\'t be able to sign in, and everything they posted will be hidden until you reactivate the account.',
        confirmLabel: 'Suspend account', danger: true,
        onConfirm: () => dispatch(setStatus({ kind: 'user', id: d.author.id, status: 'inactive', label: d.author.name }, admin)),
    }));
    const dismiss = () => dispatch(resolveReports({ targetType, targetId, status: 'dismissed', label: d.label }, admin));
    const closeOnly = () => dispatch(resolveReports({ targetType, targetId, status: 'actioned', label: d.label }, admin));

    return (
        <article className={`rcard ${open ? '' : 'rcard-closed'} ${reports.length >= 2 && open ? 'rcard-hot' : ''}`}>
            <div className="rcard-head">
                <span className="type-chip"><Icon name={TYPE_ICON[kind]} size={13} />{NOUN[kind]}</span>
                <span className="rcard-count tabnum">{plural(reports.length, 'report')}</span>
                <StatusPill active={active} />
                <span className="grow" />
                <span className="muted small">latest {timeAgo(Math.max(...reports.map((r) => r.createdAt)))}</span>
            </div>

            <div className="rcard-target">
                {kind === 'user' ? (
                    <div className="rcard-user"><Avatar user={d.item} size={36} /><div><b>{d.label}</b><div className="muted small">{d.body}</div></div></div>
                ) : kind === 'forum' ? (
                    <div className="rcard-user"><ForumMark forum={d.item} size={36} /><div><b>{d.label}</b><div className="muted small">{d.body}</div></div></div>
                ) : (
                    <>
                        {d.context && <div className="muted small">Answer on “{d.context}”</div>}
                        {kind === 'query' && <b className="rcard-title">{d.label}</b>}
                        {d.body && <p className="rcard-body">{d.body}</p>}
                    </>
                )}
                {d.author && kind !== 'user' && (
                    <div className="rcard-meta">
                        <Avatar user={d.author} size={20} />
                        <span>{d.anonymous ? `${d.author.name} (posted anonymously)` : d.author.name}</span>
                        {!isActive(d.author) && <span className="state state-off">Suspended</span>}
                        {d.forum && <><span className="dot">·</span><ForumMark forum={d.forum} size={16} />{d.forum.name}</>}
                    </div>
                )}
            </div>

            <div className="rcard-reasons">
                {Object.entries(reasons).map(([r, n]) => <span key={r} className="reason-chip">{reasonLabel(r)}{n > 1 && <b> ×{n}</b>}</span>)}
            </div>
            <ul className="rcard-notes">
                {reports.map((r) => {
                    const who = board.users[r.reporterId];
                    return (
                        <li key={r.id}>
                            <b>{who ? who.name : 'Student'}</b> <span className="muted">· {timeAgo(r.createdAt)}</span>
                            {r.note && <> — “{r.note}”</>}
                            {r.status !== 'open' && <span className={`outcome outcome-${r.status}`}>{r.status === 'dismissed' ? 'Dismissed' : 'Actioned'}</span>}
                        </li>
                    );
                })}
            </ul>

            {open && (
                <div className="rcard-actions">
                    {d.item && active && <button className="btn btn-sm btn-danger" onClick={takeDown}><Icon name="eyeOff" size={15} />Deactivate {NOUN[kind].toLowerCase()}</button>}
                    {d.item && !active && <button className="btn btn-sm btn-secondary" onClick={closeOnly}><Icon name="check" size={15} />Already inactive · close</button>}
                    {d.author && kind !== 'user' && isActive(d.author) && <button className="btn btn-sm btn-secondary" onClick={suspendAuthor}><Icon name="user" size={15} />Suspend author</button>}
                    <button className="btn btn-sm btn-ghost" onClick={dismiss}>Dismiss, no violation</button>
                </div>
            )}
        </article>
    );
}

function Reports({ board, needle }) {
    const [show, setShow] = useState('open');
    const groups = {};
    board.reports.forEach((r) => {
        const key = `${r.targetType}:${r.targetId}`;
        if (!groups[key]) groups[key] = { key, targetType: r.targetType, targetId: r.targetId, queryId: r.queryId, reports: [] };
        groups[key].reports.push(r);
    });
    const list = Object.values(groups)
        .filter((g) => show === 'all' || (show === 'open' ? g.reports.some((r) => r.status === 'open') : g.reports.every((r) => r.status !== 'open')))
        .filter((g) => !needle || describe(board, g.targetType, g.targetId, g.queryId).label.toLowerCase().includes(needle))
        // Most-reported first, then newest.
        .sort((a, b) => (b.reports.length - a.reports.length) || (Math.max(...b.reports.map((r) => r.createdAt)) - Math.max(...a.reports.map((r) => r.createdAt))));

    return (
        <>
            <div className="segmented" role="radiogroup" aria-label="Report status">
                {[['open', 'Needs review'], ['closed', 'Resolved'], ['all', 'All']].map(([id, label]) => (
                    <button key={id} role="radio" aria-checked={show === id} className={show === id ? 'on' : ''} onClick={() => setShow(id)}>{label}</button>
                ))}
            </div>
            {list.length === 0
                ? <div className="empty">{show === 'open' ? 'All clear. No reports waiting for review. 🎉' : 'Nothing here yet.'}</div>
                : <div className="rlist">{list.map((g) => <ReportGroup key={g.key} group={g} board={board} />)}</div>}
        </>
    );
}

const openReportCount = (board, type, id) => board.reports.filter((r) => r.status === 'open' && r.targetType === type && r.targetId === id).length;

function Accounts({ board, needle }) {
    const toggle = useStatusToggle();
    const rows = Object.values(board.users)
        .filter((u) => !needle || `${u.name} ${u.email} ${u.major}`.toLowerCase().includes(needle))
        .sort((a, b) => (openReportCount(board, 'user', b.id) - openReportCount(board, 'user', a.id)) || a.name.localeCompare(b.name));
    const counts = (id) => {
        let q = 0, a = 0;
        Object.values(board.queries).forEach((x) => { if ((x.ownerId || x.authorId) === id) q++; x.answers.forEach((y) => { if (y.authorId === id) a++; }); });
        return { q, a };
    };
    return (
        <div className="table-wrap">
            <table className="table">
                <thead><tr><th>Account</th><th>Joined</th><th className="num">Queries</th><th className="num">Answers</th><th className="num">Open reports</th><th>Status</th><th><span className="sr-only">Active</span></th></tr></thead>
                <tbody>
                    {rows.map((u) => {
                        const c = counts(u.id);
                        const reports = openReportCount(board, 'user', u.id);
                        const active = isActive(u);
                        return (
                            <tr key={u.id} className={active ? '' : 'row-off'}>
                                <td><div className="cell-user"><Avatar user={u} size={30} /><div><b>{u.name}</b><div className="muted small">{u.email}{u.major ? ` · ${u.major}` : ''}</div></div></div></td>
                                <td className="muted small">{timeAgo(u.joinedAt || Date.now())}</td>
                                <td className="num tabnum">{c.q}</td>
                                <td className="num tabnum">{c.a}</td>
                                <td className="num tabnum">{reports > 0 ? <span className="flag-count">{reports}</span> : <span className="muted">0</span>}</td>
                                <td><StatusPill active={active} /></td>
                                <td><Switch checked={active} label={`${u.name} active`} onChange={(v) => toggle({ kind: 'user', id: u.id, label: u.name }, v)} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function Posts({ board, needle }) {
    const toggle = useStatusToggle();
    const [filter, setFilter] = useState('all');
    const rows = [];
    Object.values(board.queries).forEach((q) => {
        const forum = q.forumId ? board.forums[q.forumId] : null;
        rows.push({ kind: 'query', id: q.id, queryId: q.id, label: q.title, text: q.body, author: board.users[q.ownerId || q.authorId], anonymous: q.anonymous, forum, at: q.createdAt, item: q });
        q.answers.forEach((a) => rows.push({ kind: 'answer', id: a.id, queryId: q.id, label: a.body.slice(0, 90), text: `On “${q.title}”`, author: board.users[a.authorId], forum, at: a.createdAt, item: a }));
    });
    const list = rows
        .map((r) => ({ ...r, reports: openReportCount(board, r.kind, r.id) }))
        .filter((r) => filter === 'all' || (filter === 'reported' ? r.reports > 0 : !isActive(r.item)))
        .filter((r) => !needle || `${r.label} ${r.text} ${r.author ? r.author.name : ''}`.toLowerCase().includes(needle))
        .sort((a, b) => (b.reports - a.reports) || (b.at - a.at));

    return (
        <>
            <div className="segmented" role="radiogroup" aria-label="Filter posts">
                {[['all', 'All posts'], ['reported', 'Reported'], ['inactive', 'Inactive']].map(([id, label]) => (
                    <button key={id} role="radio" aria-checked={filter === id} className={filter === id ? 'on' : ''} onClick={() => setFilter(id)}>{label}</button>
                ))}
            </div>
            {list.length === 0 ? <div className="empty">No posts match.</div> : (
                <div className="mod-list">
                    {list.map((r) => {
                        const active = isActive(r.item);
                        return (
                            <div key={r.kind + r.id} className={`mod-row ${active ? '' : 'row-off'}`}>
                                <span className="type-chip"><Icon name={TYPE_ICON[r.kind]} size={13} />{NOUN[r.kind]}</span>
                                <div className="grow">
                                    <b className="mod-title">{r.label}</b>
                                    <div className="muted small mod-sub">
                                        {r.author ? r.author.name : 'Unknown'}{r.anonymous ? ' (anonymous)' : ''} · {r.forum ? r.forum.name : 'Open Campus'} · {timeAgo(r.at)}
                                        {r.kind === 'answer' && <> · {r.text}</>}
                                    </div>
                                </div>
                                {r.reports > 0 && <span className="flag-count" title="Open reports"><Icon name="flag" size={12} />{r.reports}</span>}
                                <StatusPill active={active} />
                                <Switch checked={active} label={`${NOUN[r.kind]} active`} onChange={(v) => toggle({ kind: r.kind, id: r.id, queryId: r.queryId, label: r.label }, v)} />
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

function Forums({ board, needle }) {
    const toggle = useStatusToggle();
    const list = Object.values(board.forums)
        .filter((f) => !needle || `${f.name} ${f.description}`.toLowerCase().includes(needle))
        .sort((a, b) => (openReportCount(board, 'forum', b.id) - openReportCount(board, 'forum', a.id)) || a.name.localeCompare(b.name));
    return (
        <div className="mod-list">
            {list.map((f) => {
                const active = isActive(f);
                const owner = board.users[f.ownerId];
                const reports = openReportCount(board, 'forum', f.id);
                const queries = Object.values(board.queries).filter((q) => q.forumId === f.id).length;
                return (
                    <div key={f.id} className={`mod-row ${active ? '' : 'row-off'}`}>
                        <ForumMark forum={f} size={34} />
                        <div className="grow">
                            <b className="mod-title">{f.name}</b>
                            <div className="muted small mod-sub">
                                {f.visibility === 'private' ? 'Private' : 'Public'} · {plural(f.members.length, 'member')} · {plural(queries, 'query')} · owner {owner ? owner.name : 'unknown'}
                            </div>
                        </div>
                        {reports > 0 && <span className="flag-count" title="Open reports"><Icon name="flag" size={12} />{reports}</span>}
                        <StatusPill active={active} />
                        <Switch checked={active} label={`${f.name} active`} onChange={(v) => toggle({ kind: 'forum', id: f.id, label: f.name }, v)} />
                    </div>
                );
            })}
        </div>
    );
}

function Log({ board }) {
    if (board.modlog.length === 0) return <div className="empty">No moderation actions yet. Everything you change here is recorded.</div>;
    return (
        <ol className="modlog">
            {board.modlog.map((m) => (
                <li key={m.id}><Icon name="shield" size={14} /><span className="grow"><b>{m.adminName}</b> {m.text}</span><span className="muted small">{timeAgo(m.at)}</span></li>
            ))}
        </ol>
    );
}

export default function Admin() {
    const board = useSelector((s) => s.board);
    const [tab, setTab] = useState('reports');
    const [q, setQ] = useState('');
    const needle = q.trim().toLowerCase();

    const openReports = board.reports.filter((r) => r.status === 'open');
    const openTargets = new Set(openReports.map((r) => `${r.targetType}:${r.targetId}`)).size;
    const inactiveUsers = Object.values(board.users).filter((u) => !isActive(u)).length;
    const hiddenPosts = Object.values(board.queries).reduce((n, x) => n + (isActive(x) ? 0 : 1) + x.answers.filter((a) => !isActive(a)).length, 0);
    const pausedForums = Object.values(board.forums).filter((f) => !isActive(f)).length;

    const TABS = [
        ['reports', 'Reports', openTargets], ['accounts', 'Accounts'], ['posts', 'Posts'], ['forums', 'Forums'], ['log', 'Activity log'],
    ];

    return (
        <div className="page page-wide admin">
            <header className="page-head">
                <div>
                    <span className="eyebrow">Moderation</span>
                    <h1 className="display">Admin console</h1>
                    <p className="muted">Review what students reported and switch accounts, posts and forums on or off.</p>
                </div>
            </header>

            <div className="tiles">
                <button className={`tile ${openTargets ? 'tile-alert' : ''}`} onClick={() => setTab('reports')}>
                    <span className="tile-num tabnum">{openTargets}</span><span>Items to review</span><span className="muted small tabnum">{plural(openReports.length, 'open report')}</span>
                </button>
                <button className="tile" onClick={() => setTab('accounts')}><span className="tile-num tabnum">{inactiveUsers}</span><span>Suspended accounts</span><span className="muted small tabnum">of {Object.keys(board.users).length}</span></button>
                <button className="tile" onClick={() => setTab('posts')}><span className="tile-num tabnum">{hiddenPosts}</span><span>Inactive posts</span><span className="muted small">queries & answers</span></button>
                <button className="tile" onClick={() => setTab('forums')}><span className="tile-num tabnum">{pausedForums}</span><span>Inactive forums</span><span className="muted small tabnum">of {Object.keys(board.forums).length}</span></button>
            </div>

            <div className="toolbar">
                <div className="tabs" role="tablist">
                    {TABS.map(([id, label, n]) => (
                        <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
                            {label}{n ? <span className="tab-badge tabnum">{n}</span> : null}
                        </button>
                    ))}
                </div>
                {tab !== 'log' && (
                    <div className="searchbox">
                        <Icon name="search" size={16} />
                        <input id="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${tab}`} aria-label={`Search ${tab}`} />
                    </div>
                )}
            </div>

            {tab === 'reports' && <Reports board={board} needle={needle} />}
            {tab === 'accounts' && <Accounts board={board} needle={needle} />}
            {tab === 'posts' && <Posts board={board} needle={needle} />}
            {tab === 'forums' && <Forums board={board} needle={needle} />}
            {tab === 'log' && <Log board={board} />}
        </div>
    );
}
