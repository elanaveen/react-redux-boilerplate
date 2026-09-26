import { readCookie, writeCookie } from '../utils/storage';

export default function userReducer(state = readCookie('user'), action) {
    switch (action.type) {
        case 'GET_USER':
            writeCookie('user', action.payload)
            return action.payload
        default:
            return state
    }
}
