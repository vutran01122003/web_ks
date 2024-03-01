import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { RiAdminLine } from 'react-icons/ri';
import { TbGridDots } from 'react-icons/tb';
import { IoNotificationsOutline } from 'react-icons/io5';
import ControlBoxAccount from './ComponentControl/ControlBoxAccount';
import Avatar from '../ComponentAvatar/ComponentAvatar';
import ImageMessenger from '../../assets/images/image_messenger.png';
import ImageTask from '../../assets/images/image_task.png';
import ImageNote from '../../assets/images/image_note.png';
import Notification from './ComponentNotification/Notification';
import { notificationSelector } from '../../redux/selector';

const TopHeader = ({ auth }) => {
    const [dropBoxAccount, setDropBoxAccount] = useState(false);
    const [dropBoxProductList, setDropBoxProductList] = useState(false);
    const [dropBoxNotification, setDropBoxNotification] = useState(false);
    const notification = useSelector(notificationSelector);

    let refBoxAccount = useRef();
    let refBoxProductList = useRef();
    let refBoxNotification = useRef();

    const handleToggleVisibleNotificationModal = () => {
        setDropBoxNotification((prev) => !prev);
    };

    useEffect(() => {
        let hanlder = (e) => {
            if (!refBoxAccount.current.contains(e.target)) setDropBoxAccount(false);
        };
        document.addEventListener('mousedown', hanlder);
        return () => document.removeEventListener('mousedown', hanlder);
    });

    useEffect(() => {
        let hanlder = (e) => {
            if (!refBoxProductList.current.contains(e.target)) setDropBoxProductList(false);
        };
        document.addEventListener('mousedown', hanlder);
        return () => document.removeEventListener('mousedown', hanlder);
    });

    useEffect(() => {
        let hanlder = (e) => {
            if (!refBoxNotification.current.contains(e.target)) setDropBoxNotification(false);
        };
        document.addEventListener('mousedown', hanlder);
        return () => document.removeEventListener('mousedown', hanlder);
    });

    const determineAuth = auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003');

    const ARRAY_LIST_PRODUCT = [
        {
            id: 0,
            name_production: 'IUH Chat',
            icon_size: ImageMessenger,
            to_link: '/chat'
        },
        {
            id: 1,
            name_production: 'Task',
            icon_size: ImageTask,
            to_link: '#'
        },
        {
            id: 2,
            name_production: 'Note',
            icon_size: ImageNote,
            to_link: '#'
        }
    ];
    const returnListProduct = ARRAY_LIST_PRODUCT.map((item) => {
        return (
            <Link className='item__product' key={item.id} to={item.to_link}>
                <img src={item.icon_size} className='img__list--product' />
                <div className='text__list--product'>{item.name_production}</div>
            </Link>
        );
    });

    return (
        <div className={`container__header ${determineAuth ? 'header_admin' : ''}`}>
            <div className='tr__header'>
                <div className='flex__line'>
                    <div className='line__firts'>
                        <div className='khoa_style'>KHOA : {auth?.user?.faculty}</div>
                    </div>
                    <div className='box__control'>
                        {determineAuth ? (
                            <Tooltip placement='bottom' title={auth?.user?.group.name.toUpperCase()}>
                                <div className='border__text--role '>
                                    <RiAdminLine />
                                </div>
                            </Tooltip>
                        ) : null}

                        <div className='btn__border' ref={refBoxProductList}>
                            <div className='flex__center' onClick={() => setDropBoxProductList(!dropBoxProductList)}>
                                <TbGridDots />
                            </div>
                            <div
                                className={`box__drop--product-list  ${
                                    dropBoxProductList ? 'active_drop_box' : 'unactive_drop_box'
                                }`}
                            >
                                {returnListProduct}
                            </div>
                        </div>

                        <div className='btn__border' ref={refBoxNotification}>
                            <div className='flex__center' onClick={handleToggleVisibleNotificationModal}>
                                <IoNotificationsOutline />
                                {notification.unreadNotificationNum !== 0 && (
                                    <div className='length__noti'>
                                        <span className='dots__color'>
                                            {notification.unreadNotificationNum > 9
                                                ? '9+'
                                                : notification.unreadNotificationNum}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {dropBoxNotification && (
                                <Notification
                                    auth={auth}
                                    notification={notification}
                                    handleToggleVisibleNotificationModal={handleToggleVisibleNotificationModal}
                                />
                            )}
                        </div>

                        <div className='border__account' ref={refBoxAccount}>
                            <div className='btn_dropdown' onClick={() => setDropBoxAccount(!dropBoxAccount)}>
                                <div className='info__user'>
                                    <div id='name__user'>{auth?.user?.fullName}</div>
                                    <div id='studentId__user'>{'ID : ' + auth?.user?.userId}</div>
                                </div>
                                <Avatar
                                    url={auth?.user.avatar}
                                    size='small'
                                    className={dropBoxAccount ? 'border__avatar' : ''}
                                />
                            </div>
                            <div
                                className={`box__drop--account ${
                                    dropBoxAccount ? 'active_drop_box' : 'unactive_drop_box'
                                }`}
                            >
                                <div className='pd__select'>
                                    <ControlBoxAccount setState={setDropBoxAccount} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
