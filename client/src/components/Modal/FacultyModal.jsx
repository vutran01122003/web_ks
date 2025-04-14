import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TiDeleteOutline } from 'react-icons/ti';
import Modal from './Modal';
import { getDataApi } from '../../utils/fetchData';
import { createFaculty, updateFaculty } from '../../redux/actions/facultyAction';

function CreateFacultyModal({ onHiddenModal, header, faculty }) {
    const dispatch = useDispatch();

    const [status, setStatus] = useState(faculty?.isActive || null);
    const [facultyName, setFacultyName] = useState(faculty ? faculty.facultyName : '');
    const [facultyManagerList, setFacultyManagerList] = useState(faculty ? faculty.managers : []);

    const handleChangeFacultyName = (e) => {
        setFacultyName(e.target.value);
    };

    const handleChangeFacultyStatus = (e) => {
        setStatus(e.target.value === true);
    };

    const resetData = () => {
        setFacultyName('');
        setFacultyManagerList([]);
        onHiddenModal();
    };

    const createNewFaculty = () => {
        if (!facultyName.trim()) return;

        dispatch(
            createFaculty({
                facultyName,
                managerIdList: facultyManagerList.map((facultyManager) => facultyManager._id)
            })
        );

        resetData();
    };

    const onUpdateFaculty = () => {
        if (!facultyName.trim()) return;

        dispatch(
            updateFaculty({
                facultyData: {
                    facultyName,
                    isActive: status
                },
                facultyId: faculty._id
            })
        );
        resetData();
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle={header}>
            <form className="faculty_form">
                <div className="input_item_wrapper">
                    <label htmlFor="faculty_name_input">{faculty ? 'Tên Khoa:' : 'Tên Khoa Mới:'}</label>
                    <input
                        id="faculty_name_input"
                        type="text"
                        onChange={handleChangeFacultyName}
                        value={facultyName}
                        placeholder="Nhập tên khoa mới"
                    />
                </div>

                {faculty && (
                    <div className="input_item_wrapper">
                        <label>Trạng Thái:</label>
                        <select defaultValue={faculty.isActive} onChange={handleChangeFacultyStatus}>
                            <option value={true}>Đang Hoạt Động</option>
                            <option value={false}>Dừng Hoạt Động</option>
                        </select>
                    </div>
                )}

                <button
                    type="button"
                    className="create_new_faculty_btn"
                    onClick={() => {
                        return faculty ? onUpdateFaculty() : createNewFaculty();
                    }}
                >
                    {faculty ? 'Cập Nhật Thông Tin' : 'Tạo Khoa Mới'}
                </button>
            </form>
        </Modal>
    );
}

export default CreateFacultyModal;
