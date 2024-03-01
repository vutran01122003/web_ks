import { getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from './globalTypes';

export const createFaculty =
    ({ facultyName, managerIdList, majorList }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi(`/faculties`, {
                facultyName,
                managerIdList,
                majorList
            });

            dispatch({
                type: GLOBALTYPES.FACULTY.ADD_FACULTY,
                payload: {
                    faculty: res.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Tạo Khoa mới thất bại'
                }
            });
        }
    };

export const getAllFaculties = () => async (dispatch) => {
    try {
        const res = await getDataApi('/faculties');

        dispatch({
            type: GLOBALTYPES.FACULTY.GET_ALL_FACULTIES,
            payload: {
                facultyData: res.data
            }
        });
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error:
                    error.response?.data?.status === 401
                        ? 'Hết Phiên Đăng Nhập'
                        : error?.response?.data.msg || 'Lấy dữ liệu khoa mới thất bại'
            }
        });
    }
};

export const createCohort =
    ({ facultyId, majorId, cohortName }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi(`/faculties/${facultyId}/majors/${majorId}/cohorts`, {
                cohortName
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Tạo khóa sinh viên thất bại'
                }
            });
        }
    };

export const updateLevelYearOfCohort =
    ({ currentLevelYear, facultyId, majorId, cohortId }) =>
    async (dispatch) => {
        try {
            await patchDataApi(`/faculties/${facultyId}/majors/${majorId}/cohorts/${cohortId}`, {
                currentLevelYear: currentLevelYear + 1
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg || 'Cập nhật khóa sinh viên thất bại'
                }
            });
        }
    };
