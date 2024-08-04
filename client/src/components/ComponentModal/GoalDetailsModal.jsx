import { useDispatch, useSelector } from 'react-redux';
import GoalsInfo from '../ComponentGoalsInfo/GoalsInfo';
import { getProgressByYear } from '../../redux/actions/progressAction';
import { progressSelector } from '../../redux/selector';
import { useEffect, useState } from 'react';
import Account from '../ComponentAccount/ComponentAccount';
import { AiOutlineClose } from 'react-icons/ai';

function GoalDetailsModal({ currentUserData, onToggleModalDisplay }) {
    const dispatch = useDispatch();
    const progress = useSelector(progressSelector);
    const [levelYear, setLevelYear] = useState(currentUserData.levelYear);

    const onChangeLevelYear = (e) => {
        setLevelYear(parseInt(e.target.value));
    };

    const onGetProgress = () => {
        dispatch(
            getProgressByYear({
                userId: currentUserData._id,
                studentCohort: currentUserData.cohort,
                studentMajor: currentUserData.major,
                studentLevelYear: currentUserData.levelYear
            })
        );
    };

    const onHiddenModal = (e) => {
        if (e.target === e.currentTarget) onToggleModalDisplay();
    };

    useEffect(() => {
        onGetProgress();
    }, [levelYear]);

    return (
        progress?.goalsInfoData[levelYear] && (
            <div className="modal_overlap" onMouseUp={onHiddenModal}>
                <div className="box_wrapper goal_details_modal">
                    <div className="goal_details_modal_header">Thống Kê Chi Tiết Hoạt Động</div>
                    <div className="modal_close_icon_wrapper" onClick={onToggleModalDisplay}>
                        <AiOutlineClose />
                    </div>
                    <div className="goal_details_modal_body">
                        <div className="goal_details_modal_body_filter">
                            <Account userInfo={currentUserData} inModal={true} />
                            <select onChange={onChangeLevelYear} value={levelYear}>
                                {Array(levelYear)
                                    .fill(null)
                                    .map((_, index) => (
                                        <option key={index} value={index + 1}>{`Năm ${index + 1}`}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="goal_details_modal_body_content">
                            <GoalsInfo levelYear={levelYear} goalsInfo={progress.goalsInfoData[levelYear]} />
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default GoalDetailsModal;
