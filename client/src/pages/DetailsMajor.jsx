import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { facultySelector } from '../redux/selector';
import MajorComponent from '../components/Faculty/MajorComponent';
import { getAllFaculties } from '../redux/actions/facultyAction';

function DetailsMajor() {
    const dispatch = useDispatch();
    const faculty = useSelector(facultySelector);

    useEffect(() => {
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    return (
        <div className="faculty_major_container">
            <MajorComponent faculty={faculty} />
        </div>
    );
}

export default DetailsMajor;
