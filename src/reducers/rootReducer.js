import { combineReducers } from 'redux';
import userReducer from './userReducer';
import roleReducer from "./roleReducer";
import boardReducer from './boardReducer';
import uiReducer from './uiReducer';

export default combineReducers({
    user: userReducer,
    role: roleReducer,
    board: boardReducer,
    ui: uiReducer
});
