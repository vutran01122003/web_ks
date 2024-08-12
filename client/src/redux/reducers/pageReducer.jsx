import { removeElem, replaceElem } from '../../utils/handleArray';
import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    pages: [],
    pathName: '',
    pageId: '',
    pageName: '',
    pageType: '',
    pageStudentLevelYear: ''
};

function pageReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PAGE.GET_DYNAMIC_PAGES: {
            const { pages } = action.payload;
            return {
                ...state,
                pages: [...pages]
            };
        }

        case GLOBALTYPES.PAGE.SET_PAGE_INFO: {
            return {
                ...state,
                ...action.payload
            };
        }

        case GLOBALTYPES.PAGE.UPDATE_DYNAMIC_PAGE: {
            const { page } = action.payload;

            const newPages = replaceElem({
                elemId: page._id,
                newElem: page,
                elemList: [...state.pages]
            });

            return {
                ...state,
                pages: newPages
            };
        }

        case GLOBALTYPES.PAGE.REMOVE_DYNAMIC_PAGE: {
            const newPageList = removeElem(state.pages, action.payload.pageId);

            return {
                ...state,
                pages: [...newPageList]
            };
        }

        default:
            return state;
    }
}

export default pageReducer;
