import Cookies from 'js-cookie'
export default function userReducer(state = null, action) {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    if (user) user.id = "1";
    switch (action.type) {
        case 'GET_USER':
            Cookies.set('user', JSON.stringify(action.payload))
            return action.payload
        default:
            return user
    }
}