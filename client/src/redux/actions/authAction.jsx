import { getDataApi, postDataApi } from '../../utils/fetchData';
import { getAccessToken } from '../../utils/getCookie';
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

export const register =
    ({ isDirectRegister, ...data }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            let res = null;

            if (isDirectRegister) {
                res = await postDataApi('/register', data);
                dispatch({
                    type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
                    payload: res.data.data
                });
            } else res = await postDataApi('/admin/register', data);

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
                    error: error?.response?.data.msg || 'Tạo người dùng Không Thành Công'
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

export const verifyAccessToken = () => async (dispatch) => {
    try {
        if (getAccessToken()) {
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
