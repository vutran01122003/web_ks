import React from 'react'
import { BsSun } from 'react-icons/bs';
import { PiUserCircleGear } from "react-icons/pi"
import { IoMdLogOut } from 'react-icons/io'
import { HiOutlineLogout } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/actions/authAction';
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { CiDark } from "react-icons/ci";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Modal } from 'antd';
import { useState } from 'react';

const ControlBoxAccount = ({ setState }) => {
    const dispatch = useDispatch();
    const [openHelp, setOpenHelp] = useState(false);
    const handleOpenModalHelp = ()=>{
        setState(false);
        setOpenHelp(true);
    }
    const handleOpenModalSetting = ()=>{
        setState(false);
    }

    const handleLogout = () => {
        dispatch(logout());
    }

    const LIST_CONTROL_ACCOUNT = [
        {
            id: 0,
            name_select: "Thông tin cá nhân",
            icon_before: <PiUserCircleGear />,
            toLink: "/profile",
        },
        // {
        //     id: 1,
        //     name_select: "Darkmode",
        //     icon_before: <CiDark />,
        // },
        {
            id: 2,
            name_select: "Cài đặt",
            icon_before: <IoSettingsOutline />,
            onClick:handleOpenModalSetting
        },
        {
            id: 3,
            name_select: "Hỗ trợ",
            icon_before: <IoIosHelpCircleOutline />,
            onClick:handleOpenModalHelp
        },

    ];

    const returnListControlAccount = LIST_CONTROL_ACCOUNT.map((item) => {
        const selToLink = item.toLink;
        return (
            <React.Fragment key={item.id}>
                {
                    selToLink ?
                        <Link
                            className='item_btn_control'
                            key={item.id}
                            to={item.toLink}
                            onClick={() => setState(false)}
                        >
                            {item.icon_before}
                            {item.name_select}
                        </Link>
                        :
                        <div className='item_btn_control' key={item.id} onClick={item.onClick}>
                            {item.icon_before}
                            {item.name_select}
                        </div>
                }
            </React.Fragment>
        )
    })
    return (
        <>
            <Modal
                title="Thông Tin Liên Hệ"
                centered
                open={openHelp}
                onCancel={() => setOpenHelp(false)}
                width={700}
                footer={false}
            >
                1. THÔNG TIN LIÊN LẠC: 099999999< br/>
                2. Email: abc@gmail.com <br/>
                3. Zalo: 09123123123
            </Modal>
            {returnListControlAccount}
            <div className="border__collpe"></div>
            <React.Fragment >
                <div className='item_btn_control' onClick={() => { setState(false); handleLogout() }}>
                    {<RiLogoutCircleRLine />}
                    {"Đăng xuất"}
                </div>
            </React.Fragment>
        </>
    )
}

export default ControlBoxAccount