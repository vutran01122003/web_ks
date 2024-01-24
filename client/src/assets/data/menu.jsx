import {TbTargetArrow} from 'react-icons/tb';
import { MdOutlineForum, MdOutlineCreate} from 'react-icons/md';
import { CgBrowser } from 'react-icons/cg';
import { BiBookBookmark } from 'react-icons/bi';
import { HiOutlineNewspaper } from 'react-icons/hi'
import { BsTags } from 'react-icons/bs';
import { RiHome3Fill } from 'react-icons/ri';
import { BsFillClipboard2CheckFill } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { HiOutlineClipboardList } from "react-icons/hi";

export const ARRAY_LIST_MENU =  [
        {
            id: 0,
            allow: true,
            name_menu: 'Tổng Quan',
            icon_before: <RiHome3Fill />,
            to_link: '/',
            submenu: false
        },
        {
            id: 1,
            roles: ['0004'],
            name_menu: 'Xét Duyệt Hoạt Động',
            icon_before: <FaListCheck />,
            to_link: '/ListGoals',
            submenu: false,
        },
        {
            id: 2,
            roles: ['0004'],
            name_menu: 'Thống Kê Tiến Độ Hoàn Thành',
            icon_before: <HiOutlineClipboardList />,
            to_link: '/CompletionShedule',
            submenu: false,
        },
        {
            id: 3,
            roles: ['0004'],
            name_menu: 'Quản lý Chỉ Tiêu',
            icon_before: <TbTargetArrow />,
            to_link: '/Create_goals',
            submenu: false,
        },
        {
            id: 4,
            roles: ['0004'],
            name_menu: 'Quản lý Tin Tức',
            icon_before: <BsTags />,
            to_link: '/Create_news_type',
            submenu: false
        },
        {
            id: 5,
            roles: ['0004'],
            name_menu: 'x',
            icon_before: <CgBrowser />,
            to_link: '/manage_pages2',
            submenu: false,
            list:"Chỉ tiêu"
        },
        {
            id: 6,
            roles: ['0003'],
            name_menu: 'x',
            icon_before: <MdOutlineCreate />,
            to_link: '/Create_news',
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
            roles: ['0002'],
            icon_before: <BiBookBookmark />,
            dynamicPage: 'goals',
            submenu: true,
            isSetYear:true,
            setSubMenuYear:[
                {
                    id: 0,
                    name:"Năm 1",
                    sub_menu_item_goast:[
                        {
                            id:0,
                            name_goast:"goast 1"
                        },
                        {
                            id:1,
                            name_goast:"goast 2"
                        },
                    ]
                },
                {
                    id: 1,
                    name:"Năm 2",
                    sub_menu_item_goast:[
                        {
                            id:0,
                            name_goast:"goast 1"
                        },
                    ]
                },
                {
                    id: 2,
                    name:"Năm 3",
                },
                {
                    id: 3,
                    name:"Năm 4",
                },
                {
                    id: 4,
                    name:"Năm 5",
                },
                
            ],
            sub_menu_item: [],
        },
        // cái qlsv này chỉ có trong 004 thôi nhé
        {
            id: 9,
            allow: true,
            name_menu: 'Quản Lý Sinh Viên',
            roles: ['0004'],
            to_link: '/manage_student',
            icon_before: <MdManageAccounts />,
            submenu: false,
        },
        {
            id: 10,
            allow: true,
            name_menu: 'Forum',
            to_link: '/Forum',
            icon_before: <MdOutlineForum />,
            submenu: false,
        }
    ];

