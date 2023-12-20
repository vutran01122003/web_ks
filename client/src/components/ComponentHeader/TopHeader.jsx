import React, { useEffect, useRef, useState } from 'react'
import { IoNotificationsSharp } from 'react-icons/io5';
import { BsDot } from 'react-icons/bs';
import { ImSearch } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { TbGridDots } from "react-icons/tb";
import ControlBoxAccount from './ComponentControl/ControlBoxAccount';
import Avatar from '../ComponentAvatar/ComponentAvatar';
import { RiAdminFill } from "react-icons/ri";

import ImageMessenger from "../../assets/images/image_messenger.png";
import ImageTask from "../../assets/images/image_task.png";
import ImageNote from "../../assets/images/image_note.png";
import FormControl from '../ComponentForm/FormControl';
import { Button, Modal, Tooltip } from 'antd';
import { useMemo } from 'react';

const TopHeader = ({ auth }) => {
    const [dropBoxAccount, setDropBoxAccount] = useState(false);
    const [dropBoxProductList, setDropBoxProductList] = useState(false);
    const [dropBoxNotification, setDropBoxNotification] = useState(false);

    let refBoxAccount = useRef();
    let refBoxProductList = useRef();
    let refBoxNotification = useRef();

    useEffect(() => {
        let hanlder = (e) => {
            if (!refBoxAccount.current.contains(e.target))
                setDropBoxAccount(false);
        }
        document.addEventListener("mousedown", hanlder);
        return () => document.removeEventListener("mousedown", hanlder);
    });

    useEffect(() => {
        let hanlder = (e) => {
            if (!refBoxProductList.current.contains(e.target))
                setDropBoxProductList(false);
        }
        document.addEventListener("mousedown", hanlder);
        return () => document.removeEventListener("mousedown", hanlder);
    });

    useEffect(() => {
        let hanlder = (e) => {
            if (!refBoxNotification.current.contains(e.target))
                setDropBoxNotification(false);
        }
        document.addEventListener("mousedown", hanlder);
        return () => document.removeEventListener("mousedown", hanlder);
    });

    const determineAuth = auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003');

    const ARRAY_LIST_PRODUCT = [
        {
            id: 0,
            name_production: "Messenger",
            icon_size: ImageMessenger,
            to_link: "#"
        },
        {
            id: 1,
            name_production: "Task",
            icon_size: ImageTask,
            to_link: "#"
        },
        {
            id: 2,
            name_production: "Note",
            icon_size: ImageNote,
            to_link: "#"
        },
    ];
    const returnListProduct = ARRAY_LIST_PRODUCT.map((item) => {
        return (
            <Link className='item__product' key={item.id} to={item.to_link}>
                <img src={item.icon_size} className='img__list--product' />
                <div className="text__list--product">{item.name_production}</div>
            </Link>
        )
    });

    const [arrow, setArrow] = useState('Show');
    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    return (
        <div className='container__header'>
            <div className="tr__header">
                <div className="flex__line">
                    <div className="line__firts">


                        {/* <FormControl
                            iconBefore={<ImSearch />}
                            placeholder="Search"
                            className="box_search"
                            id="search_box"
                        /> */}
                        <div className="khoa_style">
                            KHOA : {auth?.user?.faculty}
                        </div>
                    </div>
                    <div className="box__control">

                        {determineAuth ?
                            <Tooltip 
                            placement="bottom" 
                            title="ĐANG TƯ CÁCH QUYỀN QUẢN TRỊ HỆ THỐNG" 
                            arrow={mergedArrow}
                            >
                                <div className='border__text--role '>
                                    <RiAdminFill />
                                </div>
                            </Tooltip>

                            : ""}

                        <div className="btn__border" ref={refBoxProductList}>
                            <div
                                className="flex__center"
                                onClick={() => setDropBoxProductList(!dropBoxProductList)}>
                                <TbGridDots />
                            </div>
                            <div
                                className={`box__drop--product-list  ${dropBoxProductList ? "active_drop_box" : "unactive_drop_box"}`}
                            >
                                {returnListProduct}
                            </div>
                        </div>


                        <div className="btn__border" ref={refBoxNotification}>
                            <div className="flex__center" onClick={() => setDropBoxNotification(!dropBoxNotification)}>
                                <IoNotificationsSharp />
                                <div className="length__noti">
                                    <span className='dots__color'></span>
                                </div>
                            </div>
                            <div className={`box__drop--notification ${dropBoxNotification ? "active_drop_box" : "unactive_drop_box"}`}>

                            </div>
                        </div>


                        <div className="border__account" ref={refBoxAccount}>
                            <div className="btn_dropdown" onClick={() => setDropBoxAccount(!dropBoxAccount)}>
                                <div className="info__user">
                                    <div id='name__user'>{auth?.user?.fullName}</div>
                                    <div id='studentId__user'>{"ID : " + auth?.user?.studentId}</div>
                                </div>
                                <Avatar url={auth?.user.avatar} size="small" className={dropBoxAccount ? "border__avatar" : ""} />
                            </div>
                            <div
                                className={`box__drop--account ${dropBoxAccount ? "active_drop_box" : "unactive_drop_box"}`}
                            >
                                <div className="pd__select">
                                    <ControlBoxAccount setState={setDropBoxAccount} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopHeader