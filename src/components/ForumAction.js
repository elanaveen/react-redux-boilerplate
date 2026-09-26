import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { cancelRequest, followForum, leaveForum, requestJoin } from '../actions/board';
import { hasRequested, isMember, isOwner } from '../utils/selectors';

// Follow / Request / Leave button with the right state for the current student.
export default function ForumAction({ forum, size = '' }) {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const cls = `btn ${size}`;

    if (isOwner(forum, me.id)) return <span className={`${cls} btn-static`}><Icon name="user" size={15} />Owner</span>;

    if (isMember(forum, me.id)) {
        const label = forum.visibility === 'public' ? 'Following' : 'Member';
        return (
            <button className={`${cls} btn-secondary btn-toggle`} onClick={() => dispatch(leaveForum(forum.id, me.id))}
                data-hover={forum.visibility === 'public' ? 'Unfollow' : 'Leave'}>
                <Icon name="check" size={15} /><span>{label}</span>
            </button>
        );
    }

    if (forum.visibility === 'public') {
        return <button className={`${cls} btn-primary`} onClick={() => dispatch(followForum(forum.id, me.id))}><Icon name="plus" size={15} />Follow</button>;
    }

    if (hasRequested(forum, me.id)) {
        return (
            <button className={`${cls} btn-secondary btn-toggle`} onClick={() => dispatch(cancelRequest(forum.id, me.id))} data-hover="Cancel request">
                <Icon name="inbox" size={15} /><span>Requested</span>
            </button>
        );
    }

    return <button className={`${cls} btn-primary`} onClick={() => dispatch(requestJoin(forum.id, me.id))}><Icon name="lock" size={15} />Request to join</button>;
}
