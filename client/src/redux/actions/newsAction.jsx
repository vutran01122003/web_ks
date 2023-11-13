import { getDataApi, postDataApi } from "../../utils/fetchData"
import GLOBALTYPES from "./globalTypes"

export const createNews = ({newsData}) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await postDataApi('/news', newsData);

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data?.msg
            }
        })

    } catch (error) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: error?.response.data?.status === 401 ? 
                "Hết phiên đăng nhập" : error?.response.data?.msg || 'Tạo tin tức thất bại'
            }
        })
    }
}

export const getAllNews = ({ newsType }) => async(dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await getDataApi('/news', {news_type: newsType});

        dispatch({
            type: GLOBALTYPES.NEWS.GET_NEWS,
            payload: {
                newsType,
                newsList: res.data.data,
                page: res.data?.page || 1, 
                maxPage: res.data?.maxPage
            }
        })

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
                error: error.reponse?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error.response?.data?.msg || 'Lấy Dữ Liệu Tin Tức Thất Bại'
            }
        })
    }
}

export const getNewsDetails = ({newsId}) => async(dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                loading: true
            }
        })

        const res = await getDataApi(`/news/${newsId}`);

        console.log(res.data.data);
        dispatch({
            type: GLOBALTYPES.NEWS.GET_NEWS_DETAILS,
            payload: {
                newsData: res.data.data
            }
        })

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
                error: error.reponse?.data?.status === 401 ? 
                "Hết Phiên Đăng Nhập" : error.response?.data?.msg || 'Lấy Dữ Liệu Tin Tức Thất Bại'
            }
        })
    }
} 