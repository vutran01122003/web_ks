import GLOBALTYPES from "../actions/globalTypes";

const initialState = {
    user: null,
    token: null
}

function authReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.AUTH.SET_INFO_LOGIN: {
            return {
                ...action.payload
           }
        }
        default:
            return state;
    }
}

export default authReducer;