import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { IoMdArrowDropright } from 'react-icons/io';
import Logo_IUH from '../../assets/images/logo_iuh.png';
import Logo_IUH_color_w from '../../assets/images/logo_iuh_color_w.png';
import { useDispatch, useSelector } from 'react-redux';
import { pageSelector } from '../../redux/selector';
import { getPage, getPages } from '../../redux/actions/pageAction';
import { ARRAY_LIST_MENU } from '../../assets/data/menu';
import { renderSideBar } from '../../helpers/renderSideBar';

const LayoutSideBar = ({ auth }) => {
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const determineAuth = auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003');
    const [toggleMenu, setToggleMenu] = useState(false);
    const levelYearList = Array.from(Array(auth?.user?.levelYear || 1).keys()).map((x) => x + 1);
    const [levelYear, setLevelYear] = useState(auth.user.levelYear);
    const refBoxSubs = ARRAY_LIST_MENU.map(() => useRef(null));
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
        refBoxSubs.forEach((ref, index) => {
            if (ref.current && subMenu[index]) {
                const newHeightBoxSub = `${ref.current.scrollHeight}px`;

                if (heightBoxSub[index] !== newHeightBoxSub) {
                    const newHeightBoxSubArray = [...heightBoxSub];
                    newHeightBoxSubArray[index] = newHeightBoxSub;
                    setHeightBoxSub(newHeightBoxSubArray);
                }
            }
        });
    }, [refBoxSubs, subMenu]);

    useEffect(() => {
        dispatch(getPages());
    }, [dispatch]);

    useEffect(() => {
        if (page?.pages) {
            renderSideBar({ auth, page, levelYear });
        }
    }, [JSON.stringify(page.pages), levelYear]);

    const renderArrMenu = ARRAY_LIST_MENU.map((item) => {
        return (
            <React.Fragment key={item.id}>
                {item.allow || item.roles.some((role) => auth.user.roles.includes(role)) ? (
                    <>
                        {item.submenu ? (
                            <div
                                key={item.id}
                                className={`item_menu_a ${
                                    subMenu[item.id] ? 'active_item' : 'unactive_item'
                                } `}
                                onClick={(e) => {
                                    if (e.target.name !== 'level_year_list') handleSubMenu(item.id);
                                }}
                            >
                                <div className='item_menu_contain_submenu'>
                                    <span>
                                        {item.icon_before}
                                        <span className={toggleMenu ? 'none_text__menu--item' : ''}>
                                            {item.name_menu}
                                        </span>
                                    </span>
                                    {item.dynamicPage === 'goals' && (
                                        <select
                                            name='level_year_list'
                                            value={levelYear}
                                            onChange={(e) => {
                                                handleChangeLevelYear(e);
                                                handleRefreshSubMenu(item.id);
                                            }}
                                        >
                                            {levelYearList.map((levelYearItem) => {
                                                return (
                                                    <option
                                                        value={levelYearItem}
                                                        key={levelYearItem}
                                                    >
                                                        {levelYearItem}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    )}
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
                            <NavLink key={item.id} className='item_menu_a' to={item.to_link}>
                                <span>
                                    {item.icon_before}
                                    <span className={toggleMenu ? 'none_text__menu--item' : ''}>
                                        {item.name_menu}
                                    </span>
                                </span>
                            </NavLink>
                        )}

                        {item.submenu ? (
                            <div
                                className='box_sub_menu_item'
                                ref={refBoxSubs[item.id]}
                                style={{
                                    height: `${subMenu[item.id] ? heightBoxSub[item.id] : '0px'}`
                                }}
                            >
                                {item.sub_menu_item.map((item_sub) => {
                                    return (
                                        <NavLink
                                            key={item_sub?.id}
                                            className='sub_menu_item'
                                            to={item_sub?.sub_to_link}
                                            title={item_sub?.sub_name_menu}
                                            onClick={() => {
                                                handleGetPage({ pathName: item_sub?.sub_to_link });
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
        <div
            className={`container__menu ${determineAuth ? 'sidebar_admin ' : ''} 
		${toggleMenu ? 'active_toggle' : ''}`}
        >
            <div className={`menu_wrapper ${toggleMenu ? 'active_toggle' : ''}`}>
                <div className='img__logo'>
                    {toggleMenu ? (
                        ''
                    ) : (
                        <a href='/'>
                            <img src={determineAuth ? Logo_IUH_color_w : Logo_IUH} alt='logo_iuh' />
                        </a>
                    )}

                    {determineAuth ? (
                        <div
                            className={`btn__toggle--menu ${
                                toggleMenu ? 'active_icon_toggle--menu' : ''
                            }`}
                            onClick={hanleToggleMenu}
                        >
                            <div className='line__flex_icon'>
                                <FaAnglesLeft />
                                <FaAnglesRight />
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
                <div className='wrap__menu'>
                    <div className='flex__box'>{renderArrMenu}</div>
                </div>
            </div>
        </div>
    );
};

export default LayoutSideBar;
