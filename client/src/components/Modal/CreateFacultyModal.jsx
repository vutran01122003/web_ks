import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TiDeleteOutline } from 'react-icons/ti';
import Modal from './Modal';
import { getDataApi } from '../../utils/fetchData';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import Avatar from '../Account/ComponentAvatar';
import { createFaculty } from '../../redux/actions/facultyAction';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';

function CreateFacultyModal({ onHiddenModal }) {
    const dispatch = useDispatch();

    const [userId, setUserId] = useState('');
    const [majorList, setMajorList] = useState([]);
    const [facultyName, setFacultyName] = useState('');
    const [facultyManagerList, setFacultyManagerList] = useState([]);

    const handleChangeFacultyName = (e) => {
        setFacultyName(e.target.value);
    };

    const handleChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const addFacultyManager = async () => {
        try {
            const res = await getDataApi(`/users/${userId}`);
            const userData = res.data.data;

            if (facultyManagerList.some((facultyManager) => facultyManager._id === userData._id)) {
                setUserId('');
                return;
            }

            if (userData) {
                setFacultyManagerList((prev) => [...prev, userData]);
            }
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: error.response.data.msg
                }
            });
        }
    };

    const createNewFaculty = () => {
        dispatch(
            createFaculty({
                facultyName,
                managerIdList: facultyManagerList.map((facultyManager) => facultyManager._id),
                majorList
            })
        );

        setFacultyName('');
        setUserId('');
        setMajorList([]);
        setFacultyManagerList([]);
    };

    const deleteFacultyManager = async (managerId) => {
        setFacultyManagerList((prev) => prev.filter((manager) => manager._id != managerId));
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle="Tạo Mới Khoa">
            <form className="faculty_form">
                <div className="input_item_wrapper">
                    <label htmlFor="faculty_name_input">Tên Khoa Mới:</label>
                    <input
                        id="faculty_name_input"
                        type="text"
                        onChange={handleChangeFacultyName}
                        value={facultyName}
                        placeholder="Nhập tên khoa mới"
                    />
                </div>

                <div className="input_item_wrapper">
                    <label htmlFor="faculty_manager_input">Quản Lý Khoa:</label>
                    <input
                        id="faculty_manager_input"
                        type="text"
                        onChange={handleChangeUserId}
                        value={userId}
                        placeholder="Nhập mã quản lý khoa"
                    />
                    <button type="button" onClick={addFacultyManager} className="add_faculty_manager_btn">
                        Thêm
                    </button>
                </div>

                {facultyManagerList.length > 0 && (
                    <div className="faculy_manager_list">
                        <h5 className="faculy_manager_list title">Danh sách quản lý khoa: </h5>
                        {facultyManagerList.map((facultyManager, index) => (
                            <div key={index} className="manager_info">
                                <div className="manager_info_wrapper">
                                    <Avatar url={facultyManager.avatar} size="small" />
                                    <div className="manager_info_content">
                                        <span> {capitalizeFirstLetter(facultyManager.userId)} </span>
                                        <span>
                                            {toFullName({
                                                lastName: facultyManager.lastName,
                                                firstName: facultyManager.firstName
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="manager_info_delete_btn"
                                    onClick={() => {
                                        deleteFacultyManager(facultyManager._id);
                                    }}
                                >
                                    <TiDeleteOutline />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button type="button" className="create_new_faculty_btn" onClick={createNewFaculty}>
                    Tạo Khoa Mới
                </button>
            </form>
        </Modal>
    );
}

export default CreateFacultyModal;
