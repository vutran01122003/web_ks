import { Outlet, Navigate } from 'react-router-dom';
import LayoutSideBar from '../Menu/LayoutSideBar';
import TopHeader from './TopHeader';

const { VITE_APP_TALENT_ENGINEER_CODE, VITE_APP_FACULTY_MANAGER_CODE, VITE_APP_ADMIN_CODE } = import.meta.env;

function Layout({ auth, pathName, groupCode }) {
    return (
        <div className="wrap__layout">
            <LayoutSideBar auth={auth} />
            <div className="main__body">
                <main>
                    <TopHeader auth={auth} />
                    <div className="main">
                        {(pathName === '/' || pathName === '/home') && groupCode === VITE_APP_FACULTY_MANAGER_CODE && (
                            <Navigate to="/activity" replace />
                        )}

                        {(pathName === '/' || pathName === '/home') && groupCode === VITE_APP_ADMIN_CODE && (
                            <Navigate to="/faculty" replace />
                        )}

                        {(pathName !== '/' || pathName !== '/home' || groupCode === VITE_APP_TALENT_ENGINEER_CODE) && (
                            <Outlet />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
