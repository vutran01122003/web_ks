import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, facultySelector, activitiesSelector } from '../../redux/selector';
import { getActivities } from '../../redux/actions/activitiesAction';
import { getAllFaculties } from '../../redux/actions/facultyAction';
import { capitalizeFirstLetter } from '../../utils/handleString';
import GLOBALTYPES from '../../redux/actions/globalTypes';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE, VITE_APP_TALENT_ENGINEER_CODE } = import.meta.env;

function SearchFilterComponent({
    setMajorValue,
    setCohortValue,
    setTalentEngineerType,
    setCurrentLevelYearValue,
    setActivityValue,
    setStatus,
    majorValue,
    cohortValue,
    talentEngineerType,
    currentLevelYearValue,
    activityValue,
    statusValue
}) {
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const facultyState = useSelector(facultySelector);
    const activities = useSelector(activitiesSelector);
    const [majorValueList, setMajorValueList] = useState([]);

    const handleMajorValue = (e) => {
        const value = e.target.value;

        setCohortValue('');
        setTalentEngineerType('');

        if (setCurrentLevelYearValue) setCurrentLevelYearValue('');
        if (setActivityValue) setActivityValue('');
        if (!value) {
            setMajorValue('');
            return;
        }

        setMajorValue(JSON.parse(value));
    };

    const handleCohortValue = (e) => {
        const value = e.target.value;

        setTalentEngineerType('');

        if (setCurrentLevelYearValue) setCurrentLevelYearValue('');
        if (setActivityValue) setActivityValue('');
        if (!value) {
            setCohortValue('');
            return;
        }

        setCohortValue(JSON.parse(e.target.value));
    };

    const handleTalentEngineerType = (e) => {
        const value = e.target.value;

        if (setCurrentLevelYearValue) setCurrentLevelYearValue('');
        if (setActivityValue) setActivityValue('');
        if (!value) {
            setTalentEngineerType('');
            return;
        }

        setTalentEngineerType(value);
    };

    const handleCurrentLevelYear = (e) => {
        const value = e.target.value;

        if (setActivityValue) setActivityValue('');
        if (!value) {
            setCurrentLevelYearValue('');
            return;
        }

        setCurrentLevelYearValue(+value);
    };

    const handleActivityValue = (e) => {
        setActivityValue(e.target.value);
    };

    const handleStatusValue = (e) => {
        setStatus(e.target.value);
    };

    useEffect(() => {
        if (facultyState.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    useEffect(() => {
        const facultyData = facultyState?.faculty;
        if (facultyData) {
            setMajorValueList(facultyData.majors);
        }
    }, [facultyState?.faculty]);

    useEffect(() => {
        if (setActivityValue) {
            if (majorValue?.majorName && cohortValue?.cohortName && currentLevelYearValue > 0 && talentEngineerType) {
                dispatch(
                    getActivities({
                        pageStudentCohort: cohortValue.cohortName,
                        pageStudentLevelYear: currentLevelYearValue,
                        pageStudentMajor: majorValue.majorName,
                        pageTalentEngineerType: talentEngineerType
                    })
                );
            } else {
                dispatch({
                    type: GLOBALTYPES.ACTIVITIES.RESET_ACTIVITIES
                });
            }
        }
    }, [majorValue?.majorName, cohortValue?.cohortName, currentLevelYearValue, talentEngineerType]);

    return (
        <div className="search_filter_container">
            <div className="search_filter_wrapper">
                <select value={JSON.stringify(majorValue)} onInput={handleMajorValue}>
                    <option value="">Chọn Chuyên Ngành</option>
                    {majorValueList.map((major, index) => (
                        <option key={index} value={JSON.stringify(major)}>
                            {capitalizeFirstLetter(major.majorName)}
                        </option>
                    ))}
                </select>

                <select onInput={handleCohortValue} value={JSON.stringify(cohortValue)}>
                    <option value="">Chọn khóa</option>
                    {majorValue?.cohortList &&
                        majorValue?.cohortList.length > 0 &&
                        majorValue?.cohortList.map((cohort, index) => (
                            <option key={index} value={JSON.stringify(cohort)}>
                                {`Khóa ${cohort.cohortName}`}
                            </option>
                        ))}
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

                {setCurrentLevelYearValue &&
                    (talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE ? (
                        <input
                            type="number"
                            min={1}
                            max={15}
                            placeholder="Nhập Năm học"
                            onChange={handleCurrentLevelYear}
                            value={currentLevelYearValue}
                        />
                    ) : (
                        <select onInput={handleCurrentLevelYear} value={currentLevelYearValue}>
                            <option value={''}>Chọn Năm</option>
                            {cohortValue?.currentLevelYear &&
                                new Array(cohortValue.currentLevelYear).fill(0).map((_, index) => {
                                    const levelYear = cohortValue.currentLevelYear - index;
                                    return (
                                        <option key={index} value={levelYear}>
                                            {`Năm ${levelYear} (${levelYear === cohortValue.currentLevelYear ? 'Hiện tại' : 'Đã kết thúc'})`}
                                        </option>
                                    );
                                })}
                        </select>
                    ))}

                {setActivityValue && (
                    <select value={activityValue} onInput={handleActivityValue}>
                        <option value="">Chọn Hoạt Động</option>
                        {currentLevelYearValue &&
                            activities.length > 0 &&
                            activities.map((activity, index) => (
                                <option key={index} value={activity}>
                                    {capitalizeFirstLetter(activity)}
                                </option>
                            ))}
                    </select>
                )}
            </div>
        </div>
    );
}

export default SearchFilterComponent;
