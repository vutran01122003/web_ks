import { getDataApi, postDataApi } from '../../utils/fetchData';
import notifyError from '../../utils/notifyError';
import GLOBALTYPES from './globalTypes';

export const sendChat = (question, typeChat) => async (dispatch) => {
    try {
        dispatch({
            type: GLOBALTYPES.CHATBOT.ANSWER_CHATBOT_LOADING,
            payload: {
                isLoading: true
            }
        });

        const res = await postDataApi('/chat', {
            userInput: question,
            typeChat
        });

        dispatch({
            type: GLOBALTYPES.CHATBOT.SET_CHATBOT_DATA,
            payload: {
                key: 'answer',
                data: res.data.response
            }
        });

        dispatch({
            type: GLOBALTYPES.CHATBOT.ANSWER_CHATBOT_LOADING,
            payload: {
                isLoading: false
            }
        });
    } catch (error) {
        notifyError({
            error,
            dispatch,
            defaultMessage: 'Gửi tin nhắn thất bại'
        });
    }
};

export const getTypeChat = () => async (dispatch) => {
    try {
        const res = await getDataApi('/chat');
        dispatch({
            type: GLOBALTYPES.CHATBOT.GET_TYPE_CHAT,
            payload: {
                typeChat: res.data.response
            }
        });
    } catch (error) {
        notifyError({
            dispatch,
            error,
            defaultMessage: 'Lấy dữ liệu thất bại'
        });
    }
};
