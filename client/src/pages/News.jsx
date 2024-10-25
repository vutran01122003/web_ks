import { useEffect } from 'react';
import { NewsItem } from '../components/News/NewsItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNews } from '../redux/actions/newsAction';
import { newsSelector, pageSelector } from '../redux/selector';

const News = () => {
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const news = useSelector(newsSelector);

    useEffect(() => {
        if (page?.pageName && !news.newsType[page?.pageName]) {
            dispatch(getAllNews({ newsType: page.pageName }));
        }
    }, [page?.pageName]);

    return (
        <>
            {news.newsType[page?.pageName] && (
                <div className="pageNews">
                    <header className="heading-4">{page?.pageName}</header>
                    {news.newsType[page?.pageName].newsList.length > 0 ? (
                        <>
                            {news.newsType[page?.pageName].newsList.map((news) => {
                                return (
                                    <NewsItem
                                        key={news._id}
                                        newsId={news._id}
                                        cover={news.cover}
                                        title={news.title}
                                        summary={news.summary}
                                        author={news.author}
                                        createdAt={news.createdAt}
                                    />
                                );
                            })}
                        </>
                    ) : (
                        <h4 className="notify_nothing_header">KHÔNG CÓ TIN TỨC</h4>
                    )}
                </div>
            )}
        </>
    );
};

export default News;
