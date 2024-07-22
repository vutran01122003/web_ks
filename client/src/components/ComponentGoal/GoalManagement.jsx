import { useEffect, useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearch, IoRemoveCircleOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

import { facultySelector, goalsSelector } from '../../redux/selector';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { getTable, removeTable } from '../../redux/actions/tableAction';
import { getPages } from '../../redux/actions/pageAction';
import UpdateTableModal from '../ComponentModal/UpdateTableModal';
import RemovePageModal from '../ComponentModal/RemovePageModal';
import ComfirmModal from '../ComponentModal/ConfirmModal';
import AddTableModal from '../ComponentModal/AddTableModal';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import EmptyDataNotification from '../ComponentEmptyData/EmptyDataNotification';

function GoalsManagement() {
    const dispatch = useDispatch();
    const facultyState = useSelector(facultySelector);
    const goals = useSelector(goalsSelector);
    const [major, setMajor] = useState('');
    const [cohort, setCohort] = useState('');
    const [levelYear, setLevelYear] = useState('');

    const [pageId, setPageId] = useState(null);
    const [subPageName, setSubPageName] = useState('');
    const [currentStatus, setCurrentStatus] = useState(null);
    const [tableInfo, setTableInfo] = useState(null);

    const [openAddTableModal, setOpenAddTableModal] = useState(false);
    const [openRemovePageModal, setOpenRemovePageModal] = useState(false);
    const [vissibleUpdateStatusPageModal, setVissibleUpdateStatusPageModal] = useState(false);
    const [isVisibleRemoveTableModal, setIsVisibleRemoveTableModal] = useState(false);
    const [isVisibleUpdateTableModal, setIsVisibleUpdateTableModal] = useState(false);

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
        setVissibleUpdateStatusPageModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
        setCurrentStatus(status);
    };

    const onHideUpdateStatusPageModal = () => {
        setVissibleUpdateStatusPageModal(false);
    };

    const handleHideRemovePageModal = () => {
        setOpenRemovePageModal(false);
    };

    const onGetPages = async () => {
        if (major && cohort && levelYear) {
            dispatch(
                getPages({
                    pageStudentMajor: major.majorName,
                    pageStudentCohort: cohort.cohortName,
                    pageStudentLevelYear: Number.parseInt(levelYear)
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
        setCohort('');
        setLevelYear('');
    }, [major]);

    return (
        <div className="goal_management_container">
            <div className="goal_management">
                <div className="goal_management_filter">
                    <div className="goal_management_filter_select_group">
                        <select
                            className="item_filter"
                            value={major ? JSON.stringify(major) : ''}
                            onInput={(e) => {
                                setMajor(e.target.value ? JSON.parse(e.target.value) : '');
                            }}
                        >
                            <option value="">Chọn Chuyên Ngành</option>
                            {facultyState.faculty.majors.map((major, index) => (
                                <option value={JSON.stringify(major)} key={index}>
                                    {capitalizeFirstLetter(major.majorName)}
                                </option>
                            ))}
                        </select>
                        <select
                            className="item_filter"
                            value={cohort ? JSON.stringify(cohort) : ''}
                            onInput={(e) => {
                                setCohort(e.target.value ? JSON.parse(e.target.value) : '');
                            }}
                        >
                            <option value="">Chọn Khóa</option>
                            {major?.cohortList &&
                                major.cohortList.map((cohort, index) => (
                                    <option value={JSON.stringify(cohort)} key={index}>
                                        {cohort.cohortName}
                                    </option>
                                ))}
                        </select>

                        <select
                            className="item_filter"
                            value={levelYear}
                            onInput={(e) => {
                                setLevelYear(Number.parseInt(e.target.value));
                            }}
                        >
                            <option value="">Chọn Năm</option>
                            {cohort.currentLevelYear &&
                                new Array(cohort.currentLevelYear)
                                    .fill(0)
                                    .map((_, index) => (
                                        <option
                                            value={cohort.currentLevelYear - index}
                                            key={index}
                                        >{`Năm ${cohort.currentLevelYear - index} ${index === 0 ? '(Hiện tại)' : '(Đã kết thúc)'}`}</option>
                                    ))}
                        </select>
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

                {vissibleUpdateStatusPageModal && (
                    <RemovePageModal
                        onHideUpdateStatusPageModal={onHideUpdateStatusPageModal}
                        subPageName={subPageName}
                        pageId={pageId}
                        currentStatus={currentStatus}
                    />
                )}

                {isVisibleRemoveTableModal && (
                    <ComfirmModal
                        headerContent={`Xóa Chỉ Tiêu`}
                        bodyContent={`Bạn chắc chắn muốn xóa chỉ tiêu ${tableInfo.tableName}`}
                        noteContent={`Sau khi xóa chỉ tiêu ${tableInfo.tableName} thì tiến độ hoàn thành và điểm số của sinh viên cho chỉ tiêu này sẽ mất đi`}
                        toggleConfirmModalDisplay={handleToggleRemoveTableModalDisplay}
                        onAccept={removeTableHandling}
                    />
                )}

                {isVisibleUpdateTableModal && goals.table && (
                    <UpdateTableModal
                        tableInfo={tableInfo}
                        toggleUpdateTableModalDisplay={handleToggleVisibleUpdateTableModal}
                    />
                )}

                <div className="goal_management_body">
                    {goals.filteredPage.length > 0 ? (
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
                                <tbody>
                                    {goals.filteredPage.map((filteredPageItem) => (
                                        <tr key={filteredPageItem._id}>
                                            <td className="page_name">
                                                {capitalizeFirstLetter(filteredPageItem.pageName)}
                                            </td>

                                            <td className="page_status">
                                                {filteredPageItem.isActive ? (
                                                    <span className="active">Đang Hiển Thị</span>
                                                ) : (
                                                    <span className="inactive">Không Hiển Thị</span>
                                                )}
                                            </td>

                                            <td>
                                                {filteredPageItem.tables.length > 0 &&
                                                    filteredPageItem.tables.map((table) => (
                                                        <div className="activity_name">
                                                            <span>{capitalizeFirstLetter(table.tableName)}</span>
                                                            <div className="activity_btn_group">
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
                                                    <div className="icon_wrapper">
                                                        <IoIosAddCircleOutline />
                                                    </div>
                                                    <span>Thêm Chỉ Tiêu Mới Vào Nhóm Chỉ Tiêu</span>
                                                </div>

                                                <div
                                                    className="update_status_page_goal_btn btn_item"
                                                    onClick={() => {
                                                        onOpenUpdateStatusPageModal({
                                                            pageName: filteredPageItem.pageName,
                                                            pageId: filteredPageItem._id,
                                                            status: filteredPageItem.isActive
                                                        });
                                                    }}
                                                >
                                                    <div className="icon_wrapper">
                                                        {filteredPageItem.isActive ? (
                                                            <IoEyeOffOutline />
                                                        ) : (
                                                            <IoEyeOutline />
                                                        )}
                                                    </div>
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
                                                    <div className="icon_wrapper">
                                                        <IoRemoveCircleOutline />
                                                    </div>
                                                    <span>{`Xóa ${capitalizeFirstLetter(filteredPageItem.pageName)}`}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyDataNotification />
                    )}
                </div>
            </div>
        </div>
    );
}

export default GoalsManagement;
