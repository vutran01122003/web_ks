import { getDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const login =
    ({ userId, password }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/login', {
                userId,
                password
            });

            dispatch({
                type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
                payload: res.data.data
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: res.data.status }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Đăng Nhập Thất Bại'
                }
            });
        }
    };

export const register = (data) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        const res = await postDataApi('/register', data);

        dispatch({
            type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
            payload: res.data.data
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.status
            }
        });
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.data.msg || 'Cập Nhật Thông Tin Không Thành Công'
            }
        });
    }
};
export const logout = () => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        const res = await getDataApi('/logout');

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.status
            }
        });

        window.location.href = '/';
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.data.msg || 'Đăng Xuất Không Thành Công'
            }
        });
    }
};

const hasAccessToken = () => {
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith('accessToken='));
};

export const verifyAccessToken = () => async (dispatch) => {
    try {
        if (hasAccessToken()) {
            const res = await getDataApi('/access-token');
            dispatch({
                type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
                payload: res.data
            });
        } else {
            dispatch({
                type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
                payload: null
            });
        }
    } catch (error) {
        notifyError({
            dispatch,
            error,
            defaultMessage: 'Tải trang thất bại'
        });
    }
};
