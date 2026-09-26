import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import Avatar, { ForumMark } from './Avatar';
import { timeAgo, plural } from '../utils/format';
import { isSolved, visibleAnswers } from '../utils/selectors';
import { toggleQueryUpvote } from '../actions/board';
import { useBurst } from './Fx';

export default function QueryCard({ query, showForum = true }) {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const author = useSelector((s) => s.board.users[query.authorId]);
    const forum = useSelector((s) => (query.forumId ? s.board.forums[query.forumId] : null));
    const answerCount = useSelector((s) => visibleAnswers(s.board, query).length);
    const upvoted = query.upvotes.includes(me.id);
    const solved = isSolved(query);
    const [voteRef, burst] = useBurst();
    const vote = () => {
        if (!upvoted) burst('+1');
        dispatch(toggleQueryUpvote(query.id, me.id));
    };

    return (
        <article className={`qcard ${solved ? 'qcard-solved' : ''}`}>
            <button ref={voteRef} className={`vote ${upvoted ? 'vote-on' : ''}`} aria-pressed={upvoted} aria-label="Upvote query" onClick={vote}>
                <Icon name="chevronUp" size={18} strokeWidth={2} />
                <span>{query.upvotes.length}</span>
            </button>
            <div className="qcard-main">
                <div className="qcard-meta">
                    {showForum && (
                        <Link className="qcard-forum" to={forum ? `/forum/${forum.id}` : '/home'}>
                            <ForumMark forum={forum} size={18} />{forum ? forum.name : 'Open Campus'}
                        </Link>
                    )}
                    {showForum && <span className="dot">·</span>}
                    <span className="qcard-author">
                        <Avatar user={author} anonymous={query.anonymous} size={18} />
                        {query.anonymous ? 'Anonymous' : author ? author.name : 'Student'}
                    </span>
                    <span className="dot">·</span>
                    <span>{timeAgo(query.createdAt)}</span>
                </div>
                <Link to={`/query/${query.id}`} className="qcard-title">{query.title}</Link>
                {query.body && <p className="qcard-body">{query.body.replace(/```[\s\S]*?```/g, '[code]').slice(0, 180)}</p>}
                <div className="qcard-foot">
                    {solved ? (
                        <span className="status status-solved"><Icon name="checkCircle" size={14} />Solved</span>
                    ) : answerCount === 0 ? (
                        <span className="status status-open"><span className="pulse" />Needs help</span>
                    ) : null}
                    <Link to={`/query/${query.id}`} className="qcard-answers">
                        <Icon name="message" size={14} />{plural(answerCount, 'answer')}
                    </Link>
                    {query.tags.map((t) => <Link key={t} to={`/search?q=%23${t}`} className="tag">#{t}</Link>)}
                </div>
            </div>
        </article>
    );
}
