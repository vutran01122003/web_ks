import Avatar from '../Account/ComponentAvatar';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE, VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_MAJOR_MANAGER_CODE } =
    import.meta.env;

const LayoutInfo = ({ user, isDetailedRow }) => {
    const groupCodeList = user?.groups.map((group) => group.groupCode);
    let heading = 'Thông Tin Cá Nhân';

    switch (groupCodeList[0]) {
        case '001': {
            heading = 'Kỹ Sư Tài Năng Tạm Thời';
            break;
        }
        case '002': {
            heading = `Kỹ Sư Tài Năng ${!user.isActive ? '(Tài Khoản Đã Khóa)' : ''}`;
            break;
        }
        case '003': {
            heading = 'Quản Lý Kỹ Sư Tài Năng';
            break;
        }
        case '004': {
            heading = 'Quản Trị Hệ Thống';
            break;
        }
        default: {
            heading = 'Thông Tin Cá Nhân';
            break;
        }
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
            label: 'Ngành',
            value: user?.major.majorName ? capitalizeFirstLetter(user?.major.majorName) : 'Chưa Cập Nhật',
            roles: [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE],
            isShow: isDetailedRow ? false : true
        },
        {
            label: 'Khóa',
            value: user?.cohort.cohortName ? capitalizeFirstLetter(user?.cohort.cohortName) : 'Chưa Cập Nhật',
            roles: [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE],
            isShow: true
        },
        {
            label: 'Năm',
            value: user?.major.majorName ? user?.cohort?.currentLevelYear : 'Chưa Cập Nhật',
            roles: [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE],
            isShow: true
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
                        const roles = userData.roles;
                        const mergedRoles = Array.from(new Set([...roles, ...groupCodeList]));

                        if (mergedRoles.length < groupCodeList.length + roles.length || roles.length === 0) {
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
