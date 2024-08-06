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
        case GLOBALTYPES.ROW.GET_DYNAMIC_ROWS: {
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
                    currentRows: page === 1 ? dynamicRows.length : rowData.length + dynamicRows.length
                }
            };
        }

        case GLOBALTYPES.ROW.REMOVE_ROW: {
            const { rowsType, rowId, contentId } = action.payload;
            return {
                ...state,
                [rowsType]: {
                    ...state[rowsType],
                    data: [
                        ...state[rowsType].data.filter(
                            (row) => !(row._id === rowId && row.content[0]._id === contentId)
                        )
                    ],
                    currentRows: state.currentRows
                }
            };
        }

        case GLOBALTYPES.ROW.UPDATE_ROW: {
            const { rowsType, rowId, contentId, editedData } = action.payload;

            let index = null;
            const rowList = [...state[rowsType].data];

            const row = rowList.find((row, idx) => {
                if (row._id === rowId && row.content[0]._id === contentId) {
                    index = idx;
                    return true;
                }
                return false;
            });

            rowList.splice(index, 1, {
                ...row,
                content: [
                    {
                        ...row.content[0],
                        ...editedData
                    }
                ]
            });

            return {
                ...state,
                [rowsType]: {
                    ...state[rowsType],
                    data: rowList
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

        case GLOBALTYPES.ROW.RESET_ALL_TAB: {
            return initialState;
        }

        default:
            return state;
    }
}

export default rowReducer;
