import '../assets/css/main.css';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, MemoryRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import RequireAuth from './RequireAuth';
import Login from '../layouts/login/login';
import AuthRoutes from './AuthRoutes';

// The single-file preview build runs inside a sandboxed frame without real URLs.
const PREVIEW = process.env.REACT_APP_PREVIEW === 'true';
const Router = PREVIEW ? MemoryRouter : BrowserRouter;

function App(props) {
  const { theme } = props;

  useEffect(() => {
    const root = document.documentElement;
    if (theme !== 'system') root.setAttribute('data-theme', theme);
    else if (root.dataset.appTheme) root.removeAttribute('data-theme');
    // Remember that we set it, so "system" never clears a theme the host page chose.
    if (theme !== 'system') root.dataset.appTheme = '1';
    else delete root.dataset.appTheme;
  }, [theme]);

  return (
    <Router>
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
        <Route path="*" element={<div className='fullpage notfound'><h1 className='display'>404</h1><p className='muted'>This page missed the college bus.</p><Link className='btn btn-primary' to='/'>Go home</Link></div>} />
      </Routes>
    </Router>
  );
}

const mapStateToProps = state => ({
  role: state.role,
  theme: state.ui.theme,
})
export default connect(mapStateToProps)(App);
