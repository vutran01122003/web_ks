import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineSchool, MdManageAccounts } from 'react-icons/md';
import { BiBookBookmark } from 'react-icons/bi';
import { IoMdTime } from 'react-icons/io';
import { HiOutlineUserGroup, HiOutlineClipboardList } from 'react-icons/hi';
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
        name_menu: 'Thống Kê Tiến Độ',
        icon_before: <HiOutlineClipboardList />,
        to_link: '/progress',
        submenu: false
    },
    {
        roles: [VITE_APP_MAJOR_MANAGER_CODE],
        name_menu: 'Thêm Nhóm Chỉ Tiêu',
        icon_before: <TbTargetArrow />,
        to_link: '/goal-creation',
        submenu: false
    },
    {
        roles: [VITE_APP_MAJOR_MANAGER_CODE],
        name_menu: 'Quản lý Nhóm Chỉ Tiêu',
        icon_before: <HiOutlineClipboardList />,
        to_link: '/goal-management',
        submenu: false
    },
    {
        roles: [VITE_APP_MAJOR_MANAGER_CODE],
        name_menu: 'Quản lý Thời Hạn',
        icon_before: <IoMdTime />,
        to_link: '/deadline',
        submenu: false
    },
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
        name_menu: 'Khoa Và Chuyên Ngành',
        roles: [VITE_APP_ADMIN_CODE],
        to_link: '/faculty',
        icon_before: <MdOutlineSchool />,
        submenu: true,
        sub_menu_item: [
            {
                sub_name_menu: 'Danh sách khoa',
                sub_to_link: '/details-faculty'
            },
            {
                sub_name_menu: 'Danh sách chuyên ngành',
                sub_to_link: '/details-major'
            },
            {
                sub_name_menu: 'Danh sách khóa',
                sub_to_link: '/details-cohort'
            }
        ]
    },
    {
        name_menu: 'Danh sách QLCN',
        roles: [VITE_APP_ADMIN_CODE],
        to_link: '/manager',
        icon_before: <MdManageAccounts />,
        submenu: false
    }
];
