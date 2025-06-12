import { Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineHelpOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdLogout } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { changePassword, logout } from '../../redux/actions/authAction';
import GLOBALTYPES from '../../redux/actions/globalTypes';

const ControlBoxAccount = ({ setState }) => {
    const dispatch = useDispatch();
    const [openHelp, setOpenHelp] = useState(false);
    const [data, setData] = useState('');
    const [visibleChangePasswordModal, setVisibleChangePasswordModal] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);

    const resetData = () => {
        setData('');
        setVisiblePassword(false);
        setVisibleChangePasswordModal(false);
    };

    const handleToggleVisiblePassword = () => {
        setVisiblePassword((prev) => !prev);
    };

    const handleChangeData = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleChangePassword = () => {
        if (!data.password || !data.newPassword || !data.newConfirmPassword) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });

            return;
        }

        if (data.newPassword !== data.newConfirmPassword) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Mật khẩu không giống nhau'
                }
            });

            return;
        }

        dispatch(
            changePassword({
                password: data.password,
                newPassword: data.newPassword
            })
        );

        resetData();
    };

    const handleOpenModalHelp = () => {
        setState(false);
        setOpenHelp(true);
    };

    const handleOpenModalChangePassword = () => {
        setState(false);
        setVisibleChangePasswordModal(true);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const LIST_CONTROL_ACCOUNT = [
        {
            name_select: 'Thông tin cá nhân',
            icon_before: <FaRegUser size={20} />,
            toLink: '/profile'
        },
        {
            name_select: 'Đổi mật khẩu',
            icon_before: <RiLockPasswordLine />,
            onClick: handleOpenModalChangePassword
        },
        {
            name_select: 'Hỗ trợ',
            icon_before: <MdOutlineHelpOutline />,
            onClick: handleOpenModalHelp
        }
    ];

    const returnListControlAccount = LIST_CONTROL_ACCOUNT.map((item, index) => {
        const selToLink = item.toLink;
        return selToLink ? (
            <Link className="item_btn_control" key={index} to={item.toLink} onClick={() => setState(false)}>
                {item.icon_before}
                {item.name_select}
            </Link>
        ) : (
            <div className="item_btn_control" key={index} onClick={item.onClick}>
                {item.icon_before}
                {item.name_select}
            </div>
        );
    });

    return (
        <Fragment>
            <Modal
                title="Thông Tin Liên Hệ"
                centered
                open={openHelp}
                onCancel={() => setOpenHelp(false)}
                width={700}
                footer={false}
            >
                <div className="contact_modal">
                    <span>Ngô Hữu Dũng - Chủ nhiệm ngành HTTT - ngohuudung@iuh.edu.vn </span>
                    <span>Nguyễn Thị Hạnh - Chủ nhiệm ngành KTPM - ngthihanh@iuh.edu.vn</span>
                </div>
            </Modal>

            <Modal
                title="Thay Đổi Mật Khẩu"
                centered
                open={visibleChangePasswordModal}
                onCancel={() => setVisibleChangePasswordModal(false)}
                width={700}
                footer={false}
            >
                <div className="change_password_modal">
                    <div className="input_item">
                        <label>Mật khẩu hiện tại:</label>
                        <input
                            name="password"
                            type={visiblePassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu hiện tại"
                            value={data.password || ''}
                            onChange={handleChangeData}
                        />
                    </div>

                    <div className="input_item">
                        <label>Mật khẩu mới:</label>
                        <input
                            type={visiblePassword ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="Nhập mật khẩu mới"
                            value={data.newPassword || ''}
                            onChange={handleChangeData}
                        />
                    </div>

                    <div className="input_item">
                        <label>Nhập lại mật khẩu mới:</label>
                        <input
                            type={visiblePassword ? 'text' : 'password'}
                            name="newConfirmPassword"
                            placeholder="Nhập lại mật khẩu mới"
                            value={data.newConfirmPassword || ''}
                            onChange={handleChangeData}
                        />
                    </div>

                    <div className="password_display_input">
                        <input
                            type="checkbox"
                            checked={visiblePassword}
                            onClick={handleToggleVisiblePassword}
                            readOnly
                        />
                        <span>{visiblePassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</span>
                    </div>
                    <button onClick={handleChangePassword}>Cập nhật mật khẩu</button>
                </div>
            </Modal>

            {returnListControlAccount}
            <div
                className="item_btn_control"
                onClick={() => {
                    setState(false);
                    handleLogout();
                }}
            >
                {<MdLogout />}
                {'Đăng xuất'}
            </div>
        </Fragment>
    );
};

export default ControlBoxAccount;
