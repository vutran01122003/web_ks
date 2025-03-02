import { postDataApi } from '../../utils/fetchData';
import { downloadExcel } from '../../utils/handleFile';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

const { VITE_APP_TALENT_ENGINEER_CODE } = import.meta.env;

export const importUser = (formData) => async (dispatch) => {
    try {
        const res = await postDataApi('/users-excel/import', formData);

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data?.msg
            }
        });
    } catch (error) {
        notifyError({
            error,
            dispatch,
            defaultMessage: 'Thêm sinh viên thất bại'
        });
    }
};

export const exportQualifiedUsersExcel = (filterData) => async (dispatch) => {
    try {
        const { major, cohort, groupCode } = filterData;
        const type = groupCode === VITE_APP_TALENT_ENGINEER_CODE ? 'kstn' : 'kstn_bosung';

        await downloadExcel({
            endpoint: '/qualified-users/export',
            filterData,
            filename: `${major}_${cohort}_${type}_ddsv`
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: 'Xuất file thành công'
            }
        });
    } catch (error) {
        notifyError({
            error,
            dispatch,
            defaultMessage: 'Xuất file excel thất bại'
        });
    }
};

export const exportProgressStatisticsExcel = (filterData) => async (dispatch) => {
    try {
        const { major, cohort, groupCode } = filterData;
        const type = groupCode === VITE_APP_TALENT_ENGINEER_CODE ? 'kstn' : 'kstn_bosung';

        await downloadExcel({
            endpoint: '/progress-statistics/export',
            filterData,
            filename: `${major}_${cohort}_${type}_tktd`
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: 'Xuất file thành công'
            }
        });
    } catch (error) {
        notifyError({
            error,
            dispatch,
            defaultMessage: 'Xuất file excel thất bại'
        });
    }
};
