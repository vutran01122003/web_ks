import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowDropright, IoMdAddCircle } from 'react-icons/io';
import { MdRemoveCircle } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaPen } from 'react-icons/fa';
import { getDataApi } from '../utils/fetchData';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { capitalizeFirstLetter, toFullName } from '../utils/handleString';
import Avatar from '../components/Account/ComponentAvatar';
import { createCohort, createFaculty, getAllFaculties } from '../redux/actions/facultyAction';
import { facultySelector } from '../redux/selector';

function Faculty() {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState('');
    const [majorList, setMajorList] = useState([]);
    const [majorName, setMajorName] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [cohortName, setCohortName] = useState('');
    const [currentFaculty, setCurrentFaculty] = useState({});
    const [currentMajor, setCurrentMajor] = useState({});
    const [facultyManagerList, setFacultyManagerList] = useState([]);
    const faculty = useSelector(facultySelector);

    const handleChangeFacultyName = (e) => {
        setFacultyName(e.target.value);
    };

    const handleChangeUserId = (e) => {
        setUserId(e.target.value);
    };

    const handleChangeMajorName = (e) => {
        setMajorName(e.target.value);
    };

    const handleChangeCohortName = (e) => {
        setCohortName(e.target.value);
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

    useEffect(() => {
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    const FacultyUi = (
        <>
            <form className="faculty_form">
                <fieldset>
                    <legend>Tạo Mới Khoa</legend>
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
                        <button type="button" onClick={addMajor} className="add_aculty_major_btn">
                            Thêm
                        </button>
                    </div>
                    {facultyManagerList.length > 0 && (
                        <div className="faculy_manager_list">
                            <h5 className="faculy_manager_list title">Danh sách quản lý khoa: </h5>
                            {facultyManagerList.map((facultyManager, index) => (
                                <div key={index} className="manager_info">
                                    <div className="manager_info_wrapper">
                                        <IoMdArrowDropright />
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
                    <button type="button" className="create_new_faculty_btn" onClick={createNewFaculty}>
                        Tạo Khoa Mới
                    </button>
                </fieldset>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Tên Khoa</th>
                        <th>Quản Lý Khoa</th>
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
                                {facultyItem.managerList.map((manager, index) => (
                                    <div key={index} className="manager_item">{`${manager.userId}-${toFullName({
                                        lastName: manager.lastName,
                                        firstName: manager.firstName
                                    })}`}</div>
                                ))}
                            </td>
                            <td>
                                {facultyItem.majors.map((major, index) => (
                                    <div className="major_item" key={index}>
                                        <span>{capitalizeFirstLetter(major.majorName)}</span>
                                        <button className="updated_btn">Sửa</button>
                                        <button className="delete_btn">Xóa</button>
                                    </div>
                                ))}
                            </td>
                            <td>{facultyItem.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}</td>
                            <td className="interactive_btn_wrapper">
                                <div className="updated_btn">
                                    <FaPen /> <span>Chỉnh Sửa</span>
                                </div>
                                <div className="add_btn">
                                    <IoMdAddCircle /> <span>Thêm Chuyên Ngành</span>
                                </div>
                                <div className="delete_btn">
                                    <MdRemoveCircle /> <span>Xóa Khoa</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

    const CohortUi = (
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
            children: FacultyUi
        },
        {
            key: 'cohort',
            label: 'Khóa Sinh Viên',
            children: CohortUi
        }
    ];

    return (
        <div className="faculty_major_container">
            <Tabs defaultActiveKey="1" items={items} className="tabs_container" />
        </div>
    );
}

export default Faculty;
