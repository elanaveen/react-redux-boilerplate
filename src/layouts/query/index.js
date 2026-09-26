import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Composer from '../../components/Composer';
import RichText from '../../components/RichText';
import Icon from '../../components/Icon';
import Avatar, { ForumMark } from '../../components/Avatar';
import { acceptAnswer, addAnswer, deleteQuery, followForum, toggleAnswerUpvote, toggleQueryUpvote, toggleSave } from '../../actions/board';
import { canPost, canView, isSolved } from '../../utils/selectors';
import { plural, timeAgo } from '../../utils/format';

function Answer({ query, answer, isAsker }) {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const author = useSelector((s) => s.board.users[answer.authorId]);
    const upvoted = answer.upvotes.includes(me.id);

    return (
        <article className={`answer ${answer.accepted ? 'answer-accepted' : ''}`}>
            <div className="answer-head">
                <Avatar user={author} size={28} />
                <span className="answer-author">{author ? author.name : 'Student'}</span>
                {author && author.major && <span className="muted small">{author.major}</span>}
                <span className="muted small">· {timeAgo(answer.createdAt)}</span>
                {answer.accepted && <span className="status status-solved"><Icon name="checkCircle" size={14} />Accepted</span>}
            </div>
            <RichText text={answer.body} className="serif-text" />
            <div className="actions">
                <button className={`action ${upvoted ? 'on' : ''}`} aria-pressed={upvoted} onClick={() => dispatch(toggleAnswerUpvote(query.id, answer.id, me.id))}>
                    <Icon name="chevronUp" size={16} strokeWidth={2} />Helpful · {answer.upvotes.length}
                </button>
                {isAsker && answer.authorId !== me.id && (
                    <button className={`action ${answer.accepted ? 'on' : ''}`} onClick={() => dispatch(acceptAnswer(query.id, answer.id))}>
                        <Icon name="check" size={16} />{answer.accepted ? 'Unaccept' : 'Accept answer'}
                    </button>
                )}
            </div>
        </article>
    );
}

export default function QueryThread() {
    const { queryId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const me = useSelector((s) => s.user);
    const query = useSelector((s) => s.board.queries[queryId]);
    const forum = useSelector((s) => (query && query.forumId ? s.board.forums[query.forumId] : null));
    const author = useSelector((s) => (query ? s.board.users[query.authorId] : null));

    if (!query) {
        return <div className="page"><div className="empty">This query doesn't exist or was deleted. <Link to="/home">Back home</Link></div></div>;
    }
    if (!canView(forum, me.id)) {
        return (
            <div className="page">
                <div className="locked card">
                    <Icon name="lock" size={28} />
                    <h2 className="serif">This query is in a private forum</h2>
                    <p className="muted">Request to join <b>{forum.name}</b> to read and answer it.</p>
                    <Link className="btn btn-primary" to={`/forum/${forum.id}`}>View forum</Link>
                </div>
            </div>
        );
    }

    const isAsker = (query.ownerId || query.authorId) === me.id;
    const upvoted = query.upvotes.includes(me.id);
    const saved = query.savedBy.includes(me.id);
    const answers = [...query.answers].sort((a, b) =>
        (b.accepted - a.accepted) || (b.upvotes.length - a.upvotes.length) || (a.createdAt - b.createdAt));

    const answer = ({ text }) => {
        dispatch(addAnswer(query.id, text, me.id));
        if (forum && forum.visibility === 'public') dispatch(followForum(forum.id, me.id));
    };

    const remove = () => {
        if (window.confirm('Delete this query and all its answers?')) {
            dispatch(deleteQuery(query.id));
            navigate('/home');
        }
    };

    return (
        <div className="page page-thread">
            <div className="crumbs">
                <Link to={forum ? `/forum/${forum.id}` : '/home'} className="crumb">
                    <Icon name="arrowLeft" size={16} /><ForumMark forum={forum} size={20} />{forum ? forum.name : 'Open Campus'}
                </Link>
            </div>

            <h1 className="serif thread-title">{query.title}</h1>
            <div className="thread-meta">
                <Avatar user={author} anonymous={query.anonymous} size={22} />
                <span>{query.anonymous ? 'Anonymous student' : author ? author.name : 'Student'}</span>
                <span className="dot">·</span><span>{timeAgo(query.createdAt)}</span>
                {isSolved(query) && <span className="status status-solved"><Icon name="checkCircle" size={14} />Solved</span>}
            </div>

            {(query.body || query.tags.length > 0) && (
                <div className="bubble">
                    {query.body && <RichText text={query.body} />}
                    {query.tags.length > 0 && (
                        <div className="bubble-tags">{query.tags.map((t) => <Link key={t} to={`/search?q=%23${t}`} className="tag">#{t}</Link>)}</div>
                    )}
                </div>
            )}

            <div className="actions">
                <button className={`action ${upvoted ? 'on' : ''}`} aria-pressed={upvoted} onClick={() => dispatch(toggleQueryUpvote(query.id, me.id))}>
                    <Icon name="chevronUp" size={16} strokeWidth={2} />Me too · {query.upvotes.length}
                </button>
                <button className={`action ${saved ? 'on' : ''}`} aria-pressed={saved} onClick={() => dispatch(toggleSave(query.id, me.id))}>
                    <Icon name="bookmark" size={15} />{saved ? 'Saved' : 'Save'}
                </button>
                {isAsker && (
                    <button className="action action-danger" onClick={remove}><Icon name="trash" size={15} />Delete</button>
                )}
            </div>

            <div className="divider"><span>{plural(query.answers.length, 'answer')}</span></div>

            {answers.length === 0 && (
                <div className="empty">No answers yet. If you know something, even a hint helps.</div>
            )}
            {answers.map((a) => <Answer key={a.id} query={query} answer={a} isAsker={isAsker} />)}

            {canPost(forum, me.id) && (
                <div className="dock">
                    <Composer mode="answer" compact placeholder={isAsker ? 'Add a follow-up or reply…' : 'Help out with an answer…'} onSubmit={answer} />
                    <div className="dock-note">Be kind. Explain the idea, not only the final answer.</div>
                </div>
            )}
        </div>
    );
}
