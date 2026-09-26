import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { cancelRequest, followForum, leaveForum, requestJoin, toast } from '../actions/board';
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
            <button className={`${cls} btn-secondary btn-toggle pop-in`} onClick={() => dispatch(leaveForum(forum.id, me.id))}
                data-hover={forum.visibility === 'public' ? 'Unfollow' : 'Leave'}>
                <Icon name="check" size={15} /><span>{label}</span>
            </button>
        );
    }

    if (forum.visibility === 'public') {
        return <button className={`${cls} btn-primary`} onClick={() => {
            dispatch(followForum(forum.id, me.id));
            dispatch(toast({ icon: forum.emoji, title: `Following ${forum.name}`, sub: 'Its queries now show up in For you.' }));
        }}><Icon name="plus" size={15} />Follow</button>;
    }

    if (hasRequested(forum, me.id)) {
        return (
            <button className={`${cls} btn-secondary btn-toggle pop-in`} onClick={() => dispatch(cancelRequest(forum.id, me.id))} data-hover="Cancel request">
                <Icon name="inbox" size={15} /><span>Requested</span>
            </button>
        );
    }

    return <button className={`${cls} btn-primary`} onClick={() => {
        dispatch(requestJoin(forum.id, me.id));
        dispatch(toast({ icon: '📨', title: 'Request sent', sub: `The owner of ${forum.name} will review it.` }));
    }}><Icon name="lock" size={15} />Request to join</button>;
}
