import { getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const createDealine =
    ({ facultyId, majorId, cohortId, levelYear, startDate, endDate, talentEngineerType }) =>
    async (dispatch) => {
        try {
            const res = await postDataApi('/deadline', {
                facultyId,
                majorId,
                cohortId,
                levelYear,
                startDate,
                endDate,
                talentEngineerType
            });

            dispatch(
                getDeadlineList({
                    facultyId,
                    majorId,
                    cohortId,
                    talentEngineerType
                })
            );
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Tạo thời hạn Thất Bại'
            });
        }
    };

export const getDeadlineList =
    ({ facultyId, majorId, cohortId, talentEngineerType }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi('/deadline', {
                facultyId,
                majorId,
                cohortId,
                talentEngineerType
            });

            dispatch({
                type: GLOBALTYPES.DEADLINE.GET_DEADLINE,
                payload: {
                    data: res.data.data
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
                dispatch,
                error,
                defaultMessage: 'Tạo thời hạn Thất Bại'
            });
        }
    };

export const updateDealine =
    ({ deadlineId, startDate, endDate, status }) =>
    async (dispatch) => {
        try {
            const res = await patchDataApi('/deadline', {
                deadlineId,
                startDate,
                endDate,
                status
            });

            dispatch({
                type: GLOBALTYPES.DEADLINE.UPDATE_DEADLINE,
                payload: {
                    data: res.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: 'Cập nhật thời hạn thành công'
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Cập nhật thời hạn Thất Bại'
            });
        }
    };
