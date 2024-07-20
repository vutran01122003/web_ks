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

        default:
            return state;
    }
}

export default goalsReduce;
