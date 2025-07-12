import GLOBALTYPES from './globalTypes';
import { getDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import { getMajors } from './facultyAction';
import axios from 'axios';

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
                defaultMessage: 'Lấy dữ liệu tiến trình hoàn thành chỉ tiêu theo năm thất bại'
            });
        }
    };

export const exportRegisterForm = () => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        await postDataApi(
            '/progress/register-form',
            {},
            {
                responseType: 'arraybuffer'
            }
        ).then((res) => {
            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'PhieuDangKy.docx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: 'Xuất phiếu đăng ký thành công'
            }
        });
    } catch (error) {
        notifyError({
            dispatch,
            error,
            defaultMessage: 'Xuất phiếu đăng ký thất bại'
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
                defaultMessage: 'Lấy dữ liệu tiến độ hoàn thành thất bại'
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
    ({ limit, major, cohort, groupCode, faculty, levelYear, updatedCohortData }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/progress/process', {
                limit,
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
                    sortProgressPercentage: -1,
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
                defaultMessage: 'Kết thúc hoạt động nộp minh chứng thất bại'
            });
        }
    };

export const confirmProgress =
    ({ levelYear, faculty, major, cohort, groupCode, updatedCohortData }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/progress/confirm', {
                major,
                cohort,
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
                    sortProgressPercentage: -1,
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
                defaultMessage: 'Kết thúc hoạt động nộp minh chứng thất bại'
            });
        }
    };

export const revertProgress =
    ({ major, cohort, groupCode, levelYear, faculty }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/progress/revert', {
                majorName: major,
                cohortName: cohort,
                groupCode,
                levelYear
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
                    sortProgressPercentage: -1,
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
                defaultMessage: 'Duyệt lại thất bại'
            });
        }
    };
