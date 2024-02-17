import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from './globalTypes';

export const createUpdatedActivityNotification =
    ({ title, content, senderId, recipientId, pageId }) =>
    async (dispatch) => {
        try {
            await postDataApi('/notification', {
                title,
                content,
                senderId,
                recipientId,
                pageId
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Tạo thông báo thất bại'
                }
            });
        }
    };

export const getNumUnreadNotification =
    ({ userId }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/notification/num_unread_notification/${userId}`);
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.GET_NUM_UNREAD_NOTIFICATION,
                payload: {
                    numUnreadNotification: res.data.data.numUnreadNotification
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Tạo thông báo thất bại'
                }
            });
        }
    };

export const getNotifications =
    ({ userId, page, limit, currentNumNotifications }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.LOADING_NOTIFICATIONS,
                payload: {
                    isLoading: true
                }
            });

            const res = await getDataApi(
                `/notification/${userId}?page=${page}&limit=${limit}&currentNumNotifications=${currentNumNotifications}`
            );

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS,
                payload: {
                    data: res.data.data,
                    recipientId: userId,
                    page
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Lấy dữ liệu thông báo thất bại'
                }
            });
        } finally {
            dispatch({
                type: GLOBALTYPES.NOTIFICATION.LOADING_NOTIFICATIONS,
                payload: {
                    isLoading: false
                }
            });
        }
    };

export const updateReadStatus =
    ({ notificationId, status, recipientId }) =>
    async (dispatch) => {
        try {
            await patchDataApi('/notification/read_status', {
                notificationId,
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
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Cập nhật trạng thái đọc thất bại'
                }
            });
        }
    };

export const deleteNotification =
    ({ notificationId, recipientId }) =>
    async (dispatch) => {
        try {
            await deleteDataApi('/notification', {
                notificationId,
                recipientId
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.DELETE_NOTIFICATION,
                payload: {
                    notificationId
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Cập nhật trạng thái đọc thất bại'
                }
            });
        }
    };

export const markAllAsRead =
    ({ recipientId }) =>
    async (dispatch) => {
        try {
            await patchDataApi('/notification/read_status_all', {
                recipientId
            });

            const res = await getDataApi(
                `/notification/${recipientId}?page=1&limit=5&currentNumNotifications=0`
            );

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.GET_NOTIFICATIONS,
                payload: {
                    data: res.data.data,
                    recipientId,
                    page: 1
                }
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.MARK_ALL_AS_READ
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Cập nhật trạng thái đọc thất bại'
                }
            });
        }
    };

export const deleteAllNotification =
    ({ recipientId }) =>
    async (dispatch) => {
        try {
            await deleteDataApi('/notification/all', {
                recipientId
            });

            dispatch({
                type: GLOBALTYPES.NOTIFICATION.DELETE_ALL_OTIFICATION
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Cập nhật trạng thái đọc thất bại'
                }
            });
        }
    };
