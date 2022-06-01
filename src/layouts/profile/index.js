import { memo } from 'react';
import { connect } from 'react-redux';

function Profile(props) {
    const user = props.user;
    return (
        <div className='bg-white'>
            <div className="p-5" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 15px' }}>
                <div>
                    <h2>Profile</h2>
                    <p className='mb-0 text-secondary'>Name: <b>{user?.username}</b></p>
                    <p className='mb-0 text-secondary'>Role: <b>{props?.role}</b></p>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    ...state,
    user: state.user,
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(memo(Profile));