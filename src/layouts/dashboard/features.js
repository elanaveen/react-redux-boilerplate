import { memo } from 'react';
import { connect } from 'react-redux';

function features(props) {
    return (
        <div>
            <h3>Feature Implementations</h3>
            <ul>
                <li>React/Redux</li>
                <li>Auth Handling</li>
                <li>Dynamic routing</li>
                <li>Multiple roles</li>
                <li>Window Online/Offline</li>
                <li>PWA</li>
                <li>Code splitting!</li>
            </ul>
        </div>
    );
}

const mapStateToProps = state => ({
    ...state,
})
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(memo(features));