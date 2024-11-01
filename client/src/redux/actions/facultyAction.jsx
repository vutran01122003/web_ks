import { getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
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
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Tạo Khoa mới thất bại'
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
        notifyError({
            dispatch,
            error,
            defaultMessage: 'Lấy dữ liệu khoa mới thất bại'
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
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Tạo khóa sinh viên thất bại'
            });
        }
    };

export const updateLevelYearOfCohort =
    ({ currentLevelYear, facultyId, majorId, cohortId }) =>
    async (dispatch) => {
        try {
            await patchDataApi(`/faculties/${facultyId}/majors/${majorId}/cohorts/${cohortId}`, {
                currentLevelYear: currentLevelYear
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Cập nhật khóa sinh viên thất bại'
            });
        }
    };

export const getFacultyById =
    ({ facultyId }) =>
    async (dispatch) => {
        try {
            await getDataApi(`/faculties/${facultyId}`);
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy dữ liệu khoa thất bại'
            });
        }
    };

export const getFacultyByName =
    ({ facultyName }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(`/faculty/${facultyName}`);

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_FACULTY,
                payload: {
                    faculty: res.data.data
                }
            });
        } catch (error) {
            notifyError({
                error,
                dispatch,
                defaultMessage: 'Lấy dữ liệu khoa thất bại'
            });
        }
    };
