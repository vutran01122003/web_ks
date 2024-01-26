import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    loading: false,
    pendingRows: {
        data: [],
        page: 0,
        maxPage: false,
        currentRows: 0
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
    },
    resubmitedRows: {
        data: [],
        page: 0,
        maxPage: false,
        currentRows: 0
    }
};

function rowReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.ROW.LOADING_PENDING_ROWS:
            return {
                ...state,
                loading: action.payload.loading
            };
        case GLOBALTYPES.ROW.GET_DYNAMIC_ROWS:
            const rowsType = action.payload.rowsType;
            const dynamicRows = action.payload.dynamicRows;
            const rowData = state[rowsType].data;
            const page = action.payload?.page;

            return {
                ...state,
                [rowsType]: {
                    ...state[rowsType],
                    data: action.payload.page === 1 ? dynamicRows : [...rowData, ...dynamicRows],
                    page: page || 1,
                    maxPage: dynamicRows.length === 0 ? true : false,
                    currentRows:
                        page === 1 ? dynamicRows.length : rowData.length + dynamicRows.length
                }
            };

        case GLOBALTYPES.ROW.REMOVE_ROW: {
            const rowsType = action.payload.rowsType;
            return {
                ...state,
                [rowsType]: {
                    ...state[rowsType],
                    data: [
                        ...state[rowsType].data.filter(
                            (row) =>
                                !(
                                    row._id === action.payload.rowId &&
                                    row.content[0]._id === action.payload.contentId
                                )
                        )
                    ],
                    currentRows: state.currentRows
                }
            };
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
            };
        }
        default:
            return state;
    }
}

export default rowReducer;
