import { getDataApi, postDataApi } from '../../utils/fetchData';
import { getAccessToken, removeAccessToken, setAccessToken } from '../../utils/handleCredentials';
import notifyError from '../../utils/notifyError';
import { getFacultyByName } from './facultyAction';
import GLOBALTYPES from './globalTypes';

const { VITE_APP_MAJOR_MANAGER_CODE } = import.meta.env;

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

            const data = res.data.data;

            dispatch({
                type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
                payload: data
            });

            setAccessToken(data.token.accessToken);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: res.data.status }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response?.data.msg || 'Đăng nhập thất bại'
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
                const resData = res.data.data;

                dispatch({
                    type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
                    payload: resData
                });

                setAccessToken(resData.token.accessToken);
            } else {
                res = await postDataApi('/admin/register', data);
                if (data.groupCode === VITE_APP_MAJOR_MANAGER_CODE)
                    dispatch(getFacultyByName({ facultyName: data.faculty }));
            }

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
                    error: error?.response?.data.msg || 'Tạo người dùng không thành công'
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

        removeAccessToken();

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
                error: error?.response?.data.msg || 'Đăng xuất không thành công'
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
            defaultMessage: 'Lấy thông tin người dùng thất bại'
        });
    }
};
