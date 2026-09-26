import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Composer from '../../components/Composer';
import QueryCard from '../../components/QueryCard';
import Icon, { Logo } from '../../components/Icon';
import { createQuery } from '../../actions/board';
import { feedFor } from '../../utils/selectors';
import { greeting } from '../../utils/format';

const FILTERS = [
    { id: 'foryou', label: 'For you', icon: 'sparkle' },
    { id: 'latest', label: 'Latest', icon: 'inbox' },
    { id: 'unanswered', label: 'Unanswered', icon: 'message' },
    { id: 'solved', label: 'Solved', icon: 'checkCircle' },
    { id: 'saved', label: 'Saved', icon: 'bookmark' },
];

const EMPTY = {
    foryou: 'Follow a few forums and their queries will land here.',
    latest: 'No queries yet. Be the first to ask!',
    unanswered: 'Every query has an answer. Nice work, campus.',
    solved: 'No solved queries yet.',
    saved: 'Save queries with the bookmark icon to find them later.',
};

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((s) => s.user);
    const board = useSelector((s) => s.board);
    const [filter, setFilter] = useState('foryou');
    const feed = feedFor(board, user.id, filter);

    const ask = (draft) => {
        const q = dispatch(createQuery(draft, user.id));
        navigate(`/query/${q.id}`);
    };

    return (
        <div className="page page-home">
            <header className="hero">
                <h1 className="serif hero-title"><Logo size={34} /> {greeting(user.name)}</h1>
            </header>

            <Composer mode="ask" onSubmit={ask} autoFocus />

            <div className="chips" role="tablist" aria-label="Feed filter">
                {FILTERS.map((f) => (
                    <button key={f.id} role="tab" aria-selected={filter === f.id} className={`chip ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
                        <Icon name={f.icon} size={15} />{f.label}
                    </button>
                ))}
            </div>

            <section className="feed">
                {feed.length === 0 ? <div className="empty">{EMPTY[filter]}</div> : feed.map((q) => <QueryCard key={q.id} query={q} />)}
            </section>
        </div>
    );
}
