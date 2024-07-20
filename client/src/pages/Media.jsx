import { useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import ReactQuillComponent from '../components/ComponentReactQuill/ReactQuillComponent';
import { useDispatch, useSelector } from 'react-redux';
import { pageSelector } from '../redux/selector';
import { createNews } from '../redux/actions/newsAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { createPage } from '../redux/actions/pageAction';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

function MediaUi() {
    const coverRef = useRef();
    const newsTypeRef = useRef();

    const dispatch = useDispatch();
    const page = useSelector(pageSelector);

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [newsType, setNewsType] = useState('');
    const [newsTypeValue, setNewsTypeValue] = useState('');
    const [visibleModal, setVisibleModal] = useState(false);

    const handleToggleModal = () => {
        setVisibleModal((prev) => !prev);
    };

    const handleChangeNewsTypeValue = (e) => {
        setNewsTypeValue(e.target.value);
    };

    const handleNewsType = (value) => {
        setNewsType(value);
        setVisibleModal(false);
    };

    const handleCreateNewsType = () => {
        dispatch(
            createPage({
                pageData: {
                    pageName: newsTypeValue,
                    pageType: 'tin tức'
                }
            })
        );
    };

    const createNewNews = (e) => {
        e.preventDefault();

        if (title && summary && content && file && newsType) {
            e.preventDefault();
            const newsData = new FormData();
            newsData.set('title', title);
            newsData.set('summary', summary);
            newsData.set('content', content);
            newsData.set('newsType', newsType);
            newsData.set('cover', file);

            dispatch(createNews({ newsData }));
            handleResetInput();
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Thông Tin Chưa Đầy Đủ'
                }
            });
        }
    };

    const handleResetInput = () => {
        setTitle('');
        setSummary('');
        setContent('');
        setNewsType('');
        coverRef.current.value = null;
        newsTypeRef.current.value = '';
    };

    return (
        <div className="create_post_container">
            <form className="create_post_form" onSubmit={createNewNews}>
                <input
                    className="post_input"
                    type="text"
                    placeholder="Tiêu Đề Bài Viết"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />

                <div className="select_new_type_wrapper">
                    <label className="select_new_type_label">
                        <span>Phân Loại Bài Viết</span>
                    </label>
                    <Tippy
                        visible={visibleModal}
                        interactive={visibleModal}
                        onClickOutside={handleToggleModal}
                        placement="bottom-start"
                        render={(attrs) => (
                            <div className="select_new_type_modal" tabIndex="-1" {...attrs}>
                                {page.pages.map((currentPage) => {
                                    if (currentPage.pageType === 'tin tức')
                                        return (
                                            <div
                                                onClick={() => {
                                                    handleNewsType(currentPage.pageName);
                                                }}
                                                className="news_type_item"
                                                key={currentPage._id}
                                            >
                                                {capitalizeFirstLetter(currentPage.pageName)}
                                            </div>
                                        );
                                    return null;
                                })}

                                <div className="add_news_type_container">
                                    <div className="add_news_type_wrapper">
                                        <label className="add_news_type_label">Thêm loại tin tức:</label>
                                        <input
                                            className="add_news_type_input"
                                            type="text"
                                            onChange={handleChangeNewsTypeValue}
                                            placeholder="Nhập tên loại tin tức"
                                        />
                                    </div>
                                    <button onClick={handleCreateNewsType} type="button" className="add_news_type_btn">
                                        Đồng ý
                                    </button>
                                </div>
                            </div>
                        )}
                    >
                        <div onClick={handleToggleModal} className="select_new_type">
                            {capitalizeFirstLetter(newsType) || 'Chọn loại tin tức'}
                        </div>
                    </Tippy>
                </div>

                <input
                    className="post_input"
                    type="text"
                    placeholder="Nội Dung Tóm Tắt"
                    value={summary}
                    onChange={(e) => {
                        setSummary(e.target.value);
                    }}
                />

                <span className="file_input">
                    <span className="file_input_wrapper">Ảnh bìa: </span>
                    <input
                        type="file"
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}
                        ref={coverRef}
                        className="select-img-post"
                        accept="image/png, image/gif, image/jpeg"
                    />
                </span>
                <ReactQuillComponent content={content} setContent={setContent} />
                <div className="post_btn_wrapper">
                    <button className="post_btn">Tạo bài viết</button>
                </div>
            </form>
        </div>
    );
}

export default MediaUi;
