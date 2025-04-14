import { removeElem, replaceElem } from '../../utils/handleArray';
import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    facultyData: [],
    faculty: null
};

function facultyReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.FACULTY.GET_ALL_FACULTIES: {
            return {
                ...state,
                facultyData: action.payload.facultyData
            };
        }

        case GLOBALTYPES.FACULTY.GET_FACULTY: {
            return {
                ...state,
                faculty: action.payload.faculty
            };
        }

        case GLOBALTYPES.FACULTY.ADD_FACULTY: {
            return {
                ...state,
                facultyData: [...state.facultyData, action.payload.faculty]
            };
        }

        case GLOBALTYPES.FACULTY.UPDATE_FACULTY: {
            const faculty = action.payload?.faculty;
            const facultyId = faculty._id;
            const elemList = state.facultyData;

            const newData = replaceElem({ facultyId, faculty, elemList });

            return {
                faculty,
                facultyData: newData
            };
        }

        case GLOBALTYPES.FACULTY.DELETE_FACULTY: {
            const facultyId = action.payload.facultyId;
            const faculties = state.facultyData;

            const newFaculties = removeElem(faculties, facultyId);

            return {
                facultyData: [...newFaculties]
            };
        }

        default:
            return state;
    }
}

export default facultyReducer;
