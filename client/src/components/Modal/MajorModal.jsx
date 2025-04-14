import { Fragment, useState } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { createMajor, updateMajor } from '../../redux/actions/facultyAction';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { getDataApi } from '../../utils/fetchData';
import Avatar from '../Account/ComponentAvatar';

function CreateMajorModal({ onHiddenModal, facultyState, header, faculty, major }) {
    const dispatch = useDispatch();

    const facultyData = facultyState?.facultyData;
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState(major?.isActive || null);
    const [currentFaculty, setCurrentFaculty] = useState({});
    const [majorName, setMajorName] = useState(major?.majorName || '');
    const [majorManagerList, setMajorManagerList] = useState(major?.managers || []);

    const handleChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const handleChangeMajorStatus = (e) => {
        setStatus(e.target.value === 'true');
    };

    const addMajorManager = async () => {
        try {
            if (!userId) return;

            const res = await getDataApi(`/users/${userId}`);
            const userData = res.data.data;

            setUserId('');

            if (majorManagerList.some((majorManager) => majorManager._id === userData._id)) return;
            if (userData) setMajorManagerList((prev) => [...prev, userData]);
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response.data.msg
                }
            });
        }
    };

    const deleteMajorManager = async (managerId) => {
        setMajorManagerList((prev) => prev.filter((manager) => manager._id != managerId));
    };

    const handleChangeFacultySelect = (e) => {
        setCurrentFaculty(JSON.parse(e.target.value));
    };

    const handleChangeMajorName = (e) => {
        setMajorName(e.target.value);
    };

    const resetData = () => {
        setUserId('');
        setCurrentFaculty({});
        setMajorName('');
        setMajorManagerList([]);
        onHiddenModal();
    };

    const onCreateMajor = () => {
        if (Object.keys(currentFaculty).length === 0 || !majorName.trim()) return;

        dispatch(
            createMajor({
                facultyId: currentFaculty._id,
                majorName: majorName.toLowerCase(),
                managerIdList: majorManagerList.map((majorManager) => majorManager._id)
            })
        );

        resetData();
    };

    const onUpdateMajor = () => {
        if (Object.keys(faculty).length === 0 || !majorName.trim()) return;

        dispatch(
            updateMajor({
                facultyId: faculty._id,
                majorId: major._id,
                majorData: {
                    majorName,
                    managers: majorManagerList.map((majorManager) => majorManager._id),
                    isActive: status
                }
            })
        );
        resetData();
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle={header}>
            <form className="major_form">
                <div className="input_item_wrapper">
                    {faculty ? (
                        <Fragment>
                            <label>Khoa:</label>
                            <input type="text" className="not_allowed" value={faculty.facultyName} readOnly />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <label>Chọn Khoa:</label>
                            <select defaultValue={''} onChange={handleChangeFacultySelect}>
                                <option value="">Chọn Khoa</option>
                                {facultyData.map((facultyItem) => (
                                    <option key={facultyItem._id} value={JSON.stringify(facultyItem)}>
                                        {capitalizeFirstLetter(facultyItem.facultyName)}
                                    </option>
                                ))}
                            </select>
                        </Fragment>
                    )}
                </div>

                <div className="input_item_wrapper">
                    <label htmlFor="major_input">Tên Chuyên Ngành:</label>
                    <input
                        id="major_input"
                        type="text"
                        onChange={handleChangeMajorName}
                        value={majorName}
                        placeholder="Nhập tên chuyên ngành"
                    />
                </div>

                {major && (
                    <div className="input_item_wrapper">
                        <label>Trạng Thái:</label>
                        <select defaultValue={major.isActive} onChange={handleChangeMajorStatus}>
                            <option value={true}>Đang Hoạt Động</option>
                            <option value={false}>Dừng Hoạt Động</option>
                        </select>
                    </div>
                )}

                <div className="input_item_wrapper">
                    <label htmlFor="major_manager_input">Quản Lý Chuyên Ngành:</label>
                    <input
                        id="major_manager_input"
                        type="text"
                        onChange={handleChangeUserId}
                        value={userId}
                        placeholder="Nhập mã quản lý chuyên ngành"
                    />
                    <button type="button" onClick={addMajorManager} className="add_major_manager_btn">
                        Thêm
                    </button>
                </div>

                {majorManagerList.length > 0 && (
                    <div className="faculy_manager_list">
                        <h5 className="faculy_manager_list title">Danh sách quản lý chuyên ngành: </h5>
                        {majorManagerList.map((majorManager, index) => (
                            <div key={index} className="manager_info">
                                <div className="manager_info_wrapper">
                                    <Avatar url={majorManager.avatar} size="small" />
                                    <div className="manager_info_content">
                                        <span> {capitalizeFirstLetter(majorManager.userId)} </span>
                                        <span>
                                            {toFullName({
                                                lastName: majorManager.lastName,
                                                firstName: majorManager.firstName
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="manager_info_delete_btn"
                                    onClick={() => {
                                        deleteMajorManager(majorManager._id);
                                    }}
                                >
                                    <TiDeleteOutline />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    className="create_new_major_btn"
                    onClick={() => (major ? onUpdateMajor() : onCreateMajor())}
                >
                    {major ? 'Cập Nhật Thông Tin' : 'Thêm Chuyên Ngành'}
                </button>
            </form>
        </Modal>
    );
}

export default CreateMajorModal;
