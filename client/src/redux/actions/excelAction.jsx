import { postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
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
        notifyError({
            error,
            dispatch,
            defaultMessage: 'Thêm sinh viên thất bại'
        });
    }
};
