import { connect } from "react-redux";
import {
    useLocation,
    useNavigate
} from "react-router-dom";
import Logout from "./logout";
import { useEffect, useState } from "react";

function TopHeader(props) {
    let location = useLocation();
    let navigate = useNavigate();
    const [active, setactive] = useState('');
    
    useEffect(() => {
        setactive(location.pathname);
        // eslint-disable-next-line
    }, [location.pathname])

    const changepath = (path) => {
        navigate(path)
        setactive(path)
    }
    return (
        <div className="navbar sticky-top">
            <div className="header-menu">
                <div className="logo">Logo</div>
                <ul className="top-menu">
                    {props.menu.map((r, i) => {
                        return <li key={i} className={active === r.path ? 'active' : ''} onClick={() => changepath(r.path)}>
                            <span className="ml-2">{r.title}</span>
                        </li>
                    })}
                </ul>
                <Logout />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    ...state,
})

export default connect(mapStateToProps, {})(TopHeader);