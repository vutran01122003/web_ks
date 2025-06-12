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
    const [status, setStatus] = useState(major?.isActive || null);
    const [currentFaculty, setCurrentFaculty] = useState({});
    const [majorName, setMajorName] = useState(major?.majorName || '');
    const [majorManagerList, setMajorManagerList] = useState(major?.managers || []);

    const handleChangeMajorStatus = (e) => {
        setStatus(e.target.value === 'true');
    };

    const handleChangeFacultySelect = (e) => {
        setCurrentFaculty(JSON.parse(e.target.value));
    };

    const handleChangeMajorName = (e) => {
        setMajorName(e.target.value);
    };

    const resetData = () => {
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
