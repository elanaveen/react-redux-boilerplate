import { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { simpleAction } from '../../actions/simple';
import {
    useNavigate
} from "react-router-dom";

function Login(props) {
    const { user, simpleaction } = props;
    const [loading, setloading] = useState(false);
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [role, setrole] = useState('');
    const [error, seterror] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard")
        }
    }, [user, navigate])

    const onFinish = (e) => {
        e.preventDefault();
        if (username && password && role) {
            setloading(true)
            seterror('')
            simpleaction({ username: username, password: password, role }).then(res => {
                setloading(false);
                navigate("/dashboard")
            }).catch(err => {
                console.log(err)
                setloading(false)
                seterror(err)
            })
        } else {
            seterror('Enter all fields')
        }
    };

    return (
        <div className="fullpage">
            <div style={{ width: '100%', padding: '10px 15px', maxWidth: '400px' }}>
                <h3 style={{ marginBottom: '20px' }}>App name</h3>
                <form onSubmit={onFinish}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" value={username} onChange={(e) => setusername(e.target.value)} />
                    <label htmlFor="password"  >Password:</label>
                    <input type="password" name="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                    <label htmlFor="role">Role:</label>
                    <select name="role" value={role} onChange={(e) => setrole(e.target.value)}>
                        <option value="" disabled>Select</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    {error ?
                        <div className='errormsg'>
                            {error}
                        </div>
                        : null}
                    <br />
                    <button type="submit" disabled={loading}>{loading ? 'Authenticating' : 'Submit'}</button>
                </form>
                <br />
                <hr/>
                <h3>Features</h3>
                <ul>
                    <li>React/Redux</li>
                    <li>Auth Handling</li>
                    <li>Dynamic routing</li>
                    <li>Multiple roles</li>
                    <li>Window Online/Offline</li>
                    <li>PWA</li>
                    <li>Code splitting!</li>
                </ul>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    ...state,
})
const mapDispatchToProps = dispatch => ({
    simpleaction: (values) => dispatch(simpleAction(values))
})
export default connect(mapStateToProps, mapDispatchToProps)(memo(Login));