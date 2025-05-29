import { useRef } from 'react';
import Modal from './Modal';

function UpdateDeadlineModal({
    handleToggleDisplayUpdateDeadlineModal,
    updateDeadline,
    startDate,
    endDate,
    handleChangeStartDate,
    handleChangeEndDate
}) {
    const startDateRef = useRef();
    const endDateRef = useRef();

    return (
        <Modal headerTitle="Cập Nhật Thời Hạn" onHiddenModal={() => handleToggleDisplayUpdateDeadlineModal()}>
            <div className="update_deadline_modal">
                <div className="input_item">
                    <label>Ngày bắt đầu</label>
                    <input
                        className="datetime_input"
                        ref={startDateRef}
                        type="datetime-local"
                        placeholder="Nhập ngày bắt đầu"
                        value={startDate}
                        onChange={handleChangeStartDate}
                    />
                    <input
                        className="display_input"
                        type="text"
                        placeholder="Nhập ngày bắt đầu"
                        value={startDate ? new Date(startDate).toLocaleString('en-GB') : 'Chọn ngày giờ bắt đầu'}
                        readOnly
                        onClick={() => startDateRef.current.showPicker()}
                    />
                </div>

                <div className="input_item">
                    <label>Ngày kết thúc</label>
                    <input
                        className="datetime_input"
                        ref={endDateRef}
                        type="datetime-local"
                        placeholder="Nhập ngày kết thúc"
                        value={endDate}
                        onChange={handleChangeEndDate}
                    />
                    <input
                        className="display_input"
                        type="text"
                        placeholder="Nhập ngày kết thúc"
                        value={endDate ? new Date(endDate).toLocaleString('en-GB') : 'Chọn ngày giờ kết thúc'}
                        readOnly
                        onClick={() => endDateRef.current.showPicker()}
                    />
                </div>

                <button onClick={updateDeadline}>Cập nhật Thời Hạn</button>
            </div>
        </Modal>
    );
}

export default UpdateDeadlineModal;
