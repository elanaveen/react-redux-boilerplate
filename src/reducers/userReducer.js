import Cookies from 'js-cookie'
export default function userReducer(state = null, action) {
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    switch (action.type) {
        case 'GET_USER':
            if (action.payload) Cookies.set('user', JSON.stringify(action.payload), { expires: 30 })
            else Cookies.remove('user')
            return action.payload
        default:
            return state === null ? user : state
    }
}
