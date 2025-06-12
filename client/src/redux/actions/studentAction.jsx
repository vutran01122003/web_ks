import { getDataApi, patchDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import { getAllFaculties } from './facultyAction';
import GLOBALTYPES from './globalTypes';

export const getStudents =
    ({ major, cohort, groupCode, limit, page, status, userId, sortByName }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.STUDENT.LOADING,
                payload: {
                    isLoading: true
                }
            });

            const res = await getDataApi('/users', {
                major,
                cohort,
                limit,
                groupCode,
                page,
                status,
                userId,
                sortByName
            });

            dispatch({
                type: GLOBALTYPES.STUDENT.GET_STUDENTS,
                payload: {
                    studentList: res.data.data,
                    page: page
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: 'Lấy dữ liệu thành công'
                }
            });
        } catch (error) {
            notifyError({
                error,
                dispatch,
                defaultMessage: 'Lấy danh sách kỹ sư tài năng thất bại'
            });
        } finally {
            dispatch({
                type: GLOBALTYPES.STUDENT.LOADING,
                payload: {
                    isLoading: false
                }
            });
        }
    };

export const updateUser =
    ({ userId, userData }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/users/${userId}`, {
                userData
            });

            dispatch(getAllFaculties());

            dispatch({
                type: GLOBALTYPES.STUDENT.UPDATE_STUDENT,
                payload: {
                    userId: userId,
                    userData: res.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: 'Cập nhật thông tin người dùng thành công'
                }
            });
        } catch (error) {
            notifyError({
                error,
                dispatch,
                defaultMessage: 'Cập nhật thông tin người dùng thất bại'
            });
        }
    };
