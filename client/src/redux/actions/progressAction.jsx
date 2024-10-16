import GLOBALTYPES from './globalTypes';
import { getDataApi, postDataApi } from '../../utils/fetchData';

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
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response.data?.msg ||
                              'Lấy Dữ Liệu Tiến Trình Hoàn Thành Chỉ Tiêu Theo Năm Thất Bại'
                }
            });
        }
    };

export const getAnnualTaskProgress =
    ({ major, levelYear, faculty, cohort, groupCode, isCompleted, userId, sortProgressPercentage, page, limit }) =>
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
                isCompleted,
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
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error?.response.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response.data?.msg || 'Lấy Dữ Liệu Tiến Độ Hoàn Thành Thất Bại'
                }
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
    ({ conditions, major, cohort, faculty, levelYear, updatedCohortData }) =>
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
                updatedCohortData
            });

            const updatedFaculty = await getDataApi(`/faculties/${updatedCohortData.facultyId}`);

            dispatch({
                type: GLOBALTYPES.FACULTY.UPDATE_FACULTY,
                payload: {
                    facultyId: updatedCohortData.facultyId,
                    newElem: updatedFaculty.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.AUTH.UPDATE_LEVEL_YEAR,
                payload: {
                    levelYear: updatedCohortData.nextYearValue
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
                        error?.response.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response.data?.msg || 'Kết Thúc Hoạt Động Nộp Minh Chứng Thất Bại'
                }
            });
        }
    };
