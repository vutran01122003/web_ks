import React from 'react';
import ComponentAvatar from '../ComponentAvatar/ComponentAvatar';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

const LayoutInfo = ({ user, isDetailedRow }) => {
    const heading =
        user?.roles.includes('0004') || user?.roles.includes('0003')
            ? 'Thông Tin Giảng Viên'
            : 'Thông Tin Sinh Viên';

    const userDataList = [
        {
            label: user?.roles.includes('0004') || user?.roles.includes('0003') ? 'MSGV' : 'MSSV',
            value: user?.studentId || 'Chưa cập nhật',
            isShow: true
        },
        {
            label: 'Họ tên',
            value: user?.fullName ? capitalizeFirstLetter(user?.fullName) : 'Chưa cập nhật',
            isShow: true
        },
        {
            label: 'Ngày sinh',
            value: new Date(user.birthday).toLocaleDateString('en-GB') || 'Chưa cập nhật',
            isShow: isDetailedRow ? false : true
        },
        {
            label: 'Khoa',
            value: user?.faculty ? capitalizeFirstLetter(user?.faculty) : 'Chưa cập nhật',
            role: '0004',
            isShow: true
        },
        {
            label: 'Ngành',
            value: capitalizeFirstLetter(user?.major) || 'Chưa cập nhật',
            role: '0002',
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
                        if (
                            (userData?.role && user?.roles.includes(userData?.role)) ||
                            !userData?.role
                        ) {
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
