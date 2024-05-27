import GLOBALTYPES from '../actions/globalTypes';

const initialState = [];

function activitiesReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.ACTIVITIES.GET_ACTIVITIES:
            return action.payload.activities;
        case GLOBALTYPES.ACTIVITIES.RESET_ACTIVITIES:
            return [];
        default:
            return state;
    }
}

export default activitiesReducer;
