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
        const newPage = await getDataApi(JSON.parse(formData.get('rowData')).path);

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
                error: error.response?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error?.response?.data.msg || 'Thêm Hoạt Động Thất Bại'
            }
        })
    }
}

export const getDynamicRows = ({ tab, studentData, page, limit, currentRows}) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ROW.LOADING_PENDING_ROWS,
            payload: {
                loading: true
            }
        })

        const res = await getDataApi('/dynamic_rows', {
            page: page || 1,
            limit: limit || 3,
            current_rows: currentRows,
            rows_type: tab,
            student_id: studentData?.studentId || null,
            major: studentData?.major || null
        })
  
        dispatch({
            type: GLOBALTYPES.ROW.GET_DYNAMIC_ROWS,
            payload: {
                rowsType: tab,
                dynamicRows: res.data.data,
                page
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
                error: error.response?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error?.response?.data.msg || 'Lấy Dữ Liệu Chỉ Tiêu Chờ Duyệt Thất Bại'
            }
        })
    } finally {
        dispatch({
            type: GLOBALTYPES.ROW.LOADING_PENDING_ROWS,
            payload: {
                loading: false
            }
        })

    }
}

export const updateRowsStatus = ({pageInfo, noteValue, rowsType, rowListId, contentIdList, status, deadline }) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await patchDataApi('/dynamic_rows/update', { pageInfo, rowListId, contentIdList, status, noteValue, deadline});
        
        if(contentIdList.length === 1) {
            dispatch({
                type: GLOBALTYPES.ROW.REMOVE_ROW,
                payload: {
                    rowsType,
                    rowId: rowListId,
                    contentId: contentIdList[0]
                }
            });
        } else {
            dispatch({
                type: GLOBALTYPES.ROW.REMOVE_ALL_ROW,
                payload: {
                    rowsType,
                    pendingRowId: rowListId
                }
            });
        }
      
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
                error: error.response?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error?.response?.data.msg || 'Duyệt Chỉ Tiêu Thất Bại'
            }
        })
    }
}