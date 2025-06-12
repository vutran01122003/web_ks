import { useDispatch, useSelector } from 'react-redux';
import GoalsInfo from '../Goal/GoalsInfo';
import { getProgressByYear } from '../../redux/actions/progressAction';
import { progressSelector } from '../../redux/selector';
import { useEffect, useState } from 'react';
import Account from '../Account/ComponentAccount';
import { AiOutlineClose } from 'react-icons/ai';
import GLOBALTYPES from '../../redux/actions/globalTypes';

function GoalDetailsModal({ currentUserData, onToggleModalDisplay }) {
    const dispatch = useDispatch();
    const progress = useSelector(progressSelector);
    const currentLevelYear = currentUserData.cohort.currentLevelYear;
    const [levelYear, setLevelYear] = useState(currentLevelYear);

    const onChangeLevelYear = (e) => {
        setLevelYear(parseInt(e.target.value));
    };

    const onGetProgress = () => {
        dispatch(
            getProgressByYear({
                userId: currentUserData._id,
                studentCohort: currentUserData.cohort.cohortName,
                studentMajor: currentUserData.major.majorName,
                studentLevelYear: levelYear
            })
        );
    };

    const onHiddenModal = (e) => {
        if (e.target === e.currentTarget) onToggleModalDisplay();
    };

    useEffect(() => {
        dispatch({
            type: GLOBALTYPES.PROGRESS.RESET_GOALS_INFO_DATA
        });
        onGetProgress();
    }, [levelYear]);

    return (
        <div className="modal_overlap" onDoubleClick={onHiddenModal}>
            <div className="box_wrapper goal_details_modal">
                <div className="goal_details_modal_header">
                    <span>Thống Kê Chi Tiết Hoạt Động</span>
                    <div className="modal_close_icon_wrapper" onClick={onToggleModalDisplay}>
                        <AiOutlineClose />
                    </div>
                </div>

                <div className="goal_details_modal_body">
                    <div className="goal_details_modal_body_filter">
                        <Account userInfo={currentUserData} inModal={true} />
                        <select onChange={onChangeLevelYear} value={levelYear}>
                            {Array(currentUserData.levelYear)
                                .fill(null)
                                .map((_, index) => (
                                    <option key={index} value={index + 1}>{`Năm ${index + 1}`}</option>
                                ))}
                        </select>
                    </div>

                    {progress.goalsInfoData[levelYear] && (
                        <div className="goal_details_modal_body_content">
                            <GoalsInfo levelYear={levelYear} goalsInfo={progress.goalsInfoData[levelYear]} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GoalDetailsModal;
