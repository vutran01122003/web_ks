import Tippy from '@tippyjs/react/headless';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { IoMdMore } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { TfiMoreAlt } from 'react-icons/tfi';
import { TiMediaRecord } from 'react-icons/ti';
import { AiFillDelete } from 'react-icons/ai';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    updateReadStatus,
    deleteNotification,
    markAllAsRead,
    deleteAllNotification,
    getNotifications
} from '../../redux/actions/notifyAction';

function Notification({ notification, auth, handleToggleVisibleNotificationModal }) {
    const user = auth?.user;
    const dispatch = useDispatch();
    const notificationRef = useRef();
    const observer = useRef();
    const [visibleMoreModal, setVisibleMoreModal] = useState(false);
    const [currentNotificationId, setCurrentNotificationId] = useState(null);
    const [visibleNtfItemMoreModal, setvisibleNtfItemMoreModal] = useState(false);

    const handleScrollToLastNotificationItemRef = useCallback(
        (elem) => {
            if (notification.isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !notification.maxPage) {
                    dispatch(
                        getNotifications({
                            recipientId: user._id,
                            page: notification.page + 1,
                            limit: 5,
                            currentNumNotifications: notification.currentNumNotifications
                        })
                    );
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [
            user._id,
            notification.isLoading,
            notification.page,
            notification.maxPage,
            notification.currentNumNotifications
        ]
    );

    const setCurrentElemRef = (e) => {
        notificationRef.current = e.currentTarget;
    };

    const handleToggleVisibleMoreModal = () => {
        setVisibleMoreModal((prev) => !prev);
    };

    const handleToggleVisibleNtfItemMoreModal = () => {
        setvisibleNtfItemMoreModal((prev) => !prev);
    };

    const handleNtfItemMoreModalOuterClick = (e) => {
        if (notificationRef.current && !notificationRef.current.contains(e.target)) {
            notification.current = null;
            setvisibleNtfItemMoreModal(false);
        }
    };

    const handleSetCurrentNotificationId = (id) => {
        setCurrentNotificationId(id);
        handleToggleVisibleNtfItemMoreModal();
    };

    const handleMarkAllAsRead = () => {
        if (notification.unreadNotificationNum !== 0) dispatch(markAllAsRead({ recipientId: user._id }));
        handleToggleVisibleMoreModal();
    };

    const handleDeleteAllNotification = () => {
        if (notification.data.length !== 0) dispatch(deleteAllNotification({ recipientId: user._id }));
        handleToggleVisibleMoreModal();
    };

    const updateReadStatusNotificationItem = ({ notificationId, status }) => {
        dispatch(
            updateReadStatus({
                notificationId,
                status: status,
                recipientId: user._id
            })
        );

        currentNotificationId(null);
        handleToggleVisibleNtfItemMoreModal();
    };

    const deleteNotificationItem = ({ notificationId }) => {
        dispatch(
            deleteNotification({
                notificationId,
                recipientId: user._id
            })
        );
        handleToggleVisibleNtfItemMoreModal();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleNtfItemMoreModalOuterClick);

        return () => {
            document.removeEventListener('mousedown', handleNtfItemMoreModalOuterClick);
        };
    }, [notificationRef.current]);

    useEffect(() => {
        if (notification.data.length === 0 && !notification.maxPage)
            dispatch(
                getNotifications({
                    recipientId: user._id,
                    limit: 5,
                    page: 1,
                    currentNumNotifications: 0
                })
            );
    }, []);

    return (
        <div className={`notification_wrapper`}>
            <div className="notification_heading">
                <span>Thông báo</span>
                <Tippy
                    interactive
                    visible={visibleMoreModal}
                    onClickOutside={handleToggleVisibleMoreModal}
                    render={() => (
                        <div className="more_modal">
                            <div className="more_modal_item read_btn" onClick={handleMarkAllAsRead}>
                                <FaCheck />
                                <span> Đánh dấu đã đọc tất cả</span>
                            </div>
                            <div className="more_modal_item del_btn" onClick={handleDeleteAllNotification}>
                                <AiFillDelete />
                                <span>Xóa tất cả thông báo</span>
                            </div>
                        </div>
                    )}
                >
                    <div className="notification_more" onClick={handleToggleVisibleMoreModal}>
                        <TfiMoreAlt />
                    </div>
                </Tippy>
            </div>
            <div className="notification_body">
                {notification.data.length > 0 ? (
                    <div>
                        {notification.data.map((notificationItem, index) => {
                            let isRead = false;
                            if (notificationItem.recipient) {
                                isRead = notificationItem.isRead ? true : false;
                            } else {
                                isRead = notificationItem.readedUserList.includes(user._id) ? true : false;
                            }

                            return (
                                <div
                                    ref={
                                        notification.data.length === index + 1
                                            ? handleScrollToLastNotificationItemRef
                                            : null
                                    }
                                    key={notificationItem._id + index}
                                    className={`notification_item ${
                                        isRead ? 'read_notification' : 'unread_notification'
                                    } `}
                                >
                                    <Link
                                        to={`${
                                            notificationItem?.page ? 'page/' + notificationItem.page.pageName : null
                                        }`}
                                        className="notification_item_content_wrapper"
                                        onClick={() => {
                                            updateReadStatusNotificationItem({
                                                notificationId: notificationItem._id,
                                                status: !notificationItem.isRead
                                            });

                                            handleToggleVisibleNotificationModal();
                                        }}
                                    >
                                        <div className="notification_item_img_wrapper">
                                            <img src={notificationItem.sender?.avatar} alt="avatar" />
                                        </div>
                                        <div className="notification_item_content">
                                            <div className="notification_item_title">{notificationItem.title}</div>
                                            <div className="notification_item_note">
                                                {`Ghi chú: ${
                                                    notificationItem.content
                                                        ? notificationItem.content
                                                        : 'Không có ghi chú'
                                                }`}
                                            </div>
                                            <div className="notification_item_datetime">
                                                {moment(notificationItem.createdAt).fromNow()}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="notification_item_icon_wrapper">
                                        {!isRead && (
                                            <div className="notification_item_unread">
                                                <TiMediaRecord />
                                            </div>
                                        )}

                                        <div
                                            className="notification_item_more"
                                            onClick={(e) => {
                                                setCurrentElemRef(e);
                                                handleSetCurrentNotificationId(notificationItem._id);
                                            }}
                                        >
                                            <IoMdMore />
                                            {notificationItem._id === currentNotificationId &&
                                                visibleNtfItemMoreModal && (
                                                    <div className="more_modal notification_item_more_modal">
                                                        <div className="more_modal_item read_btn">
                                                            <FaCheck />
                                                            <span
                                                                onClick={() => {
                                                                    updateReadStatusNotificationItem({
                                                                        notificationId: notificationItem._id,
                                                                        status: notificationItem.recipient
                                                                            ? !notificationItem.isRead
                                                                            : !notificationItem.readedUserList.includes(
                                                                                  user?._id
                                                                              )
                                                                    });
                                                                }}
                                                            >
                                                                {isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                                                            </span>
                                                        </div>
                                                        <div className="more_modal_item del_btn">
                                                            <AiFillDelete />

                                                            <span
                                                                onClick={() => {
                                                                    deleteNotificationItem({
                                                                        notificationId: notificationItem._id
                                                                    });
                                                                }}
                                                            >
                                                                Xóa thông báo
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <span className="notify_nothing">Chưa có thông báo</span>
                )}
            </div>
        </div>
    );
}

export default Notification;
