import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import { ForumMark } from '../../components/Avatar';
import QueryCard from '../../components/QueryCard';
import { visibleQueries } from '../../utils/selectors';

export default function Search() {
    const [params, setParams] = useSearchParams();
    const q = params.get('q') || '';
    const me = useSelector((s) => s.user);
    const board = useSelector((s) => s.board);

    const needle = q.trim().toLowerCase();
    const tagOnly = needle.startsWith('#') ? needle.slice(1) : null;
    const queries = !needle ? [] : visibleQueries(board, me.id).filter((x) =>
        tagOnly ? x.tags.includes(tagOnly)
            : `${x.title} ${x.body} ${x.tags.join(' ')} ${x.answers.map((a) => a.body).join(' ')}`.toLowerCase().includes(needle));
    const forums = !needle ? [] : Object.values(board.forums).filter((f) =>
        tagOnly ? f.tags.includes(tagOnly) : `${f.name} ${f.description} ${f.tags.join(' ')}`.toLowerCase().includes(needle));

    return (
        <div className="page">
            <h1 className="display">Search</h1>
            <div className="searchbox searchbox-lg">
                <Icon name="search" size={18} />
                <input autoFocus value={q} placeholder="Search queries, answers, forums or #tags"
                    onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} aria-label="Search" />
            </div>

            {!needle && <div className="empty">Try <Link to="/search?q=%23resume">#resume</Link>, <Link to="/search?q=bus">bus</Link> or <Link to="/search?q=hackathon">hackathon</Link>.</div>}

            {forums.length > 0 && (
                <>
                    <div className="section-label">Forums</div>
                    <div className="card list">
                        {forums.map((f) => (
                            <Link key={f.id} to={`/forum/${f.id}`} className="person person-link">
                                <ForumMark forum={f} size={32} />
                                <span className="grow"><b>{f.name}</b><br /><span className="muted small truncate">{f.description}</span></span>
                                {f.visibility === 'private' && <Icon name="lock" size={14} className="muted" />}
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {needle && (
                <>
                    <div className="section-label">Queries</div>
                    <section className="feed">
                        {queries.length === 0 ? <div className="empty">No queries found. <Link to="/home">Ask it yourself</Link>. Someone probably has the same doubt.</div>
                            : queries.map((x) => <QueryCard key={x.id} query={x} />)}
                    </section>
                </>
            )}
        </div>
    );
}
