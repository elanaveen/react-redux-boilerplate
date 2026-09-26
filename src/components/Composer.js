import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from './Icon';
import { ForumMark } from './Avatar';
import { canPost } from '../utils/selectors';
import { normalizeTag } from '../utils/format';

function useAutoGrow(ref, value, max = 320) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, max) + 'px';
    }, [ref, value, max]);
}

function usePopover() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open) return;
        const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', esc);
        return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
    }, [open]);
    return { open, setOpen, ref };
}

function ForumPicker({ value, onChange, locked }) {
    const user = useSelector((s) => s.user);
    const forums = useSelector((s) => s.board.forums);
    const { open, setOpen, ref } = usePopover();
    const options = Object.values(forums).filter((f) => canPost(f, user.id)).sort((a, b) => a.name.localeCompare(b.name));
    const current = value ? forums[value] : null;

    return (
        <div className="popover-wrap" ref={ref}>
            <button type="button" className="pill" disabled={locked} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
                <ForumMark forum={current} size={18} />
                <span className="pill-label">{current ? current.name : 'Open Campus'}</span>
                {!locked && <Icon name="chevronDown" size={14} />}
            </button>
            {open && (
                <div className="popover" role="listbox">
                    <div className="popover-title">Post to</div>
                    {[null, ...options].map((f) => (
                        <button type="button" key={f ? f.id : 'open'} role="option" aria-selected={value === (f ? f.id : null)}
                            className={`popover-item ${value === (f ? f.id : null) ? 'selected' : ''}`}
                            onClick={() => { onChange(f ? f.id : null); setOpen(false); }}>
                            <ForumMark forum={f} size={22} />
                            <span className="grow">
                                <span className="popover-item-name">{f ? f.name : 'Open Campus'}</span>
                                <span className="popover-item-sub">{f ? (f.visibility === 'private' ? 'Private forum' : 'Public forum') : 'Visible to every student'}</span>
                            </span>
                            {value === (f ? f.id : null) && <Icon name="check" size={16} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Composer({
    mode = 'ask', placeholder, forumId = null, lockForum = false, autoFocus = false, onSubmit, compact = false,
}) {
    const [text, setText] = useState('');
    const [target, setTarget] = useState(forumId);
    const [tags, setTags] = useState([]);
    const [tagDraft, setTagDraft] = useState('');
    const [tagging, setTagging] = useState(false);
    const [anonymous, setAnonymous] = useState(false);
    const ref = useRef(null);
    useAutoGrow(ref, text, compact ? 200 : 320);

    useEffect(() => { setTarget(forumId); }, [forumId]);

    const ready = text.trim().length >= (mode === 'ask' ? 8 : 2);

    const addTag = () => {
        const t = normalizeTag(tagDraft);
        if (t && !tags.includes(t) && tags.length < 5) setTags([...tags, t]);
        setTagDraft('');
    };

    const submit = (e) => {
        e && e.preventDefault();
        if (!ready) return;
        onSubmit({ text, forumId: target, tags, anonymous });
        setText(''); setTags([]); setAnonymous(false); setTagging(false);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e);
    };

    return (
        <form className={`composer ${compact ? 'composer-compact' : ''}`} onSubmit={submit}>
            <textarea
                ref={ref}
                value={text}
                autoFocus={autoFocus}
                rows={compact ? 1 : 2}
                placeholder={placeholder || (mode === 'ask' ? 'What are you stuck on?' : 'Share what you know…')}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label={mode === 'ask' ? 'Your question' : 'Your answer'}
            />
            {mode === 'ask' && text.trim() && !compact && (
                <div className="composer-hint">The first line becomes the title. Add details on the next lines. Wrap code in ``` fences.</div>
            )}
            {tags.length > 0 && (
                <div className="composer-tags">
                    {tags.map((t) => (
                        <span className="tag tag-removable" key={t}>#{t}
                            <button type="button" aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}><Icon name="x" size={12} /></button>
                        </span>
                    ))}
                </div>
            )}
            <div className="composer-bar">
                <div className="composer-tools">
                    {mode === 'ask' && (
                        <>
                            <ForumPicker value={target} onChange={setTarget} locked={lockForum} />
                            {tagging ? (
                                <input className="pill pill-input" autoFocus value={tagDraft} placeholder="tag, then Enter"
                                    onChange={(e) => setTagDraft(e.target.value)}
                                    onBlur={() => { addTag(); setTagging(false); }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
                                        if (e.key === 'Escape') setTagging(false);
                                    }} />
                            ) : (
                                <button type="button" className="pill" onClick={() => setTagging(true)} disabled={tags.length >= 5}>
                                    <Icon name="hash" size={15} /><span className="pill-label">Tag</span>
                                </button>
                            )}
                            <button type="button" className={`pill ${anonymous ? 'pill-on' : ''}`} onClick={() => setAnonymous(!anonymous)}
                                aria-pressed={anonymous} title="Hide your name on this query">
                                <Icon name="ghost" size={15} /><span className="pill-label">Anonymous</span>
                            </button>
                        </>
                    )}
                </div>
                <button type="submit" className="send" disabled={!ready} aria-label={mode === 'ask' ? 'Ask' : 'Post answer'} title="Send (Ctrl/⌘ + Enter)">
                    <Icon name="arrowUp" size={18} strokeWidth={2.25} />
                </button>
            </div>
        </form>
    );
}
