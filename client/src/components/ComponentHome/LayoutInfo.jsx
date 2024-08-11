import Avatar from '../ComponentAccount/ComponentAvatar';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';

const LayoutInfo = ({ user, isDetailedRow }) => {
    const { VITE_APP_ADMIN_CODE, VITE_APP_TALENTED_ENGINEER_CODE, VITE_APP_FACULTY_MANAGER_CODE } = import.meta.env;
    const groupCode = user?.group.groupCode;

    let heading = 'Thông Tin Cá Nhân';

    switch (groupCode) {
        case VITE_APP_ADMIN_CODE:
            heading = 'Thông Tin Quản Trị Hệ Thống';
            break;
        case VITE_APP_FACULTY_MANAGER_CODE:
            heading = 'Thông Tin Giảng Viên';
            break;
        case VITE_APP_TALENTED_ENGINEER_CODE:
            heading = 'Thông Tin Sinh Viên';
            break;
        default:
            break;
    }

    const userDataList = [
        {
            label: 'Mã Số',
            value: user?.userId || 'Chưa Cập Nhật',
            isShow: true
        },
        {
            label: 'Họ tên',
            value: toFullName({
                lastName: user.lastName,
                firstName: user.firstName
            }),
            isShow: true
        },
        {
            label: 'Ngày sinh',
            value: user?.birthday ? new Date(user?.birthday).toLocaleDateString('en-GB') : 'Chưa Cập Nhật',
            isShow: isDetailedRow ? false : true
        },
        {
            label: 'Khoa',
            value: user?.faculty ? capitalizeFirstLetter(user?.faculty) : 'Chưa Cập Nhật',
            role: VITE_APP_FACULTY_MANAGER_CODE,
            isShow: true
        },
        {
            label: 'Ngành',
            value: user?.major ? capitalizeFirstLetter(user?.major) : 'Chưa Cập Nhật',
            role: VITE_APP_TALENTED_ENGINEER_CODE,
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
                        if ((userData?.role && groupCode === userData?.role) || !userData?.role) {
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
