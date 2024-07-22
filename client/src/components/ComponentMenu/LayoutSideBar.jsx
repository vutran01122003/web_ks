import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { IoMdArrowDropright } from 'react-icons/io';
import Logo_IUH from '../../assets/images/logo_iuh.png';
import Logo_IUH_color_w from '../../assets/images/logo_iuh.png';
import { useDispatch, useSelector } from 'react-redux';
import { pageSelector } from '../../redux/selector';
import { getPage, getPages } from '../../redux/actions/pageAction';
import { ARRAY_LIST_MENU } from '../../assets/data/menu';
import { renderSideBar } from '../../helpers/renderSideBar';

const LayoutSideBar = ({ auth }) => {
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [levelYear, setLevelYear] = useState(auth.user.levelYear);
    const { VITE_APP_FACULTY_MANAGER_CODE, VITE_APP_ADMIN_CODE, VITE_APP_TALENTED_ENGINEER_CODE } = import.meta.env;
    const determineAuth = [VITE_APP_FACULTY_MANAGER_CODE, VITE_APP_ADMIN_CODE].includes(auth?.user?.group.groupCode);
    const levelYearList = Array.from(Array(auth?.user?.levelYear || 1).keys()).map((x) => x + 1);

    const menuRef = useRef([
        ...ARRAY_LIST_MENU.map(() => ({
            current: null
        }))
    ]);

    const [heightBoxSub, setHeightBoxSub] = useState(ARRAY_LIST_MENU.map(() => '0px'));
    const [subMenu, setSubMenu] = useState(ARRAY_LIST_MENU.map(() => false));

    const handleSubMenu = (index) => {
        const newSubMenuState = [...subMenu];
        newSubMenuState[index] = !newSubMenuState[index];

        const newHeightBoxSub = [...heightBoxSub];

        setSubMenu(newSubMenuState);
        setHeightBoxSub(newHeightBoxSub);

        setToggleMenu(false);
    };

    const handleRefreshSubMenu = (index) => {
        const newSubMenuState = [...subMenu];
        newSubMenuState[index] = false;
        setSubMenu(newSubMenuState);
        setToggleMenu(false);
    };

    const hanleToggleMenu = () => {
        setToggleMenu(!toggleMenu);
        const newSubMenu = subMenu.map(() => false);
        setSubMenu(newSubMenu);
    };

    const handleGetPage = async ({ pathName }) => {
        if (pathName) dispatch(getPage({ pathName }));
    };

    const handleChangeLevelYear = (e) => {
        setLevelYear(e.target.value);
    };

    useEffect(() => {
        menuRef.current.forEach((refCurrent, index) => {
            if (refCurrent && subMenu[index]) {
                const newHeightBoxSub = `${refCurrent.scrollHeight}px`;

                if (heightBoxSub[index] !== newHeightBoxSub) {
                    const newHeightBoxSubArray = [...heightBoxSub];
                    newHeightBoxSubArray[index] = newHeightBoxSub;
                    setHeightBoxSub(newHeightBoxSubArray);
                }
            }
        });
    }, [menuRef, subMenu]);

    useEffect(() => {
        if (auth?.user && VITE_APP_TALENTED_ENGINEER_CODE === auth?.user?.group.groupCode) dispatch(getPages());
    }, [dispatch]);

    useEffect(() => {
        if (page?.pages) {
            renderSideBar({ auth, page, levelYear });
        }
    }, [JSON.stringify(page.pages), levelYear]);

    const renderArrMenu = ARRAY_LIST_MENU.map((item) => {
        return (
            <React.Fragment key={item.id}>
                {item.allow || item.role === auth?.user.group.groupCode ? (
                    <>
                        {item.submenu ? (
                            <div
                                key={item.id}
                                className={`item_menu_a ${subMenu[item.id] ? 'active_item' : 'unactive_item'} `}
                                onClick={(e) => {
                                    if (e.target.name !== 'level_year_list') handleSubMenu(item.id);
                                }}
                            >
                                <div className="item_menu_contain_submenu">
                                    <span>
                                        {item.icon_before}
                                        <span className={toggleMenu ? 'none_text__menu--item' : ''}>
                                            {item.name_menu}
                                            {item.dynamicPage === 'goals' && (
                                                <select
                                                    name="level_year_list"
                                                    value={levelYear}
                                                    onChange={(e) => {
                                                        handleChangeLevelYear(e);
                                                        handleRefreshSubMenu(item.id);
                                                    }}
                                                >
                                                    {levelYearList.map((levelYearItem) => {
                                                        return (
                                                            <option value={levelYearItem} key={levelYearItem}>
                                                                {levelYearItem}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            )}
                                        </span>
                                    </span>
                                </div>
                                {toggleMenu ? (
                                    ''
                                ) : (
                                    <div
                                        className={`icon_active_sub ${
                                            subMenu[item.id] ? 'active_icon' : 'unactive_icon'
                                        }`}
                                    >
                                        <IoMdArrowDropright />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink key={item.id} className="item_menu_a" to={item.to_link}>
                                <span>
                                    {item.icon_before}
                                    <span className={toggleMenu ? 'none_text__menu--item' : ''}>{item.name_menu}</span>
                                </span>
                            </NavLink>
                        )}

                        {item.submenu ? (
                            <div
                                className="box_sub_menu_item"
                                ref={(ref) => {
                                    if (ref) menuRef.current[item.id] = ref;
                                }}
                                style={{
                                    height: `${subMenu[item.id] ? heightBoxSub[item.id] : '0px'}`
                                }}
                            >
                                {item.sub_menu_item.map((item_sub) => {
                                    return (
                                        <NavLink
                                            key={item_sub?.id}
                                            className="sub_menu_item"
                                            to={item_sub?.sub_to_link}
                                            title={item_sub?.sub_name_menu}
                                            onClick={() => {
                                                handleGetPage({
                                                    pathName: item_sub?.sub_to_link
                                                });
                                            }}
                                        >
                                            {item_sub?.sub_name_menu}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        ) : undefined}
                    </>
                ) : null}
            </React.Fragment>
        );
    });

    return (
        <div className={`container__menu sidebar ${toggleMenu ? 'active_toggle' : ''}`}>
            <div className={`menu_wrapper ${toggleMenu ? 'active_toggle' : ''}`}>
                <div className="img__logo">
                    {toggleMenu ? null : (
                        <a href="/">
                            <img src={determineAuth ? Logo_IUH_color_w : Logo_IUH} alt="logo_iuh" />
                        </a>
                    )}

                    <div
                        className={`btn__toggle--menu ${toggleMenu ? 'active_icon_toggle--menu' : ''}`}
                        onClick={hanleToggleMenu}
                    >
                        <div className="line__flex_icon">
                            <FaAnglesLeft />
                            <FaAnglesRight />
                        </div>
                    </div>
                </div>
                <div className="wrap__menu">
                    <div className="flex__box">{renderArrMenu}</div>
                </div>
            </div>
        </div>
    );
};

export default LayoutSideBar;
