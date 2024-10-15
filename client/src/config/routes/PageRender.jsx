import { useParams, useLocation } from 'react-router-dom';
import NotFound from '../../pages/NotFound';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector';

const pages = import.meta.glob('../../pages/**/*.jsx');

function PageRender() {
    const { page, id } = useParams();
    const location = useLocation();
    const pathName = location.pathname;
    const [PageComponent, setPageComponent] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const auth = useSelector(authSelector);
    const pageName = id
        ? `${page?.replace(/\w/, page?.charAt(0).toUpperCase())}/[id]`
        : page?.replace(/\w/, page?.charAt(0).toUpperCase());

    useEffect(() => {
        const pagePath = `../../pages/${pathName.includes('/page/') ? 'DynamicPage' : pageName}.jsx`;
        if (pages[pagePath]) {
            pages[pagePath]().then((module) => {
                setPageComponent(module);
                setNotFound(false);
            });
        } else {
            setPageComponent(null);
            setNotFound(true);
        }
    }, [page, id, setPageComponent, auth?.user, pathName]);

    if (PageComponent && !notFound) {
        const Component = PageComponent.default;
        return <Component />;
    }

    if (notFound && !PageComponent) {
        return <NotFound />;
    }

    return null;
}

export default PageRender;
