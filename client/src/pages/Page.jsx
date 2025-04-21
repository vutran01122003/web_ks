import { Input } from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';
import { ARRAY_LIST_MENU } from '../shared/menu';
import AddTableModal from '../components/Modal/AddTableModal';
import RemoveTableModal from '../components/Modal/RemoveTableModal';
import ViewTablesModal from '../components/Modal/ViewTablesModal';
import RemovePageModal from '../components/Modal/RemovePageModal';
import { useSelector } from 'react-redux';
import { pageSelector } from '../redux/selector';
import { ImBin2 } from 'react-icons/im';
import { IoMdAddCircle } from 'react-icons/io';
import { LuView } from 'react-icons/lu';
const { VITE_APP_ADMIN_CODE, VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_MAJOR_MANAGER_CODE, VITE_APP_GOAL_PAGE } =
    import.meta.env;

const PageManagement = () => {
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
                    if (menuItem.dynamicPage && menuItem.dynamicPage === VITE_APP_GOAL_PAGE) {
                        menuItem = {
                            ...menuItem,
                            sub_menu_item: page.pages.reduce((initialArr, page) => {
                                if (page.pageType === VITE_APP_GOAL_PAGE) {
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
                            }, [])
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
                    <ViewTablesModal handleHideViewTablesModal={handleHideViewTablesModal} subPageName={subPageName} />
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
                            <th>STT</th>
                            <th>Tên trang</th>
                            <th>Quyền truy cập</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(pages).length > 0 &&
                            pages.map((menu_item, index) => {
                                let role = null;
                                let roles = menu_item?.roles;

                                switch (roles ? roles[0] : null) {
                                    case VITE_APP_TALENT_ENGINEER_CODE: {
                                        role = 'Kỹ Sư Tài Năng';
                                        break;
                                    }

                                    case VITE_APP_MAJOR_MANAGER_CODE: {
                                        role = 'Quản Lý Chuyên Ngành';
                                        break;
                                    }

                                    case VITE_APP_ADMIN_CODE: {
                                        role = 'Quản Trị Hệ Thống';
                                        break;
                                    }
                                    default:
                                        role = 'Chưa Xác Định';
                                        break;
                                }

                                return (
                                    <tr key={menu_item.id}>
                                        <td>{index + 1}.</td>
                                        <td className="name_menu">{menu_item?.name_menu}</td>
                                        <td>
                                            {menu_item?.allow ? (
                                                <span className="required_role">Tất Cả</span>
                                            ) : (
                                                <span className="required_role">{role}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="icon__show">Hoạt động</div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PageManagement;
