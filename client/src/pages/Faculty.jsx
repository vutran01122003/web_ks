import { Tabs } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { IoMdAddCircle } from 'react-icons/io';
import { MdRemoveCircle } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';

import { capitalizeFirstLetter, toFullName } from '../utils/handleString';
import { createCohort, deleteMajor, getAllFaculties } from '../redux/actions/facultyAction';
import { facultySelector } from '../redux/selector';
import CreateFacultyModal from '../components/Modal/CreateFacultyModal';
import CreateMajorModal from '../components/Modal/CreateMajorModal';

function Faculty() {
    const dispatch = useDispatch();
    const faculty = useSelector(facultySelector);

    const [cohortName, setCohortName] = useState('');
    const [facultyId, setFacultyId] = useState(null);
    const [currentFaculty, setCurrentFaculty] = useState({});
    const [currentMajor, setCurrentMajor] = useState({});
    const [isDisplayCreateFacultyModel, setIsDisplayCreateFacultyModel] = useState(false);
    const [isDisplayAddMajorsModel, setIsDisplayAddMajorsModel] = useState(false);

    const handleToggleDisplayCreateFacultyModal = () => {
        setIsDisplayCreateFacultyModel((prev) => !prev);
    };

    const handleToggleDisplayAddMajorsModal = (facultyId) => {
        setFacultyId(facultyId);
        setIsDisplayAddMajorsModel((prev) => !prev);
    };

    const handleChangeCohortName = (e) => {
        setCohortName(e.target.value);
    };

    const handleChangeFacultySelect = (e) => {
        setCurrentFaculty(JSON.parse(e.target.value));
    };

    const handleChangeMajorSelect = (e) => {
        setCurrentMajor(JSON.parse(e.target.value));
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

    const deleteMajorById = ({ facultyId, majorId }) => {
        dispatch(deleteMajor({ facultyId, majorId }));
    };

    useEffect(() => {
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    const FacultyUI = (
        <Fragment>
            {isDisplayCreateFacultyModel && (
                <CreateFacultyModal onHiddenModal={handleToggleDisplayCreateFacultyModal} />
            )}

            {isDisplayAddMajorsModel && (
                <CreateMajorModal onHiddenModal={handleToggleDisplayAddMajorsModal} facultyId={facultyId} />
            )}

            <div className="table_heading">
                <h3 className="heading">Danh Sách Khoa Và Chuyên Ngành</h3>
                <button className="create_faculty_btn" onClick={handleToggleDisplayCreateFacultyModal}>
                    <IoIosAddCircleOutline size={20} />
                    <span>Tạo Khoa Mới</span>
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tên Khoa</th>
                        <th>Chuyên Ngành</th>
                        <th>Tình Trạng</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>

                <tbody>
                    {faculty.facultyData.map((facultyItem) => (
                        <tr key={facultyItem._id}>
                            <td>{capitalizeFirstLetter(facultyItem.facultyName)}</td>
                            <td>
                                {facultyItem.majors.map((major, index) => (
                                    <div className="major_item" key={index}>
                                        <span>{capitalizeFirstLetter(major.majorName)}</span>
                                        <button className="updated_btn">Sửa</button>
                                        <button
                                            className="delete_btn"
                                            onClick={() => {
                                                deleteMajorById({
                                                    facultyId: facultyItem._id,
                                                    majorId: major._id
                                                });
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </td>
                            <td>{facultyItem.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}</td>
                            <td className="interactive_btn_wrapper">
                                <div className="updated_btn">
                                    <FaPen /> <span>Chỉnh Sửa Khoa</span>
                                </div>
                                <div
                                    className="add_btn"
                                    onClick={() => {
                                        handleToggleDisplayAddMajorsModal(facultyItem._id);
                                    }}
                                >
                                    <IoMdAddCircle /> <span>Thêm Chuyên Ngành</span>
                                </div>

                                <div className="delete_btn">
                                    <MdRemoveCircle /> <span>Ẩn Khoa</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    );

    const CohortUI = (
        <form className="cohort_form">
            <fieldset>
                <legend>Thêm khóa sinh viên mới</legend>

                <div className="cohort_input_item">
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

                <div className="cohort_input_item">
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

                <div className="cohort_input_item">
                    <label>Thêm Khóa Mới:</label>
                    <input
                        type="text"
                        placeholder="Nhập khóa sinh viên mới"
                        value={cohortName}
                        onChange={handleChangeCohortName}
                    />
                </div>

                <button type="button" onClick={createNewCohort}>
                    Thêm Khóa Mới
                </button>
            </fieldset>
        </form>
    );

    const items = [
        {
            key: 'faculty',
            label: 'Khoa & Chuyên Ngành',
            children: FacultyUI
        },
        {
            key: 'cohort',
            label: 'Khóa Sinh Viên',
            children: CohortUI
        }
    ];

    return (
        <div className="faculty_major_container">
            <Tabs defaultActiveKey="1" items={items} className="tabs_container" />
        </div>
    );
}

export default Faculty;
