import { Fragment, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { MdRemoveCircle } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import CreateCohortModal from '../Modal/CreateCohortModal';
import { capitalizeFirstLetter } from '../../utils/handleString';

function CohortComponent({ faculty }) {
    const [isDisplayCreateCohortModal, setIsDisplayCreateCohortModal] = useState(false);

    const handleToggleDisplayAddCohortModal = (facultyId) => {
        setIsDisplayCreateCohortModal((prev) => !prev);
    };

    return (
        <Fragment>
            {isDisplayCreateCohortModal && (
                <CreateCohortModal onHiddenModal={handleToggleDisplayAddCohortModal} faculty={faculty} />
            )}

            <div className="table_heading">
                <h3 className="heading">Danh Sách Khóa Sinh Viên</h3>
                <button className="create_major_btn" onClick={handleToggleDisplayAddCohortModal}>
                    <IoIosAddCircleOutline size={20} />
                    <span>Tạo Khóa Mới</span>
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Tên Khoa</th>
                        <th>Chuyên Ngành</th>
                        <th>Khóa Sinh Viên</th>
                        <th>Tình Trạng</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>

                <tbody>
                    {faculty.facultyData.reduce((arr, facultyItem) => {
                        const majors = facultyItem.majors;
                        if (majors.length === 0) return arr;

                        const cohortsLength = majors.reduce((total, major) => {
                            return total + major.cohorts.length;
                        }, 0);

                        return [
                            ...arr,
                            ...majors.reduce((arr, major, majorIndex) => {
                                console.log(majorIndex);
                                const cohorts = major.cohorts;

                                return [
                                    ...arr,
                                    cohorts.map((cohort, index) => {
                                        return (
                                            <tr key={cohort._id}>
                                                {majorIndex === 0 && index === 0 && (
                                                    <td rowSpan={cohortsLength}>
                                                        {capitalizeFirstLetter(facultyItem.facultyName)}
                                                    </td>
                                                )}

                                                {index === 0 && (
                                                    <td rowSpan={cohorts.length}>
                                                        <div className="major_item" key={major._id}>
                                                            <span>{capitalizeFirstLetter(major.majorName)}</span>
                                                        </div>
                                                    </td>
                                                )}

                                                <td>{cohort.cohortName}</td>
                                                <td className={`status ${cohort.isActive ? 'active' : 'inactive'}`}>
                                                    {cohort.isActive ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
                                                </td>
                                                <td className="interactive_btn_wrapper">
                                                    <div className="updated_btn">
                                                        <FaPen /> <span>Chỉnh Sửa Khóa</span>
                                                    </div>

                                                    <div className="delete_btn">
                                                        <MdRemoveCircle /> <span>Ẩn Khóa</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ];
                            }, [])
                        ];
                    }, [])}
                </tbody>
            </table>
        </Fragment>
    );
}

export default CohortComponent;
