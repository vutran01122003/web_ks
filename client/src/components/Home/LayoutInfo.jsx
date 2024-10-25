import Avatar from '../Account/ComponentAvatar';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';

const {
    VITE_APP_ADMIN_CODE,
    VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE,
    VITE_APP_TALENT_ENGINEER_CODE,
    VITE_APP_FACULTY_MANAGER_CODE
} = import.meta.env;

const LayoutInfo = ({ user, isDetailedRow }) => {
    const groupCode = user?.group.groupCode;
    let heading = 'Thông Tin Cá Nhân';

    switch (groupCode) {
        case VITE_APP_ADMIN_CODE:
            heading = 'Thông Tin Quản Trị Hệ Thống';
            break;
        case VITE_APP_FACULTY_MANAGER_CODE:
            heading = 'Thông Tin Giảng Viên';
            break;
        case VITE_APP_TALENT_ENGINEER_CODE:
        case VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE:
            heading = 'Thông Tin Sinh Viên';
            break;
        default:
            break;
    }

    const userDataList = [
        {
            label: 'Mã Số',
            value: user?.userId || 'Chưa Cập Nhật',
            roles: [],
            isShow: true
        },
        {
            label: 'Họ tên',
            value: toFullName({
                lastName: user.lastName,
                firstName: user.firstName
            }),
            roles: [],
            isShow: true
        },
        {
            label: 'Ngày sinh',
            value: user?.birthday ? new Date(user?.birthday).toLocaleDateString('en-GB') : 'Chưa Cập Nhật',
            roles: [],
            isShow: isDetailedRow ? false : true
        },
        {
            label: 'Khoa',
            value: user?.faculty ? capitalizeFirstLetter(user?.faculty) : 'Chưa Cập Nhật',
            roles: [
                VITE_APP_FACULTY_MANAGER_CODE,
                VITE_APP_TALENT_ENGINEER_CODE,
                VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE
            ],
            isShow: true
        },
        {
            label: 'Ngành',
            value: user?.major ? capitalizeFirstLetter(user?.major) : 'Chưa Cập Nhật',
            roles: [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE],
            isShow: isDetailedRow ? false : true
        }
    ];

    return (
        <div className={`container__info ${isDetailedRow ? 'inside_detailed_row_modal' : ''}`}>
            <header className="heading-4">{heading}</header>
            <div className="content">
                <div className="info__avatar">
                    <Avatar size={`large ${isDetailedRow ? 'medium' : ''}`} />
                </div>
                <div className="info__text">
                    {userDataList.map((userData, index) => {
                        if (userData.roles.includes(groupCode) || userData.roles.length === 0) {
                            return userData.isShow ? (
                                <div className="info_line" key={index}>
                                    <span className="info_line_label">{`${userData.label}: `}</span>
                                    <span className="info_line_value">{userData.value}</span>
                                </div>
                            ) : null;
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default LayoutInfo;
