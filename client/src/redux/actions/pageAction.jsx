import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import notifyError from '../../utils/notifyError';
import { getMajors } from './facultyAction';

export const createPage =
    ({ pageData, resetAllData, isGoals }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/page', pageData);

            if (isGoals) dispatch(getMajors());
            if (resetAllData) resetAllData();
            if (pageData.majorName) dispatch(getMajors({ majorName: pageData.majorName }));

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: isGoals ? 'Thêm nhóm chỉ tiêu thất bại' : 'Tạo bài viết thất bại'
            });
        }
    };

export const getPages = (params) => async (dispatch) => {
    try {
        const res = await getDataApi('/pages', params);

        dispatch({
            type: GLOBALTYPES.PAGE.GET_DYNAMIC_PAGES,
            payload: {
                pages: res?.data.data
            }
        });
    } catch (error) {
        notifyError({
            dispatch,
            error,
            defaultMessage: 'Lấy dữ liệu trang thất bại'
        });
    }
};

export const getGoals = (params) => async (dispatch) => {
    try {
        const res = await getDataApi('/pages', params);

        dispatch({
            type: GLOBALTYPES.GOALS.GET_GOALS,
            payload: {
                pages: res?.data.data
            }
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res?.data.msg || 'Lấy dữ liệu thành công'
            }
        });
    } catch (error) {
        notifyError({
            dispatch,
            error,
            defaultMessage: 'Lấy dữ liệu nhóm chỉ tiêu thất bại'
        });
    }
};

export const setPageInfo = (pageInfo) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.PAGE.SET_PAGE_INFO,
            payload: {
                ...pageInfo
            }
        });
    } catch (error) {
        notifyError({
            dispatch,
            error,
            defaultMessage: 'Cập nhật dữ liệu trang thất bại'
        });
    }
};

export const removePage =
    ({ pageId }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi('/page', { pageId });

            dispatch({
                type: GLOBALTYPES.PAGE.REMOVE_DYNAMIC_PAGE,
                payload: {
                    pageId
                }
            });

            dispatch({
                type: GLOBALTYPES.GOALS.REMOVE_GOALS,
                payload: {
                    pageId
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Xóa Trang Thất Bại'
            });
        }
    };

export const updateStatusPage =
    ({ pageId, currentStatus }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await patchDataApi('/page', { pageId, currentStatus });

            dispatch({
                type: GLOBALTYPES.GOALS.UPDATE_STATUS_PAGE,
                payload: {
                    pageId,
                    currentStatus
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Cập Nhật Trạng Thái Trang Thất Bại'
            });
        }
    };
