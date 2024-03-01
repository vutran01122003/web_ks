import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineCreate, MdOutlineSchool, MdManageAccounts } from 'react-icons/md';
import { CgBrowser } from 'react-icons/cg';
import { BiBookBookmark } from 'react-icons/bi';
import { HiOutlineNewspaper, HiOutlineUserGroup, HiOutlineClipboardList } from 'react-icons/hi';
import { RiHome3Fill } from 'react-icons/ri';
import { FaListCheck } from 'react-icons/fa6';

const { VITE_APP_TALENTED_ENGINEER_CODE, VITE_APP_FACULTY_MANAGER_CODE, VITE_APP_ADMIN_CODE } = import.meta.env;

export const ARRAY_LIST_MENU = [
    {
        id: 0,
        role: VITE_APP_TALENTED_ENGINEER_CODE,
        name_menu: 'Tổng Quan',
        icon_before: <RiHome3Fill />,
        to_link: '/',
        submenu: false
    },
    {
        id: 1,
        role: VITE_APP_FACULTY_MANAGER_CODE,
        name_menu: 'Xét Duyệt Hoạt Động',
        icon_before: <FaListCheck />,
        to_link: '/activity-approval',
        submenu: false
    },
    {
        id: 2,
        role: VITE_APP_FACULTY_MANAGER_CODE,
        name_menu: 'Thống Kê Tiến Độ Hoàn Thành',
        icon_before: <HiOutlineClipboardList />,
        to_link: '/progress',
        submenu: false
    },
    {
        id: 3,
        role: VITE_APP_FACULTY_MANAGER_CODE,
        name_menu: 'Tạo Nhóm Chỉ Tiêu',
        icon_before: <TbTargetArrow />,
        to_link: '/goals',
        submenu: false
    },
    {
        id: 5,
        role: VITE_APP_FACULTY_MANAGER_CODE,
        name_menu: 'Quản Lý Trang',
        icon_before: <CgBrowser />,
        to_link: '/pages',
        submenu: false,
        list: 'Chỉ tiêu'
    },
    {
        id: 6,
        role: VITE_APP_FACULTY_MANAGER_CODE,
        name_menu: 'Tạo Tin Tức & Thông Báo',
        icon_before: <MdOutlineCreate />,
        to_link: '/create-news',
        submenu: false
    },
    {
        id: 7,
        name_menu: 'Tin Tức',
        allow: true,
        icon_before: <HiOutlineNewspaper />,
        dynamicPage: 'news',
        submenu: true,
        sub_menu_item: []
    },
    {
        id: 8,
        name_menu: 'Nhóm Chỉ Tiêu Năm',
        role: VITE_APP_TALENTED_ENGINEER_CODE,
        icon_before: <BiBookBookmark />,
        dynamicPage: 'goals',
        submenu: true,
        sub_menu_item: []
    },
    {
        id: 9,
        name_menu: 'Quản Lý Sinh Viên',
        role: VITE_APP_FACULTY_MANAGER_CODE,
        to_link: '/manage_student',
        icon_before: <HiOutlineUserGroup />,
        submenu: false
    },
    {
        id: 10,
        name_menu: 'Quản Lý Khoa & Chuyên Ngành',
        role: VITE_APP_FACULTY_MANAGER_CODE,
        to_link: '/faculty',
        icon_before: <MdOutlineSchool />,
        submenu: false
    },
    {
        id: 11,
        name_menu: 'Phân Quyền Người Dùng',
        role: VITE_APP_ADMIN_CODE,
        to_link: '/permission',
        icon_before: <MdManageAccounts />,
        submenu: false
    }
];
