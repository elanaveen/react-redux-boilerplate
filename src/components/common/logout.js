import { memo } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { simpleAction } from '../../actions/simple';

function Logout(props) {
    const { simpleaction } = props;
    let navigate = useNavigate();

    return <span className='logout' onClick={() => simpleaction(null).then(res => navigate("/"))}>
        Log-out
    </span>
}

const mapStateToProps = state => ({
    ...state,
    user: state.userReducer
})
const mapDispatchToProps = dispatch => ({
    simpleaction: (values) => dispatch(simpleAction(values))
})
export default connect(mapStateToProps, mapDispatchToProps)(memo(Logout));