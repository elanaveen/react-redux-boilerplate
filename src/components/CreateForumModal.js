import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { createForum, setForumModal } from '../actions/board';
import { normalizeTag } from '../utils/format';

const EMOJIS = ['💬', '📚', '🧪', '💻', '🌳', '∫', '🎨', '🎸', '⚽', '🏠', '💼', '🔭', '🧠', '🌱'];

const VISIBILITY = [
    { id: 'public', icon: 'globe', title: 'Public', desc: 'Anyone on campus can read, follow and ask.' },
    { id: 'private', icon: 'lock', title: 'Private', desc: 'Only people you approve can see queries.' },
];

export default function CreateForumModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((s) => s.user);
    const open = useSelector((s) => s.ui.forumModal);
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('💬');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [visibility, setVisibility] = useState('public');

    const close = () => dispatch(setForumModal(false));

    useEffect(() => {
        if (!open) return;
        setName(''); setEmoji('💬'); setDescription(''); setTags(''); setVisibility('public');
        const esc = (e) => { if (e.key === 'Escape') dispatch(setForumModal(false)); };
        document.addEventListener('keydown', esc);
        return () => document.removeEventListener('keydown', esc);
    }, [open, dispatch]);

    if (!open) return null;

    const valid = name.trim().length >= 3 && description.trim().length >= 10;

    const submit = (e) => {
        e.preventDefault();
        if (!valid) return;
        const tagList = [...new Set(tags.split(',').map(normalizeTag).filter(Boolean))].slice(0, 5);
        const forum = dispatch(createForum({ name, emoji, description, visibility, tags: tagList }, user.id));
        close();
        navigate(`/forum/${forum.id}`);
    };

    return (
        <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
            <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="new-forum-title">
                <div className="modal-head">
                    <h2 id="new-forum-title" className="serif">Start a forum</h2>
                    <button type="button" className="icon-btn" onClick={close} aria-label="Close"><Icon name="x" /></button>
                </div>
                <p className="muted modal-sub">Create a space for a course, club, hostel or anything your campus cares about.</p>

                <label className="field-label">Icon</label>
                <div className="emoji-row">
                    {EMOJIS.map((e) => (
                        <button type="button" key={e} className={`emoji ${emoji === e ? 'on' : ''}`} onClick={() => setEmoji(e)} aria-label={`Icon ${e}`}>{e}</button>
                    ))}
                </div>

                <label className="field-label" htmlFor="forum-name">Name</label>
                <input id="forum-name" className="field" autoFocus maxLength={60} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CS201 · Data Structures" />

                <label className="field-label" htmlFor="forum-desc">What's it about?</label>
                <textarea id="forum-desc" className="field" rows={3} maxLength={280} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell students what they can ask and how the forum works." />

                <label className="field-label" htmlFor="forum-tags">Tags <span className="muted">(comma separated, optional)</span></label>
                <input id="forum-tags" className="field" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="cse, dsa, exams" />

                <label className="field-label">Who can join?</label>
                <div className="visibility-grid" role="radiogroup">
                    {VISIBILITY.map((v) => (
                        <button type="button" key={v.id} role="radio" aria-checked={visibility === v.id}
                            className={`visibility-card ${visibility === v.id ? 'on' : ''}`} onClick={() => setVisibility(v.id)}>
                            <Icon name={v.icon} size={20} />
                            <span className="visibility-title">{v.title}</span>
                            <span className="visibility-desc">{v.desc}</span>
                        </button>
                    ))}
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={!valid}>Create forum</button>
                </div>
            </form>
        </div>
    );
}
