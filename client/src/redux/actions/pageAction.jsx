import { deleteDataApi, getDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from '../../redux/actions/globalTypes';

export const createPage = (data) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        const res = await postDataApi('/page', data);

        console.log(res);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res?.data.status
            }
        });
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.data.msg || 'Tạo Trang Thất Bại'
            }
        });
    }
}

export const getPages = () => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }    
        })

        const res = await getDataApi('/page');

        dispatch({
            type: GLOBALTYPES.PAGE.GET_DYNAMIC_PAGES,
            payload: {
                pages: res?.data.data
            }
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: false
            }
        })
    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.data.msg || "Lấy Dữ Liệu Trang Thất Bại"
            }
        })
    }
}

export const getPage = ({pathName}) => async (dispatch) => {
    try {
        if (pathName.includes('/page/')) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            })

            const res = await getDataApi(pathName);

            dispatch({
                type: GLOBALTYPES.PAGE.DYNAMIC_PAGE_INFO,
                payload: {
                    pathName, 
                    pageId: res?.data.data?._id,
                    pageName: res?.data.data?.pageName,
                    tables: res?.data.data.tables
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: false
                }
            })
        }    
    } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error?.response?.data.msg || 'Lấy Dữ Liệu Trang Thất Bại'
                }
            })
       
    }
}

export const removePage = ({pageId}) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await deleteDataApi('/page', {pageId});

        dispatch({
            type: GLOBALTYPES.PAGE.REMOVE_DYNAMIC_PAGE,
            payload: {
                pageId
            }
        })

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        })

    } catch (error) {
        console.log(error)
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.data.msg || 'Xóa Trang Thất Bại'
            }
        })
    }
}
  
       
     