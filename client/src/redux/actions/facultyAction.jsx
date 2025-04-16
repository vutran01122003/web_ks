import { deleteDataApi, getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const createFaculty =
    ({ facultyName, managerIdList }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi(`/faculties`, {
                facultyName,
                managerIdList
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

export const updateFaculty =
    ({ facultyId, facultyData }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/faculties/${facultyId}`, {
                data: facultyData
            });

            dispatch({
                type: GLOBALTYPES.FACULTY.UPDATE_FACULTY,
                payload: {
                    faculty: res.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg || 'Cập nhật thông tin khoa thành công'
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Cập nhật thông tin khoa thất bại'
            });
        }
    };

export const deleteFaculty =
    ({ facultyId }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi(`/faculties/${facultyId}`);

            dispatch({
                type: GLOBALTYPES.FACULTY.DELETE_FACULTY,
                payload: {
                    facultyId
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg || 'Xóa khoa thành công'
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Xóa khoa thất bại'
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
            console.log(facultyId);
            await getDataApi(`/faculties/id/${facultyId}`);
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
            const res = await getDataApi(`/faculties/name/${facultyName}`);

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

export const createMajor =
    ({ facultyId, majorName, managerIdList }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi(`/faculties/${facultyId}/majors`, {
                majorName,
                managerIdList
            });

            const faculties = await getDataApi('/faculties');

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_ALL_FACULTIES,
                payload: {
                    facultyData: faculties.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg || 'Thêm chuyên ngành thành công'
                }
            });
        } catch (error) {
            notifyError({
                error,
                dispatch,
                defaultMessage: 'Thêm chuyên ngành thất bại'
            });
        }
    };

export const getMajors =
    ({ managerId }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi('/majors', {
                managerId
            });

            console.log(res.data.data);

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_MAJORS,
                payload: {
                    majors: res.data.data
                }
            });
        } catch (error) {
            notifyError({
                error,
                dispatch,
                defaultMessage: 'Lấy dữ liệu chuyên ngành thất bại'
            });
        }
    };

export const updateMajor =
    ({ facultyId, majorId, majorData }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/faculties/${facultyId}/majors/${majorId}`, {
                data: majorData
            });

            const faculties = await getDataApi('/faculties');

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_ALL_FACULTIES,
                payload: {
                    facultyData: faculties.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg || 'Cập nhật chuyên ngành thành công'
                }
            });
        } catch (error) {
            notifyError({
                error,
                dispatch,
                defaultMessage: 'Cập nhật chuyên ngành thành công'
            });
        }
    };

export const deleteMajor =
    ({ facultyId, majorId }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi(`/faculties/${facultyId}/majors/${majorId}`);

            const faculties = await getDataApi('/faculties');

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_ALL_FACULTIES,
                payload: {
                    facultyData: faculties.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res?.data.msg || 'Xóa chuyên ngành thành công'
                }
            });
        } catch (error) {
            notifyError({
                error,
                dispatch,
                defaultMessage: 'Xóa chuyên ngành thất bại'
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

            const faculties = await getDataApi('/faculties');

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_ALL_FACULTIES,
                payload: {
                    facultyData: faculties.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg || 'Tạo khóa sinh viên thành công'
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

export const updateCohort =
    ({ facultyId, majorId, cohortId, cohortData }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi(`/faculties/${facultyId}/majors/${majorId}/cohorts/${cohortId}`, {
                data: cohortData
            });

            const faculties = await getDataApi('/faculties');

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_ALL_FACULTIES,
                payload: {
                    facultyData: faculties.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg || 'Cập nhật khóa sinh viên thành công'
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Cập nhật khóa sinh viên thất bại'
            });
        }
    };

export const deleteCohort =
    ({ facultyId, majorId, cohortId }) =>
    async (dispatch) => {
        try {
            const res = await deleteDataApi(`/faculties/${facultyId}/majors/${majorId}/cohorts/${cohortId}`);

            const faculties = await getDataApi('/faculties');

            dispatch({
                type: GLOBALTYPES.FACULTY.GET_ALL_FACULTIES,
                payload: {
                    facultyData: faculties.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data.msg || 'Xóa khóa sinh viên thành công'
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Xóa khóa sinh viên thất bại'
            });
        }
    };
