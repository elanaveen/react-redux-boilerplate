import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeConfirm, confetti, dismissToast, toast } from '../actions/board';
import { badgesFor } from '../utils/selectors';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Toasts() {
    const dispatch = useDispatch();
    const toasts = useSelector((s) => s.ui.toasts);

    useEffect(() => {
        const timers = toasts.map((t) => setTimeout(() => dispatch(dismissToast(t.id)), 3800));
        return () => timers.forEach(clearTimeout);
    }, [toasts, dispatch]);

    return (
        <div className="toasts" role="status" aria-live="polite">
            {toasts.map((t) => (
                <button key={t.id} className={`toast toast-${t.tone}`} onClick={() => dispatch(dismissToast(t.id))}>
                    <span className="toast-icon" aria-hidden="true">{t.icon}</span>
                    <span className="toast-text"><b>{t.title}</b>{t.sub && <span>{t.sub}</span>}</span>
                </button>
            ))}
        </div>
    );
}

const COLORS = ['#FFB020', '#16307A', '#4C7DFF', '#FF6B4A', '#1FB57A', '#FFD66B'];

// Lightweight canvas confetti: fires whenever ui.confetti increments.
export function Confetti() {
    const count = useSelector((s) => s.ui.confetti);
    const canvas = useRef(null);

    useEffect(() => {
        if (!count || reducedMotion() || !canvas.current) return;
        const el = canvas.current;
        const ctx = el.getContext && el.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        el.width = window.innerWidth * dpr;
        el.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        const w = window.innerWidth;
        const pieces = Array.from({ length: 140 }, () => ({
            x: w / 2 + (Math.random() - 0.5) * 120, y: window.innerHeight * 0.35,
            vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 13 - 4,
            r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
            size: 6 + Math.random() * 6, color: COLORS[Math.floor(Math.random() * COLORS.length)],
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        }));
        let frame;
        let t = 0;
        const tick = () => {
            t++;
            ctx.clearRect(0, 0, w, window.innerHeight);
            pieces.forEach((p) => {
                p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
                ctx.save();
                ctx.globalAlpha = Math.max(0, 1 - t / 130);
                ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.color;
                if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                else { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2); ctx.fill(); }
                ctx.restore();
            });
            if (t < 130) frame = requestAnimationFrame(tick);
            else ctx.clearRect(0, 0, w, window.innerHeight);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [count]);

    return <canvas ref={canvas} className="confetti" aria-hidden="true" />;
}

export function ConfirmDialog() {
    const dispatch = useDispatch();
    const confirm = useSelector((s) => s.ui.confirm);

    useEffect(() => {
        if (!confirm) return;
        const esc = (e) => { if (e.key === 'Escape') dispatch(closeConfirm()); };
        document.addEventListener('keydown', esc);
        return () => document.removeEventListener('keydown', esc);
    }, [confirm, dispatch]);

    if (!confirm) return null;
    return (
        <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) dispatch(closeConfirm()); }}>
            <div className="modal modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
                <h2 id="confirm-title" className="display">{confirm.title}</h2>
                <p className="muted">{confirm.body}</p>
                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={() => dispatch(closeConfirm())}>Cancel</button>
                    <button autoFocus className={`btn ${confirm.danger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => { dispatch(closeConfirm()); confirm.onConfirm(); }}>{confirm.confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

// Celebrates newly earned badges while the student is using the app.
export function BadgeWatcher() {
    const dispatch = useDispatch();
    const user = useSelector((s) => s.user);
    const board = useSelector((s) => s.board);
    const earned = badgesFor(board, user.id).filter((b) => b.earned);
    const key = earned.map((b) => b.id).join(',');
    const seen = useRef(null);

    useEffect(() => {
        const ids = key ? key.split(',') : [];
        if (seen.current === null) { seen.current = new Set(ids); return; }
        const fresh = earned.filter((b) => !seen.current.has(b.id));
        fresh.forEach((b) => {
            seen.current.add(b.id);
            dispatch(toast({ icon: b.icon, tone: 'amber', title: `Badge unlocked: ${b.name}`, sub: b.desc }));
        });
        if (fresh.length) setTimeout(() => dispatch(confetti()), 250);
        // eslint-disable-next-line
    }, [key, dispatch]);

    return null;
}

// Floating "+1" that pops out of a button when it is switched on.
export function useBurst() {
    const ref = useRef(null);
    const fire = (label = '+1') => {
        const el = ref.current;
        if (!el || reducedMotion()) return;
        const b = document.createElement('span');
        b.className = 'burst';
        b.textContent = label;
        el.appendChild(b);
        el.classList.remove('pop');
        void el.offsetWidth; // restart the pop animation
        el.classList.add('pop');
        setTimeout(() => b.remove(), 700);
    };
    return [ref, fire];
}
