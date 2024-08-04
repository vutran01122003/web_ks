import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaSquareFacebook, FaLinkedin, FaSquareXTwitter } from 'react-icons/fa6';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNewsDetails } from '../../redux/actions/newsAction';
import { newsSelector } from '../../redux/selector';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import Avatar from '../../components/ComponentAccount/ComponentAvatar.jsx';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter.jsx';

const NewsDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [newsData, setNewsData] = useState(null);
    const news = useSelector(newsSelector);

    useEffect(() => {
        if (id) {
            dispatch(getNewsDetails({ newsId: id }));
        }
    }, [id, dispatch]);

    useEffect(() => {
        setNewsData(news.currentNews);
    }, [JSON.stringify(news.currentNews)]);

    return (
        <>
            {newsData && (
                <>
                    <div className="pageNewsDetail">
                        <div className="pageNewsDetail__params">
                            <Link to={`/page/${newsData.newsType}`} className="paramRoot">
                                {capitalizeFirstLetter(newsData.newsType)}
                            </Link>
                            <Link href="#" className="paramCurrent breadcrumb-item">
                                {capitalizeFirstLetter(newsData.title)}
                            </Link>
                            <div className="shareNews">
                                <p>Chia sẻ:</p>
                                <div className="shareItems">
                                    <FaSquareFacebook className="facebook" />
                                    <FaLinkedin className="linkedin" />
                                    <FaSquareXTwitter className="x" />
                                </div>
                            </div>
                        </div>
                        <div className="pageNewsDetail__container">
                            <div className="headerNews">
                                <div className="headerNews__title">
                                    <h1>{newsData.title}</h1>
                                </div>
                                <div className="headerNew_info_wrapper">
                                    <Avatar url={newsData.author.cover} size="small" />
                                    <div className="headerNew_info">
                                        <span className="headerNews__author">{newsData.author.fullName}</span>

                                        <span className="headerNews__time">
                                            {moment(newsData.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="contentNews"
                                dangerouslySetInnerHTML={{
                                    __html: newsData.content
                                }}
                            ></div>
                        </div>
                    </div>
                    <ScrollToTopButton />
                </>
            )}
        </>
    );
};

export default NewsDetail;
