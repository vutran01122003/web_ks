import { getDataApi, postDataApi } from '../../utils/fetchData';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import axios from 'axios';

export const addRow = ({formData}) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await postDataApi('/row', formData);
        console.log(res);
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
        console.log(error);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response?.status === 401? 'Hết Phiên Đăng Nhập' : 'Thêm Thông Tin Bảng Thất Bại'
            }
        })
    }
}

export const createPage = (data) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        });

        const res = await postDataApi('/page', data);

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
                error: error?.response?.status === 401 ? 'Hết Phiên Đăng Nhập' : 'Tạo Page Thất Bại'
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
                error: error?.response?.status === 401 ? 'Hết Phiên Đăng Nhập' :  "Lấy Dữ Liệu Page Thất Bại"
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
                    error: error?.response?.status === 401 ? 'Hết Phiên Đăng Nhập' : 'Lấy Dữ Liệu Page Thất Bại'
                }
            })
       
    }
}
  
       
     