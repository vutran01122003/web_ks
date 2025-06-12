import { Outlet, Navigate } from 'react-router-dom';
import LayoutSideBar from '../Menu/LayoutSideBar';
import TopHeader from './TopHeader';

const {
    VITE_APP_TALENT_ENGINEER_CODE,
    VITE_APP_MAJOR_MANAGER_CODE,
    VITE_APP_ADMIN_CODE,
    VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE
} = import.meta.env;

const defaultPathMapping = {
    [VITE_APP_MAJOR_MANAGER_CODE]: '/activity',
    [VITE_APP_ADMIN_CODE]: '/details-faculty'
};

function Layout({ auth, pathName, groupCodeList }) {
    const paths = ['/', '/home'];
    const cond1 = groupCodeList.includes(VITE_APP_MAJOR_MANAGER_CODE) || groupCodeList.includes(VITE_APP_ADMIN_CODE);
    const cond2 =
        groupCodeList.includes(VITE_APP_TALENT_ENGINEER_CODE) ||
        groupCodeList.includes(VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE);

    return (
        <div className="wrap__layout">
            <LayoutSideBar auth={auth} />
            <div className="main__body">
                <main>
                    <TopHeader auth={auth} />
                    <div className="main">
                        {paths.includes(pathName) && cond1 && (
                            <Navigate to={defaultPathMapping[groupCodeList[0]]} replace />
                        )}

                        {(!paths.includes(pathName) || cond2) && <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
