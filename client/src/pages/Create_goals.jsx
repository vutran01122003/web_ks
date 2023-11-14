import React, { useState } from 'react'
import ComponentButton from '../components/ComponentButton/ComponentButton';
import { BiSolidAddToQueue } from "react-icons/bi"
import { AiFillCloseCircle, AiFillSave, AiOutlineClose } from "react-icons/ai"
import { MdOutlineAddCircle } from "react-icons/md"
import { useDispatch } from 'react-redux';
import { createPage } from '../redux/actions/pageAction';
import GLOBALTYPES from '../redux/actions/globalTypes';

const CreateGoals = () => {
    const dispatch = useDispatch();

    const [pageName, setPageName] = useState('');
    const [tables, setTables] = useState([
        {
            tableName: "",
            description: "",
            rowTitleList: [""],
            rowValueList: []
        }
    ]);

    const addTable = () => {
        setTables([...tables, {
            tableName: "",
            description: "",
            rowTitleList: [""],
            rowValueList: []
        }]);
    };

    const updateTable = (index, key, value) => {
        const updatedTables = [...tables];
        updatedTables[index][key] = value;
        setTables(updatedTables);
    };

    const deleteTable = (tableIndex) => {
        if (tables.length > 1) {
            const updatedTables = [...tables];
            updatedTables.splice(tableIndex, 1);
            setTables(updatedTables);
        }
    };

    const updateRowTitle = (tableIndex, rowIndex, value) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rowTitleList[rowIndex] = value;
        setTables(updatedTables);
    };

    const addRowValue = (tableIndex) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rowTitleList.push('');
        setTables(updatedTables);
    };

    const deleteRowValue = (tableIndex, index_row_title) => {
        if (tables[tableIndex].rowTitleList.length > 1) {
            const updatedTables = [...tables];
            updatedTables[tableIndex].rowTitleList.splice(index_row_title, 1);
            setTables(updatedTables);
        }

    };

    const handleCreatePage = async () => {
        const checkDuplicate = tables.some((table) => table.rowTitleList.length !== (new Set(table.rowTitleList)).size);

        if(!checkDuplicate) {
            const kq = {
                pageName,
                pageType: "Chỉ Tiêu",
                tables: tables.map((table) => ({
                    tableName: table.tableName,
                    description: table.description,
                    rowTitleList: table.rowTitleList
                }))
            };
            dispatch(createPage(kq));
            setPageName('');
            setTables([
                {
                    tableName: "",
                    description: "",
                    rowTitleList: [""],
                    rowValueList: []
                }
            ])
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Các cột không được trùng tên"
                }
            })
        }
       
    }

    return (
        <div className="wrap__goals">
            <div className="body__goals">
                <div className='line__flex'>
                    <h1>Thêm Nhóm Chỉ Tiêu</h1>
                </div>

                <div className="filed__line">
                    <label>Tên Nhóm Chỉ Tiêu</label>
                    <input
                        type="text"
                        id="name__chi_tieu"
                        placeholder=''
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                    />
                </div>
                <div className="connection__table">
                    {tables.map((table, tableIndex) => {
                        return (
                            <div key={tableIndex} className="box__table">

                                <div className="flex__hLine">
                                    <div className="text__heading_fw">
                                        <div className="text__length">Tên Chỉ Tiêu:</div>
                                        <input
                                            type="text"
                                            value={table.tableName}
                                            placeholder="Nhập tiêu đề chỉ tiêu"
                                            onChange={(e) => updateTable(tableIndex, 'tableName', e.target.value)}
                                            className="input_title--chi_tieu"
                                        />
                                    </div>

                                    <div className="btn__delete">
                                        {tables.length > 1 && (
                                            <button onClick={() => deleteTable(tableIndex)}>
                                                <AiOutlineClose />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex__line_lable">
                                    <label htmlFor="mo_ta_chi_tieu">Mô Tả Chỉ Tiêu:</label>
                                    <input
                                        type="text"
                                        value={table.description}
                                        placeholder="Nhập mô tả chỉ tiêu"
                                        onChange={(e) => updateTable(tableIndex, 'description', e.target.value)}
                                        id="mo_ta_chi_tieu"
                                    />

                                </div>

                                <div className="table__col--target">
                                    <div className="flex__line">
                                        <ComponentButton onClick={() => addRowValue(tableIndex)} textButton="Thêm Cột"
                                            className="btn__add-col" icon_before={<MdOutlineAddCircle />} />
                                    </div>

                                    <div className='tr__line--cols'>
                                        <div className="box__cols">
                                            <span className="hag_stt">#</span>
                                            {table.rowTitleList.map((rowTitle, rowIndex) => {
                                                return (
                                                    <div key={rowIndex} className="item__col">
                                                        <input
                                                            type="text"
                                                            value={rowTitle}
                                                            placeholder={`Cột ${rowIndex + 1}`}
                                                            onChange={(e) => updateRowTitle(tableIndex, rowIndex, e.target.value)}
                                                        />
                                                        {table.rowTitleList.length > 1 && (
                                                            <div onClick={() => deleteRowValue(tableIndex, rowIndex)} className="del__col">
                                                                <AiFillCloseCircle />
                                                            </div>
                                                        )
                                                        }
                                                    </div>
                                                )
                                            })}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="line__flex">
                    <ComponentButton
                        onClick={addTable}
                        type="button"
                        textButton="Thêm Chỉ Tiêu"
                        className="btn__add_table"
                        icon_before={<BiSolidAddToQueue />}
                    />

                    <ComponentButton
                        textButton="Tạo Trang"
                        onClick={handleCreatePage}
                        type="button"
                        className="btn__create--page"
                        icon_before={<AiFillSave />} />
                </div>
            </div>
        </div>
    )
}

export default CreateGoals