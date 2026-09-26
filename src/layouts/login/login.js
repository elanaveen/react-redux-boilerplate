import { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import {
    useNavigate
} from "react-router-dom";
import Icon, { Logo } from '../../components/Icon';

const FEATURES = [
    { icon: 'message', title: 'Raise a query', desc: 'Ask anything, even anonymously. Batchmates and seniors jump in.' },
    { icon: 'users', title: 'Public & private forums', desc: 'Follow your department, clubs and bus route, or run a private study circle.' },
    { icon: 'flame', title: 'Earn XP & badges', desc: 'Keep your streak, climb from Fresher to Legend, top the helper board.' },
];

const TICKER = ['Is bus 12 late today?', 'DBMS unit 3 notes anyone?', 'Hackathon team needs 1 ML person', 'Best aptitude book?', 'Mess menu today 🍛', 'How to prep for the placement OA?'];

function Login(props) {
    const { user, role, dologin } = props;
    const [loading, setloading] = useState(false);
    const [form, setform] = useState({ name: '', email: '', college: 'VSB College of Engineering Technical Campus', major: '' });
    const [error, seterror] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        if (user && role === 'student') {
            navigate("/home")
        }
    }, [user, role, navigate])

    const set = (key) => (e) => setform({ ...form, [key]: e.target.value });

    const tryDemo = () => {
        setloading(true);
        dologin({ name: 'Guest Student', email: 'guest@vsb.student', college: 'VSB College of Engineering Technical Campus', major: 'CSE · 2nd year' })
            .then(() => { setloading(false); navigate("/home"); });
    };

    const onFinish = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.college.trim()) return seterror('Please add your name and college.');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return seterror('Enter a valid college email.');
        setloading(true)
        seterror('')
        dologin(form).then(() => {
            setloading(false);
            navigate("/home")
        }).catch(err => {
            setloading(false)
            seterror(String(err))
        })
    };

    return (
        <div className="login">
            <section className="login-hero">
                <div className="brand brand-lg"><Logo size={38} /><span>VSB <em>Forums</em></span></div>
                <h1 className="display login-title">Stuck on something?<br /><span className="hl">Ask VSB.</span></h1>
                <p className="login-lead">The student hangout for doubts, notes, bus timings, placements and everything in between. Ask a question, help a junior, and earn XP while you do it.</p>
                <div className="ticker" aria-hidden="true"><div className="ticker-track">{[...TICKER, ...TICKER].map((t, i) => <span key={i} className="ticker-item">{t}</span>)}</div></div>
                <ul className="login-features">
                    {FEATURES.map((f) => (
                        <li key={f.title}>
                            <span className="login-feature-icon"><Icon name={f.icon} size={18} /></span>
                            <span><b>{f.title}</b><br /><span className="muted">{f.desc}</span></span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="login-panel">
                <form className="card login-card" onSubmit={onFinish}>
                    <h2 className="display">Join the conversation</h2>
                    <p className="muted">Use your college email. We'll verify it once accounts go live.</p>
                    <label className="field-label" htmlFor="name">Full name</label>
                    <input className="field" id="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Naveen Ela" />
                    <label className="field-label" htmlFor="email">College email</label>
                    <input className="field" id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="yourname@college.edu" />
                    <label className="field-label" htmlFor="college">College</label>
                    <input className="field" id="college" value={form.college} onChange={set('college')} placeholder="VSB College of Engineering Technical Campus" />
                    <label className="field-label" htmlFor="major">Branch & year <span className="muted">(optional)</span></label>
                    <input className="field" id="major" value={form.major} onChange={set('major')} placeholder="CSE · 2nd year" />
                    {error ? <div className='errormsg'>{error}</div> : null}
                    <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? 'Signing you in…' : 'Continue'}</button>
                    <button className="btn btn-secondary btn-block btn-demo" type="button" onClick={tryDemo} disabled={loading}>Try the demo as a guest</button>
                    <p className="unofficial">Student-run project. Not an official college website.</p>
                </form>
            </section>
        </div>
    );
}

const mapStateToProps = state => ({
    user: state.user,
    role: state.role,
})
const mapDispatchToProps = dispatch => ({
    dologin: (values) => dispatch(login(values))
})
export default connect(mapStateToProps, mapDispatchToProps)(memo(Login));
