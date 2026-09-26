import { readCookie, writeCookie } from '../utils/storage';

export default function roleReducer(state = readCookie('role'), action) {
    switch (action.type) {
        case 'GET_ROLE':
            writeCookie('role', action.payload)
            return action.payload
        default:
            return state
    }
}
