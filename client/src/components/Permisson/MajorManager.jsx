import { Fragment, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import { getFacultyManagers } from '../../redux/actions/permissonAction';
import { facultySelector, permissionSelector } from '../../redux/selector';
import StudentDetailsModal from '../Modal/StudentDetailsModal';
import AccountCreatetion from './AccountCreation';
import AccountCreatetionModal from '../Modal/AccountCreationModal';
import { IoIosAddCircleOutline } from 'react-icons/io';
const { VITE_APP_MAJOR_MANAGER_CODE } = import.meta.env;

function MajorManager() {
    const dispatch = useDispatch();
    const { facultyManagers } = useSelector(permissionSelector);
    const { facultyData } = useSelector(facultySelector);
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [currentFaculty, setCurrentFaculty] = useState('');
    const [currentMajor, setCurrentMajor] = useState('');
    const [visibleDetailsUserModal, setVisibleDetailsUserModal] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [visibleAccountCreationModal, setVisibleAccountCreationModal] = useState(false);

    const handleToggleDisplayDetailsUserModal = () => {
        setVisibleDetailsUserModal((prev) => !prev);
    };

    const handleToggleDisplayAccountCreationModal = () => {
        setVisibleAccountCreationModal((prev) => !prev);
    };

    const handleEditUser = (currentUser) => {
        if (currentUser) {
            setCurrentUser(currentUser);
        } else {
            setCurrentUser(null);
            dispatch(
                getFacultyManagers({
                    groupCode: VITE_APP_MAJOR_MANAGER_CODE
                })
            );
        }

        handleToggleDisplayDetailsUserModal();
    };

    const search = ({ searchValue, facultyManagers, currentFaculty, currentMajor }) => {
        const faculty = currentFaculty ? JSON.parse(currentFaculty) : '';
        const major = currentMajor ? JSON.parse(currentMajor) : '';

        if (!searchValue)
            setUsers(
                facultyManagers.filter(
                    (user) => (!faculty || faculty._id === user.faculty._id) && (!major || major._id === user.major._id)
                )
            );
        else {
            if (/^\d+$/.test(searchValue)) {
                setUsers(
                    facultyManagers.filter(
                        (user) =>
                            user.userId.includes(searchValue) &&
                            (!faculty || faculty._id === user.faculty._id) &&
                            (!major || major._id === user.major._id)
                    )
                );
            } else {
                setUsers(
                    facultyManagers.filter(
                        (user) =>
                            toFullName({ firstName: user.firstName, lastName: user.lastName }).includes(searchValue) &&
                            (!faculty || faculty._id === user.faculty._id) &&
                            (!major || major._id === user.major._id)
                    )
                );
            }
        }
    };

    useEffect(() => {
        dispatch(
            getFacultyManagers({
                groupCode: VITE_APP_MAJOR_MANAGER_CODE
            })
        );
    }, []);

    useEffect(() => {
        setUsers(facultyManagers);
    }, [JSON.stringify(facultyManagers)]);

    useEffect(() => {
        let timerId = null;

        if (facultyManagers.length > 0) {
            timerId = setTimeout(() => {
                search({ searchValue, facultyManagers, currentFaculty, currentMajor });
            }, 500);
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [searchValue, currentFaculty, currentMajor, JSON.stringify(facultyManagers)]);

    useEffect(() => {
        setCurrentMajor('');
    }, [currentFaculty]);

    return (
        <Fragment>
            {visibleDetailsUserModal && (
                <StudentDetailsModal currentUserData={currentUser} onToggleModal={handleEditUser} isManager />
            )}

            {visibleAccountCreationModal && (
                <AccountCreatetionModal
                    facultyData={facultyData}
                    onToggleModal={handleToggleDisplayAccountCreationModal}
                />
            )}

            <div className="manager_list_container">
                <div className="search_container">
                    <div>
                        <input
                            type="text"
                            placeholder="Nhập mã số hoặc tên quản lý"
                            className="search_input_v2"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />

                        <select onChange={(e) => setCurrentFaculty(e.target.value)} value={currentFaculty}>
                            <option value="">Chọn khoa</option>
                            {facultyData.map((faculty) => (
                                <option key={faculty._id} value={JSON.stringify(faculty)}>
                                    {capitalizeFirstLetter(faculty.facultyName)}
                                </option>
                            ))}
                        </select>

                        <select value={currentMajor} onChange={(e) => setCurrentMajor(e.target.value)}>
                            <option value="">Chọn chuyên ngành</option>
                            {currentFaculty &&
                                JSON.parse(currentFaculty).majors.map((major) => (
                                    <option value={JSON.stringify(major)} key={major._id}>
                                        {capitalizeFirstLetter(major.majorName)}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <button onClick={handleToggleDisplayAccountCreationModal}>
                        <IoIosAddCircleOutline size={20} />
                        <span>Thêm Quản Lý Chuyên Ngành</span>
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Mã GV</th>
                            <th>Tên Quản Lý</th>
                            <th>Khoa</th>
                            <th>Chuyên Ngành</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Trạng Thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => {
                            const majorName = user?.major?.majorName;
                            const facultyName = user?.faculty?.facultyName;

                            return (
                                <tr key={user._id}>
                                    <td className="td_item">{user?.userId}</td>
                                    <td className="td_item">
                                        {toFullName({ firstName: user.firstName, lastName: user.lastName })}
                                    </td>
                                    <td className="td_item">
                                        {facultyName ? capitalizeFirstLetter(facultyName) : 'Chưa Cập Nhật'}
                                    </td>
                                    <td className="td_item">
                                        {majorName ? capitalizeFirstLetter(majorName) : 'Chưa Cập Nhật'}
                                    </td>
                                    <td className="td_item">{user?.phone || 'Chưa Cập Nhật'}</td>
                                    <td className="td_item">{user?.email || 'Chưa Cập Nhật'}</td>
                                    <td className={`status td_item ${user?.isActive ? 'active' : 'inactive'}`}>
                                        {user?.isActive ? 'Hoạt Động' : 'Đã Khóa'}
                                    </td>
                                    <td className="td_item">
                                        <button className="account_btn" onClick={() => handleEditUser(user)}>
                                            <FaRegEdit />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}

export default MajorManager;
