import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import Logo_IUH from '../../assets/images/logo_iuh.png'
import Logo_IUH_color_w from '../../assets/images/logo_iuh_color_w.png'
import { useDispatch, useSelector } from 'react-redux'
import { pageSelector } from '../../redux/selector'
import { getPage, getPages } from '../../redux/actions/pageAction'
import { ARRAY_LIST_MENU } from '../../assets/data/menu'
import { renderSideBar } from '../../helpers/renderSideBar';
import { Modal } from 'antd';

const LayoutSideBarTest2 = ({ auth }) => {
    const dispatch = useDispatch()
    const page = useSelector(pageSelector);
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

    useEffect(() => {
        dispatch(getPages())
    }, [dispatch])

    useEffect(() => {
        if (page?.pages) {
            renderSideBar({ auth, page });
        }
    }, [JSON.stringify(page.pages)]);


    const [openModalMap, setOpenModalMap] = useState({}); 

    const showModal = (yearId, visibility) => {
        setOpenModalMap((prev) => ({ ...prev, [yearId]: visibility }));
    };

    const renderArrMenu = ARRAY_LIST_MENU.map((item) => {
        return (
            <React.Fragment key={item.id}>
                {item.allow || item.roles.some((role) => auth.user.roles.includes(role)) ? (
                    <>
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
                                {
                                    item.isSetYear ?
                                        <div className="box__select--year">
                                            {item.setSubMenuYear.map((itemSubYear) => {
                                                return (
                                                    <>
                                                        <div className='set__year--item' onClick={() => showModal(itemSubYear.id, true)}>
                                                            {itemSubYear.name}
                                                        </div>
                                                        <Modal
                                                            open={openModalMap[itemSubYear.id]}
                                                            onOk={() => showModal(itemSubYear.id, false)}
                                                            onCancel={() => showModal(itemSubYear.id, false)}
                                                            footer={null}
                                                            // mask={null}
                                                            
                                                            className="modal_list_goast"
                                                        >
                                                            <div className="box__goast--year">
                                                                {itemSubYear.sub_menu_item_goast?.map((item_goast) => {
                                                                    return (
                                                                        <NavLink
                                                                            key={item_goast.id}
                                                                            className="sub_menu_itema"
                                                                        >
                                                                            {item_goast.name_goast}
                                                                        </NavLink>
                                                                    )
                                                                })}
                                                            </div>
                                                        </Modal>


                                                    </>

                                                )
                                            })}

                                        </div>
                                        :
                                        item.sub_menu_item.map((item_sub) => {
                                            return (
                                                <NavLink
                                                    key={item_sub?.id}
                                                    className="sub_menu_item"
                                                    to={item_sub?.sub_to_link}
                                                    title={item_sub?.sub_name_menu}
                                                    onClick={() => {
                                                        handleGetPage({ pathName: item_sub?.sub_to_link })
                                                    }}
                                                >
                                                    {item_sub?.sub_name_menu}
                                                </NavLink>
                                            )
                                        })
                                }
                            </div>
                        ) : undefined}
                    </>
                ) : null}
            </React.Fragment>
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

export default LayoutSideBarTest2