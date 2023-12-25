import GLOBALTYPES from "../actions/globalTypes";
import removeElem from '../../utils/removeElem';
const initialState = {
    loading: false,
    pendingRows: {
        data: [],
        page: 0,
        maxPage: false,
        currentRows: 0,
    },
    acceptedRows: {
        data: [],
        page: 0,
        maxPage: false,
        currentRows: 0
    },
    rejectedRows: {
        data: [],
        page: 0,
        maxPage: false,
        currentRows: 0
    }
}

function rowReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.ROW.LOADING_PENDING_ROWS:
            return {
                ...state,
                loading: action.payload.loading
            }
        case GLOBALTYPES.ROW.GET_DYNAMIC_ROWS:          
            return {
                ...state,
                [action.payload.rowsType]: {
                    ...state[action.payload.rowsType],
                    data: action.payload.page === 1 ?  action.payload.dynamicRows : [...state[action.payload.rowsType].data, ...action.payload.dynamicRows],
                    page: action.payload?.page || 1,
                    maxPage: action.payload.dynamicRows.length === 0 ? true : false,
                    currentRows: action.payload?.page === 1 ? 
                        action.payload.dynamicRows.length : 
                        state[action.payload.rowsType].data.length + action.payload.dynamicRows.length
                }
                // pendingRows: action.payload.page === 1 ? 
                //     action.payload.pendingRows : 
                //     [...state.pendingRows, ...action.payload.pendingRows],
                // page: action.payload?.page || 1,
                // maxPage: action.payload.pendingRows.length === 0 ? true : false,
                // currentPendingRows: action.payload?.page === 1 ? 
                //     action.payload.pendingRows.length : 
                //     state.pendingRows.length + action.payload.pendingRows.length
            }
        case GLOBALTYPES.ROW.REMOVE_ALL_ROW: {
            const newArr = removeElem([...state.pendingRows], action.payload.pendingRowId);

            return {
                ...state,
                pendingRows: newArr,
                currentPendingRows: state.currentPendingRows - 1
            }
        }
               
        case GLOBALTYPES.ROW.REMOVE_ROW: {
            console.log(action.payload.rowsType);
            const rowList = [...state[action.payload.rowsType].data];
            let flat = null;

            for(let i = 0; i < state[action.payload.rowsType].data.length; i++) {
                if(state[action.payload.rowsType].data[i]._id === action.payload.rowId) {
                    flat = i;
                    for(let j = 0; j < state[action.payload.rowsType].data[i].content.length; j++) {
                        if(state[action.payload.rowsType].data[i].content[j]._id === action.payload.contentId) {
                            rowList[i].content.splice(j, 1);
                            if(rowList[i].content.length === 0) rowList.splice(i, 1); 
                            break;
                        }
                    }
                    break;
                }
            }

            return {
                ...state,
                [action.payload.rowsType]: {
                    ...state[action.payload.rowsType],
                    data: rowList,
                    currentRows: rowList[flat]?.content ? 
                    state.currentRows : state.currentRows - 1
                }
            }
        }
           
        default:
            return state;
    }
}

export default rowReducer;