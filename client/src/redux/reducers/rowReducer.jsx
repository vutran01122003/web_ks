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
            }
        case GLOBALTYPES.ROW.REMOVE_ALL_ROW: {
            const newArr = removeElem([...state[action.payload.rowsType].data], action.payload.rowId);

            return {
                ...state,
                [action.payload.rowsType]: {
                    ...state[action.payload.rowsType],
                    data: newArr
                }
            }
        }
               
        case GLOBALTYPES.ROW.REMOVE_ROW: {
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
        case GLOBALTYPES.ROW.REFRESH_TAB: {
            return {
                ...state,
                [action.payload.rowsType]: {
                    data: [],
                    page: 0,
                    maxPage: false,
                    currentRows: 0
                }
            }
        }
        default:
            return state;
    }
}

export default rowReducer;