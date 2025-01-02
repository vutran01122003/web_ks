import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    data: [],
    page: 0,
    maxPage: false,
    unreadNotificationNum: 0,
    isLoading: false,
    currentNumNotifications: 0
};

function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.NOTIFICATION.LOADING_NOTIFICATIONS: {
            return {
                ...state,
                isLoading: action.payload.isLoading
            };
        }

        case GLOBALTYPES.NOTIFICATION.GET_NUM_UNREAD_NOTIFICATION: {
            return {
                ...state,
                unreadNotificationNum: action.payload.numUnreadNotifications
            };
        }

        case GLOBALTYPES.NOTIFICATION.ADD_NOTIFICATION: {
            return {
                ...state,
                data: [action.payload.notification, ...state.data],
                unreadNotificationNum: state.unreadNotificationNum + 1,
                currentNumNotifications: state.currentNumNotifications + 1
            };
        }

        case GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS: {
            return {
                ...state,
                data: [...state.data, ...action.payload.data],
                page: action.payload.page,
                maxPage: action.payload.data.length === 0 ? true : false,
                currentNumNotifications:
                    action.payload.page === 1
                        ? action.payload.data.length
                        : state.currentNumNotifications + action.payload.data.length
            };
        }

        case GLOBALTYPES.NOTIFICATION.UPDATE_STATUS_READ_NOTIFICATION: {
            let notificationList = [...state.data];
            let unreadNotificationNum = state.unreadNotificationNum;
            let status = action.payload.status;

            for (let i = 0; i < notificationList.length; i++) {
                if (action.payload.notificationId === notificationList[i]._id) {
                    if (notificationList[i].recipient) notificationList[i].isRead = status;
                    else {
                        const readedUserList = notificationList[i].readedUserList;
                        status
                            ? readedUserList.push(action.payload.recipientId)
                            : readedUserList.splice(readedUserList.indexOf(action.payload.recipientId), 1);
                    }
                    break;
                }
            }

            return {
                ...state,
                data: notificationList,
                unreadNotificationNum: status ? unreadNotificationNum - 1 : unreadNotificationNum + 1
            };
        }

        case GLOBALTYPES.NOTIFICATION.DELETE_NOTIFICATION: {
            let notification = null;
            let ntfList = [...state.data];

            for (let i = 0; i < ntfList.length; i++) {
                if (action.payload.notificationId === ntfList[i]._id) {
                    notification = ntfList[i];
                    ntfList.splice(i, 1);
                    break;
                }
            }

            return {
                ...state,
                data: ntfList,
                unreadNotificationNum: notification.isRead
                    ? state.unreadNotificationNum
                    : state.unreadNotificationNum - 1,
                currentNumNotifications: state.currentNumNotifications - 1
            };
        }

        case GLOBALTYPES.NOTIFICATION.DELETE_ALL_OTIFICATION: {
            return {
                data: [],
                page: 0,
                maxPage: false,
                unreadNotificationNum: 0,
                currentNumNotifications: 0
            };
        }

        case GLOBALTYPES.NOTIFICATION.MARK_ALL_AS_READ: {
            let ntfList = [...state.data];
            const _recipientId = action.payload.recipientId;

            for (let i = 0; i < ntfList.length; i++) {
                if (ntfList[i].recipient && !ntfList[i].isRead) ntfList[i].isRead = true;
                else if (!ntfList[i].recipient && !ntfList[i].readedUserList.includes(_recipientId)) {
                    ntfList[i].readedUserList.push(_recipientId);
                }
            }

            return {
                ...state,
                unreadNotificationNum: 0,
                data: ntfList
            };
        }

        default:
            return state;
    }
}

export default notificationReducer;
