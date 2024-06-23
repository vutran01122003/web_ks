import { getDataApi } from '../../utils/fetchData';
import GLOBALTYPES from './globalTypes';

export const getActivities =
    ({ pageStudentMajor, pageStudentCohort, pageStudentLevelYear }) =>
    async (dispatch) => {
        try {
            const res = await getDataApi(
                `/page/activities?pageStudentMajor=${pageStudentMajor}&pageStudentCohort=${pageStudentCohort}&pageStudentLevelYear=${pageStudentLevelYear}`
            );

            const activities =
                res.data.data.length > 0
                    ? res.data.data[0].tables.map(
                          (activity) => activity.tableName
                      )
                    : [];

            dispatch({
                type: GLOBALTYPES.ACTIVITIES.GET_ACTIVITIES,
                payload: {
                    activities
                }
            });
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error:
                        error.response?.data?.status === 401
                            ? 'Hết Phiên Đăng Nhập'
                            : error?.response?.data.msg ||
                              'Lấy Dữ Liệu Hoạt Động Thất Bại'
                }
            });
        }
    };
