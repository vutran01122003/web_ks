import { getDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const getFacultyManagers =
    ({ groupCode }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi('/users/groups', {
                groupCode
            });

            dispatch({
                type: GLOBALTYPES.PERMISSION.GET_FACULTY_MANAGERS,
                payload: {
                    facultyManagers: res.data.data
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy danh sách quản lý khoa thất bại'
            });
        }
    };
