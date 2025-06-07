import { replaceElem } from '../../utils/handleArray';
import GLOBALTYPES from '../actions/globalTypes';

const initialState = {
    deadlineList: []
};

function deadlineReducer(state = initialState, action) {
    switch (action.type) {
        case GLOBALTYPES.DEADLINE.GET_DEADLINE: {
            return {
                ...state,
                deadlineList: action.payload.data
            };
        }
        case GLOBALTYPES.DEADLINE.UPDATE_DEADLINE: {
            const deadlineList = [...state.deadlineList];
            const newDeadline = action.payload.data;

            return {
                ...state,
                deadlineList: replaceElem({
                    elemId: newDeadline._id,
                    newElem: newDeadline,
                    elemList: deadlineList
                })
            };
        }
        case GLOBALTYPES.DEADLINE.RESET_DATA: {
            return {
                deadlineList: []
            };
        }

        default: {
            return state;
        }
    }
}

export default deadlineReducer;
