import React from 'react'
import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineForum, MdOutlineCreate } from 'react-icons/md';
import { CgBrowser } from 'react-icons/cg';
import { BiBookBookmark } from 'react-icons/bi';
import { HiOutlineNewspaper } from 'react-icons/hi'
import { BsTags } from 'react-icons/bs';

import { RiHome3Fill } from 'react-icons/ri';
import { FaClipboardList } from "react-icons/fa6";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

import { NavLink } from 'react-router-dom'
import { FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

import Logo_IUH from '../../assets/images/logo_iuh.png'
import Logo_IUH_color_w from '../../assets/images/logo_iuh_color_w.png'

const LayoutSideBarTest = ({ auth }) => {

    const ARRAY_LIST_MENU = [
        {
            id: 0,
            title_menu: 'Trang chủ',
            isShowTitle: true,
            listMenuHanle: [
                {
                    id: 0,
                    name_menu: 'Tổng Quan',
                    icon_before: <RiHome3Fill />,
                    to_link: '/',
                    allow: true,
                    submenu: false
                }
            ],
        },
        {
            id: 1,
            title_menu: "Chỉ tiêu",
            isShowTitle: true,
            listMenuHanle: [
                {
                    id: 1,
                    roles: ['0004'],
                    name_menu: 'Xét Duyệt Chỉ Tiêu',
                    icon_before: <FaClipboardList />,
                    to_link: '/listGoals',
                    submenu: false,
                },
                {
                    id: 2,
                    roles: ['0004'],
                    name_menu: 'Thêm Nhóm Chỉ Tiêu',
                    icon_before: <TbTargetArrow />,
                    to_link: '/create_goals',
                    submenu: false,
                },
                {
                    id: 3,
                    name_menu: 'Nhóm Chỉ Tiêu',
                    roles: ['0002'],
                    icon_before: <BiBookBookmark />,
                    dynamicPage: 'goals',
                    submenu: true,
                    sub_menu_item: [],
                },
            ]
        },
        {
            id: 2,
            title_menu: "Tin Tức",
            isShowTitle: true,
            listMenuHanle: [
                {
                    id: 0,
                    name_menu: 'Tin Tức',
                    allow: true,
                    icon_before: <HiOutlineNewspaper />,
                    dynamicPage: 'news',
                    submenu: true,
                    sub_menu_item: []
                },
                {
                    id: 1,
                    roles: ['0004'],
                    name_menu: 'Thêm Loại Tin Tức',
                    icon_before: <BsTags />,
                    to_link: '/create_news_type',
                    submenu: false
                },

                {
                    id: 2,
                    roles: ['0003'],
                    name_menu: 'Tạo Tin Tức',
                    icon_before: <MdOutlineCreate />,
                    to_link: '/create_news',
                    submenu: false
                },
            ]
        },
        {
            id: 3,
            title_menu: "Trang",
            isShowTitle: true,
            listMenuHanle: [
                {
                    id: 0,
                    roles: ['0004'],
                    name_menu: 'Quản Lý Trang',
                    icon_before: <CgBrowser />,
                    to_link: '/manage_pages',
                    submenu: false,
                },
            ]
        },
        {
            id: 4,
            title_menu: "Socials",
            isShowTitle: true,
            listMenuHanle: [
                {
                    id: 0,
                    allow: true,
                    name_menu: 'Forum',
                    to_link: '/forum',
                    icon_before: <MdOutlineForum />,
                    submenu: false,
                }
            ]
        },
    ];

    const determineAuth = auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003');
    const [toggleMenu, setToggleMenu] = useState(false);

    const refBoxSubs = ARRAY_LIST_MENU.map(() => useRef(null))
    const [heightBoxSub, setHeightBoxSub] = useState(ARRAY_LIST_MENU.map(() => '0px'))
    const [subMenu, setSubMenu] = useState(ARRAY_LIST_MENU.map(() => false))

    // console.log(heightBoxSub);
    // console.log(subMenu);
    // console.log(refBoxSubs);

    const handleSubMenu = (index) => {
        const newSubMenuState = [...subMenu]
        newSubMenuState[index] = !newSubMenuState[index]

        const newHeightBoxSub = [...heightBoxSub]

        setSubMenu(newSubMenuState)
        setHeightBoxSub(newHeightBoxSub)

        setToggleMenu(false);
    }

    const hanleToggleMenu = () => {
        setToggleMenu(!toggleMenu);
        const newSubMenu = subMenu.map(() => false);
        setSubMenu(newSubMenu);
    }

    const handleGetPage = async ({ pathName }) => {
        if (pathName) dispatch(getPage({ pathName }));
    }

    useEffect(() => {
        refBoxSubs.forEach((ref, index) => {
            if (ref.current && subMenu[index]) {
                const newHeightBoxSub = `${ref.current.scrollHeight}px`

                if (heightBoxSub[index] !== newHeightBoxSub) {
                    const newHeightBoxSubArray = [...heightBoxSub]
                    newHeightBoxSubArray[index] = newHeightBoxSub
                    setHeightBoxSub(newHeightBoxSubArray)
                }
            }
        })
    }, [refBoxSubs, subMenu])


    const renderArrMenu = ARRAY_LIST_MENU.map((itemTitle) => {
        return (
            // <React.Fragment >
                <div key={itemTitle.id} className={toggleMenu ? "set__toggleMenu" : ""}>
                    {itemTitle.isShowTitle ? <div className="heading__title--menu"> {itemTitle.title_menu} </div> : ""}
                    <div className="list__hanle--menu" >
                        {itemTitle.listMenuHanle.map((item) => {
                            return (
                                <React.Fragment key={item.id}>
                                    {item.submenu ? (
                                        <div
                                            key={item.id}
                                            className={`item_menu_a ${subMenu[item.id] ? "active_item" : "unactive_item"} `}
                                            onClick={() => handleSubMenu(item.id)}>
                                            <span>
                                                {item.icon_before}
                                                <span className={toggleMenu ? "none_text__menu--item" : ""}>{item.name_menu}</span>
                                            </span>
                                            {
                                                toggleMenu ? "" :
                                                    <div
                                                        className={`icon_active_sub ${subMenu[item.id] ? 'active_icon' : 'unactive_icon'
                                                            }`}
                                                    >
                                                        <FaAngleRight />
                                                    </div>
                                            }

                                        </div>
                                    ) : (
                                        <NavLink
                                            key={item.id}
                                            className="item_menu_a"
                                            to={item.to_link}>
                                            <span>
                                                {item.icon_before}
                                                <span className={toggleMenu ? "none_text__menu--item" : ""}>{item.name_menu}</span>
                                            </span>
                                        </NavLink>
                                    )}

                                    {item.submenu ? (
                                        <div
                                            className="box_sub_menu_item"
                                            ref={refBoxSubs[item.id]}
                                            style={{ height: `${subMenu[item.id] ? heightBoxSub[item.id] : '0px'}` }}
                                        >
                                            <NavLink
                                                className="sub_menu_item"
                                                to="/qwe"
                                                title="#"
                                            >
                                                Sub 1
                                            </NavLink>
                                            <NavLink
                                                className="sub_menu_item"
                                                to="/qwe123"
                                                title="#"
                                            >
                                                Sub 2
                                            </NavLink>
                                        </div>
                                    ) : undefined}
                                </React.Fragment>
                            )
                        })}
                    </div>

                </div>
            // </React.Fragment>
        )
    })

    return (
        <div
            className={`container__menu ${determineAuth ? 'sidebar_admin ' : ''} 
    ${toggleMenu ? "active_toggle" : ""}`}
        >
            <div className={`menu_wrapper ${toggleMenu ? "active_toggle" : ""}`}>
                <div className="img__logo">
                    {
                        toggleMenu ? "" :
                            <a href="/">
                                <img src={determineAuth ? Logo_IUH_color_w : Logo_IUH} alt="logo_iuh" />
                            </a>
                    }

                    {
                        determineAuth ?
                            <div
                                className={`btn__toggle--menu ${toggleMenu ? "active_icon_toggle--menu" : ""}`}
                                onClick={hanleToggleMenu}
                            >
                                <div className="line__flex_icon">
                                    <FaAnglesLeft />
                                    <FaAnglesRight />
                                </div>
                            </div>
                            : ""
                    }

                </div>
                <div className="wrap__menu">
                    <div className="flex__box">{renderArrMenu}</div>
                </div>
            </div>
        </div>
    )
}

export default LayoutSideBarTest