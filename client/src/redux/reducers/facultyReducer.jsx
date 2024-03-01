import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    facultyData: []
};

function facultyReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.FACULTY.GET_ALL_FACULTIES: {
            return {
                ...state,
                facultyData: action.payload.facultyData
            };
        }

        case GLOBALTYPES.FACULTY.ADD_FACULTY: {
            return {
                ...state,
                facultyData: [...state.facultyData, action.payload.faculty]
            };
        }
        default:
            return state;
    }
}

export default facultyReducer;
