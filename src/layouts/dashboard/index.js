import React, { memo, Suspense } from 'react';
import { connect } from 'react-redux';
const Features = React.lazy(() => import('./features'));
function Dashboard(props) {
  const { user } = props;
  return (
    <div className='padd-5'>
      <h3>Welcome Back, {user.username.split('@')[0]}!</h3>
      <p className='mb-0 text-secondary'>Lets do good today.</p>
      <hr />
      {/* //code splitting */}
      <Suspense fallback={<div>Loading...</div>}>
        <Features />
      </Suspense>
    </div>
  );
}

const mapStateToProps = state => ({
  ...state,
})
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(memo(Dashboard));