import { AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { stopSubmittingProof } from '../../redux/actions/progressAction';
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
    const [numUsers, setNumUsers] = useState('');

    const handleChangesetNumUsers = (e) => {
        if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) {
            setNumUsers(e.target.value);
        }
    };

    const handleHideModal = (e) => {
        if (e.target === e.currentTarget) handleHiddenStopSubmittingProofModal();
    };

    const handleStopSubmittingProof = () => {
        dispatch(
            stopSubmittingProof({
                limit: numUsers,
                major,
                cohort,
                faculty,
                levelYear,
                groupCode,
                updatedCohortData
            })
        );
        handleHiddenStopSubmittingProofModal();
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
                        Bạn có chắc muốn dừng hoạt động nộp minh chứng ?
                    </p>

                    <div className="stop_submitting_proof_body_notify">
                        <span>{`Lưu ý: Sinh viên ngành ${capitalizeFirstLetter(major)} của khóa ${cohort} không đạt điều kiện sẽ bị loại khỏi chương trình kỹ sư tài năng.`}</span>
                    </div>

                    <div className="condition_filter_wrapper">
                        <h4>Thiết lập điều kiện: </h4>

                        <div className="input_item">
                            <label>Số lượng sinh viên thông qua:</label>
                            <input
                                className="input_text_item"
                                type="text"
                                placeholder="Nhập số lượng sinh viên"
                                onChange={handleChangesetNumUsers}
                                value={numUsers}
                            />
                        </div>
                    </div>
                </div>
                <div className="stop_submitting_proof_footer">
                    <button className="btn_close" onClick={handleHiddenStopSubmittingProofModal}>
                        Không đồng ý
                    </button>

                    <button className={`btn_accept active`} onClick={handleStopSubmittingProof}>
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StopSubmittingProofModal;
