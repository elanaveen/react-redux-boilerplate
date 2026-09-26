import { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import {
    useNavigate
} from "react-router-dom";
import Icon, { Logo } from '../../components/Icon';

const FEATURES = [
    { icon: 'message', title: 'Raise a query', desc: 'Ask anything, even anonymously. Classmates and seniors help out.' },
    { icon: 'globe', title: 'Public forums', desc: 'Follow courses, clubs and campus topics you care about.' },
    { icon: 'lock', title: 'Private forums', desc: 'Run study circles where you approve every join request.' },
];

function Login(props) {
    const { user, role, dologin } = props;
    const [loading, setloading] = useState(false);
    const [form, setform] = useState({ name: '', email: '', college: '', major: '' });
    const [error, seterror] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        if (user && role === 'student') {
            navigate("/home")
        }
    }, [user, role, navigate])

    const set = (key) => (e) => setform({ ...form, [key]: e.target.value });

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
                <div className="brand brand-lg"><Logo size={34} /><span>Can Forums</span></div>
                <h1 className="serif login-title">Can anyone help with…?<br /><span className="accent">Yes. Your campus can.</span></h1>
                <p className="login-lead">A calm place for college students to ask questions, help each other and build communities around courses, clubs and campus life.</p>
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
                    <h2 className="serif">Join your campus</h2>
                    <p className="muted">Use your college email. We'll verify it once accounts go live.</p>
                    <label className="field-label" htmlFor="name">Full name</label>
                    <input className="field" id="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Naveen Kumar" />
                    <label className="field-label" htmlFor="email">College email</label>
                    <input className="field" id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@college.edu" />
                    <label className="field-label" htmlFor="college">College</label>
                    <input className="field" id="college" value={form.college} onChange={set('college')} placeholder="State Institute of Technology" />
                    <label className="field-label" htmlFor="major">Branch & year <span className="muted">(optional)</span></label>
                    <input className="field" id="major" value={form.major} onChange={set('major')} placeholder="CSE · 2nd year" />
                    {error ? <div className='errormsg'>{error}</div> : null}
                    <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? 'Signing you in…' : 'Continue'}</button>
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
