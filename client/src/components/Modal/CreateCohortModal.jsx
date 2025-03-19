import Modal from './Modal';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { useState } from 'react';
import { createCohort } from '../../redux/actions/facultyAction';

function CreateCohortModal({ onHiddenModal, faculty }) {
    const [cohortName, setCohortName] = useState('');
    const [currentFaculty, setCurrentFaculty] = useState({});
    const [currentMajor, setCurrentMajor] = useState({});

    const handleChangeFacultySelect = (e) => {
        setCurrentFaculty(JSON.parse(e.target.value));
    };

    const handleChangeMajorSelect = (e) => {
        setCurrentMajor(JSON.parse(e.target.value));
    };

    const handleChangeCohortName = (e) => {
        setCohortName(e.target.value);
    };

    const createNewCohort = () => {
        if (Object.keys(currentFaculty).length === 0 || Object.keys(currentMajor).length === 0 || !cohortName.trim())
            return;

        dispatch(
            createCohort({
                facultyId: currentFaculty._id,
                majorId: currentMajor._id,
                cohortName
            })
        );
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle="Tạo Mới Khóa Sinh Viên">
            <form className="cohort_form">
                <div className="input_item_wrapper">
                    <label>Chọn Khoa:</label>
                    <select defaultValue={''} onChange={handleChangeFacultySelect}>
                        <option value="">Chọn Khoa</option>
                        {faculty.facultyData.map((facultyItem) => (
                            <option key={facultyItem._id} value={JSON.stringify(facultyItem)}>
                                {capitalizeFirstLetter(facultyItem.facultyName)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input_item_wrapper">
                    <label>Chọn Chuyên Ngành:</label>
                    <select defaultValue={''} onChange={handleChangeMajorSelect}>
                        {Object.keys(currentFaculty).length > 0 ? (
                            <>
                                <option value="">Chọn Chuyên Ngành</option>

                                {currentFaculty.majors.map((majorItem) => (
                                    <option key={majorItem._id} value={JSON.stringify(majorItem)}>
                                        {capitalizeFirstLetter(majorItem.majorName)}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="">Chưa Chọn Khoa</option>
                        )}
                    </select>
                </div>

                <div className="input_item_wrapper">
                    <label>Thêm Khóa Mới:</label>
                    <input
                        type="text"
                        placeholder="Nhập khóa sinh viên mới"
                        value={cohortName}
                        onChange={handleChangeCohortName}
                    />
                </div>

                <button type="button" className="create_new_cohort_btn" onClick={createNewCohort}>
                    Thêm Khóa Sinh Viên Mới
                </button>
            </form>
        </Modal>
    );
}

export default CreateCohortModal;
