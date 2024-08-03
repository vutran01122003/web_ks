import { getDataApi, patchDataApi } from '../../utils/fetchData';
import GLOBALTYPES from './globalTypes';

export const getStudents =
    ({ major, cohort, limit, page, status, userId }) =>
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
                page,
                status,
                userId
            });

            dispatch({
                type: GLOBALTYPES.STUDENT.GET_STUDENTS,
                payload: {
                    studentList: res.data.data,
                    page: page
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Lấy danh sách kỹ sư tài năng thất bại'
                }
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
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Cập nhật thông tin người dùng thất bại'
                }
            });
        }
    };
