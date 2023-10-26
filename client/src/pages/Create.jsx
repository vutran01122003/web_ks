import {useState} from 'react';
import { createPage } from '../redux/actions/pageAction';
import { useDispatch } from 'react-redux';

function CreatePages() {
    const dispatch = useDispatch();
    const [rowTitleList, setRowTitleList] = useState([]);
    const [titleRowValue, setTitleRowValue] = useState('');
    const [titleTable, setTitleTable] = useState('');
    const [pageNameValue, setPageNameValue] = useState('');
    const [descriptionTable, setDescriptionTable] = useState('');

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
        dispatch(createPage({pageNameValue, titleTable, descriptionTable, rowTitleList}));
    };

    return (
        <div>
            <div>
                <h3>Tên Page</h3>
                <input
                    type='text'
                    className='outline-none border-2'
                    value={pageNameValue}
                    onChange={(e) => {
                        setPageNameValue(e.target.value);
                    }}
                />

                <h4>Tên Bảng</h4>
                <input
                    type='text'
                    className='outline-none border-2'
                    value={titleTable}
                    onChange={(e) => {
                        setTitleTable(e.target.value);
                    }}
                />

                <h4>Mô tả bảng</h4>
                <input
                    type='text'
                    className='outline-none border-2'
                    value={descriptionTable}
                    onChange={(e) => {
                        setDescriptionTable(e.target.value);
                    }}
                />

                <h4>thêm cột</h4>
                <input
                    type='text'
                    className='outline-none border-2'
                    onChange={handleTitleRowValue}
                    value={titleRowValue}
                />

                <button
                    className='ml-1 px-1 active:scale-90  bg-gray-500'
                    onClick={handleAddRowTitleList}
                >
                    add
                </button>
            </div>
            <div className='mt-10'>
                <h1 className='font-bold text-3xl'>{pageNameValue || ""}</h1>
                <h1 className='font-bold text-2xl'>{titleTable || ""}</h1>
                <h3 className='font-light text-sm text-gray-3000'>
                    {descriptionTable ? '(' + descriptionTable + ')' : ''}
                </h3>
                <div className='mt-5 flex row flex-wrap'>
                    {rowTitleList.map((rowTitle, index) => (
                        <span key={index} className='px-5 py-1 bg-gray-300 m-0.5'>
                            {rowTitle}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={handleCreatePage}
                className='mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded outline_none'
            >
                Tạo Pages
            </button>
        </div>
    );
}

export default CreatePages;
