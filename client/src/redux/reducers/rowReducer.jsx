import GLOBALTYPES from "../actions/globalTypes";
import removeElem from '../../utils/removeElem';
const initialState = {
    loading: false,
    pendingRows: [],
    page: 1,
    maxPage: false,
    currentPendingRows: 0
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
                pendingRows: action.payload.page === 1 ? 
                    action.payload.pendingRows : 
                    [...state.pendingRows, ...action.payload.pendingRows],
                page: action.payload?.page || 1,
                maxPage: action.payload.pendingRows.length === 0 ? true : false,
                currentPendingRows: action.payload?.page === 1 ? 
                    action.payload.pendingRows.length : 
                    state.pendingRows.length + action.payload.pendingRows.length
            }
        case GLOBALTYPES.ROW.REMOVE_PENDING_ROW:
                console.log(action.payload.pendingRowId);
                const newArr = removeElem([...state.pendingRows], action.payload.pendingRowId);

                return {
                    ...state,
                    pendingRows: newArr,
                    currentPendingRows: state.currentPendingRows - 1
                }

        default:
            return state;
    }
}

export default rowReducer;