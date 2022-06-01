import Cookies from 'js-cookie'
export default function roleReducer(state = null, action) {
    const role = Cookies.get('role') ? JSON.parse(Cookies.get('role')) : null;
    switch (action.type) {
        case 'GET_ROLE':
            Cookies.set('role', JSON.stringify(action.payload))
            return action.payload
        default:
            return role
    }
}