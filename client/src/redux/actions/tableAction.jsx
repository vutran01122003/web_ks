import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from './globalTypes';

export const addTable =
    ({ pageId, tables }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi('/table', { pageId, tables });

            dispatch({
                type: GLOBALTYPES.GOALS.ADD_NEW_GOAL,
                payload: {
                    pageId,
                    page: res.data.page
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Thêm chỉ tiêu thất bại'
                }
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
                    tables: res.data.data.tables
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Lấy dữ liệu các chỉ tiêu thất bại'
                }
            });
        }
    };

export const getTable =
    ({ pageId, tableId }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi('/table', {
                pageId,
                tableId
            });

            dispatch({
                type: GLOBALTYPES.GOALS.GET_GOAL,
                payload: {
                    table: res.data.table
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Lấy dữ liệu chỉ tiêu thất bại'
                }
            });
        }
    };

export const removeTable =
    ({ pageId, tableId }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi('/table', {
                pageId,
                tableId
            });

            dispatch({
                type: GLOBALTYPES.GOALS.REMOVE_GOAL,
                payload: {
                    pageId,
                    tableId
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Xóa chỉ tiêu thất bại'
                }
            });
        }
    };

export const updateTable =
    ({ pageId, table, tableIndex }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi('/table', {
                pageId,
                table
            });

            if (tableIndex !== undefined) {
                dispatch({
                    type: GLOBALTYPES.GOALS.UPDATE_STATUS_TABLE,
                    payload: {
                        tableIndex,
                        pageId,
                        status: table.isActive
                    }
                });
            }

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Cập nhật chỉ tiêu thất bại'
                }
            });
        }
    };
