import { Outlet, Navigate } from 'react-router-dom';
import LayoutSideBar from '../Menu/LayoutSideBar';
import TopHeader from './TopHeader';

const {
    VITE_APP_TALENT_ENGINEER_CODE,
    VITE_APP_FACULTY_MANAGER_CODE,
    VITE_APP_ADMIN_CODE,
    VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE
} = import.meta.env;

const defaultPathMapping = {
    [VITE_APP_FACULTY_MANAGER_CODE]: '/activity',
    [VITE_APP_ADMIN_CODE]: '/faculty'
};

function Layout({ auth, pathName, groupCode }) {
    return (
        <div className="wrap__layout">
            <LayoutSideBar auth={auth} />
            <div className="main__body">
                <main>
                    <TopHeader auth={auth} />
                    <div className="main">
                        {['/', '/home'].includes(pathName) &&
                            [VITE_APP_FACULTY_MANAGER_CODE, VITE_APP_ADMIN_CODE].includes(groupCode) && (
                                <Navigate to={defaultPathMapping[groupCode]} replace />
                            )}

                        {(!['/', '/home'].includes(pathName) ||
                            [VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_TEMPORARY_TALENT_ENGINEER_CODE].includes(
                                groupCode
                            )) && <Outlet />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
