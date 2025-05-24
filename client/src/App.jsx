import { Fragment, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/dist';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Apply from './pages/Apply';
import SocketIO from './Socket.io';
import NotFound from './pages/NotFound';
import Alert from './components/Toast/Alert';
import PageRender from './config/routes/PageRender';
import FirstLogin from './components/Login/FirstLogin';
import { authSelector, facultySelector } from './redux/selector';
import { verifyAccessToken } from './redux/actions/authAction';
import { getNumUnreadNotification } from './redux/actions/notifyAction';
import { getFacultyByName, getMajors } from './redux/actions/facultyAction';
import { FaExclamationTriangle } from 'react-icons/fa';

const App = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const auth = useSelector(authSelector);
    const facultyState = useSelector(facultySelector);
    const [showMobileWarning, setShowMobileWarning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const user = auth?.user;
    const pathName = location.pathname;
    const groupCodeList = user?.groups.map((group) => group.groupCode);

    useEffect(() => {
        dispatch(verifyAccessToken()).finally(() => setIsLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (window.innerWidth <= 800) setShowMobileWarning(true);
    }, []);

    useEffect(() => {
        if (user) {
            dispatch(getNumUnreadNotification({ userId: user._id }));
            if (!facultyState.faculty && !groupCodeList.includes('004'))
                dispatch(getFacultyByName({ facultyName: user?.faculty?.facultyName }));
            if (groupCodeList.includes('003')) dispatch(getMajors({ managerId: user._id }));
        }
    }, [user, dispatch]);

    if (isLoading) return null;

    return showMobileWarning ? (
        <div className="show_mobile_warning">
            <div className="mobile-warning">
                <div className="warning-card">
                    <FaExclamationTriangle className="warning-icon" />
                    <h1>Không hỗ trợ thiết bị di động</h1>
                    <p>Vui lòng sử dụng trình duyệt trên máy tính để tiếp tục.</p>
                </div>
            </div>
        </div>
    ) : (
        <Fragment>
            <Alert />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/apply" element={<Apply />} />
                <Route
                    path="/"
                    element={
                        user ? (
                            <Fragment>
                                <Layout auth={auth} pathName={pathName} groupCodeList={groupCodeList} />
                                <SocketIO auth={auth} />
                            </Fragment>
                        ) : auth?.firstLogin ? (
                            <FirstLogin />
                        ) : (
                            <Login />
                        )
                    }
                >
                    <Route index element={<Home auth={auth} />} />
                    <Route path="/home" element={<Home auth={auth} />} />
                    <Route path="/:page" element={<PageRender />} />
                    <Route path="/:page/:id" element={<PageRender />} />
                    <Route path="/page/:dynamicPage" element={<PageRender />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Fragment>
    );
};

export default App;
