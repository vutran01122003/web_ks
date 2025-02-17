import { useState } from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import { TiDeleteOutline } from 'react-icons/ti';
import Modal from './Modal';
import { getDataApi } from '../../utils/fetchData';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import Avatar from '../Account/ComponentAvatar';
import { createFaculty } from '../../redux/actions/facultyAction';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';

function CreateFacultyModal({ onHiddenModal }) {
    const [userId, setUserId] = useState('');
    const [majorList, setMajorList] = useState([]);
    const [majorName, setMajorName] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [facultyManagerList, setFacultyManagerList] = useState([]);

    const handleChangeFacultyName = (e) => {
        setFacultyName(e.target.value);
    };

    const handleChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const handleChangeMajorName = (e) => {
        setMajorName(e.target.value);
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

    const addMajor = () => {
        if (majorName.trim()) setMajorList((prev) => Array.from(new Set([...prev, majorName])));
        setMajorName('');
    };

    const deleteMajor = (majorData) => {
        setMajorList((prev) => prev.filter((majorItem) => majorItem !== majorData));
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle="Tạo Mới Khoa">
            <form className="faculty_form">
                <fieldset>
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

                    <div className="input_item_wrapper">
                        <label htmlFor="faculty_major_input">Tên Chuyên Ngành:</label>
                        <input
                            id="faculty_major_input"
                            type="text"
                            onChange={handleChangeMajorName}
                            value={majorName}
                            placeholder="Nhập tên chuyên ngành"
                        />
                        <button type="button" onClick={addMajor} className="add_faculty_major_btn">
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

                    {majorList.length > 0 && (
                        <div className="faculy_major_list">
                            <h5 className="faculy_major_list_title title">Danh sách chuyên ngành: </h5>
                            {majorList.map((major, index) => (
                                <div key={index} className="major_item">
                                    <div className="major_item_content">
                                        <IoMdArrowDropright />
                                        <span> {major} </span>
                                    </div>

                                    <div
                                        className="major_item_delete_btn"
                                        onClick={() => {
                                            deleteMajor(major);
                                        }}
                                    >
                                        <TiDeleteOutline />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </fieldset>

                <button type="button" className="create_new_faculty_btn" onClick={createNewFaculty}>
                    Tạo Khoa Mới
                </button>
            </form>
        </Modal>
    );
}

export default CreateFacultyModal;
