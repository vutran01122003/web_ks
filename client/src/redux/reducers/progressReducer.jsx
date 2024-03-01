import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    goalsInfoData: {},
    annualTaskProgress: {
        data: [],
        page: 0,
        maxPage: false,
        currentRows: 0
    }
};

function progressReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PROGRESS.GET_PROGRESS_BY_YEAR: {
            return {
                ...state,
                goalsInfoData: {
                    ...state.goalsInfoData,
                    [action.payload.levelYear]: action.payload.goalsInfoData
                }
            };
        }
        case GLOBALTYPES.PROGRESS.GET_ANNUAL_TASK_PROGRESS: {
            return {
                ...state,
                annualTaskProgress: {
                    ...state.annualTaskProgress,
                    data:
                        state.annualTaskProgress.page === 0
                            ? [...action.payload.data]
                            : [...state.annualTaskProgress.data, ...action.payload.data],
                    maxPage: action.payload.data.length === 0 ? true : false,
                    page: action.payload.page,
                    currentRows: state.annualTaskProgress.currentRows + action.payload.data.length
                }
            };
        }
        default:
            return state;
    }
}

export default progressReducer;
