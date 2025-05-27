import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { facultySelector, activitiesSelector } from '../../redux/selector';
import { getActivities } from '../../redux/actions/activitiesAction';
import { capitalizeFirstLetter } from '../../utils/handleString';
import GLOBALTYPES from '../../redux/actions/globalTypes';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE, VITE_APP_TALENT_ENGINEER_CODE } = import.meta.env;

function SearchFilterComponent({
    facultyData,
    setFacultyValue,
    setMajorValue,
    setCohortValue,
    setTalentEngineerType,
    setCurrentLevelYearValue,
    setActivityName,
    setStatus,
    facultyValue,
    majorValue,
    cohortValue,
    talentEngineerType,
    currentLevelYearValue,
    activityName,
    statusValue,
    userId,
    handleChangeUserId
}) {
    console.log(facultyData);
    const dispatch = useDispatch();
    const facultyState = useSelector(facultySelector);
    const activities = useSelector(activitiesSelector);
    const majorValueList = facultyData ? facultyValue?.majors || [] : facultyState?.majors;
    const isTemporaryEngineer = talentEngineerType === VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE;

    const handleFacultyValue = (e) => {
        const value = e.target.value;

        setMajorValue('');
        setCohortValue('');
        setTalentEngineerType('');

        if (setCurrentLevelYearValue) setCurrentLevelYearValue('');
        if (setActivityName) setActivityName('');
        if (!value) {
            setMajorValue('');
            return;
        }

        setFacultyValue(JSON.parse(value));
    };

    const handleMajorValue = (e) => {
        const value = e.target.value;

        setCohortValue('');
        setTalentEngineerType('');

        if (setCurrentLevelYearValue) setCurrentLevelYearValue('');
        if (setActivityName) setActivityName('');
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
        if (setActivityName) setActivityName('');
        if (!value) {
            setCohortValue('');
            return;
        }

        setCohortValue(JSON.parse(e.target.value));
    };

    const handleTalentEngineerType = (e) => {
        const value = e.target.value;

        if (setCurrentLevelYearValue) setCurrentLevelYearValue('');
        if (setActivityName) setActivityName('');
        if (!value) {
            setTalentEngineerType('');
            return;
        }

        setTalentEngineerType(value);
    };

    const handleCurrentLevelYear = (e) => {
        const value = e.target.value;

        if (setActivityName) setActivityName('');
        if (!value) {
            setCurrentLevelYearValue('');
            return;
        }

        setCurrentLevelYearValue(+value);
    };

    const onChangeActivityName = (e) => {
        setActivityName(e.target.value);
    };

    const handleStatusValue = (e) => {
        setStatus(e.target.value);
    };

    useEffect(() => {
        if (setActivityName) {
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
                {setFacultyValue && (
                    <select value={JSON.stringify(facultyValue)} onInput={handleFacultyValue}>
                        <option value="">Chọn Chuyên Ngành</option>
                        {facultyData.map((faculty, index) => (
                            <option key={index} value={JSON.stringify(faculty)}>
                                {capitalizeFirstLetter(faculty.facultyName)}
                            </option>
                        ))}
                    </select>
                )}

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
                    {majorValue?.cohorts &&
                        majorValue?.cohorts.length > 0 &&
                        majorValue?.cohorts.map((_, index) => {
                            const cohorts = majorValue?.cohorts;
                            const length = cohorts.length;
                            return (
                                <option key={index} value={JSON.stringify(cohorts[length - index - 1])}>
                                    {`Khóa ${cohorts[length - index - 1].cohortName}`}
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

                {setCurrentLevelYearValue &&
                    (talentEngineerType && isTemporaryEngineer ? (
                        <select onInput={handleCurrentLevelYear} value={currentLevelYearValue}>
                            <option value={''}>{`Chọn Năm`}</option>
                            {cohortValue?.additionalRegisterInfo?.levelYear ? (
                                new Array(cohortValue.additionalRegisterInfo.levelYear).fill(0).map((_, index) => {
                                    const currentAdditionalLevelYear = cohortValue.additionalRegisterInfo.levelYear;
                                    const isActive = cohortValue.additionalRegisterInfo.isActive;
                                    const levelYear = currentAdditionalLevelYear - index;

                                    return (
                                        <option key={index} value={levelYear}>
                                            {`Năm ${levelYear} ${levelYear === currentAdditionalLevelYear && isActive ? '(Đang hoạt động)' : '(Đã kết thúc)'}`}
                                        </option>
                                    );
                                })
                            ) : (
                                <option value={1}>Năm 1</option>
                            )}
                        </select>
                    ) : (
                        <select onInput={handleCurrentLevelYear} value={currentLevelYearValue}>
                            <option value={''}>{`Chọn Năm`}</option>
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

                {setActivityName && (
                    <select value={activityName} onInput={onChangeActivityName}>
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

                {handleChangeUserId && (
                    <input
                        className="search_input"
                        type="text"
                        name="userId"
                        value={userId}
                        placeholder="Nhập Mã Sinh Viên"
                        onChange={handleChangeUserId}
                    />
                )}
            </div>
        </div>
    );
}

export default SearchFilterComponent;
