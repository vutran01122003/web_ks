import { getDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const getActivities =
    ({ pageStudentMajor, pageStudentCohort, pageStudentLevelYear, pageTalentEngineerType }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(
                `/page/activities?pageStudentMajor=${pageStudentMajor}&pageStudentCohort=${pageStudentCohort}&pageStudentLevelYear=${pageStudentLevelYear}&pageTalentEngineerType=${pageTalentEngineerType}`
            );

            const activities =
                res.data.data.length > 0 ? res.data.data[0].tables.map((activity) => activity.tableName) : [];

            dispatch({
                type: GLOBALTYPES.ACTIVITIES.GET_ACTIVITIES,
                payload: {
                    activities
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy Dữ Liệu Hoạt Động Thất Bại'
            });
        }
    };
