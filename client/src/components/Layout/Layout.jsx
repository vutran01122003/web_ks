import { Outlet, Navigate } from 'react-router-dom';
import LayoutSideBar from '../ComponentMenu/LayoutSideBar';
import TopHeader from '../ComponentHeader/TopHeader';
function Layout({ auth, pathName, groupCode }) {
    const { VITE_APP_TALENTED_ENGINEER_CODE, VITE_APP_FACULTY_MANAGER_CODE, VITE_APP_ADMIN_CODE } = import.meta.env;

    return (
        <>
            <div className='wrap__layout'>
                <LayoutSideBar auth={auth} />
                <div className='main__body'>
                    <main>
                        <TopHeader auth={auth} />
                        <div className='main'>
                            {(pathName === '/' || pathName === '/home') &&
                                groupCode === VITE_APP_FACULTY_MANAGER_CODE && <Navigate to='/ListGoals' replace />}

                            {(pathName === '/' || pathName === '/home') && groupCode === VITE_APP_ADMIN_CODE && (
                                <Navigate to='/activity-approval' replace />
                            )}

                            {(pathName !== '/' ||
                                pathName !== '/home' ||
                                groupCode === VITE_APP_TALENTED_ENGINEER_CODE) && <Outlet />}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

export default Layout;
