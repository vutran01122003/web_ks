import {useState} from 'react';
import { createPage } from '../redux/actions/pageAction';
import { useDispatch } from 'react-redux';

function CreatePages() {
    const dispatch = useDispatch();
    const [rowTitleList, setRowTitleList] = useState([]);
    const [titleRowValue, setTitleRowValue] = useState('');
    const [tableName, setTableName] = useState('');
    const [pageName, setPageName] = useState('');
    const [description, setDescription] = useState('');


    const handleAddRowTitleList = () => {
        if (titleRowValue) {
            setRowTitleList((prev) => [...prev, titleRowValue]);
            setTitleRowValue('');
        }
    };

    const handleTitleRowValue = (e) => {
        setTitleRowValue(e.target.value);
    };

    const handleCreatePage = async () => {
        dispatch(createPage({pageName, tables: [{tableName, description, rowTitleList}]}));
    };

    return (
        <div className='create_goal_container'>
            <h1 className='page_title'>Tạo Nhóm Chỉ Tiêu</h1>
            <div>
               <div className='input_page_item'>
                <label>Tên Page: </label>
                    <input
                        type='text'
                        className='outline-none border-2'
                        value={pageName}
                        onChange={(e) => {
                            setPageName(e.target.value);
                        }}
                    />
               </div>

               <div className='input_page_item'>
                <label>Tên Bảng: </label>
                    <input
                        type='text'
                        className='outline-none border-2'
                        value={tableName}
                        onChange={(e) => {
                            setTableName(e.target.value);
                        }}
                    />
               </div>

                <div className='input_page_item'>
                    <label>Mô tả bảng: </label>
                    <input
                        type='text'
                        className='outline-none border-2'
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />
                </div>

              <div className='input_page_item'>
                    <label>Thêm cột: </label>
                    <input
                        type='text'
                        className='outline-none border-2'
                        onChange={handleTitleRowValue}
                        value={titleRowValue}
                    />
                    <button
                        className='btn_add_page'
                        onClick={handleAddRowTitleList}
                    >
                        Thêm Cột
                    </button>
              </div>

               
            </div>
            <div className='mt-10'>
                <h1 className='page_title_preview'>{pageName || ""}</h1>
                <h3 className='table_title_preview'>{tableName || ""}</h3>
                <h4 className='description_preview'>
                    {description ? 'Mô tả bảng: ' + description : ''}
                </h4>
                <div className='page_column'>
                    {rowTitleList.map((rowTitle, index) => (
                        <span key={index}  className='item_column'>
                            {rowTitle}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={handleCreatePage}
                className='btn_create_page'
            >
                Tạo Pages
            </button>
        </div>
    );
}

export default CreatePages;
