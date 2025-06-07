import { useState } from 'react';
import Modal from './Modal';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { useDispatch } from 'react-redux';
import { updateTotalScorePage } from '../../redux/actions/pageAction';

function UpdateTotalScore({ pageId, currentTotalScore, handleHideUpdateTotalScoreModal }) {
    const dispatch = useDispatch();
    const [totalScore, setTotalScore] = useState(currentTotalScore || 0);

    const handleUpdateTotalScore = () => {
        if (totalScore === '') {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });

            return;
        }

        dispatch(
            updateTotalScorePage({
                pageId,
                totalScore
            })
        );

        handleHideUpdateTotalScoreModal();
    };

    return (
        <Modal headerTitle="Cập Nhật Tổng Điểm Phải Đạt" onHiddenModal={handleHideUpdateTotalScoreModal}>
            <div className="update_total_score_modal">
                <div className="body">
                    <label>Nhập tổng điểm:</label>
                    <input
                        type="text"
                        value={totalScore}
                        onChange={(e) =>
                            setTotalScore(Number.parseInt(e.target.value) ? Number.parseInt(e.target.value) : '')
                        }
                    />
                </div>

                <button onClick={handleUpdateTotalScore}>Cập Nhật</button>
            </div>
        </Modal>
    );
}

export default UpdateTotalScore;
