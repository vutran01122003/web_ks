import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FacultyComponent from '../components/Faculty/FacultyComponent';
import { facultySelector } from '../redux/selector';
import { getAllFaculties } from '../redux/actions/facultyAction';

function DetailsFaculty() {
    const dispatch = useDispatch();
    const faculty = useSelector(facultySelector);

    useEffect(() => {
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    return (
        <div className="faculty_major_container">
            <FacultyComponent faculty={faculty} />
        </div>
    );
}

export default DetailsFaculty;
