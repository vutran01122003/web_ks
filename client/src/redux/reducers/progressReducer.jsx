import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    goalsInfoData: {},
    annualTaskProgress: {
        isLoading: false,
        data: [],
        page: 1,
        isMaxPage: false
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

        case GLOBALTYPES.PROGRESS.LOADING: {
            return {
                ...state,
                annualTaskProgress: {
                    ...state.annualTaskProgress,
                    isLoading: action.payload.isLoading
                }
            };
        }

        case GLOBALTYPES.PROGRESS.GET_ANNUAL_TASK_PROGRESS: {
            const { data, page } = action.payload;
            const { annualTaskProgress } = state;

            return {
                ...state,
                annualTaskProgress: {
                    ...annualTaskProgress,
                    data: [...annualTaskProgress.data, ...data],
                    isMaxPage: data.length === 0 ? true : false,
                    page: page
                }
            };
        }

        case GLOBALTYPES.PROGRESS.RESET_ANNUAL_TASK_PROGRESS: {
            return {
                ...state,
                annualTaskProgress: {
                    isLoading: false,
                    data: [],
                    page: 1,
                    isMaxPage: false
                }
            };
        }

        case GLOBALTYPES.PROGRESS.RESET_GOALS_INFO_DATA: {
            return {
                ...state,
                goalsInfoData: {}
            };
        }

        default:
            return state;
    }
}

export default progressReducer;
