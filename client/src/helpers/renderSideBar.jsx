import { ARRAY_LIST_MENU } from '../assets/data/menu';

export const renderSideBar = ({ auth, page, levelYear }) => {
    ARRAY_LIST_MENU.forEach((menuItem) => {
        if (menuItem.dynamicPage && menuItem.dynamicPage === 'news') {
            menuItem.sub_menu_item = page.pages.reduce((intialArr, page) => {
                if (page.pageType === 'tin tức') {
                    return [
                        ...intialArr,
                        {
                            id: page._id,
                            sub_page_type: page.pageType,
                            sub_name_menu: page.pageName,
                            sub_icon_before: '?',
                            sub_to_link: `/page/${page.pageName}`
                        }
                    ];
                }
                return intialArr;
            }, []);
        }

        if (menuItem.dynamicPage && menuItem.dynamicPage === 'goals') {
            menuItem.sub_menu_item = page.pages.reduce((intialArr, page) => {
                if (
                    page.pageType === 'chỉ tiêu' &&
                    page.pageStudentCohort === auth?.user.cohort &&
                    page.pageFaculty === auth?.user.faculty &&
                    page.pageStudentMajor === auth?.user.major &&
                    page.pageStudentLevelYear === Number.parseInt(levelYear)
                ) {
                    return [
                        ...intialArr,
                        {
                            id: page._id,
                            sub_page_type: page.pageType,
                            sub_name_menu: page.pageName,
                            sub_icon_before: '?',
                            sub_to_link: `/page/${page.pageName}`
                        }
                    ];
                }
                return intialArr;
            }, []);
        }
    });
};
