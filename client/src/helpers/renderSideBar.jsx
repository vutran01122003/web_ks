import { ARRAY_LIST_MENU } from '../shared/menu';

const { VITE_APP_GOAL_PAGE, VITE_APP_NEWS_PAGE } = import.meta.env;

export const renderSideBar = ({ auth, page, levelYear }) => {
    const user = auth?.user;

    ARRAY_LIST_MENU.forEach((menuItem) => {
        if (menuItem.dynamicPage && menuItem.dynamicPage === VITE_APP_NEWS_PAGE) {
            menuItem.sub_menu_item = page.pages.reduce((intialArr, page) => {
                if (page.pageType === VITE_APP_NEWS_PAGE) {
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

        if (menuItem.dynamicPage && menuItem.dynamicPage === VITE_APP_GOAL_PAGE) {
            menuItem.sub_menu_item = page.pages.reduce((intialArr, page) => {
                if (
                    page.pageType === VITE_APP_GOAL_PAGE &&
                    page.pageStudentCohort === user?.cohort.cohortName &&
                    page.pageFaculty === user?.faculty.facultyName &&
                    page.pageStudentMajor === user?.major.majorName &&
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
