import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BsFillCaretRightFill } from 'react-icons/bs'
import Logo_IUH from '../../assets/images/logo_iuh.png'
import Logo_IUH_color_w from '../../assets/images/logo_iuh_color_w.png'
import { getDataApi } from '../../utils/fetchData'
import { useDispatch, useSelector } from 'react-redux'
import { pageSelector } from '../../redux/selector'
import GLOBALTYPES from '../../redux/actions/globalTypes'
import { getPages } from '../../redux/actions/pageAction'
import { ARRAY_LIST_MENU } from '../../assets/data/menu'

const LayoutSideBar = ({ auth }) => {
	const dispatch = useDispatch()
	const page = useSelector(pageSelector)
	const determineAuth = auth?.user?.roles.includes('0004') || auth?.user?.roles.includes('0003')
	

	const refBoxSubs = ARRAY_LIST_MENU.map(() => useRef(null))
	const [heightBoxSub, setHeightBoxSub] = useState(ARRAY_LIST_MENU.map(() => '0px'))
	const [subMenu, setSubMenu] = useState(ARRAY_LIST_MENU.map(() => false))

	const handleSubMenu = (index) => {
		const newSubMenuState = [...subMenu]
		newSubMenuState[index] = !newSubMenuState[index]

		const newHeightBoxSub = [...heightBoxSub]

		setSubMenu(newSubMenuState)
		setHeightBoxSub(newHeightBoxSub)
	}

	const handleGetPage = async ({ pathName }) => {
		try {
			if (pathName.includes('/page/')) {
				const res = await getDataApi(pathName);
				dispatch({
					type: GLOBALTYPES.PAGE.DYNAMIC_PAGE_INFO,
					payload: {
						pathName,
                        pageType: res.data.data?.pageType,
						pageId: res.data.data?._id,
						pageName: res.data.data.pageName,
						tables: res.data.data.tables,
					},
				})
			}
		} catch (error) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: 'Lấy Dữ Liệu Trang Thất Bại',
				},
			})
		}
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
            ARRAY_LIST_MENU[5].sub_menu_item = page.pages.reduce((intialArr, page) => {
                if(page.pageType === "Tin Tức") {
                    return [
                        ...intialArr, 
                        {
                            id: page._id,
                            sub_name_menu: page.pageName,
                            sub_icon_before: '?',
                            sub_to_link: `/page/${page.pageName}`,
                        }
                    ]
                }
                return intialArr;
            }, [])

            ARRAY_LIST_MENU[6].sub_menu_item = page.pages.reduce((intialArr, page) => {
                if(page.pageType === "Chỉ Tiêu") {
                    return [
                        ...intialArr, 
                        {
                            id: page._id,
                            sub_name_menu: page.pageName,
                            sub_icon_before: '?',
                            sub_to_link: `/page/${page.pageName}`,
                        }
                    ]
                }
                return intialArr;
            }, [])
        }
    }, [JSON.stringify(page.pages)])

	const renderArrMenu = ARRAY_LIST_MENU.map((item) => {
		return (
			<React.Fragment key={item.id}>
				{item.allow || item.roles.some((role) => auth.user.roles.includes(role)) ? (
					<>
						{item.submenu ? (
							<div key={item.id} className="item_menu_a" onClick={() => handleSubMenu(item.id)}>
								<span>
									{item.icon_before}
									{item.name_menu}
								</span>
								<div
									className={`icon_active_sub ${
										subMenu[item.id] ? 'active_icon' : 'unactive_icon'
									}`}
								>
									<BsFillCaretRightFill />
								</div>
							</div>
						) : (
							<NavLink key={item.id} className="item_menu_a" to={item.to_link}>
								<span>
									{item.icon_before}
									{item.name_menu}
								</span>
							</NavLink>
						)}

						{item.submenu ? (
							<div
								className="box_sub_menu_item"
								ref={refBoxSubs[item.id]}
								style={{ height: `${subMenu[item.id] ? heightBoxSub[item.id] : '0px'}` }}
							>
								{item.sub_menu_item.map((item_sub) => {
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
								})}
							</div>
						) : undefined}
					</>
				) : null}
			</React.Fragment>
		)
	})

	return (
		<div className={`container__menu  ${determineAuth ? 'background_admin' : ''}`}>
			<div className="img__logo">
				<a href="/">
					<img src={determineAuth ? Logo_IUH_color_w : Logo_IUH} alt="logo_iuh" />
				</a>
			</div>
			<div className="wrap__menu">
				<div className="flex__box">{renderArrMenu}</div>
			</div>
		</div>
	)
}

export default LayoutSideBar
