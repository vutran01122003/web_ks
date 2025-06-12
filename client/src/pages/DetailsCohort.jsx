import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { facultySelector } from '../redux/selector';
import CohortComponent from '../components/Faculty/CohortComponent';
import { getAllFaculties } from '../redux/actions/facultyAction';

function DetailsCohort() {
    const dispatch = useDispatch();
    const faculty = useSelector(facultySelector);

    useEffect(() => {
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    return (
        <div className="faculty_major_container">
            <CohortComponent faculty={faculty} />
        </div>
    );
}

export default DetailsCohort;
