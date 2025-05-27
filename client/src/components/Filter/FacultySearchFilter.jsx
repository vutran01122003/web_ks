import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/handleString';

function FacultySearchFilter({ facultyData, majorFilter, cohortFilter, setFacultyList }) {
    const [currentFacultyIndex, setCurrentFacultyIndex] = useState('');
    const [currentMajorIndex, setCurrentMajorIndex] = useState('');
    const [currentCohortIndex, setCurrentCohortIndex] = useState('');
    const currentFaculty = facultyData[currentFacultyIndex];
    const currentMajor = currentFaculty?.majors[currentMajorIndex];
    const currentCohort = currentMajor?.cohorts[currentCohortIndex];

    useEffect(() => {
        if (currentFaculty) {
            let faculty = facultyData.find((faculty) => faculty._id === currentFaculty._id);
            let majors = [];
            let cohorts = [];

            if (currentMajor) {
                majors = faculty.majors.filter((major) => major._id === currentMajor._id);
                faculty = {
                    ...faculty,
                    majors
                };

                if (currentCohort) {
                    cohorts = majors[0].cohorts.filter((cohort) => cohort._id === currentCohort._id);

                    faculty = {
                        ...faculty,
                        majors: [
                            {
                                ...majors[0],
                                cohorts
                            }
                        ]
                    };
                }
            }

            setFacultyList([faculty]);
        } else {
            setFacultyList(facultyData);
        }
    }, [
        JSON.stringify(currentFaculty),
        JSON.stringify(currentMajor),
        JSON.stringify(currentCohort),
        JSON.stringify(facultyData)
    ]);

    useEffect(() => {
        setCurrentMajorIndex('');
        setCurrentCohortIndex('');
    }, [currentFacultyIndex]);

    useEffect(() => {
        setCurrentCohortIndex('');
    }, [currentMajorIndex]);

    return (
        <div>
            <select
                value={currentFacultyIndex}
                onChange={(e) => setCurrentFacultyIndex(e.target.value ? parseInt(e.target.value) : '')}
            >
                <option value="">Chọn Khoa</option>
                {facultyData.map((faculty, index) => (
                    <option value={index} key={faculty._id}>
                        {capitalizeFirstLetter(faculty.facultyName)}
                    </option>
                ))}
            </select>

            {majorFilter && (
                <select
                    value={currentMajorIndex}
                    onChange={(e) => setCurrentMajorIndex(e.target.value ? parseInt(e.target.value) : '')}
                >
                    <option value="">Chọn chuyên ngành</option>
                    {currentFaculty &&
                        currentFaculty.majors.map((major, index) => (
                            <option value={index} key={major._id}>
                                {capitalizeFirstLetter(major.majorName)}
                            </option>
                        ))}
                </select>
            )}

            {cohortFilter && (
                <select
                    value={currentCohortIndex}
                    onChange={(e) => setCurrentCohortIndex(e.target.value ? parseInt(e.target.value) : '')}
                >
                    <option value="">Chọn Khóa</option>
                    {currentMajor &&
                        currentMajor.cohorts.map((cohort, index) => {
                            const cohorts = currentMajor.cohorts;
                            const length = cohorts.length;
                            const currentCohort = cohorts[length - index - 1];
                            return (
                                <option value={length - index - 1} key={currentCohort._id}>
                                    {capitalizeFirstLetter(currentCohort.cohortName)}
                                </option>
                            );
                        })}
                </select>
            )}
        </div>
    );
}

export default FacultySearchFilter;
