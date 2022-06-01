import { combineReducers } from 'redux';
import simpleReducer from './simple';
import userReducer from './userReducer';
import roleReducer from "./roleReducer";

export default combineReducers({
    simpleReducer,
    user: userReducer,
    role: roleReducer
});