import { connect } from "react-redux";
import {
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreateForumModal from "../components/CreateForumModal";
import { BadgeWatcher, ConfirmDialog, Confetti, Toasts } from "../components/Fx";
import Icon, { Logo } from "../components/Icon";
import { setSidebar, setTheme } from "../actions/board";
import { logout, SUSPENDED_MESSAGE } from "../actions/auth";
import { ReportDialog } from "../components/Report";
import { isActive } from "../utils/selectors";

const NEXT_THEME = { system: "light", light: "dark", dark: "system" };
const THEME_ICON = { system: "monitor", light: "sun", dark: "moon" };

function AdminBar({ user, theme, dispatch, onLogout }) {
  return (
    <header className="adminbar">
      <span className="brand"><Logo size={26} /><span>VSB <em>Forums</em></span><span className="admin-tag"><Icon name="shield" size={13} />Admin</span></span>
      <span className="grow" />
      <span className="adminbar-user">{user.name}</span>
      <button className="icon-btn" onClick={() => dispatch(setTheme(NEXT_THEME[theme]))} aria-label={`Theme: ${theme}. Switch theme`} title={`Theme: ${theme}`}><Icon name={THEME_ICON[theme]} /></button>
      <button className="btn btn-sm btn-secondary" onClick={onLogout}><Icon name="logout" size={15} />Log out</button>
    </header>
  );
}

function RequireAuth(props) {
  let auth = props.user;
  let location = useLocation();
  let navigate = useNavigate();
  const signOut = () => props.dispatch(logout()).then(() => navigate('/'));
  const [online, setonline] = useState(navigator.onLine);

  useEffect(() => {
    const off = () => setonline(false);
    const on = () => setonline(true);
    window.addEventListener('offline', off);
    window.addEventListener('online', on);
    return () => {
      window.removeEventListener('offline', off);
      window.removeEventListener('online', on);
    };
  }, []);

  useEffect(() => {
    const main = document.querySelector('.main');
    if (main) main.scrollTop = 0;
  }, [location.pathname]);

  if (!auth) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  if (props.role === 'admin') {
    return (
      <div className="admin-shell">
        <AdminBar user={auth} theme={props.theme} dispatch={props.dispatch} onLogout={signOut} />
        <main className="main">{props.children}</main>
        <ConfirmDialog />
        <Toasts />
      </div>
    );
  }

  // A moderator can suspend an account while its owner is signed in.
  if (!props.accountActive) {
    return (
      <div className="fullpage suspended">
        <Icon name="shield" size={40} />
        <h1 className="display">Account suspended</h1>
        <p className="muted">{SUSPENDED_MESSAGE}</p>
        <button className="btn btn-primary" onClick={signOut}>Log out</button>
      </div>
    );
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <div className="mobilebar">
          <button className="icon-btn" onClick={() => props.opensidebar()} aria-label="Open menu"><Icon name="menu" /></button>
          <span className="brand"><Logo size={24} /><span>VSB <em>Forums</em></span></span>
        </div>
        {!online ? <div className="networkerror">You're offline. Changes are saved on this device.</div> : null}
        {props.children}
      </main>
      <CreateForumModal />
      <ConfirmDialog />
      <ReportDialog />
      <Toasts />
      <Confetti />
      <BadgeWatcher />
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  role: state.role,
  theme: state.ui.theme,
  accountActive: !state.user || isActive(state.board.users[state.user.id]),
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  opensidebar: () => dispatch(setSidebar(true))
})

export default connect(mapStateToProps, mapDispatchToProps)(RequireAuth);
