import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils/handleString';
import { useDispatch, useSelector } from 'react-redux';
import { facultySelector } from '../../redux/selector';

function FacultyStudentFilter({
    facultyData,
    majorFilter,
    cohortFilter,
    setFacultyList,
    setCurrentFaculty,
    setCurrentMajor,
    setCurrentCohort,
    setStatus,
    setTalentEngineerType,
    setCurrentLevelYearValue
}) {
    const dispatch = useDispatch();
    const { facultyData } = useSelector(facultySelector);
    const [currentFacultyIndex, setCurrentFacultyIndex] = useState('');
    const [currentMajorIndex, setCurrentMajorIndex] = useState('');
    const [currentCohortIndex, setCurrentCohortIndex] = useState('');
    const currentFaculty = facultyData[currentFacultyIndex];
    const currentMajor = currentFaculty?.majors[currentMajorIndex];
    const currentCohort = currentMajor?.cohorts[currentCohortIndex];

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

            <select onInput={handleTalentEngineerType} value={talentEngineerType}>
                <option value="">Chọn Đối Tượng</option>
                {Object.keys(cohortValue).length > 0 && (
                    <Fragment>
                        <option value={VITE_APP_TALENT_ENGINEER_CODE}>Kỹ Sư Tài Năng</option>
                        <option value={VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE}>Xét Tuyển Bổ Sung</option>
                    </Fragment>
                )}
            </select>

            {setStatus && (
                <select value={statusValue} onChange={handleStatusValue}>
                    <option value="">Trạng Thái</option>
                    <option value={true}>Đang Hoạt Động</option>
                    <option value={false}>Đã Khóa</option>
                </select>
            )}
        </div>
    );
}

export default FacultyStudentFilter;
