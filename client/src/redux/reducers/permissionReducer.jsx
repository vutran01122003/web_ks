import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    facultyManagers: []
};

function permissionReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.PERMISSION.GET_FACULTY_MANAGERS: {
            return {
                ...state,
                facultyManagers: action.payload.facultyManagers
            };
        }
        default: {
            return state;
        }
    }
}

export default permissionReducer;
