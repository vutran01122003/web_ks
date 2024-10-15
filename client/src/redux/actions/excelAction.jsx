import { postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from './globalTypes';

export const importUser = (formData) => async (dispatch) => {
    try {
        const res = await postDataApi('/excel', formData);

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data?.msg
            }
        });
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error:
                    error.response?.data?.status === 401
                        ? 'Hết Phiên Đăng Nhập'
                        : error?.response?.data.msg || 'Thêm sinh viên thất bại'
            }
        });
    }
};
