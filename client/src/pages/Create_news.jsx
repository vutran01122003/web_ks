import React, { useRef, useState } from 'react';
import ReactQuillComponent from '../components/ComponentReactQuill/ReactQuillComponent';
import { useDispatch, useSelector } from 'react-redux';
import { pageSelector } from '../redux/selector';
import { createNews } from '../redux/actions/newsAction';
import GLOBALTYPES from '../redux/actions/globalTypes';

function CreateNew() {
    const dispatch = useDispatch();
    const page = useSelector(pageSelector);
    const coverRef = useRef();
    const newsTypeRef = useRef();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [newsType, setNewsType] = useState('');

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

    const handleResetInput = (e) => {
        setTitle('');
        setSummary('');
        setContent('');
        setNewsType('');
        coverRef.current.value = null;
        newsTypeRef.current.value = '';
    };

    return (
        <div className='create_post_container'>
            <h2 className='create_post_title'>Tạo Bài Viết</h2>
            <form className='create_post_form' onSubmit={createNewNews}>
                <input
                    className='post_input'
                    type='text'
                    placeholder='Tiêu Đề Bài Viết'
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                />

                <div className='select_new_type_wrapper'>
                    <label className='select_new_type_label'>
                        <span>Phân Loại Bài Viết</span>
                    </label>

                    <select
                        className='select_new_type'
                        onChange={(e) => {
                            setNewsType(e.target.value);
                        }}
                        ref={newsTypeRef}
                        defaultValue=''
                    >
                        <option value=''>Không Xác Định</option>
                        {page?.pages &&
                            page.pages.map((page, index) => {
                                if (page.pageType === 'tin tức') {
                                    return (
                                        <option value={page.pageName} key={index}>
                                            {page.pageName}
                                        </option>
                                    );
                                }
                            })}
                    </select>
                </div>

                <input
                    className='post_input'
                    type='text'
                    placeholder='Nội Dung Tóm Tắt'
                    value={summary}
                    onChange={(e) => {
                        setSummary(e.target.value);
                    }}
                />

                <span className='file_input'>
                    <span className='file_input_wrapper'>Ảnh bìa: </span>
                    <input
                        type='file'
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}
                        ref={coverRef}
                        className='select-img-post'
                        accept='image/png, image/gif, image/jpeg'
                    />
                </span>
                <ReactQuillComponent content={content} setContent={setContent} />
                <div className='post_btn_wrapper'>
                    <button className='post_btn'>Tạo bài viết</button>
                </div>
            </form>
        </div>
    );
}

export default CreateNew;
