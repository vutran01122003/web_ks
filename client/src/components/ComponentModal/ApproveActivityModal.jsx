import { useDispatch } from 'react-redux';
import { updateRowsStatus } from '../../redux/actions/rowAction';
import { AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { createUpdatedActivityNotification } from '../../redux/actions/notifyAction';
import { formatTimeStr } from '../../utils/formatDatetime';

const [ACCEPTED_STATUS, REJECTED_STATUS, RESUBMITED_STATUS] = ['đã duyệt', 'từ chối', 'phải nộp lại'];

function ApproveActivityModal({
    auth,
    userData,
    content,
    title,
    prevStatus,
    status,
    rowInfoData,
    handleHiddenConfirmModal,
    rowsType,
    isTimedExtension
}) {
    const dispatch = useDispatch();
    const [noteValue, setNoteValue] = useState('');
    const [visibleDateInput, setVisibleDateInput] = useState(false);
    const [datetimeValue, setDateTimeValue] = useState('');

    const handleUpdateRowsStatus = () => {
        if (visibleDateInput === true && !datetimeValue) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Chưa nhập hạn cuối nộp lại'
                }
            });
            return;
        }

        let title = '';
        switch (status) {
            case REJECTED_STATUS:
                title = `Hoạt động ${rowInfoData.tableInfo.tableName} của bạn đã bị từ chối.`;
                break;
            case ACCEPTED_STATUS:
                title = `Hoạt động ${rowInfoData.tableInfo.tableName} của bạn đã được chấp nhận.`;
                break;
            case RESUBMITED_STATUS:
                title = `Hoạt động ${rowInfoData.tableInfo.tableName} của bạn cần phải nộp lại. ${datetimeValue && `Hạn nộp cuối là  ${formatTimeStr(datetimeValue)}`}`;
                break;
            default:
                title = `Hoạt động ${rowInfoData.tableInfo.tableName} của bạn đã xảy ra lỗi.`;
                break;
        }

        dispatch(
            updateRowsStatus({
                userId: userData?._id,
                pageInfo: {
                    pageStudentCohort: rowInfoData.pageInfo.pageStudentCohort,
                    pageStudentMajor: rowInfoData.pageInfo.pageStudentMajor,
                    pageStudentLevelYear: rowInfoData.pageInfo.pageStudentLevelYear
                },
                noteValue,
                rowsType,
                prevStatus,
                status,
                rowListId: rowInfoData.rowListId,
                contentIdList: rowInfoData.contentIdList,
                deadline: datetimeValue,
                isTimedExtension
            })
        );

        dispatch(
            createUpdatedActivityNotification({
                title,
                content: noteValue,
                senderId: auth.user._id,
                recipientId: userData?._id,
                pageId: rowInfoData.pageInfo.pageId
            })
        );
        handleHiddenConfirmModal();
    };

    const handleChangeDatetimeValue = (e) => {
        setDateTimeValue(e.target.value);
    };

    const handleChangeVisiableStatusDateInput = (e) => {
        const boolean = e.target.value === 'true';
        if (!boolean) setDateTimeValue('');
        setVisibleDateInput(boolean);
    };

    const handleChangeNoteValue = (e) => {
        setNoteValue(e.target.value);
    };

    const handleHiddenPopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHiddenConfirmModal();
        }
    };

    return (
        <div className="modal_overlap" onMouseUp={handleHiddenPopup}>
            <div className="approve_modal">
                <div className="approve_modal_header">
                    <h2>{title}</h2>
                    <div className="modal_close_btn" onClick={handleHiddenConfirmModal}>
                        <AiOutlineClose />
                    </div>
                </div>
                <div className="approve_modal_body">
                    <p className="approve_modal_body_content">
                        {content}
                        <span>(Kiểm tra thật kỹ minh chứng trước khi đồng ý)</span>
                    </p>
                    {status === 'phải nộp lại' && (
                        <div className="deadline_submit">
                            {!isTimedExtension && (
                                <div className="deadline_submit_radio_group">
                                    <label>Tạo Thời Hạn:</label>

                                    <div className="deadline_submit_radio_item">
                                        <input
                                            type="radio"
                                            name="deadline_submit_radio"
                                            onChange={handleChangeVisiableStatusDateInput}
                                            id="deadline_submit_radio_optional"
                                            defaultChecked
                                            value={false}
                                        />
                                        <label htmlFor="deadline_submit_radio_optional">Không bắt buộc</label>
                                    </div>

                                    <div className="deadline_submit_radio_item">
                                        <input
                                            type="radio"
                                            onChange={handleChangeVisiableStatusDateInput}
                                            name="deadline_submit_radio"
                                            id="required_deadline_submit"
                                            value={true}
                                        />
                                        <label htmlFor="required_deadline_submit">Bắt buộc</label>
                                    </div>
                                </div>
                            )}

                            {(visibleDateInput === true || isTimedExtension) && (
                                <div className="deadline_submit_input_wrapper">
                                    <label htmlFor="deadline_submit_input">Nhập Thời Gian:</label>
                                    <input
                                        type="datetime-local"
                                        onChange={handleChangeDatetimeValue}
                                        id="deadline_submit_input"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="approve_modal_body_note">
                        <textarea
                            placeholder="Nhập ghi chú cho hoạt động (nếu có)"
                            onChange={handleChangeNoteValue}
                        ></textarea>
                    </div>
                </div>
                <div className="approve_modal_footer">
                    <button className="btn_close" onClick={handleHiddenConfirmModal}>
                        Không đồng ý
                    </button>
                    <button className="btn_accept" onClick={handleUpdateRowsStatus}>
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApproveActivityModal;
