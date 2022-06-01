import { connect } from "react-redux";
import {
  useLocation,
  Navigate,
} from "react-router-dom";
import AuthRoutes from './AuthRoutes';
import Topheader from "../components/common/topheader";
import { useState } from "react";

function RequireAuth(props) {
  let auth = props.user;
  let location = useLocation();
  const [online, setonline] = useState(true);

  if (!auth) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  window.addEventListener('offline', function (e) { setonline(false); });
  window.addEventListener('online', function (e) { setonline(true); });
  return (
    <div>
      <div className="site-div">
        <Topheader menu={AuthRoutes.filter((p) => p.roles.includes(props.role) && p.ismenu)} />
        {!online ? <div className="networkerror">You are offline! Check your internet connection.</div> : null}
        <div style={{ minHeight: 'calc(100vh - 90px)' }}>
          {props.children}
        </div>
        <footer>Copyright @Appname {new Date().getFullYear()}.</footer>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  ...state,
})

export default connect(mapStateToProps, {})(RequireAuth);