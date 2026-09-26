import '../assets/css/main.css';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import RequireAuth from './RequireAuth';
import Login from '../layouts/login/login';
import AuthRoutes from './AuthRoutes';

function App(props) {
  const { theme } = props;

  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        {AuthRoutes.filter((p) => p.roles.includes(props.role)).map((r) => {
          return <Route key={r.id}
            path={r.path}
            element={
              <RequireAuth>
                {r.component}
              </RequireAuth>
            }
          />
        })}
        <Route path="*" element={<div className='fullpage notfound'><h1 className='serif'>404</h1><p className='muted'>This page wandered off campus.</p><Link className='btn btn-primary' to='/'>Go home</Link></div>} />
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  role: state.role,
  theme: state.ui.theme,
})
export default connect(mapStateToProps)(App);
