import GLOBALTYPES from "../actions/globalTypes";

const initialState = {
    pageName: "",
    tables: []
}

function TableReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.TABLE.SET_TABLES: {
            return {
                ...state,
                pageName: action.payload.pageName,
                tables: action.payload.tables
            }
        }
           
        default: 
            return state
           
    }
}

export default TableReducer;