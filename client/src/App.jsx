import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom/dist'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import PageRender from './config/routes/PageRender'
import { useEffect } from 'react'
import { authSelector } from './redux/selector'
import { verifyAccessToken } from './redux/actions/authAction'
import Alert from './components/ComponentToast/Alert'
import FirstLogin from './components/ComponentFirstLogin/FirstLogin'
import NotFound from './pages/NotFound'
import { getPage } from './redux/actions/pageAction'
import { getPeddingRows } from './redux/actions/rowAction'
import Apply from './pages/Apply'

const App = () => {
	const dispatch = useDispatch()
	const auth = useSelector(authSelector)
	const location = useLocation()
	const pathName = location.pathname

	useEffect(() => {
		dispatch(verifyAccessToken())
		dispatch(getPage({ pathName }))
	}, [dispatch])

	return (
		<>
			<Alert />
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/apply" element={<Apply />} />
				<Route
					path="/"
					element={
						auth?.user ? (
							<Layout auth={auth} />
						) : auth?.firstLogin ? (
							<FirstLogin
								studentId={auth.firstLogin.studentId}
								birthday={auth.firstLogin.birthday}
							/>
						) : (
							<Login />
						)
					}
				>   
                    <Route path="/home" element={<Home auth={auth}/>} />
					<Route index element={<Home auth={auth} />} />
					<Route path="/:page" element={<PageRender />} />
					<Route path="/:page/:id" element={<PageRender />} />
					<Route path="/page/:dynamicPage" element={<PageRender />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</>
	)
}

export default App;
