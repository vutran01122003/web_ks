import { getDataApi, patchDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from '../../redux/actions/globalTypes';

export const addRow = ({formData}) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await postDataApi('/row', formData);
        const newPage = await getDataApi(formData.get('path'));

        dispatch({
            type: GLOBALTYPES.PAGE.UPDATE_DYNAMIC_PAGE,
            payload: {
                tables: newPage?.data.data.tables
            }
        })

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res?.data.status
            }
        })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error.reponse?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error?.response?.data.msg || 'Thêm Hoạt Động Thất Bại'
            }
        })
    }
}

export const getPeddingRows = () => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await getDataApi('/pending_rows');
  
        dispatch({
            type: GLOBALTYPES.ROW.GET_PENDING_ROWS,
            payload: {
                peddingRows: res.data.data
            }
        })

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res?.data.status
            }
        })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error.reponse?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error?.response?.data.msg || 'Lấy Dữ Liệu Chỉ Tiêu Chờ Duyệt Thất Bại'
            }
        })
    }
}

export const updatePeddingRowStatus = ({ rowListId, contentIdList, status }) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await patchDataApi('/pending_rows/update', { rowListId, contentIdList, status });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res?.data.msg
            }
        })

    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error.reponse?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error?.response?.data.msg || 'Duyệt Chỉ Tiêu Thất Bại'
            }
        })
    }
}