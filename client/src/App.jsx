import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/dist';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Apply from './pages/Apply';
import SocketIO from './Socket.io';
import NotFound from './pages/NotFound';
import Alert from './components/ComponentToast/Alert';
import PageRender from './config/routes/PageRender';
import { authSelector } from './redux/selector';
import { verifyAccessToken } from './redux/actions/authAction';
import { getPage } from './redux/actions/pageAction';
import FirstLogin from './components/ComponentFirstLogin/FirstLogin';
import { getNumUnreadNotification } from './redux/actions/notifyAction';

const App = () => {
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const location = useLocation();
    const pathName = location.pathname;
    const groupCode = auth?.user?.group.groupCode;

    useEffect(() => {
        dispatch(verifyAccessToken());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getPage({ pathName }));
    }, [dispatch, pathName]);

    useEffect(() => {
        if (auth?.user) {
            dispatch(getNumUnreadNotification({ userId: auth?.user._id }));
        }
    }, [auth]);

    return (
        <>
            <Alert />
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/apply' element={<Apply />} />
                <Route
                    path='/'
                    element={
                        auth?.user ? (
                            <>
                                <Layout auth={auth} pathName={pathName} groupCode={groupCode} />
                                <SocketIO auth={auth} />
                            </>
                        ) : auth?.firstLogin ? (
                            <FirstLogin userId={auth.firstLogin.userId} birthday={auth.firstLogin.birthday} />
                        ) : (
                            <Login />
                        )
                    }
                >
                    <Route index element={<Home auth={auth} />} />
                    <Route path='/home' element={<Home auth={auth} />} />
                    <Route path='/:page' element={<PageRender />} />
                    <Route path='/:page/:id' element={<PageRender />} />
                    <Route path='/page/:dynamicPage' element={<PageRender />} />
                    <Route path='*' element={<NotFound />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
