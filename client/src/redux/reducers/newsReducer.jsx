import GLOBALTYPES from "../actions/globalTypes";

const initialState = {
    currentNews: '',
    currentNewsType: '',
    newsType: {},
}

function newsReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.NEWS.GET_NEWS:
            return {
                ...state,
                currentNewsType: action.payload.newsType,
                newsType: {
                    ...state.newsType,
                    [action.payload.newsType] : {
                        newsList: action.payload.page === 1 ? action.payload.newsList : 
                        [...state[action.payload.newsId].newsList, ...action.payload.newsList],
                        page: action.payload?.page || 1,
                        maxPage: action.payload?.maxPage || false
                    }
                }
            }
        case GLOBALTYPES.NEWS.GET_NEWS_DETAILS: 
            return {
                ...state,
                currentNews: action.payload.newsData
            }
        default:
            return state
    }
}

export default newsReducer;