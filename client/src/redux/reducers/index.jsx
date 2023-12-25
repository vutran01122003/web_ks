import authReducer from './authReducer';
import pageReducer from './pageReducer';
import alertReducer from './alertReducer';
import { combineReducers } from 'redux';
import rowReducer from './rowReducer';
import TableReducer from './tableReducer';
import newsReducer from './newsReducer';
import progressReducer from './progressReducer';
import chatBotReducer from './chatbotReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    page: pageReducer,
    row: rowReducer,
    alert: alertReducer,
    table: TableReducer,
    news: newsReducer,
    progress: progressReducer,
	chatbot: chatBotReducer,
});

export default rootReducer;
