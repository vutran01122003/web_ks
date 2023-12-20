import { Outlet } from 'react-router-dom';
import LayoutSideBar from '../ComponentMenu/LayoutSideBar';
import TopHeader from '../ComponentHeader/TopHeader';
import Modal from '../ComponentModal/Modal';
import Footer from '../ComponentFooter/Footer';
function Layout({auth}) {
    return (
        <>
            <div className='wrap__layout'>
                <LayoutSideBar auth={auth}/>
                <div className='main__body'>
                    <main>
                        <TopHeader auth={auth} />
                        <div className='main'>
                            <Outlet />
                            {/* <Footer/> */}
                        </div>
                    </main>
                </div>
                {/* <Modal/> */}
            </div>
        </>
    );
}

export default Layout;
