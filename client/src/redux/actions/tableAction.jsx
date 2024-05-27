import { deleteDataApi, getDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from './globalTypes';

export const addTable =
    ({ pageId, tables }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true,
                },
            });

            const res = await postDataApi('/table', { pageId, tables });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg,
                },
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg ||
                              'Thêm chỉ tiêu thất bại',
                },
            });
        }
    };

export const getTables =
    ({ subPageName }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/page/${subPageName}`);
            dispatch({
                type: GLOBALTYPES.TABLE.SET_TABLES,
                payload: {
                    pageName: subPageName,
                    tables: res.data.data.tables,
                },
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg ||
                              'Lấy dữ liệu chỉ tiêu thất bại',
                },
            });
        }
    };

export const removeTable =
    ({ pageId, tableId }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true,
                },
            });

            const res = await deleteDataApi('/table', {
                pageId,
                tableId,
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg,
                },
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg ||
                              'Xóa chỉ tiêu thất bại',
                },
            });
        }
    };
