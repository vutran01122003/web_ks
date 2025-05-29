import Modal from './Modal';

function MenuGoalModal({
    table,
    filteredPageItem,
    handleGetTable,
    setTableInfo,
    handleToggleTableDetailsModal,
    handleToggleVisibleUpdateTableModal,
    handleToggleDisplayGoalModal,
    handleToggleUpdateStatusTableModalDisplay,
    handleToggleRemoveTableModalDisplay,
    index
}) {
    return (
        <Modal headerTitle="Các Chức Năng Của Chỉ Tiêu" onHiddenModal={handleToggleDisplayGoalModal} className="z-99">
            <div className="menu_goal_modal">
                <div className="activity_btn_group">
                    <span
                        className="activity_edit_btn"
                        onClick={() => {
                            handleGetTable({
                                pageId: filteredPageItem._id,
                                tableId: table._id
                            });
                            handleToggleTableDetailsModal();
                        }}
                    >
                        {`Xem chi tiết ${table.tableName}`}
                    </span>

                    <span
                        className="activity_edit_btn"
                        onClick={() => {
                            setTableInfo({
                                pageId: filteredPageItem._id
                            });
                            handleGetTable({
                                pageId: filteredPageItem._id,
                                tableId: table._id
                            });
                            handleToggleVisibleUpdateTableModal();
                        }}
                    >
                        {`Sửa thông tin  ${table.tableName}`}
                    </span>

                    <span
                        className={`activity_update_status_btn ${table.isActive ? 'inactive' : 'active'}`}
                        onClick={() => {
                            setTableInfo({
                                pageId: filteredPageItem._id,
                                tableId: table._id,
                                tableName: table.tableName,
                                isActive: table.isActive,
                                tableIndex: index
                            });
                            handleToggleUpdateStatusTableModalDisplay();
                        }}
                    >
                        {table.isActive ? `Ẩn chỉ tiêu ${table.tableName}` : `Hiện chỉ tiêu ${table.tableName}`}
                    </span>

                    <span
                        className="activity_delete_btn"
                        onClick={() => {
                            setTableInfo({
                                pageId: filteredPageItem._id,
                                tableId: table._id,
                                tableName: table.tableName
                            });
                            handleToggleRemoveTableModalDisplay();
                        }}
                    >
                        {`Xóa chỉ tiêu ${table.tableName}`}
                    </span>
                </div>
            </div>
        </Modal>
    );
}

export default MenuGoalModal;
