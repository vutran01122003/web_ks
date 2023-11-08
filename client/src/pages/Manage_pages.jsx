import { useState } from 'react';
import {ARRAY_LIST_MENU} from '../assets/data/menu';
import AddTableModal from '../components/ComponentModal/AddTableModal';
import RemoveTableModal from '../components/ComponentModal/RemoveTableModal';
import ViewTablesModal from '../components/ComponentModal/ViewTablesModal';

function ManagePagesPage() {
    const [openAddTableModal, setOpenAddTableModal] = useState(false);
    const [openRemoveTableModal, setOpenRemoveTableModal] = useState(false);
    const [openViewTablesModal, setOpenViewTablesModal] = useState(false);
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

    const handleOpenViewTablesModal = () => {
        setOpenViewTablesModal(true);
    }

    const handleHideViewTablesModal = () => {
        setOpenViewTablesModal(false);
    }
 
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
            />
        }
        <ul>
            {
                ARRAY_LIST_MENU.map((menu_item, index) => {
                    return (
                        <li className='menu_item' key={index + menu_item.name_menu}>
                            <span className='menu_item_name'> 
                                {menu_item.name_menu}
                            </span>
                            <>
                                {
                                    menu_item?.allow ? 
                                    <span className='required_role'>Tất Cả Người Dùng</span>:
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
                            </>
                            {
                                menu_item?.sub_menu_item &&
                                <ul className='sub_menu_ul'>
                                {   
                                    menu_item?.sub_menu_item.map((sub_menu_item, index) => (
                                            <li className='sub_menu_item' key={index + sub_menu_item?.sub_name_menu}>
                                                <span className='sub_menu_item_name'>
                                                    {sub_menu_item?.sub_name_menu}
                                                </span>
                                                
                                                {
                                                    sub_menu_item.sub_to_link.includes("/page/") &&
                                                    <div className='sub_menu_item_btn_wrapper'>
                                                        <button 
                                                            className='watch_table_btn'
                                                            onClick={() => {handleOpenViewTablesModal()}}
                                                        >
                                                            Xem Các Chỉ Tiêu
                                                        </button>

                                                        <button 
                                                            className='add_table_btn'
                                                            onClick={() => {
                                                                handleOpenAddTableModal({
                                                                    pageId: sub_menu_item.id,
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
                                                        <button className='remove_page_btn'>Xóa Page</button>
                                                    </div>
                                                }
                                            </li>
                                        ))
                                    }
                                </ul>
                            }
                        </li>       
                    )
                })
            }
        </ul>
    </div>;
}

export default ManagePagesPage;