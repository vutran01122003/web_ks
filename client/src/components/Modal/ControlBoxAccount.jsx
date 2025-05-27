import React, { Fragment } from 'react';
import { PiUserCircleGear } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosHelpCircleOutline } from 'react-icons/io';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { Modal } from 'antd';
import { useState } from 'react';

const ControlBoxAccount = ({ setState }) => {
    const dispatch = useDispatch();
    const [openHelp, setOpenHelp] = useState(false);
    const handleOpenModalHelp = () => {
        setState(false);
        setOpenHelp(true);
    };
    const handleOpenModalSetting = () => {
        setState(false);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const LIST_CONTROL_ACCOUNT = [
        {
            name_select: 'Thông tin cá nhân',
            icon_before: <PiUserCircleGear />,
            toLink: '/profile'
        },
        {
            name_select: 'Hỗ trợ',
            icon_before: <IoIosHelpCircleOutline />,
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
                1. THÔNG TIN LIÊN LẠC: 099999999
                <br />
                2. Email: abc@gmail.com <br />
                3. Zalo: 09123123123
            </Modal>

            {returnListControlAccount}
            <div
                className="item_btn_control"
                onClick={() => {
                    setState(false);
                    handleLogout();
                }}
            >
                {<RiLogoutCircleRLine />}
                {'Đăng xuất'}
            </div>
        </Fragment>
    );
};

export default ControlBoxAccount;
