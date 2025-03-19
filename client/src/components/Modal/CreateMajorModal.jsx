import { useState } from 'react';
import { TiDeleteOutline } from 'react-icons/ti';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { createMajors } from '../../redux/actions/facultyAction';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import { getDataApi } from '../../utils/fetchData';
import Avatar from '../Account/ComponentAvatar';

function CreateMajorModal({ onHiddenModal, faculty }) {
    const dispatch = useDispatch();

    const [userId, setUserId] = useState('');
    const [currentFaculty, setCurrentFaculty] = useState({});
    const [majorName, setMajorName] = useState('');
    const [majorManagerList, setMajorManagerList] = useState([]);

    const handleChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const addMajorManager = async () => {
        try {
            const res = await getDataApi(`/users/${userId}`);
            const userData = res.data.data;

            if (majorManagerList.some((majorManager) => majorManager._id === userData._id)) {
                setUserId('');
                return;
            }

            if (userData) setMajorManagerList((prev) => [...prev, userData]);
        } catch (error) {
            console.log(error);
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

    const onCreateMajors = () => {
        dispatch(createMajors({ facultyId: currentFaculty._id, majorName: majorName.toLowerCase() }));
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle="Thêm Chuyên Ngành">
            <form className="major_form">
                <div className="input_item_wrapper">
                    <label>Chọn Khoa:</label>
                    <select defaultValue={''} onChange={handleChangeFacultySelect}>
                        <option value="">Chọn Khoa</option>
                        {faculty?.facultyData.map((facultyItem) => (
                            <option key={facultyItem._id} value={JSON.stringify(facultyItem)}>
                                {capitalizeFirstLetter(facultyItem.facultyName)}
                            </option>
                        ))}
                    </select>
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
                        <h5 className="faculy_manager_list title">Danh sách quản lý khoa: </h5>
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

                <button type="button" className="create_new_major_btn" onClick={onCreateMajors}>
                    Thêm Chuyên Ngành
                </button>
            </form>
        </Modal>
    );
}

export default CreateMajorModal;
