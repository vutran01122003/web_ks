import {TbTargetArrow} from 'react-icons/tb';
import { MdLightbulbOutline, MdOutlineCreate} from 'react-icons/md';
import { CgBrowser } from 'react-icons/cg';
import { BiBookBookmark, BiHomeSmile } from 'react-icons/bi';
import { HiOutlineNewspaper } from 'react-icons/hi'
import { BsTags } from 'react-icons/bs';

export const ARRAY_LIST_MENU =  [
        {
            id: 0,
            allow: true,
            name_menu: 'Tổng Quan',
            icon_before: <BiHomeSmile />,
            to_link: '/',
            submenu: false
        },
        {
            id: 1,
            roles: ['0004'],
            name_menu: 'Thêm Nhóm Chỉ Tiêu',
            icon_before: <TbTargetArrow />,
            to_link: '/create_goals',
            submenu: false
        },
        {
            id: 2,
            roles: ['0004'],
            name_menu: 'Thêm Loại Tin Tức',
            icon_before: <BsTags />,
            to_link: '/create_news',
            submenu: false
        },
        {
            id: 3,
            roles: ['0004'],
            name_menu: 'Quản Lý Trang',
            icon_before: <CgBrowser />,
            to_link: '/manage_pages',
            submenu: false
        },
        {
            id: 4,
            roles: ['0003'],
            name_menu: 'Tạo Tin Tức',
            icon_before: <MdOutlineCreate />,
            to_link: '/create_news',
            submenu: false
        },
        {
            id: 5,
            name_menu: 'Tin Tức',
            allow: true,
            icon_before: <HiOutlineNewspaper />,
            to_link: '/news',
            submenu: false
        },
        {
            id: 6,
            name_menu: 'Chỉ Tiêu',
            roles: ['0002'],
            icon_before: <BiBookBookmark />,
            submenu: true,
            sub_menu_item: []
        },
        {
            id: 7,
            roles: ['0002'],
            name_menu: 'Ngoại Khoá',
            icon_before: <MdLightbulbOutline />,
            submenu: true,
            sub_menu_item: [
                {
                    id: 0,
                    sub_name_menu: 'Tiến độ kế hoạch',
                    sub_icon_before: '?',
                    sub_to_link: '/plan'
                },
                {
                    id: 1,
                    sub_name_menu: 'Bằng cấp và chứng chỉ',
                    sub_icon_before: '?',
                    sub_to_link: '/degress'
                },
                {
                    id: 2,
                    sub_name_menu: 'Quá trình đào tạo',
                    sub_icon_before: '?',
                    sub_to_link: '/traning'
                },
                {
                    id: 3,
                    sub_name_menu: 'Thành tích',
                    sub_icon_before: '?',
                    sub_to_link: '/achievements'
                },
                {
                    id: 4,
                    sub_name_menu: 'Lập kế hoạch học tập',
                    sub_icon_before: '?',
                    sub_to_link: '/study'
                }
            ]
        }
    ];

