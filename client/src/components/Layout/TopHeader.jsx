import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { RiAdminLine } from 'react-icons/ri';
import { IoNotificationsOutline } from 'react-icons/io5';
import Notification from '../Notification/Notification';
import { notificationSelector } from '../../redux/selector';
import Account from '../Account/ComponentAccount';

const { VITE_APP_MAJOR_MANAGER_CODE, VITE_APP_ADMIN_CODE } = import.meta.env;

const TopHeader = ({ auth }) => {
    const user = auth?.user;
    const groupCodeList = user?.groups.map((group) => group.groupCode);

    const [dropBoxAccount, setDropBoxAccount] = useState(false);
    const [dropBoxNotification, setDropBoxNotification] = useState(false);
    const notification = useSelector(notificationSelector);

    let refBoxAccount = useRef();
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
            if (!refBoxNotification.current.contains(e.target)) setDropBoxNotification(false);
        };
        document.addEventListener('mousedown', hanlder);
        return () => document.removeEventListener('mousedown', hanlder);
    });

    const determineAuth =
        groupCodeList.includes(VITE_APP_ADMIN_CODE) || groupCodeList.includes(VITE_APP_MAJOR_MANAGER_CODE);

    return (
        <div className="container__header">
            <div className="tr__header">
                <div className="flex__line">
                    <div className="line__firts">
                        {groupCodeList.includes(VITE_APP_ADMIN_CODE) ? (
                            <div className="khoa_style">QUẢN TRỊ VIÊN HỆ THỐNG</div>
                        ) : (
                            <div className="khoa_style">KHOA : {user?.faculty?.facultyName}</div>
                        )}
                    </div>

                    <div className="box__control">
                        {determineAuth ? (
                            <Tooltip placement="bottom" title={user?.groups[0].name.toUpperCase()}>
                                <div className="border__text--role ">
                                    <RiAdminLine />
                                </div>
                            </Tooltip>
                        ) : null}

                        <div className="btn__border" ref={refBoxNotification}>
                            <div className="flex__center" onClick={handleToggleVisibleNotificationModal}>
                                <IoNotificationsOutline />
                                {notification.unreadNotificationNum !== 0 && (
                                    <div className="length__noti">
                                        <span className="dots__color">
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

                        {auth?.user && (
                            <Account
                                userInfo={auth?.user}
                                refBoxAccount={refBoxAccount}
                                setDropBoxAccount={setDropBoxAccount}
                                dropBoxAccount={dropBoxAccount}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
