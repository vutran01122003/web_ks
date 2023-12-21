import { useDispatch } from "react-redux";
import { updatePeddingRowStatus } from "../../redux/actions/rowAction";
import { Modal } from "antd";

function ConfirmModal({isOpen, content, title, status, rowInfoData, handleHiddenConfirmModal}) {
    const dispatch = useDispatch();

    const handleUpdateRowStatus = () => {
        dispatch(updatePeddingRowStatus({
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
            onOk={handleUpdateRowStatus}
            onCancel={handleHiddenConfirmModal}
        >
            {content}
        </Modal>
    );
}

export default ConfirmModal;