import GLOBALTYPES from '../actions/globalTypes';
const initialState = {
    socket: null,
};

function socketReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.SOCKET.SET_SOCKET:
            return {
                ...state,
                socket: action.payload.socket,
            };
        default:
            return state;
    }
}

export default socketReducer;
