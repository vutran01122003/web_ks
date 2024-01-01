import { useEffect, useState } from 'react';
import {ARRAY_LIST_MENU} from '../assets/data/menu';
import AddTableModal from '../components/ComponentModal/AddTableModal';
import RemoveTableModal from '../components/ComponentModal/RemoveTableModal';
import ViewTablesModal from '../components/ComponentModal/ViewTablesModal';
import RemovePageModal from '../components/ComponentModal/RemovePageModal';
import { useSelector } from 'react-redux';
import { pageSelector } from '../redux/selector';

function ManagePagesPage() {
    const page = useSelector(pageSelector);
    const [pages, setPages] = useState({});
    const [openAddTableModal, setOpenAddTableModal] = useState(false);
    const [openRemoveTableModal, setOpenRemoveTableModal] = useState(false);
    const [openViewTablesModal, setOpenViewTablesModal] = useState(false);
    const [openRemovePageModal, setOpenRemovePageModal] = useState(false);
    const [pageId, setPageId] = useState(null);
    const [subPageName, setSubPageName] = useState("");

    const handleOpenAddTableModal = ({pageId, pageName}) => {
        setOpenAddTableModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
    }

    const handleHideAddTableModal = () => {
        setOpenAddTableModal(false);
    }

    const handleOpenRemoveTableModal = ({pageId, pageName}) => {
        setOpenRemoveTableModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
    }

    const handleHideRemoveTableModal = () => {
        setOpenRemoveTableModal(false);
    }

    const handleOpenViewTablesModal = ({pageName}) => {
        setOpenViewTablesModal(true);
        setSubPageName(pageName);
    }

    const handleHideViewTablesModal = () => {
        setOpenViewTablesModal(false);
    }

    const handleOpenRemovePageModal = ({pageId, pageName}) => {
        setOpenRemovePageModal(true);
        setSubPageName(pageName);
        setPageId(pageId);
    }

    const handleHideRemovePageModal = () => {
        setOpenRemovePageModal(false);
    }

    useEffect(() => {
        setPages(ARRAY_LIST_MENU);
    }, []);

    useEffect(() => {
        if (page.pages && Object.keys(pages).length > 0) {
            setPages(prev => {
                const menu = [...prev];
                for(let menuItem of menu) {
                    if(menuItem.dynamicPage && menuItem.dynamicPage === 'goals') {
                        menuItem =  {
                            ...menuItem, 
                            sub_menu_item: page.pages.reduce((initialArr, page) => {
                                if(page.pageType === "chỉ tiêu") {
                                    return [    
                                        ...initialArr,
                                        {
                                            id: page?._id,
                                            sub_page_type: page.pageType,
                                            sub_name_menu: page?.pageName,
                                            sub_icon_before: '?',
                                            sub_to_link: `/page/${page?.pageName}`,
                                        }
                                    ]
                                }
                                return initialArr;
                            }, [])
                        };
                        break;
                    }
                }
                return menu;
            })
        }
    }, [JSON.stringify(page.pages)]);

    return <div className='pages_management_container'>
        {
            openAddTableModal && 
            <AddTableModal 
                handleHideAddTableModal={handleHideAddTableModal}
                subPageName={subPageName}
                pageId={pageId}
            />
        }

        {
            openRemoveTableModal &&
            <RemoveTableModal 
                handleHideRemoveTableModal={handleHideRemoveTableModal}
                subPageName={subPageName}
                pageId={pageId}
            />
        }

        {
            openViewTablesModal && 
            <ViewTablesModal 
                handleHideViewTablesModal={handleHideViewTablesModal}
                subPageName={subPageName}
            />
        }

        {
            openRemovePageModal &&
            <RemovePageModal
                handleHideRemovePageModal={handleHideRemovePageModal}
                subPageName={subPageName}
                pageId={pageId}
            />
        }

        <ul>
            {
                Object.keys(pages).length > 0 && pages.map((menu_item, index) => {
                    return (
                        <li className='menu_item' key={menu_item.id}>
                            <div className='menu_item_label'>
                                <span className='menu_item_name'> 
                                    {menu_item?.name_menu}
                                </span>
                                
                                {
                                    menu_item?.allow ? 
                                    <span className='required_role'>Tất Cả Người Dùng</span> : 
                                    <>
                                        {
                                            menu_item?.roles.map((role) => {
                                                let job = null;

                                                switch (role) {
                                                    case "0001": {
                                                        job = "Sinh Viên"
                                                        break;
                                                    }
                                                        
                                                    case "0002": {
                                                        job = "Kỹ Sư Tài Năng"
                                                        break;
                                                    }

                                                    case "0003": {
                                                        job = "Quản Trị Viên Nội Dung Website"
                                                        break;
                                                    }

                                                    case "0004": {
                                                        job = "Quản Trị Viên Cấu Trúc Website"
                                                        break;
                                                    }
                                                    default:
                                                        break;
                                                }
                                                return  <span className='required_role' key={role}>{job}</span>
                                            }) 
                                        }
                                    </>
                                }
                            </div>
                            
                            {
                                menu_item?.sub_menu_item && 
                                menu_item?.sub_menu_item.length > 0 ?
                                <ul className='sub_menu_ul'>
                                {   
                                    menu_item?.sub_menu_item.map((sub_menu_item) => (
                                            <li className='sub_menu_item' key={sub_menu_item?.id}>
                                                <span className='sub_menu_item_name'>
                                                    {sub_menu_item?.sub_name_menu}
                                                </span>
                                                
                                                {
                                                    sub_menu_item?.sub_to_link.includes("/page/") &&
                                                    <div className='sub_menu_item_btn_wrapper'>
                                                        {
                                                            sub_menu_item?.sub_page_type === "Chỉ Tiêu" &&
                                                            <>
                                                                <button 
                                                                    className='watch_table_btn'
                                                                    onClick={() => {handleOpenViewTablesModal({
                                                                        pageName: sub_menu_item?.sub_name_menu
                                                                    })}}
                                                                >
                                                                    Xem Các Chỉ Tiêu
                                                                </button>

                                                                <button 
                                                                    className='add_table_btn'
                                                                    onClick={() => {
                                                                        handleOpenAddTableModal({
                                                                            pageId: sub_menu_item?.id,
                                                                            pageName: sub_menu_item?.sub_name_menu
                                                                        })
                                                                    }}
                                                                >
                                                                    Thêm Chỉ Tiêu
                                                                </button>

                                                                <button 
                                                                    className='remove_table_btn'
                                                                    onClick={() => {
                                                                        handleOpenRemoveTableModal({
                                                                            pageId: sub_menu_item.id,
                                                                            pageName: sub_menu_item?.sub_name_menu
                                                                        })
                                                                    }}
                                                                >
                                                                    Xoá Chỉ Tiêu
                                                                </button>
                                                            </>
                                                        }
                                                        <button 
                                                            className='remove_page_btn'
                                                            onClick={() => {
                                                                handleOpenRemovePageModal({
                                                                    pageId: sub_menu_item.id,
                                                                    pageName: sub_menu_item?.sub_name_menu
                                                                })
                                                            }}
                                                        >
                                                            Xóa Trang
                                                        </button>
                                                    </div>
                                                }
                                            </li>
                                        ))
                                    }
                                </ul> : <></>
                            }
                        </li>       
                    )
                })
            }
        </ul>
    </div>;
}

export default ManagePagesPage;