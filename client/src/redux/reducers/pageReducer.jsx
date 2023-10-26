import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    pages: [],
    pathName: '',
    pageId: '',
    pageName: '',
    tables: []
};

function pageReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PAGE.GET_DYNAMIC_PAGES: {
            return {
                ...state,
                pages: [...action.payload.pages]
            };
        }
        case GLOBALTYPES.PAGE.DYNAMIC_PAGE_INFO:
            return {
                ...state,
                pathName: action.payload.pathName,
                pageId: action.payload.pageId,
                pageName: action.payload.pageName,
                tables: [...action.payload.tables]
            };
        case GLOBALTYPES.PAGE.UPDATE_DYNAMIC_PAGE: 
            return {
                ...state,
                tables: [...action.payload.tables]
            };
        default:
            return state;
    }
}

export default pageReducer;
