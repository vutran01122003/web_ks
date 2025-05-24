import { useEffect, useState } from 'react';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyManagers } from '../../redux/actions/permissonAction';
import { permissionSelector } from '../../redux/selector';
import { updateUser } from '../../redux/actions/studentAction';
const { VITE_APP_MAJOR_MANAGER_CODE } = import.meta.env;

function FacultyManager() {
    const dispatch = useDispatch();
    const { facultyManagers } = useSelector(permissionSelector);
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');

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

    const updateUserStatus = ({ userId, userData }) => {
        dispatch(updateUser({ userId, userData })).then(() => {
            dispatch(
                getFacultyManagers({
                    groupCode: VITE_APP_MAJOR_MANAGER_CODE
                })
            );
        });
    };

    useEffect(() => {
        let timerId = null;

        if (facultyManagers.length > 0) {
            timerId = setTimeout(() => {
                if (!searchValue) setUsers(facultyManagers);
                else {
                    if (/^\d+$/.test(searchValue)) {
                        setUsers(facultyManagers.filter((user) => user.userId.includes(searchValue)));
                    } else {
                        setUsers(
                            facultyManagers.filter((user) =>
                                toFullName({ firstName: user.firstName, lastName: user.lastName }).includes(searchValue)
                            )
                        );
                    }
                }
            }, 500);
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [searchValue, JSON.stringify(facultyManagers)]);

    return (
        <div className="manager_list_container">
            <div className="search_container">
                <input
                    type="text"
                    placeholder="Nhập mã số hoặc tên quản lý"
                    className="search_input_v2"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className="search_btn">Tìm kiếm</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Mã Số</th>
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
                                <td>{user?.userId}</td>
                                <td>{toFullName({ firstName: user.firstName, lastName: user.lastName })}</td>
                                <td>{facultyName ? capitalizeFirstLetter(facultyName) : 'Chưa Cập Nhật'}</td>
                                <td>{majorName ? capitalizeFirstLetter(majorName) : 'Chưa Cập Nhật'}</td>
                                <td>{user?.phone || 'Chưa Cập Nhật'}</td>
                                <td>{user?.email || 'Chưa Cập Nhật'}</td>
                                <td className={`status ${user?.isActive ? 'active' : 'inactive'}`}>
                                    {user?.isActive ? 'Hoạt Động' : 'Đã Khóa'}
                                </td>
                                <td className="btn_group">
                                    <button
                                        className={`account_btn ${user?.isActive ? 'active' : 'inactive'}`}
                                        onClick={() =>
                                            updateUserStatus({
                                                userId: user._id,
                                                userData: {
                                                    ...user,
                                                    isActive: !user?.isActive
                                                }
                                            })
                                        }
                                    >
                                        {user?.isActive ? 'Khóa Tài Khoản' : 'Mở Tài Khóa'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default FacultyManager;
