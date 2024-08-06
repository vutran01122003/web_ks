import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    filteredPage: [],
    table: null
};

function goalsReduce(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.GOALS.GET_GOALS: {
            return {
                ...state,
                filteredPage: [...action.payload.pages]
            };
        }

        case GLOBALTYPES.GOALS.GET_GOAL: {
            return {
                ...state,
                table: action.payload.table
            };
        }

        case GLOBALTYPES.GOALS.ADD_NEW_GOAL: {
            const { pageId, page } = action.payload;
            const goalList = [...state.filteredPage];

            for (let i = 0; i < goalList.length; i++) {
                if (goalList[i]._id === pageId) {
                    goalList[i] = page;
                    break;
                }
            }

            return {
                ...state,
                filteredPage: goalList
            };
        }

        case GLOBALTYPES.GOALS.REMOVE_GOAL: {
            const { pageId, tableId } = action.payload;
            const goalList = [...state.filteredPage];

            let index = null;

            for (let i = 0; i < goalList.length; i++) {
                if (goalList[i]._id === pageId) {
                    index = i;
                    break;
                }
            }

            goalList[index].tables = goalList[index].tables.filter((table) => table._id !== tableId);

            return {
                ...state,
                filteredPage: goalList
            };
        }

        case GLOBALTYPES.GOALS.REMOVE_GOALS: {
            const { pageId } = action.payload;
            const goalList = [...state.filteredPage];

            return {
                ...state,
                filteredPage: goalList.filter((goal) => goal._id !== pageId)
            };
        }

        case GLOBALTYPES.GOALS.UPDATE_STATUS_PAGE: {
            const { pageId, currentStatus } = action.payload;
            const goalList = [...state.filteredPage];

            for (let i = 0; i < goalList.length; i++) {
                if (goalList[i]._id === pageId) {
                    goalList[i].isActive = !currentStatus;
                    break;
                }
            }

            return {
                ...state,
                filteredPages: goalList
            };
        }

        case GLOBALTYPES.GOALS.UPDATE_STATUS_TABLE: {
            const { pageId, tableIndex, status } = action.payload;

            const goalList = [...state.filteredPage];
            for (let i = 0; i < goalList.length; i++) {
                if (goalList[i]._id === pageId) {
                    goalList[i].tables[tableIndex].isActive = status;
                    break;
                }
            }

            return {
                ...state,
                filteredPages: goalList
            };
        }

        case GLOBALTYPES.GOALS.RESET_GOALS: {
            return {
                filteredPage: [],
                table: null
            };
        }

        default:
            return state;
    }
}

export default goalsReduce;
