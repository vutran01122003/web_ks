import replaceElem from '../../utils/replaceElem';
import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    facultyData: [],
};

function facultyReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.FACULTY.GET_ALL_FACULTIES: {
            return {
                ...state,
                facultyData: action.payload.facultyData,
            };
        }

        case GLOBALTYPES.FACULTY.ADD_FACULTY: {
            return {
                ...state,
                facultyData: [...state.facultyData, action.payload.faculty],
            };
        }

        case GLOBALTYPES.FACULTY.UPDATE_FACULTY: {
            const newElem = action.payload.newElem;
            const elemId = action.payload.facultyId;
            const elemList = state.facultyData;

            const newData = replaceElem({ elemId, newElem, elemList });

            return {
                ...state,
                facultyData: newData,
            };
        }
        default:
            return state;
    }
}

export default facultyReducer;
