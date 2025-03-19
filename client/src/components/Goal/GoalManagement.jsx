import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearch } from 'react-icons/io5';
import { TiDeleteOutline } from 'react-icons/ti';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { RxUpdate } from 'react-icons/rx';
import { goalsSelector } from '../../redux/selector';
import ConfirmModal from '../Modal/ConfirmModal';
import AddTableModal from '../Modal/AddTableModal';
import UpdateTableModal from '../Modal/UpdateTableModal';
import RemovePageModal from '../Modal/RemovePageModal';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import SearchFilterComponent from '../Filter/SearchFilter';
import TableDetailsModel from '../Modal/TableDetailsModal';
import { capitalizeFirstLetter } from '../../utils/handleString';
import EmptyDataNotification from '../Notification/EmptyDataNotification';
import { getGoals, updateStatusPage } from '../../redux/actions/pageAction';
import { getTable, removeTable, updateTable } from '../../redux/actions/tableAction';

function GoalsManagement() {
    const dispatch = useDispatch();
    const goals = useSelector(goalsSelector);
    const [major, setMajor] = useState('');
    const [cohort, setCohort] = useState('');
    const [levelYear, setLevelYear] = useState('');
    const [talentEngineerType, setTalentEngineerType] = useState('');

    const [pageId, setPageId] = useState(null);
    const [subPageName, setSubPageName] = useState('');
    const [currentStatus, setCurrentStatus] = useState(null);
    const [tableInfo, setTableInfo] = useState(null);

    const [openAddTableModal, setOpenAddTableModal] = useState(false);
    const [openRemovePageModal, setOpenRemovePageModal] = useState(false);
    const [isVisibleUpdateStatusPageModal, setIsVisibleUpdateStatusPageModal] = useState(false);
    const [isVisibleRemoveTableModal, setIsVisibleRemoveTableModal] = useState(false);
    const [isVisibleUpdateTableModal, setIsVisibleUpdateTableModal] = useState(false);
    const [isVisibleTableDetailsModal, setIsVisibleTableDetailsModal] = useState(false);
    const [isVisibleUpdateStatusTableModal, setIsVisibleUpdateStatusTableModal] = useState(false);

    const handleToggleTableDetailsModal = () => {
        setIsVisibleTableDetailsModal((prev) => !prev);
    };

    const handleOpenAddTableModal = ({ pageId, pageName }) => {
        setOpenAddTableModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
    };

    const handleHideAddTableModal = () => {
        setOpenAddTableModal(false);
    };

    const handleOpenRemovePageModal = ({ pageId, pageName }) => {
        setOpenRemovePageModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
    };

    const handleToggleRemoveTableModalDisplay = () => {
        setIsVisibleRemoveTableModal((prev) => !prev);
    };

    const removeTableHandling = () => {
        dispatch(removeTable(tableInfo));
        handleToggleRemoveTableModalDisplay();
    };

    const handleToggleVisibleUpdateTableModal = () => {
        setIsVisibleUpdateTableModal((prev) => !prev);
    };

    const handleGetTable = ({ pageId, tableId }) => {
        dispatch(getTable({ pageId, tableId }));
    };

    const onOpenUpdateStatusPageModal = ({ pageId, pageName, status }) => {
        setIsVisibleUpdateStatusPageModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
        setCurrentStatus(status);
    };

    const onHideUpdateStatusPageModal = () => {
        setIsVisibleUpdateStatusPageModal(false);
    };

    const handleUpdateStatusPage = () => {
        dispatch(updateStatusPage({ pageId, currentStatus }));
        onHideUpdateStatusPageModal();
    };

    const handleHideRemovePageModal = () => {
        setOpenRemovePageModal(false);
    };

    const handleToggleUpdateStatusTableModalDisplay = () => {
        setIsVisibleUpdateStatusTableModal((prev) => !prev);
    };

    const onUpdateStatusTable = () => {
        dispatch(
            updateTable({
                pageId: tableInfo.pageId,
                table: {
                    _id: tableInfo.tableId,
                    isActive: !tableInfo.isActive
                },
                tableIndex: tableInfo.tableIndex
            })
        );
        handleToggleUpdateStatusTableModalDisplay();
    };

    const onGetPages = async () => {
        if (major && cohort && levelYear) {
            dispatch(
                getGoals({
                    pageStudentMajor: major.majorName,
                    pageStudentCohort: cohort.cohortName,
                    pageStudentLevelYear: Number.parseInt(levelYear),
                    pageTalentEngineerType: talentEngineerType
                })
            );
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Thông tin tìm kiếm chưa đầy đủ'
                }
            });
        }
    };

    useEffect(() => {
        if (goals.table)
            setTableInfo((prev) => ({
                ...prev,
                table: goals.table
            }));
    }, [goals.table]);

    useEffect(() => {
        if (goals.filteredPage.length > 0)
            dispatch({
                type: GLOBALTYPES.GOALS.RESET_GOALS
            });
    }, [major, cohort, levelYear, talentEngineerType]);

    return (
        <div className="goal_management_container">
            <div className="goal_management">
                <div className="goal_management_filter">
                    <div className="goal_management_filter_select_group">
                        <SearchFilterComponent
                            setMajorValue={setMajor}
                            setCohortValue={setCohort}
                            setTalentEngineerType={setTalentEngineerType}
                            setCurrentLevelYearValue={setLevelYear}
                            majorValue={major}
                            cohortValue={cohort}
                            talentEngineerType={talentEngineerType}
                            currentLevelYearValue={levelYear}
                        />
                    </div>

                    <button className="search_btn" onClick={onGetPages}>
                        <IoSearch />
                        Tìm Kiếm
                    </button>
                </div>

                {openAddTableModal && (
                    <AddTableModal
                        handleHideAddTableModal={handleHideAddTableModal}
                        subPageName={subPageName}
                        pageId={pageId}
                    />
                )}

                {openRemovePageModal && (
                    <RemovePageModal
                        handleHideRemovePageModal={handleHideRemovePageModal}
                        subPageName={subPageName}
                        pageId={pageId}
                    />
                )}

                {isVisibleUpdateStatusPageModal && (
                    <ConfirmModal
                        headerContent={currentStatus ? 'Ẩn Nhóm Chỉ Tiêu' : 'Hiện Thị Nhóm Chỉ Tiếu'}
                        bodyContent={`Bạn chắc chắn muốn ${currentStatus ? 'ẩn' : 'hiện'} ${subPageName}`}
                        toggleConfirmModalDisplay={onHideUpdateStatusPageModal}
                        onAccept={handleUpdateStatusPage}
                    />
                )}

                {isVisibleRemoveTableModal && (
                    <ConfirmModal
                        headerContent={`Xóa Chỉ Tiêu`}
                        bodyContent={`Bạn chắc chắn muốn xóa chỉ tiêu ${tableInfo.tableName}`}
                        noteContent={`Sau khi xóa chỉ tiêu ${tableInfo.tableName} thì tiến độ hoàn thành và điểm số của sinh viên cho chỉ tiêu này sẽ mất đi.`}
                        toggleConfirmModalDisplay={handleToggleRemoveTableModalDisplay}
                        onAccept={removeTableHandling}
                    />
                )}

                {isVisibleUpdateTableModal && goals.table && (
                    <UpdateTableModal
                        tableInfo={tableInfo}
                        toggleUpdateTableModalDisplay={handleToggleVisibleUpdateTableModal}
                        onGetPages={onGetPages}
                    />
                )}

                {isVisibleTableDetailsModal && goals.table && (
                    <TableDetailsModel
                        table={goals.table}
                        toggleTableDetailsModalDisplay={handleToggleTableDetailsModal}
                    />
                )}

                {isVisibleUpdateStatusTableModal && (
                    <ConfirmModal
                        headerContent={`${tableInfo.isActive ? 'Ẩn' : 'Hiển Thị'} Chỉ Tiêu ${tableInfo.tableName}`}
                        bodyContent={`Bạn chắc chắn muốn ${tableInfo.isActive ? 'ẩn' : 'hiện'} chỉ tiêu ${tableInfo.tableName}`}
                        noteContent={
                            tableInfo.isActive
                                ? `Chỉ tiêu ${tableInfo.tableName} sẽ không thể tương tác và thấy được sau khi ẩn đi. Tiến độ và điểm số của sinh viên cho chỉ tiêu này sẽ không bị ảnh hưởng.`
                                : `Chỉ tiêu ${tableInfo.tableName} sẽ có thể tương tác và thấy được chỉ tiêu này sau khi hiện thị.`
                        }
                        toggleConfirmModalDisplay={handleToggleUpdateStatusTableModalDisplay}
                        onAccept={onUpdateStatusTable}
                    />
                )}

                <div className="goal_management_body">
                    <div className="table_wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nhóm Chỉ Tiêu</th>
                                    <th>Trạng Thái</th>
                                    <th>Chỉ Tiêu</th>
                                    <th>Thao Tác Với Nhóm Chỉ Tiêu</th>
                                </tr>
                            </thead>
                            {goals.filteredPage.length > 0 && (
                                <tbody>
                                    {goals.filteredPage.map((filteredPageItem) => (
                                        <tr key={filteredPageItem._id}>
                                            <td className="page_name">
                                                {capitalizeFirstLetter(filteredPageItem.pageName)}
                                            </td>

                                            <td className="page_status">
                                                {filteredPageItem.isActive ? (
                                                    <span className="active">Đang Hoạt Động</span>
                                                ) : (
                                                    <span className="inactive">Không Hoạt Động</span>
                                                )}
                                            </td>

                                            <td className="activity_wrapper">
                                                {filteredPageItem.tables.length > 0 &&
                                                    filteredPageItem.tables.map((table, index) => (
                                                        <div key={table._id} className="activity_name">
                                                            <span>{capitalizeFirstLetter(table.tableName)}</span>
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
                                                                    Xem
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
                                                                    Sửa
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
                                                                    {table.isActive ? 'Ẩn' : 'Hiện'}
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
                                                                    Xóa
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </td>

                                            <td className="btn_group">
                                                <div
                                                    className="add_goal_btn btn_item"
                                                    onClick={() => {
                                                        handleOpenAddTableModal({
                                                            pageName: filteredPageItem.pageName,
                                                            pageId: filteredPageItem._id
                                                        });
                                                    }}
                                                >
                                                    <IoIosAddCircleOutline size={17} />
                                                    <span>Thêm Chỉ Tiêu Mới Vào Nhóm Chỉ Tiêu</span>
                                                </div>

                                                <div
                                                    className={`update_status_page_goal_btn ${filteredPageItem.isActive ? 'active' : 'inactive'} btn_item`}
                                                    onClick={() => {
                                                        onOpenUpdateStatusPageModal({
                                                            pageName: filteredPageItem.pageName,
                                                            pageId: filteredPageItem._id,
                                                            status: filteredPageItem.isActive
                                                        });
                                                    }}
                                                >
                                                    <RxUpdate size={16} />
                                                    <span>
                                                        {filteredPageItem.isActive
                                                            ? `Ẩn ${capitalizeFirstLetter(filteredPageItem.pageName)}`
                                                            : `Hiện ${capitalizeFirstLetter(filteredPageItem.pageName)}`}
                                                    </span>
                                                </div>

                                                <div
                                                    className="remove_page_goal_btn btn_item"
                                                    onClick={() => {
                                                        handleOpenRemovePageModal({
                                                            pageId: filteredPageItem._id,
                                                            pageName: filteredPageItem.pageName
                                                        });
                                                    }}
                                                >
                                                    <TiDeleteOutline size={17} />
                                                    <span>{`Xóa ${capitalizeFirstLetter(filteredPageItem.pageName)}`}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>

                        {goals.filteredPage.length === 0 && <EmptyDataNotification />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoalsManagement;
