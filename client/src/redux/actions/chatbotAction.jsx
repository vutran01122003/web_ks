import { getDataApi, postDataApi } from '../../utils/fetchData'
import GLOBALTYPES from './globalTypes'

export const sendChat = (question, typeChat) => async (dispatch) => {
	try {
		dispatch({
			type: GLOBALTYPES.CHATBOT.ANSWER_CHATBOT_LOADING,
			payload: {
				isLoading: true,
			},
		})

		const res = await postDataApi('/chat', { userInput: question, typeChat })

		dispatch({
			type: GLOBALTYPES.CHATBOT.SET_CHATBOT_DATA,
			payload: {
				key: 'answer',
				data: res.data.response,
			},
		})

		// const chatData = JSON.parse(localStorage.getItem('chatData')) || []

		// if (chatData) {
		// 	chatData[chatData.length - 1] = {
		// 		question,
		// 		answer: res.data.response,
		// 	}
		// }

		// localStorage.setItem('chatData', JSON.stringify(chatData))

		dispatch({
			type: GLOBALTYPES.CHATBOT.ANSWER_CHATBOT_LOADING,
			payload: {
				isLoading: false,
			},
		})
	} catch (error) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error:
					error?.response.data?.status === 401
						? 'Hết phiên đăng nhập'
						: error?.response.data?.msg || 'Gửi tin nhắn thất bại',
			},
		})
	}
}

export const getTypeChat = () => async (dispatch) => {
	try {
		const res = await getDataApi('/chat')
		dispatch({
			type: GLOBALTYPES.CHATBOT.GET_TYPE_CHAT,
			payload: {
				typeChat: res.data.response,
			},
		})
	} catch (error) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error:
					error?.response.data?.status === 401
						? 'Hết phiên đăng nhập'
						: error?.response.data?.msg || 'Lấy dữ liệu thất bại',
			},
		})
	}
}
