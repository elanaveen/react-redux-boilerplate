import '../assets/css/main.css';
import { connect } from 'react-redux';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RequireAuth from './RequireAuth';
import Login from '../layouts/login/login';
import AuthRoutes from './AuthRoutes';

function App(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
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
        <Route path="*" element={<div className='fullpage'><h3>404</h3><Link to='/'>Go to Home</Link></div>} />
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = state => ({
  ...state,
})
const mapDispatchToProps = dispatch => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(App);