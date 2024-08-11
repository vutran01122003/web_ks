import no_image from '../../assets/images/no_image.jpg';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toFullName } from '../../utils/handleString';

export const NewsItem = ({ newsId, cover, title, summary, createdAt, author }) => {
    return (
        <Link to={`/news/${newsId}`} className="container_news_item">
            <div className="left__item">
                <img className="cover_news" src={cover?.url || no_image} />
            </div>

            <div className="right__item">
                <div className="news_body">
                    <div className={`news__title-text`}>{title}</div>
                    <div className="news_info">
                        <span className="createdAt_news">{moment(createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                        {' Bởi '}
                        <span className="news_author">
                            {toFullName({
                                lastName: author.lastName,
                                firstName: author.firstName
                            })}
                        </span>
                    </div>
                    <div className={`news__summary`}>{summary}</div>
                </div>

                <div className="news__more">Xem chi tiết</div>
            </div>
        </Link>
    );
};
