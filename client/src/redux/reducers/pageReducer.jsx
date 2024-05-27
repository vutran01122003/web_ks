import removeElem from '../../utils/removeElem';
import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    pages: [],
    pathName: '',
    pageId: '',
    pageName: '',
    pageType: '',
    pageLevelYear: 0,
    tables: [],
};

function pageReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PAGE.GET_DYNAMIC_PAGES: {
            return {
                ...state,
                pages: [...action.payload.pages],
            };
        }
        case GLOBALTYPES.PAGE.DYNAMIC_PAGE_INFO: {
            return {
                ...state,
                pathName: action.payload.pathName,
                pageId: action.payload.pageId,
                pageName: action.payload.pageName,
                pageType: action.payload.pageType,
                pageLevelYear: action.payload.pageLevelYear,
                tables: [...action.payload.tables],
            };
        }

        case GLOBALTYPES.PAGE.UPDATE_DYNAMIC_PAGE: {
            return {
                ...state,
                tables: [...action.payload.tables],
            };
        }

        case GLOBALTYPES.PAGE.REMOVE_DYNAMIC_PAGE: {
            const newPageList = removeElem(state.pages, action.payload.pageId);

            return {
                ...state,
                pages: [...newPageList],
            };
        }

        default:
            return state;
    }
}

export default pageReducer;
