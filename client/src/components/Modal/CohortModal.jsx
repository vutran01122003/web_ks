import Modal from './Modal';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { Fragment, useState } from 'react';
import { createCohort, updateCohort } from '../../redux/actions/facultyAction';
import { useDispatch } from 'react-redux';

function CohortModal({ onHiddenModal, facultyState, header, faculty, major, cohort }) {
    const dispatch = useDispatch();
    const facultyData = facultyState?.facultyData;
    const [status, setStatus] = useState(cohort?.isActive || null);
    const [cohortName, setCohortName] = useState(cohort?.cohortName || '');
    const [currentFaculty, setCurrentFaculty] = useState({});
    const [currentMajor, setCurrentMajor] = useState({});

    const handleChangeCohortStatus = (e) => {
        setStatus(e.target.value === 'true');
    };

    const handleChangeFacultySelect = (e) => {
        setCurrentFaculty(JSON.parse(e.target.value));
    };

    const handleChangeMajorSelect = (e) => {
        setCurrentMajor(JSON.parse(e.target.value));
    };

    const handleChangeCohortName = (e) => {
        setCohortName(e.target.value);
    };

    const resetData = () => {
        setCohortName('');
        setCurrentFaculty({});
        setCurrentMajor({});
        onHiddenModal();
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

        resetData();
    };

    const onUpdateCohort = () => {
        if (
            Object.keys(faculty).length === 0 ||
            Object.keys(major).length === 0 ||
            Object.keys(cohort).length === 0 ||
            !cohortName.trim()
        )
            return;

        dispatch(
            updateCohort({
                facultyId: faculty._id,
                majorId: major._id,
                cohortId: cohort._id,
                cohortData: { cohortName, isActive: status }
            })
        );

        resetData();
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle={header}>
            <form className="cohort_form">
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
                            </select>{' '}
                        </Fragment>
                    )}
                </div>

                <div className="input_item_wrapper">
                    {major ? (
                        <Fragment>
                            <label>Chuyên Ngành:</label>
                            <input type="text" className="not_allowed" value={major.majorName} readOnly />
                        </Fragment>
                    ) : (
                        <Fragment>
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
                        </Fragment>
                    )}
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

                {cohort && (
                    <div className="input_item_wrapper">
                        <label>Trạng Thái:</label>
                        <select defaultValue={cohort.isActive} onChange={handleChangeCohortStatus}>
                            <option value={true}>Đang Hoạt Động</option>
                            <option value={false}>Dừng Hoạt Động</option>
                        </select>
                    </div>
                )}

                <button
                    type="button"
                    className="create_new_cohort_btn"
                    onClick={() => (cohort ? onUpdateCohort() : createNewCohort())}
                >
                    {cohort ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
            </form>
        </Modal>
    );
}

export default CohortModal;
