import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFaculties } from '../redux/actions/facultyAction';
import { facultySelector } from '../redux/selector';
import FacultyComponent from '../components/Faculty/FacultyComponent';
import MajorComponent from '../components/Faculty/MajorComponent';
import CohortComponent from '../components/Faculty/CohortComponent';

function Faculty() {
    const dispatch = useDispatch();
    const faculty = useSelector(facultySelector);

    useEffect(() => {
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    const items = [
        {
            key: 'faculty',
            label: 'Danh Sách Khoa',
            children: <FacultyComponent faculty={faculty} />
        },
        {
            key: 'major',
            label: 'Danh Sách Chuyên Ngành',
            children: <MajorComponent faculty={faculty} />
        },
        {
            key: 'cohort',
            label: 'Khóa Sinh Viên',
            children: <CohortComponent faculty={faculty} />
        }
    ];

    return (
        <div className="faculty_major_container">
            <Tabs defaultActiveKey="1" items={items} className="tabs_container" />
        </div>
    );
}

export default Faculty;
