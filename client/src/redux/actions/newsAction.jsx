import { getDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const createNews =
    ({ newsData }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await postDataApi('/news', newsData);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    success: res.data?.msg
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Tạo tin tức thất bại'
            });
        }
    };

export const getAllNews =
    ({ newsType }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi('/news', { news_type: newsType });

            dispatch({
                type: GLOBALTYPES.NEWS.GET_NEWS,
                payload: {
                    newsType,
                    newsList: res.data.data,
                    page: res.data?.page || 1,
                    maxPage: res.data?.maxPage
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: false
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy Dữ Liệu Tin Tức Thất Bại'
            });
        }
    };

export const getNewsDetails =
    ({ newsId }) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: true
                }
            });

            const res = await getDataApi(`/news/${newsId}`);

            dispatch({
                type: GLOBALTYPES.NEWS.GET_NEWS_DETAILS,
                payload: {
                    newsData: res.data.data
                }
            });

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    loading: false
                }
            });
        } catch (error) {
            notifyError({
                dispatch,
                error,
                defaultMessage: 'Lấy Dữ Liệu Tin Tức Thất Bại'
            });
        }
    };
