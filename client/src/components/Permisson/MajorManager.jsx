import { Fragment, useEffect, useState } from 'react';
import { getDataApi, postDataApi } from '../../utils/fetchData';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
const { VITE_APP_MAJOR_MANAGER_CODE } = import.meta.env;

function MajorManager() {
    const [userList, SetUserList] = useState([]);
    useEffect(() => {
        getDataApi('/users/groups', {
            groupCode: VITE_APP_MAJOR_MANAGER_CODE
        }).then((res) => {
            SetUserList(res.data.data);
        });
    }, []);

    return (
        <div className="manager_list_container">
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
                    </tr>
                </thead>

                <tbody>
                    {userList.map((user) => {
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
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default MajorManager;
