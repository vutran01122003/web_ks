import React from 'react';
import ComponentAvatar from '../ComponentAvatar/ComponentAvatar';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

const LayoutInfo = ({ user, isDetailedRow }) => {
    const { VITE_APP_ADMIN_CODE, VITE_APP_TALENTED_ENGINEER_CODE, VITE_APP_FACULTY_MANAGER_CODE } = import.meta.env;
    const groupCode = user?.group.groupCode;

    let heading = 'Thông Tin Người Dùng';

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
            value: user?.userId || 'Chưa cập nhật',
            isShow: true
        },
        {
            label: 'Họ tên',
            value: user?.fullName ? capitalizeFirstLetter(user?.fullName) : 'Chưa cập nhật',
            isShow: true
        },
        {
            label: 'Ngày sinh',
            value: user?.birthday ? new Date(user?.birthday).toLocaleDateString('en-GB') : 'Chưa cập nhật',
            isShow: isDetailedRow ? false : true
        },
        {
            label: 'Khoa',
            value: user?.faculty ? capitalizeFirstLetter(user?.faculty) : 'Chưa cập nhật',
            role: VITE_APP_FACULTY_MANAGER_CODE,
            isShow: true
        },
        {
            label: 'Ngành',
            value: user?.major ? capitalizeFirstLetter(user?.major) : 'Chưa cập nhật',
            role: VITE_APP_TALENTED_ENGINEER_CODE,
            isShow: isDetailedRow ? false : true
        }
    ];

    return (
        <div className={`container__info ${isDetailedRow ? 'inside_detailed_row_modal' : ''}`}>
            <header className='heading-4'>{heading}</header>
            <div className='content'>
                <div className='info__avatar'>
                    <ComponentAvatar size={`large ${isDetailedRow ? 'medium' : ''}`} />
                </div>
                <div className='info__text'>
                    {userDataList.map((userData, index) => {
                        if ((userData?.role && groupCode === userData?.role) || !userData?.role) {
                            return userData.isShow ? (
                                <div className='info_line' key={index}>
                                    <span className='info_line_label'>{`${userData.label}: `}</span>
                                    <span className='info_line_value'>{userData.value}</span>
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
