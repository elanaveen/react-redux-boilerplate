import Cookies from 'js-cookie'
export default function roleReducer(state = null, action) {
    const role = Cookies.get('role') ? JSON.parse(Cookies.get('role')) : null;
    switch (action.type) {
        case 'GET_ROLE':
            if (action.payload) Cookies.set('role', JSON.stringify(action.payload), { expires: 30 })
            else Cookies.remove('role')
            return action.payload
        default:
            return state === null ? role : state
    }
}
