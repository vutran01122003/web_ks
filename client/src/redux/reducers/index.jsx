import authReducer from './authReducer';
import pageReducer from './pageReducer';
import alertReducer from './alertReducer';
import { combineReducers } from 'redux';
import rowReducer from './rowReducer';
import TableReducer from './tableReducer';
import newsReducer from './newsReducer';
import progressReducer from './progressReducer';
import chatBotReducer from './chatbotReducer';
import socketReducer from './socketReducer';
import notificationReducer from './notificationReducer';
import facultyReducer from './facultyReducer';
import activitiesReducer from './activitiesReducer';
import goalsReduce from './goalsReduce';
import studentReducer from './studentReducer';
import permissionReducer from './permissionReducer';
import deadlineReducer from './deadlineReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    page: pageReducer,
    row: rowReducer,
    alert: alertReducer,
    table: TableReducer,
    news: newsReducer,
    progress: progressReducer,
    chatbot: chatBotReducer,
    socket: socketReducer,
    notification: notificationReducer,
    faculty: facultyReducer,
    activities: activitiesReducer,
    goals: goalsReduce,
    student: studentReducer,
    permission: permissionReducer,
    deadline: deadlineReducer
});

export default rootReducer;
