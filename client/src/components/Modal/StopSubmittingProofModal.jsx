import { AiOutlineClose } from 'react-icons/ai';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { stopSubmittingProof } from '../../redux/actions/progressAction';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { capitalizeFirstLetter } from '../../utils/handleString';

function StopSubmittingProofModal({
    cohort,
    major,
    faculty,
    levelYear,
    groupCode,
    handleHiddenStopSubmittingProofModal,
    updatedCohortData
}) {
    const dispatch = useDispatch();
    const progressPercentageInputRef = useRef();
    const scoreInputRef = useRef();

    const [confirmValue, setConfirmValue] = useState('');
    const [progressPercentage, setProgressPercentage] = useState('');
    const [score, setScore] = useState('');

    const handleChangeProgressPercentageValue = (e) => {
        if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
            setProgressPercentage(e.target.value);
        }
    };

    const handleChangeScoreValue = (e) => {
        setScore(e.target.value);
    };

    const handleConfirmValue = (e) => {
        setConfirmValue(e.target.value);
    };

    const handleHideModal = (e) => {
        if (e.target === e.currentTarget) handleHiddenStopSubmittingProofModal();
    };

    const handleChangeProgressPercentageCheckboxValue = (e) => {
        if (e.target.checked) {
            setProgressPercentage('');
            progressPercentageInputRef.current.readOnly = true;
            progressPercentageInputRef.current.style.cursor = 'not-allowed';
            progressPercentageInputRef.current.style.opacity = 0.65;
        } else {
            progressPercentageInputRef.current.readOnly = false;
            progressPercentageInputRef.current.style.cursor = 'text';
            progressPercentageInputRef.current.style.opacity = 1;
        }
    };

    const handleChangeScoreCheckboxValue = (e) => {
        if (e.target.checked) {
            setScore('');
            scoreInputRef.current.readOnly = true;
            scoreInputRef.current.style.cursor = 'not-allowed';
            scoreInputRef.current.style.opacity = 0.65;
        } else {
            scoreInputRef.current.readOnly = false;
            scoreInputRef.current.style.cursor = 'text';
            scoreInputRef.current.style.opacity = 1;
        }
    };

    const handleStopSubmittingProof = () => {
        if (
            (progressPercentage || progressPercentageInputRef.current.readOnly) &&
            (score || scoreInputRef.current.readOnly)
        ) {
            dispatch(
                stopSubmittingProof({
                    conditions: {
                        progressPercentage: progressPercentage || 0,
                        score: score || 0
                    },
                    major,
                    cohort,
                    faculty,
                    levelYear,
                    groupCode,
                    updatedCohortData
                })
            );
            handleHiddenStopSubmittingProofModal();
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
        }
    };

    return (
        <div className="modal_overlap" onMouseUp={handleHideModal}>
            <div className="stop_submitting_proof_modal">
                <div className="stop_submitting_proof_header">
                    <h2>Kết Thúc Hoạt Động Nộp Minh Chứng</h2>
                    <div className="stop_submitting_proof_close_btn" onClick={handleHiddenStopSubmittingProofModal}>
                        <AiOutlineClose />
                    </div>
                </div>
                <div className="stop_submitting_proof_body">
                    <p className="stop_submitting_proof_body_content">
                        {`${capitalizeFirstLetter(major)} - Khóa ${cohort} - Năm ${levelYear}`}
                    </p>

                    <ul className="stop_submitting_proof_body_notify">
                        <li>{`Sinh viên không thể tiếp tục tham gia các hoạt động và nộp minh chứng của năm ${levelYear}.`}</li>
                        <li>{`Sinh viên đạt điều kiện sẽ tham gia các hoạt động và nộp minh chứng của năm ${
                            levelYear + 1
                        }.`}</li>
                        <li>{`Sinh viên không đạt điều kiện bị loại khỏi danh sách kỹ sư tài năng và khóa tài khoản.`}</li>
                    </ul>

                    <div className="condition_filter_wrapper">
                        <h4>Thiết lập điều kiện để sinh viên thông qua: </h4>

                        <div className="input_item">
                            <label>Tiến Độ:</label>
                            <input
                                className="input_text_item"
                                type="text"
                                placeholder="Nhập phần trăm tiến độ tối thiểu"
                                onChange={handleChangeProgressPercentageValue}
                                value={progressPercentage}
                                ref={progressPercentageInputRef}
                            />
                            <span className="input_checkbox_item">
                                <input type="checkbox" onClick={handleChangeProgressPercentageCheckboxValue} />
                                <span>Không bắt buộc</span>
                            </span>
                        </div>

                        <div className="input_item">
                            <label>Số Điểm:</label>
                            <input
                                className="input_text_item"
                                type="text"
                                placeholder="Nhập số điểm tối thiểu"
                                value={score}
                                onChange={handleChangeScoreValue}
                                ref={scoreInputRef}
                            />
                            <span className="input_checkbox_item">
                                <input type="checkbox" onClick={handleChangeScoreCheckboxValue} />
                                <span>Không bắt buộc</span>
                            </span>
                        </div>
                    </div>

                    <div className="stop_submitting_proof_body_code">
                        <input onChange={handleConfirmValue} placeholder="Nhập văn bản xác nhận" />
                        <span>Nếu bạn đã chắc chắn thì hãy nhập &ldquo;Tôi đồng ý&ldquo;</span>
                    </div>
                </div>
                <div className="stop_submitting_proof_footer">
                    <button className="btn_close" onClick={handleHiddenStopSubmittingProofModal}>
                        Không đồng ý
                    </button>

                    <button
                        className={`btn_accept ${
                            confirmValue.trim().toLowerCase() === 'tôi đồng ý' ? 'active' : 'inactive'
                        }`}
                        onClick={handleStopSubmittingProof}
                    >
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StopSubmittingProofModal;
