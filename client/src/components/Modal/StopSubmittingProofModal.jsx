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
    const confirm = 'Tôi đồng ý';

    const dispatch = useDispatch();
    const progressPercentageInputRef = useRef();

    const [confirmValue, setConfirmValue] = useState('');
    const [progressPercentage, setProgressPercentage] = useState('');

    const handleChangeProgressPercentageValue = (e) => {
        if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
            setProgressPercentage(e.target.value);
        }
    };

    const handleConfirmValue = (e) => {
        setConfirmValue(e.target.value);
    };

    const handleHideModal = (e) => {
        if (e.target === e.currentTarget) handleHiddenStopSubmittingProofModal();
    };

    const handleStopSubmittingProof = () => {
        if (confirmValue.trim() !== confirm) return;

        if (progressPercentage || progressPercentageInputRef.current.readOnly) {
            dispatch(
                stopSubmittingProof({
                    conditions: {
                        progressPercentage: progressPercentage || 0
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
            window.location.reload();
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
        <div className="modal_overlap" onDoubleClick={handleHideModal}>
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
                        className={`btn_accept ${confirmValue.trim() === confirm ? 'active' : 'inactive'}`}
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
