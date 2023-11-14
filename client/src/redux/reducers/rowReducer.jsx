import GLOBALTYPES from "../actions/globalTypes";
import removeElem from '../../utils/removeElem';
const initialState = {
    loading: false,
    peddingRows: [],
    page: 1,
    maxPage: false,
    currentPeddingRows: 0
}

function rowReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.ROW.LOADING_PENDING_ROWS:
            return {
                ...state,
                loading: action.payload.loading
            }
        case GLOBALTYPES.ROW.GET_PENDING_ROWS:          
            return {
                ...state,
                peddingRows: action.payload.page === 1 ? 
                    action.payload.peddingRows : 
                    [...state.peddingRows, ...action.payload.peddingRows],
                page: action.payload?.page || 1,
                maxPage: action.payload.peddingRows.length === 0 ? true : false,
                currentPeddingRows: action.payload?.page === 1 ? 
                    action.payload.peddingRows.length : 
                    state.peddingRows.length + action.payload.peddingRows.length
            }
        case GLOBALTYPES.ROW.REMOVE_PENDING_ROW:
                console.log(action.payload.peddingRowId);
                const newArr = removeElem([...state.peddingRows], action.payload.peddingRowId);

                return {
                    ...state,
                    peddingRows: newArr,
                    currentPeddingRows: state.currentPeddingRows - 1
                }

        default:
            return state;
    }
}

export default rowReducer;