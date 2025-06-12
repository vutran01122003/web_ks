import React, { Fragment, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';
import { IoMdArrowDropright } from 'react-icons/io';
import Logo_IUH from '../../assets/images/logo/logo_iuh.png';
import { useDispatch, useSelector } from 'react-redux';
import { pageSelector } from '../../redux/selector';
import { getPages } from '../../redux/actions/pageAction';
import { ARRAY_LIST_MENU } from '../../shared/menu';
import { renderSideBar } from '../../helpers/renderSideBar';

const { VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE, VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_GOAL_PAGE } = import.meta.env;

const LayoutSideBar = ({ auth }) => {
    const user = auth?.user;
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const [toggleMenu, setToggleMenu] = useState(false);
    const currentLevelYear = auth.user?.cohort?.currentLevelYear;
    const [levelYear, setLevelYear] = useState(currentLevelYear);
    const groupCodeList = user?.groups.map((group) => group.groupCode);
    const levelYearList = Array.from(Array(currentLevelYear || 1).keys()).map((x) => x + 1);

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
        const conditions =
            groupCodeList.includes(VITE_APP_TALENT_ENGINEER_CODE) ||
            groupCodeList.includes(VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE);

        if (user && conditions) {
            dispatch(
                getPages({
                    userId: user._id,
                    pageStudentMajor: user?.major.majorName,
                    pageStudentCohort: user?.cohort.cohortName,
                    pageStudentLevelYear: levelYear
                })
            );
        }
    }, [dispatch, levelYear]);

    useEffect(() => {
        if (page?.pages) {
            renderSideBar({ auth, page, levelYear });
        }
    }, [JSON.stringify(page.pages), levelYear]);

    const renderArrMenu = ARRAY_LIST_MENU.map((item, index) => {
        let condition = false;

        if (item?.roles) {
            const roles = item.roles;
            const mergedRoles = Array.from(new Set([...roles, ...groupCodeList]));
            condition = mergedRoles.length < roles.length + groupCodeList.length;
        }

        return (
            <React.Fragment key={index}>
                {item.allow || condition ? (
                    <Fragment>
                        {item.submenu ? (
                            <div
                                key={index}
                                className={`item_menu_a ${subMenu[index] ? 'active_item' : 'unactive_item'} `}
                                onClick={(e) => {
                                    if (e.target.name !== 'level_year_list') handleSubMenu(index);
                                }}
                            >
                                <div className="item_menu_contain_submenu">
                                    <span>
                                        {item.icon_before}
                                        <span className={toggleMenu ? 'none_text__menu--item' : ''}>
                                            {item.name_menu}
                                        </span>
                                        {item.dynamicPage === VITE_APP_GOAL_PAGE && (
                                            <select
                                                className="level_year_list"
                                                name="level_year_list"
                                                value={levelYear}
                                                onChange={(e) => {
                                                    handleChangeLevelYear(e);
                                                    handleRefreshSubMenu(index);
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
                                </div>
                                {toggleMenu ? (
                                    ''
                                ) : (
                                    <div
                                        className={`icon_active_sub ${
                                            subMenu[index] ? 'active_icon' : 'unactive_icon'
                                        }`}
                                    >
                                        <IoMdArrowDropright />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink key={index} className="item_menu_a" to={item.to_link}>
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
                                    if (ref) menuRef.current[index] = ref;
                                }}
                                style={{
                                    height: `${subMenu[index] ? heightBoxSub[index] : '0px'}`
                                }}
                            >
                                {item.sub_menu_item.map((item_sub, index) => {
                                    return (
                                        <NavLink
                                            key={index}
                                            className="sub_menu_item"
                                            to={item_sub?.sub_to_link}
                                            title={item_sub?.sub_name_menu}
                                        >
                                            {item_sub?.sub_name_menu}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        ) : undefined}
                    </Fragment>
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
                            <img src={Logo_IUH} alt="logo_iuh" />
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
