import authReducer from './authReducer';
import pageReducer from './pageReducer';
import alertReducer from './alertReducer';
import { combineReducers } from 'redux';
import rowReducer from './rowReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    page: pageReducer,
    row: rowReducer,
    alert: alertReducer
});

export default rootReducer;
