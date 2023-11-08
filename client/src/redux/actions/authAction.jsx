import { getDataApi, postDataApi } from "../../utils/fetchData"
import { getLogged, removeLogged, setLogged } from "../../utils/handleLogged";
import GLOBALTYPES from "./globalTypes";

export const login = ({
    studentId,
    password
}) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await postDataApi('/login', {
            studentId,
            password
        });

        dispatch({
            type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
            payload: res.data.data
        })

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {success: res.data.status}
        })

        setLogged();
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: error.reponse?.data.msg || 'Đăng Nhập Thất Bại'}
        })
    }
}

export const register = (data) => async(dispatch) => {
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
            payload:  res.data.data
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.status
            }
        });
        setLogged();
    } catch (error) { 
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.data.msg || "Cập Nhật Thông Tin Không Thành Công"
            }
        });
    }
}
export const logout = () => async(dispatch) => {
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

        removeLogged();
        window.location.href = '/';
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.data.msg || 'Đăng Xuất Không Thành Công'
            }
        });
    }
}

export const verifyAccessToken = () => async (dispatch) => {
    try {
        const res = await getDataApi('/access_token');
                
        dispatch({
            type: GLOBALTYPES.AUTH.SET_INFO_LOGIN,
            payload: res.data
        });
        
        setLogged();
    } catch (error) {
        if(getLogged()) {
            removeLogged();
            window.location.href = "/";
        }
    }
}


