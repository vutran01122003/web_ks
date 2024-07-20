import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    user: null,
    token: null
};

function authReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.AUTH.SET_INFO_LOGIN: {
            return {
                ...action.payload
            };
        }

        case GLOBALTYPES.AUTH.UPDATE_LEVEL_YEAR: {
            return {
                ...state,
                user: {
                    ...state.user,
                    levelYear: action.payload.levelYear
                }
            };
        }

        default:
            return state;
    }
}

export default authReducer;
