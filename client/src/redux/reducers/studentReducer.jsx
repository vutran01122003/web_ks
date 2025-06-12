import { replaceElem } from '../../utils/handleArray';
import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    studentList: [],
    isLoading: false,
    page: 1,
    isMaxPage: false
};

function studentReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.STUDENT.GET_STUDENTS: {
            const { studentList, page } = action.payload;
            return {
                ...state,
                studentList: page === 1 ? studentList : [...state.studentList, ...studentList],
                page: action.payload.page,
                isMaxPage: studentList.length === 0 ? true : false
            };
        }

        case GLOBALTYPES.STUDENT.LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            };

        case GLOBALTYPES.STUDENT.RESET_STUDENT_LIST: {
            return {
                studentList: [],
                page: 1,
                isMaxPage: false
            };
        }

        case GLOBALTYPES.STUDENT.UPDATE_STUDENT: {
            const { userId, userData } = action.payload;

            const studentList = replaceElem({
                elemId: userId,
                newElem: userData,
                elemList: [...state.studentList]
            });

            return {
                ...state,
                studentList
            };
        }

        default:
            return state;
    }
}

export default studentReducer;
