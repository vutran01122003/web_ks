import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineCreate, MdOutlineSchool, MdManageAccounts } from 'react-icons/md';
import { CgBrowser } from 'react-icons/cg';
import { BiBookBookmark } from 'react-icons/bi';
import { HiOutlineNewspaper, HiOutlineUserGroup, HiOutlineClipboardList } from 'react-icons/hi';
import { RiHome3Fill } from 'react-icons/ri';
import { FaListCheck } from 'react-icons/fa6';

const {
    VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE,
    VITE_APP_TALENT_ENGINEER_CODE,
    VITE_APP_MAJOR_MANAGER_CODE,
    VITE_APP_ADMIN_CODE,
    VITE_APP_GOAL_PAGE,
    VITE_APP_NEWS_PAGE
} = import.meta.env;

export const ARRAY_LIST_MENU = [
    {
        roles: [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE],
        name_menu: 'Tổng Quan',
        icon_before: <RiHome3Fill />,
        to_link: '/',
        submenu: false
    },
    {
        roles: [VITE_APP_MAJOR_MANAGER_CODE],
        name_menu: 'Xét Duyệt Hoạt Động',
        icon_before: <FaListCheck />,
        to_link: '/activity',
        submenu: false
    },
    {
        roles: [VITE_APP_MAJOR_MANAGER_CODE],
        name_menu: 'Thống Kê Tiến Độ Hoàn Thành',
        icon_before: <HiOutlineClipboardList />,
        to_link: '/progress',
        submenu: false
    },
    {
        roles: [VITE_APP_MAJOR_MANAGER_CODE],
        name_menu: 'Quản lý Nhóm Chỉ Tiêu',
        icon_before: <TbTargetArrow />,
        to_link: '/goal',
        submenu: false
    },
    {
        roles: [VITE_APP_ADMIN_CODE],
        name_menu: 'Quản Lý Trang',
        icon_before: <CgBrowser />,
        to_link: '/page',
        submenu: false
    },
    // {
    //     roles: [VITE_APP_MAJOR_MANAGER_CODE],
    //     name_menu: 'Tạo Tin Tức & Thông Báo',
    //     icon_before: <MdOutlineCreate />,
    //     to_link: '/media',
    //     submenu: false
    // },
    // {
    //     name_menu: 'Tin Tức',
    //     allow: true,
    //     icon_before: <HiOutlineNewspaper />,
    //     dynamicPage: VITE_APP_NEWS_PAGE,
    //     submenu: true,
    //     sub_menu_item: []
    // },
    {
        name_menu: 'Nhóm Chỉ Tiêu Năm',
        roles: [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE],
        icon_before: <BiBookBookmark />,
        dynamicPage: VITE_APP_GOAL_PAGE,
        submenu: true,
        sub_menu_item: []
    },
    {
        name_menu: 'Quản Lý Sinh Viên',
        roles: [VITE_APP_MAJOR_MANAGER_CODE],
        to_link: '/student',
        icon_before: <HiOutlineUserGroup />,
        submenu: false
    },
    {
        name_menu: 'Quản Lý Khoa & Chuyên Ngành',
        roles: [VITE_APP_ADMIN_CODE],
        to_link: '/faculty',
        icon_before: <MdOutlineSchool />,
        submenu: false
    },
    {
        name_menu: 'Phân Quyền Người Dùng',
        roles: [VITE_APP_ADMIN_CODE],
        to_link: '/permission',
        icon_before: <MdManageAccounts />,
        submenu: false
    }
];
