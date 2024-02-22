import GLOBALTYPES from './globalTypes';
import { getDataApi, postDataApi } from '../../utils/fetchData';

export const getProgressByYear =
    ({ studentMajor, studentCohort, studentLevelYear }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(
                `/progress?pageStudentMajor=${studentMajor}&pageStudentLevelYear=${studentLevelYear}&pageStudentCohort=${studentCohort}`
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
    ({ major, levelYear, cohort, isCompleted, studentId, sortProgress }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi('/progress/all', {
                major,
                levelYear,
                cohort,
                isCompleted,
                studentId,
                sortProgress
            });

            dispatch({
                type: GLOBALTYPES.PROGRESS.GET_ANNUAL_TASK_PROGRESS,
                payload: {
                    data: res.data.data,
                    page: 0
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: false
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
        }
    };

export const stopSubmittingProof =
    ({ progressPercentage, score, major, cohort, levelYear }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            await postDataApi('/progress/updated-users', {
                progressPercentage,
                score,
                major,
                cohort,
                levelYear
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: false
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
