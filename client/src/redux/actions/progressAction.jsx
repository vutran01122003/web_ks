import GLOBALTYPES from "./globalTypes"
import { getDataApi } from '../../utils/fetchData'

export const getProgressByYear = ({studentMajor, studentCohort, studentLevelYear}) => async (dispatch) => {
    try {
        const res = await getDataApi(`/progress?pageStudentMajor=${studentMajor}&pageStudentLevelYear=${studentLevelYear}&pageStudentCohort=${studentCohort}`);

        dispatch({
            type: GLOBALTYPES.PROGRESS.GET_PROGRESS_BY_YEAR,
            payload: {
                goalsInfoData: res.data.data
            }
        })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response.data?.status === 401 ? "Hết Phiên Đăng Nhập" :
                    error?.response.data?.msg || 
                    "Lấy Dữ Liệu Tiến Trình Hoàn Thành Chỉ Tiêu Theo Năm Thất Bại"
            }
        })
    }
} 