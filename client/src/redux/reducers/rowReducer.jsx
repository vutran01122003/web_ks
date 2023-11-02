import GLOBALTYPES from "../actions/globalTypes";

const initialState = {
    peddingRows: []
}

function rowReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.ROW.GET_PENDING_ROWS:       
            return {
                ...state,
                peddingRows: action.payload.peddingRows
            }
    
        default:
            return state;
    }
}

export default rowReducer;