import { useDispatch } from "react-redux";
import { updateRowsStatus } from "../../redux/actions/rowAction";
import { Modal } from "antd";

function ConfirmModal({isOpen, content, title, status, rowInfoData, handleHiddenConfirmModal, rowsType}) {
    const dispatch = useDispatch();

    const handleUpdateRowsStatus = () => {
        dispatch(updateRowsStatus({
            rowsType,
            status,
            rowListId: rowInfoData.rowListId, 
            contentIdList: rowInfoData.contentIdList
        }));
        handleHiddenConfirmModal();
    }

    return (
        <Modal
            title={title}
            centered
            open={isOpen}
            onOk={handleUpdateRowsStatus}
            onCancel={handleHiddenConfirmModal}
        >
            {content}
        </Modal>
    );
}

export default ConfirmModal;