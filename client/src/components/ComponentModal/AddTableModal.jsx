import { useState } from "react";
import {useDispatch} from "react-redux";
import {addTable} from '../../redux/actions/tableAction';
import {AiOutlineClose} from 'react-icons/ai';

function AddTableModal({subPageName, pageId, handleHideAddTableModal }) {
    const dispatch = useDispatch();
    const [rowTitleList, setRowTitleList] = useState([]);
    const [titleRowValue, setTitleRowValue] = useState('');
    const [tableName, setTableName] = useState('');
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

    const handleChangeTableName = (e) => {
        setTableName(e.target.value);
    }
    
    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    }
    
    const handleClosePopup = (e) => {
        if(e.target === e.currentTarget) {
            handleHideAddTableModal();
        }
    }

    const handleCreateTable = () => {
        dispatch(addTable({
            pageId, 
            tables: [
                {
                    tableName,
                    description,
                    rowTitleList
                }
            ]
        }))
        handleHideAddTableModal();
    }

    return (  
        <div className="modal_overlap" onMouseUp={handleClosePopup}>
            <div className="box_wrapper">
                <h2 className='modal_header'>{subPageName}</h2>
                <div 
                    className="modal_close_icon_wrapper"
                    onClick={handleHideAddTableModal}
                >
                    <AiOutlineClose />
                </div>
                <div className='create_goal_container'>
                        <div className="input_goal_wrapper">
                            <div className='input_goal_item'>
                                <label>Tên Bảng: </label>
                                    <input
                                        type='text'
                                        className='outline-none border-2'
                                        value={tableName}
                                        onChange={handleChangeTableName}
                                    />
                            </div>

                                <div className='input_goal_item'>
                                    <label>Mô tả Bảng: </label>
                                    <input
                                        type='text'
                                        className='outline-none border-2'
                                        value={description}
                                        onChange={handleChangeDescription}
                                    />
                                </div>

                            <div className='input_goal_item'>
                                    <label>Thêm cột: </label>
                                    <input
                                        type='text'
                                        className='outline-none border-2'
                                        onChange={handleTitleRowValue}
                                        value={titleRowValue}
                                    />
                                    <button
                                        className='btn_add_column'
                                        onClick={handleAddRowTitleList}
                                    >
                                        Thêm Cột
                                    </button>
                            </div>    
                        </div>

                        <div className='preview_container'>
                            <h3 className='table_title_preview'>{tableName ? 'Chỉ tiêu: ' + tableName : ''}</h3>
                            <h4 className='description_preview'>
                                {description ? 'Mô tả: ' + description : ''}
                            </h4>
                            <div className='goal_column'>
                                {rowTitleList.map((rowTitle, index) => (
                                    <span key={index} className='goal_column_item'>
                                        {rowTitle}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleCreateTable}
                            className='btn_create_goal'
                        >
                                Thêm Chỉ Tiêu
                        </button>
                </div>
            </div>
        </div>
    );
}

export default AddTableModal;