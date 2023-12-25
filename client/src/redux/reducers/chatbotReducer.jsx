import GLOBALTYPES from '../actions/globalTypes'

const initialState = {
	isLoading: false,
    data: []
}

function chatBotReducer(state = initialState, action) {
	switch (action.type) {
		case GLOBALTYPES.CHATBOT.ANSWER_CHATBOT_LOADING: {
			return {
				...state,
				isLoading: action.payload.isLoading,
			}
		}
        case GLOBALTYPES.CHATBOT.SET_CHATBOT_DATA: {
            if(action.payload.key === 'answer') {
                const new_data = [...state.data];
                new_data[new_data.length -1][action.payload.key] = action.payload.data;
                return {
                    ...state,
                    data: new_data
                }
            }

            return {
                ...state,
                data: [...state.data, {
                    [action.payload.key]: action.payload.data
                }]
            }
        }
        
		default:
			return state
	}
}

export default chatBotReducer
