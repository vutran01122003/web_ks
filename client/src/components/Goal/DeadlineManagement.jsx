import { Fragment, useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import SearchFilterComponent from '../Filter/SearchFilter';
import { deadlineSelector, facultySelector } from '../../redux/selector';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { getDeadlineList, updateDealine } from '../../redux/actions/deadlineAction';
import EmptyDataNotification from '../Notification/EmptyDataNotification';
import UpdateDeadlineModal from '../Modal/UpdateDeadlineModal';

function DeadlineManagement() {
    const dispatch = useDispatch();
    const { faculty } = useSelector(facultySelector);
    const [major, setMajor] = useState('');
    const [cohort, setCohort] = useState('');
    const [talentEngineerType, setTalentEngineerType] = useState('');
    const { deadlineList } = useSelector(deadlineSelector);
    const [visibleUpdateDeadlineModal, setVisibleUpdateDeadlineModal] = useState(false);
    const [currentDeadlineId, setCurrentDeadlineId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleChangeStartDate = (e) => {
        setStartDate(e.target.value);
    };

    const handleChangeEndDate = (e) => {
        setEndDate(e.target.value);
    };

    const handleToggleDisplayUpdateDeadlineModal = (deadlineId, startDate, endDate) => {
        if (deadlineId === currentDeadlineId || !deadlineId) {
            setCurrentDeadlineId('');
            setStartDate('');
            setEndDate('');
        } else {
            if (startDate && endDate) {
                const utcStartDate = new Date(startDate);
                const utcEndDate = new Date(endDate);

                const localStartDate = new Date(utcStartDate.getTime() - utcStartDate.getTimezoneOffset() * 60000);
                const localEndDate = new Date(utcEndDate.getTime() - utcEndDate.getTimezoneOffset() * 60000);

                const formattedStartDate = localStartDate.toISOString().slice(0, 16);
                const formattedEndDate = localEndDate.toISOString().slice(0, 16);

                setStartDate(formattedStartDate);
                setEndDate(formattedEndDate);
            }

            setCurrentDeadlineId(deadlineId);
        }
        setVisibleUpdateDeadlineModal((prev) => !prev);
    };

    const onGetDeadlineList = () => {
        if (!major || !cohort || !faculty || !talentEngineerType)
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng chọn đủ thông tin'
                }
            });

        dispatch(
            getDeadlineList({
                facultyId: faculty._id,
                majorId: major._id,
                cohortId: cohort._id,
                talentEngineerType
            })
        );
    };

    const onUpdateDeadline = () => {
        if (!startDate || !endDate) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Ngày giờ bắt đầu và kết thúc không được rỗng'
                }
            });
            return;
        }

        if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Ngày giờ bắt đầu không được lớn hơn ngày giờ kết thúc'
                }
            });
            return;
        }

        dispatch(updateDealine({ deadlineId: currentDeadlineId, startDate, endDate }));
        handleToggleDisplayUpdateDeadlineModal();
    };

    return (
        <Fragment>
            <div className="deadline_management_container">
                <div className="deadline_management_filter">
                    <SearchFilterComponent
                        setMajorValue={setMajor}
                        setCohortValue={setCohort}
                        setTalentEngineerType={setTalentEngineerType}
                        majorValue={major}
                        cohortValue={cohort}
                        talentEngineerType={talentEngineerType}
                    />

                    <button className="search_btn" onClick={onGetDeadlineList}>
                        Tìm Kiếm
                    </button>
                </div>

                <div className="table_wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Năm</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deadlineList.length > 0 &&
                                deadlineList.map((deadline) => (
                                    <tr key={deadline._id}>
                                        <td>{deadline.levelYear}</td>
                                        <td>
                                            {deadline.startDate
                                                ? new Date(deadline.startDate).toLocaleString('en-GB')
                                                : 'Chưa cập nhật'}
                                        </td>
                                        <td>
                                            {deadline.endDate
                                                ? new Date(deadline.endDate).toLocaleString('en-GB')
                                                : 'Chưa cập nhật'}
                                        </td>
                                        <td>
                                            {deadline.startDate && deadline.endDate
                                                ? new Date(deadline.startDate).getTime() > new Date().getTime()
                                                    ? 'Chưa bắt đầu'
                                                    : new Date(deadline.endDate).getTime() < new Date().getTime()
                                                      ? 'Đã kết thúc'
                                                      : 'Đang diễn ra'
                                                : 'Chưa cập nhật'}
                                        </td>
                                        <td className="edit_btn">
                                            {visibleUpdateDeadlineModal && currentDeadlineId === deadline._id && (
                                                <UpdateDeadlineModal
                                                    handleToggleDisplayUpdateDeadlineModal={
                                                        handleToggleDisplayUpdateDeadlineModal
                                                    }
                                                    updateDeadline={onUpdateDeadline}
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    handleChangeStartDate={handleChangeStartDate}
                                                    handleChangeEndDate={handleChangeEndDate}
                                                />
                                            )}
                                            <span className="icon_wrapper">
                                                <TbEdit
                                                    size={22}
                                                    onClick={() =>
                                                        handleToggleDisplayUpdateDeadlineModal(
                                                            deadline?._id,
                                                            deadline?.startDate,
                                                            deadline?.endDate
                                                        )
                                                    }
                                                />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {deadlineList.length === 0 && <EmptyDataNotification />}
                </div>
            </div>
        </Fragment>
    );
}

export default DeadlineManagement;
