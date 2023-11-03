import { useParams, useLocation } from 'react-router-dom'
import NotFound from '../../pages/NotFound'
import { useEffect, useState} from 'react'
import { useSelector } from 'react-redux'

function PageRender() {
	const { page, id } = useParams()
	const location = useLocation()
	const pathName = location.pathname;
	const [PageComponent, setPageComponent] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const privatePages = ['create_goals', 'create_news', ];

    const auth = useSelector(state => state.auth);
	const pageName = id
		? `${page?.replace(/\w/, page?.charAt(0).toUpperCase())}/[id]`
		: page?.replace(/\w/, page?.charAt(0).toUpperCase())

	useEffect(() => {
        if (pathName.includes('/page/')) {
            import(/* @vite-ignore */ '../../pages/DynamicPage')
			.then((module) => {
                setPageComponent(module);
				setNotFound(false);
			})
			.catch((e) => {
                setPageComponent(null);
				setNotFound(true);
			});
        } else {
            if(page === 'create_goals' && !auth?.user.roles.includes("0004")) {
                setNotFound(true);
                setPageComponent(null);

            } else {
                import(/* @vite-ignore */ `../../pages/${pageName}`)
                .then((module) => {
                    setPageComponent(module);
                    setNotFound(false);
                })
                .catch((e) => {
                    setPageComponent(null);
                    setNotFound(true);
                });
            }

           
        }		
	}, [page, id, setPageComponent, auth?.user]);

	if(PageComponent && !notFound) {
        const Component = PageComponent.default;
        return <Component/>;
    } 

	if(notFound && !PageComponent) {
        return <NotFound />;
    }

	return null;
}

export default PageRender
