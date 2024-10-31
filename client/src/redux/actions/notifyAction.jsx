import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const createUpdatedActivityNotification =
    ({ title, content, senderId, recipientId, pageId }) =>
    async (dispatch) => {
        try {
            await postDataApi('/notifications', {
                title,
                content,
                senderId,
                recipientId,
                pageId
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Tạo thông báo thất bại'
            });
        }
    };

export const getNumUnreadNotification =
    ({ userId }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/notifications/${userId}/unread-notifications`);
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.GET_NUM_UNREAD_NOTIFICATION,
                payload: {
                    numUnreadNotifications: res.data.data.numUnreadNotifications
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy dữ liệu số lượng thông báo chưa đọc thất bại'
            });
        }
    };

export const getNotifications =
    ({ recipientId, page, limit, currentNumNotifications }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.LOADING_NOTIFICATIONS,
                payload: {
                    isLoading: true
                }
            });

            const res = await getDataApi(
                `/notifications/${recipientId}?page=${page}&limit=${limit}&currentNumNotifications=${currentNumNotifications}`
            );

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS,
                payload: {
                    data: res.data.data,
                    recipientId: recipientId,
                    page
                }
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.LOADING_NOTIFICATIONS,
                payload: {
                    isLoading: false
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy dữ liệu thông báo thất bại'
            });
        }
    };

export const updateReadStatus =
    ({ notificationId, status, recipientId }) =>
    async (dispatch) => {
        try {
            await patchDataApi(`/notifications/${notificationId}/updated-status`, {
                status,
                recipientId
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.UPDATE_STATUS_READ_NOTIFICATION,
                payload: {
                    notificationId,
                    recipientId,
                    status
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Cập nhật trạng thái đọc thất bại'
            });
        }
    };

export const deleteNotification =
    ({ notificationId, recipientId }) =>
    async (dispatch) => {
        try {
            await deleteDataApi(`/notifications/${notificationId}`, {
                recipientId
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.DELETE_NOTIFICATION,
                payload: {
                    notificationId
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Xóa thông báo thất bại'
            });
        }
    };

export const markAllAsRead =
    ({ recipientId }) =>
    async (dispatch) => {
        try {
            await patchDataApi('/notifications/updated-status', {
                recipientId
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.MARK_ALL_AS_READ,
                payload: {
                    recipientId
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Đánh dấu đã đọc tất cả thất bại'
            });
        }
    };

export const deleteAllNotification =
    ({ recipientId }) =>
    async (dispatch) => {
        try {
            await deleteDataApi('/notifications', {
                recipientId
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.DELETE_ALL_OTIFICATION
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Xóa toàn bộ thông báo thất bại'
            });
        }
    };
