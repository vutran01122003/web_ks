import { Input } from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';
import { ARRAY_LIST_MENU } from '../assets/data/menu';
import AddTableModal from '../components/ComponentModal/AddTableModal';
import RemoveTableModal from '../components/ComponentModal/RemoveTableModal';
import ViewTablesModal from '../components/ComponentModal/ViewTablesModal';
import RemovePageModal from '../components/ComponentModal/RemovePageModal';
import { useSelector } from 'react-redux';
import { pageSelector } from '../redux/selector';
import { ImBin2 } from 'react-icons/im';
import { IoMdAddCircle } from 'react-icons/io';
import { LuView } from 'react-icons/lu';

const PageManagement = () => {
    const {
        VITE_APP_ADMIN_CODE,
        VITE_APP_TALENTED_ENGINEER_CODE,
        VITE_APP_FACULTY_MANAGER_CODE
    } = import.meta.env;

    const { Search } = Input;
    const page = useSelector(pageSelector);
    const [pages, setPages] = useState({});
    const [openAddTableModal, setOpenAddTableModal] = useState(false);
    const [openRemoveTableModal, setOpenRemoveTableModal] = useState(false);
    const [openViewTablesModal, setOpenViewTablesModal] = useState(false);
    const [openRemovePageModal, setOpenRemovePageModal] = useState(false);
    const [pageId, setPageId] = useState(null);
    const [subPageName, setSubPageName] = useState('');

    const handleOpenAddTableModal = ({ pageId, pageName }) => {
        setOpenAddTableModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
    };

    const handleHideAddTableModal = () => {
        setOpenAddTableModal(false);
    };

    const handleHideRemoveTableModal = () => {
        setOpenRemoveTableModal(false);
    };

    const handleOpenViewTablesModal = ({ pageName }) => {
        setOpenViewTablesModal(true);
        setSubPageName(pageName);
    };

    const handleHideViewTablesModal = () => {
        setOpenViewTablesModal(false);
    };

    const handleOpenRemovePageModal = ({ pageId, pageName }) => {
        setOpenRemovePageModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
    };

    const handleHideRemovePageModal = () => {
        setOpenRemovePageModal(false);
    };

    useEffect(() => {
        setPages(ARRAY_LIST_MENU);
    }, []);

    useEffect(() => {
        if (page.pages && Object.keys(pages).length > 0) {
            setPages((prev) => {
                const menu = [...prev];
                for (let menuItem of menu) {
                    if (
                        menuItem.dynamicPage &&
                        menuItem.dynamicPage === 'goals'
                    ) {
                        menuItem = {
                            ...menuItem,
                            sub_menu_item: page.pages.reduce(
                                (initialArr, page) => {
                                    if (page.pageType === 'chỉ tiêu') {
                                        return [
                                            ...initialArr,
                                            {
                                                id: page?._id,
                                                sub_page_type: page.pageType,
                                                sub_name_menu: page?.pageName,
                                                sub_icon_before: '?',
                                                sub_to_link: `/page/${page?.pageName}`
                                            }
                                        ];
                                    }
                                    return initialArr;
                                },
                                []
                            )
                        };
                        break;
                    }
                }
                return menu;
            });
        }
    }, [JSON.stringify(page.pages)]);

    const ComponentSort = () => {
        return (
            <div className="line__sort">
                <Search
                    placeholder="Nhập tên trang"
                    allowClear
                    style={{
                        width: 250
                    }}
                />
            </div>
        );
    };
    return (
        <div className="container_page__manager">
            <div className="heading_text--pages">QUẢN LÝ TRANG</div>
            <div className="body__data--pages">
                <ComponentSort />
                {openAddTableModal && (
                    <AddTableModal
                        handleHideAddTableModal={handleHideAddTableModal}
                        subPageName={subPageName}
                        pageId={pageId}
                    />
                )}

                {openRemoveTableModal && (
                    <RemoveTableModal
                        handleHideRemoveTableModal={handleHideRemoveTableModal}
                        subPageName={subPageName}
                        pageId={pageId}
                    />
                )}

                {openViewTablesModal && (
                    <ViewTablesModal
                        handleHideViewTablesModal={handleHideViewTablesModal}
                        subPageName={subPageName}
                    />
                )}

                {openRemovePageModal && (
                    <RemovePageModal
                        handleHideRemovePageModal={handleHideRemovePageModal}
                        subPageName={subPageName}
                        pageId={pageId}
                    />
                )}
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tiêu đề</th>
                            <th>Quyền truy cập</th>
                            <th>Trạng thái</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(pages).length > 0 &&
                            pages.map((menu_item, index) => {
                                let role = null;

                                switch (menu_item?.role) {
                                    case VITE_APP_TALENTED_ENGINEER_CODE: {
                                        role = 'Kỹ Sư Tài Năng';
                                        break;
                                    }

                                    case VITE_APP_FACULTY_MANAGER_CODE: {
                                        role = 'Quản Lý Khoa';
                                        break;
                                    }

                                    case VITE_APP_ADMIN_CODE: {
                                        role = 'Admin';
                                        break;
                                    }
                                    default:
                                        role = 'Chưa Xác Định';
                                        break;
                                }
                                return (
                                    <React.Fragment key={menu_item.id}>
                                        <tr className="">
                                            <td>{index + 1}.</td>
                                            <td className="name_menu">
                                                {menu_item?.name_menu}
                                            </td>
                                            <td>
                                                {menu_item?.allow ? (
                                                    <span className="required_role">
                                                        Tất Cả
                                                    </span>
                                                ) : (
                                                    <span className="required_role">
                                                        {role}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="icon__show">
                                                    Hiện
                                                </div>
                                            </td>
                                            <td></td>
                                        </tr>
                                        {menu_item?.sub_menu_item &&
                                        menu_item?.sub_menu_item.length > 0 ? (
                                            <>
                                                {menu_item?.sub_menu_item.map(
                                                    (sub_menu_item, index) => (
                                                        <tr
                                                            key={
                                                                sub_menu_item?.id
                                                            }
                                                            className="tr__sub_menu"
                                                        >
                                                            <td className="">
                                                                {index + 1}.
                                                            </td>
                                                            <td
                                                                className="name_sub_menu"
                                                                onClick={() => {
                                                                    handleOpenViewTablesModal(
                                                                        {
                                                                            pageName:
                                                                                sub_menu_item?.sub_name_menu
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <span className="icon__vol">
                                                                    ┗{' '}
                                                                </span>
                                                                {
                                                                    sub_menu_item?.sub_name_menu
                                                                }
                                                            </td>
                                                            <td>{role}</td>
                                                            <td>
                                                                <div className="icon__show">
                                                                    Hiện
                                                                </div>
                                                            </td>
                                                            <td className="">
                                                                {sub_menu_item?.sub_to_link.includes(
                                                                    '/page/'
                                                                ) && (
                                                                    <div className="sub_menu_item_btn_wrapper">
                                                                        {sub_menu_item?.sub_page_type ===
                                                                            'chỉ tiêu' && (
                                                                            <>
                                                                                <div
                                                                                    className="btn_man-pages watch_table_btn"
                                                                                    onClick={() => {
                                                                                        handleOpenViewTablesModal(
                                                                                            {
                                                                                                pageName:
                                                                                                    sub_menu_item?.sub_name_menu
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <LuView />
                                                                                    <span>
                                                                                        Xem
                                                                                        Các
                                                                                        Chỉ
                                                                                        Tiêu
                                                                                    </span>
                                                                                </div>

                                                                                <div
                                                                                    className="btn_man-pages add_table_btn"
                                                                                    onClick={() => {
                                                                                        handleOpenAddTableModal(
                                                                                            {
                                                                                                pageId: sub_menu_item?.id,
                                                                                                pageName:
                                                                                                    sub_menu_item?.sub_name_menu
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <IoMdAddCircle />
                                                                                    <span>
                                                                                        Thêm
                                                                                        Chỉ
                                                                                        Tiêu
                                                                                    </span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                        <div
                                                                            className="btn_man-pages remove_page_btn"
                                                                            onClick={() => {
                                                                                handleOpenRemovePageModal(
                                                                                    {
                                                                                        pageId: sub_menu_item.id,
                                                                                        pageName:
                                                                                            sub_menu_item?.sub_name_menu
                                                                                    }
                                                                                );
                                                                            }}
                                                                        >
                                                                            <ImBin2 />{' '}
                                                                            Xóa
                                                                            chỉ
                                                                            tiêu
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PageManagement;
