import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from './Icon';
import { closeReport, openReport, submitReport } from '../actions/board';
import { hasReported, REPORT_REASONS } from '../utils/selectors';

const NOUN = { query: 'query', answer: 'answer', forum: 'forum', user: 'account' };

// Small "Report" action. Hidden on your own content; turns into "Reported" once filed.
export function ReportButton({ targetType, targetId, queryId = null, authorId = null, label, compact = false }) {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const reported = useSelector((s) => hasReported(s.board, me.id, targetType, targetId));
    if (authorId === me.id) return null;

    return (
        <button className={`action action-report ${reported ? 'reported' : ''}`} disabled={reported}
            aria-label={reported ? `You reported this ${NOUN[targetType]}` : `Report this ${NOUN[targetType]}`}
            title={reported ? 'Reported' : `Report this ${NOUN[targetType]}`}
            onClick={() => dispatch(openReport({ targetType, targetId, queryId, authorId, label }))}>
            <Icon name="flag" size={15} />{compact ? null : reported ? 'Reported' : 'Report'}
        </button>
    );
}

export function ReportDialog() {
    const dispatch = useDispatch();
    const me = useSelector((s) => s.user);
    const target = useSelector((s) => s.ui.report);
    const author = useSelector((s) => (target && target.authorId ? s.board.users[target.authorId] : null));
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');
    const [alsoUser, setAlsoUser] = useState(false);

    useEffect(() => {
        if (!target) return;
        setReason(''); setNote(''); setAlsoUser(false);
        const esc = (e) => { if (e.key === 'Escape') dispatch(closeReport()); };
        document.addEventListener('keydown', esc);
        return () => document.removeEventListener('keydown', esc);
    }, [target, dispatch]);

    if (!target) return null;
    const noun = NOUN[target.targetType];
    const canReportAuthor = author && target.targetType !== 'user' && author.id !== me.id;

    const submit = (e) => {
        e.preventDefault();
        if (!reason) return;
        dispatch(submitReport({ ...target, reason, note, alsoUserId: canReportAuthor && alsoUser ? author.id : null }, me.id));
    };

    return (
        <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) dispatch(closeReport()); }}>
            <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="report-title">
                <div className="modal-head">
                    <h2 id="report-title" className="display">Report this {noun}</h2>
                    <button type="button" className="icon-btn" onClick={() => dispatch(closeReport())} aria-label="Close"><Icon name="x" /></button>
                </div>
                {target.label && <p className="report-target">“{target.label}”</p>}
                <p className="muted modal-sub">Reports are anonymous. Only moderators see who reported.</p>

                <fieldset className="reasons">
                    <legend className="field-label">What's wrong?</legend>
                    {REPORT_REASONS.map((r) => (
                        <label key={r.id} className={`reason ${reason === r.id ? 'on' : ''}`}>
                            <input type="radio" name="reason" id={`reason-${r.id}`} value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} />
                            <span>{r.label}</span>
                        </label>
                    ))}
                </fieldset>

                <label className="field-label" htmlFor="report-note">Anything moderators should know? <span className="muted">(optional)</span></label>
                <textarea id="report-note" className="field" rows={2} maxLength={280} value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. They've posted the same link in three forums." />

                {canReportAuthor && (
                    <label className="check-row" htmlFor="report-user">
                        <input type="checkbox" id="report-user" checked={alsoUser} onChange={(e) => setAlsoUser(e.target.checked)} />
                        <span>Also report <b>{author.name}</b>'s account</span>
                    </label>
                )}

                <div className="modal-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => dispatch(closeReport())}>Cancel</button>
                    <button type="submit" className="btn btn-danger" disabled={!reason}><Icon name="flag" size={15} />Send report</button>
                </div>
            </form>
        </div>
    );
}
