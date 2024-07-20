import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { removePage, updatedStatusPage } from '../../redux/actions/pageAction';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

function RemovePageModal({
    pageId,
    subPageName,
    currentStatus,
    handleHideRemovePageModal,
    onHideUpdateStatusPageModal
}) {
    const dispatch = useDispatch();

    const handleClickOuterClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            onHideUpdateStatusPageModal ? onHideUpdateStatusPageModal() : handleHideRemovePageModal();
        }
    };

    const handleClosePopup = (e) => {
        onHideUpdateStatusPageModal ? onHideUpdateStatusPageModal() : handleHideRemovePageModal();
    };

    const handleRemovePage = () => {
        dispatch(removePage({ pageId }));
        handleHideRemovePageModal();
    };

    const handleUpdateStatusPage = () => {
        dispatch(updatedStatusPage({ pageId, currentStatus }));
        onHideUpdateStatusPageModal();
    };

    return (
        <div className="modal_overlap" onMouseUp={handleClickOuterClosePopup}>
            <div className="box_wrapper">
                <h2 className="modal_header">
                    {onHideUpdateStatusPageModal
                        ? currentStatus
                            ? 'Ẩn Nhóm Chỉ Tiêu'
                            : 'Hiện Thị Nhóm Chỉ Tiếu'
                        : 'Xóa Nhóm Chỉ Tiêu'}
                </h2>
                <div className="modal_close_icon_wrapper" onClick={handleClosePopup}>
                    <AiOutlineClose />
                </div>
                <div className="remove_page_modal">
                    <div className="remove_page_body">
                        <span>{`Bạn muốn ${onHideUpdateStatusPageModal ? (currentStatus ? 'ẩn' : 'hiện thị') : 'xóa'} ${subPageName} ?`}</span>
                        <span>( Tiến độ hoàn thành và điểm của sinh viên ở nhóm chỉ tiêu này sẽ mất đi )</span>
                    </div>
                    <div className="remove_page_footer">
                        <button className="remove_page_deny_btn" onClick={handleHideRemovePageModal}>
                            Thoát
                        </button>
                        <button
                            className="remove_page_accept_btn"
                            onClick={onHideUpdateStatusPageModal ? handleUpdateStatusPage : handleRemovePage}
                        >
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RemovePageModal;
