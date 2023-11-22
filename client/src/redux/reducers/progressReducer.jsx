import GLOBALTYPES from "../actions/globalTypes";

const initialState = {
    goalsInfoData: []
};

function progressReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PROGRESS.GET_PROGRESS_BY_YEAR: {
            return {
                ...state,
                goalsInfoData: action.payload.goalsInfoData
            }
        }
        default:
            return state;
    }
}

export default progressReducer;