import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFaculties } from '../redux/actions/facultyAction';
import { facultySelector } from '../redux/selector';
import AccountCreatetion from '../components/Permisson/AccountCreation';
import MajorManager from '../components/Permisson/MajorManager';

function Permission() {
    const dispatch = useDispatch();
    const faculty = useSelector(facultySelector);

    useEffect(() => {
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    const items = [
        {
            key: 'account',
            label: 'Tạo Tài Khoản',
            children: <AccountCreatetion faculty={faculty} />
        },
        {
            key: 'major_manager',
            label: 'Danh Sách QLCN',
            children: <MajorManager />
        }
    ];

    return (
        <div className="permission_container">
            <Tabs defaultActiveKey="1" items={items} className="tabs_container" />
        </div>
    );
}

export default Permission;
