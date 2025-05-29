import GLOBALTYPES from './globalTypes';
import { getDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import { getFacultyByName, getMajors } from './facultyAction';

export const getProgressByYear =
    ({ userId, studentMajor, studentCohort, studentLevelYear }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(
                `/progress?userId=${userId}&pageStudentMajor=${studentMajor}&pageStudentLevelYear=${studentLevelYear}&pageStudentCohort=${studentCohort}`
            );

            dispatch({
                type: GLOBALTYPES.PROGRESS.GET_PROGRESS_BY_YEAR,
                payload: {
                    goalsInfoData: res.data.data,
                    levelYear: studentLevelYear
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy Dữ Liệu Tiến Trình Hoàn Thành Chỉ Tiêu Theo Năm Thất Bại'
            });
        }
    };

export const getAnnualTaskProgress =
    ({ major, levelYear, faculty, cohort, groupCode, userId, sortProgressPercentage, page, limit }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.PROGRESS.LOADING,
                payload: {
                    isLoading: true
                }
            });

            const res = await getDataApi('/progress/all', {
                major,
                faculty,
                cohort,
                groupCode,
                levelYear,
                userId,
                sortProgressPercentage,
                page,
                limit
            });

            dispatch({
                type: GLOBALTYPES.PROGRESS.GET_ANNUAL_TASK_PROGRESS,
                payload: {
                    data: res.data.data,
                    page
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy Dữ Liệu Tiến Độ Hoàn Thành Thất Bại'
            });
        } finally {
            dispatch({
                type: GLOBALTYPES.PROGRESS.LOADING,
                payload: {
                    isLoading: false
                }
            });
        }
    };

export const stopSubmittingProof =
    ({ conditions, major, cohort, groupCode, faculty, levelYear, updatedCohortData }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/progress/updated-users', {
                conditions,
                major,
                cohort,
                faculty,
                levelYear,
                groupCode,
                updatedCohortData
            });

            dispatch({
                type: GLOBALTYPES.PROGRESS.RESET_ANNUAL_TASK_PROGRESS
            });

            dispatch(
                getMajors({
                    majorName: major
                })
            );

            dispatch(
                getAnnualTaskProgress({
                    major,
                    cohort,
                    levelYear,
                    faculty,
                    groupCode,
                    sortProgressPercentage: 1,
                    page: 1,
                    limit: 10
                })
            );

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
                defaultMessage: 'Kết Thúc Hoạt Động Nộp Minh Chứng Thất Bại'
            });
        }
    };
