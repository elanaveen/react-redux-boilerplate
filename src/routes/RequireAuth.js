import { connect } from "react-redux";
import {
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreateForumModal from "../components/CreateForumModal";
import { BadgeWatcher, ConfirmDialog, Confetti, Toasts } from "../components/Fx";
import Icon, { Logo } from "../components/Icon";
import { setSidebar } from "../actions/board";

function RequireAuth(props) {
  let auth = props.user;
  let location = useLocation();
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
      <Toasts />
      <Confetti />
      <BadgeWatcher />
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
})
const mapDispatchToProps = dispatch => ({
  opensidebar: () => dispatch(setSidebar(true))
})

export default connect(mapStateToProps, mapDispatchToProps)(RequireAuth);
