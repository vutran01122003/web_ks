import React, { useState } from 'react'
import ComponentButton from '../components/ComponentButton/ComponentButton';
import { BiSolidAddToQueue } from "react-icons/bi"
import { AiFillCloseCircle, AiFillSave, AiOutlineClose } from "react-icons/ai"
import { FaCaretRight } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { MdOutlineAddCircle } from "react-icons/md"
import { useDispatch } from 'react-redux';
import { createPage } from '../redux/actions/pageAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import Tippy from '@tippyjs/react/headless';

const CreateGoals = () => {
    const dispatch = useDispatch();
    const [pageName, setPageName] = useState('');
    const [pageFaculty, setPageFaculty] = useState('');
    const [pageStudentCohort, setPageStudentCohort] = useState('');
    const [pageStudentMajor, setPageStudentMajor] = useState('');
    const [pageStudentLevelYear, setPageStudentLevelYear] = useState('');
    const [fixedValue, setFixedValue] = useState('');
    const [visibleModal, setVisibleModal] = useState(false);
    const [indexTableValue, setIndexTableValue] = useState(null);
    const [indexRowValue, setIndexRowValue] = useState(null);
    console.log({
        pageStudentLevelYear,
        pageFaculty,
        pageName,
        pageStudentCohort,
        pageStudentMajor
    })
    const [tables, setTables] = useState([
        {
            tableName: "",
            description: "",
            quantityDemanded: "",
            rowTitleList: [{
                titleValue: "",
                fixedValue: []
            }],
            rowValueList: []
        }
    ]);

    const addTable = () => {
        setTables([...tables, {
            tableName: "",
            description: "",
            quantityDemanded: "",
            rowTitleList: [{
                titleValue: "",
                fixedValue: []
            }],
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
        updatedTables[tableIndex].rowTitleList[rowIndex].titleValue = value;
        setTables(updatedTables);
    };

    const addFixedValue = (tableIndex, rowIndex, value) => {
        if(value.trim()) {
            const updatedTables = [...tables];
            updatedTables[tableIndex].rowTitleList[rowIndex].fixedValue.push(value);
            setTables(updatedTables);
        } 
    };

    const removeFixedValue = (tableIndex, rowIndex, index) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rowTitleList[rowIndex].fixedValue.splice(index, 1);
        setTables(updatedTables);
    };

    const addRowValue = (tableIndex) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rowTitleList.push({titleValue: '', fixedValue: []});
        setTables(updatedTables);
    };

    const deleteRowValue = (tableIndex, index_row_title) => {
        if (tables[tableIndex].rowTitleList.length > 1) {
            const updatedTables = [...tables];
            updatedTables[tableIndex].rowTitleList.splice(index_row_title, 1);
            setTables(updatedTables);
        }
    };

    const handleOpenModalAddFixedValue = (indexTableValue, indexRowValue) => {
        setIndexTableValue(indexTableValue);
        setIndexRowValue(indexRowValue);
        setVisibleModal(true);
    }

    const handleCloseModelAddFixedValue = () => {
        setIndexTableValue(null);
        setIndexRowValue(null);
        setVisibleModal(false);
    }

    const resetAllData = () => {
        setPageName('');
        setPageFaculty('');
        setPageStudentCohort('');
        setPageStudentMajor('');
        setPageStudentLevelYear('');
        setTables([
            {
                tableName: "",
                description: "",
                quantityDemanded: "",
                rowTitleList: [{
                    titleValue: "",
                    fixedValue: []
                }],
                rowValueList: []
            }
        ])
    }

    const handleCreatePage = async () => {
        if(!pageName || !pageStudentCohort|| !pageStudentMajor || !pageFaculty || !pageStudentLevelYear) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Vui Lòng Điền Đầy Đủ Thông Tin"
                }
            })
            return;
        }

        const checkDuplicate = tables.some((table) => table.rowTitleList.length !== (new Set(table.rowTitleList)).size);

        if(!checkDuplicate) {
            const pageData = {
                pageName,
                pageType: "Chỉ Tiêu",
                pageFaculty,
                pageStudentCohort,
                pageStudentMajor,
                pageStudentLevelYear,
                tables: tables.map((table) => ({
                    tableName: table.tableName,
                    quantityDemanded: table.quantityDemanded,
                    description: table.description,
                    rowTitleList: table.rowTitleList
                }))
            };

            dispatch(createPage({pageData, resetAllData}));
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Các Cột Không Được Trùng Tên"
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

                <div className='goals_info_wrapper'>
                    <input 
                        type="text" 
                        placeholder='Nhập Khóa Sinh Viên'
                        onChange={(e) => {setPageStudentCohort(e.target.value)}}
                        value={pageStudentCohort}
                    />
                    <div>
                        <select 
                            onChange={(e) => {setPageFaculty(e.target.value)}}
                            value={pageFaculty}
                        >
                            <option value=''>Chọn Khoa</option>
                            <option value='Công Nghệ Thông Tin'>Công Nghệ Thông Tin</option>
                            <option value='Tự Động Hóa'>Tự Động Hóa</option>
                            <option value='Cơ Khí'>Cơ Khí</option>
                        </select>

                        <select 
                            onChange={(e) => {setPageStudentMajor(e.target.value)}}
                            value={pageStudentMajor}
                        >
                            <option value=''>Chọn Chuyên Ngành</option>
                            <option value='Kỹ Thuật Phần Mềm'>Kỹ Thuật Phần Mềm</option>
                            <option value='Khoa Học Máy Tính'>Khoa Học Máy Tính</option>
                        </select>

                        <select 
                            onChange={(e) => setPageStudentLevelYear(Number.parseInt(e.target.value))}
                            value={pageStudentLevelYear}
                        >
                            <option value=''>Chọn Năm Học</option>
                            <option value='1'>Năm 1</option>
                            <option value='2'>Năm 2</option>
                            <option value='3'>Năm 3</option>
                            <option value='4'>Năm 4</option>
                            <option value='5'>Năm 5</option>
                        </select>
                    </div>

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
                                <div className="flex__line_lable">
                                    <label htmlFor="mo_ta_chi_tieu">Số Lượng:</label>
                                    <input
                                        type="text"
                                        value={table.quantityDemanded}
                                        placeholder="Nhập số lượng cần hoàn thành"
                                        onChange={(e) => {
                                            updateTable(tableIndex, 'quantityDemanded', Number.parseInt(e.target.value) ? Number.parseInt(e.target.value) : '')
                                        }}
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
                                                            value={rowTitle?.titleValue || ''}
                                                            placeholder={`Cột ${rowIndex + 1}`}
                                                            onChange={(e) => updateRowTitle(tableIndex, rowIndex, e.target.value)}
                                                        />
                                                        {
                                                            table.rowTitleList.length > 1 && 
                                                            <div onClick={() => deleteRowValue(tableIndex, rowIndex)} className="del__col">
                                                                <abbr title="Xóa cột">
                                                                    <AiFillCloseCircle />
                                                                </abbr>
                                                            </div>
                                                        }
                                                            <Tippy
                                                                interactive
                                                                placement= 'top'
                                                                visible={
                                                                    visibleModal && 
                                                                    tableIndex === indexTableValue && 
                                                                    rowIndex === indexRowValue
                                                                }
                                                                onClickOutside={handleCloseModelAddFixedValue}
                                                                render={attrs => (
                                                                <div className="add_value_col" tabIndex="-1" {...attrs}>
                                                                    <h3 className='add_fixed_heading'>
                                                                        Thêm Giá Trị Cố Định{' '}
                                                                       <span>
                                                                        {   
                                                                            rowTitle?.titleValue ?
                                                                            "(" + rowTitle?.titleValue + ")" :
                                                                            rowTitle?.titleValue
                                                                        }
                                                                       </span>
                                                                    </h3>
                                                                    <div className='add_fixed_value_wrapper'>
                                                                            <input 
                                                                                type="text" 
                                                                                placeholder='Nhập giá trị' 
                                                                                className='fixed_value_input'
                                                                                onChange={(e) => {setFixedValue(e.target.value)}}
                                                                                value={fixedValue}
                                                                            />
                                                                            <button 
                                                                                className='add_fixed_value_btn'
                                                                                onClick={(e) => {
                                                                                    addFixedValue(tableIndex, rowIndex, fixedValue);
                                                                                    setFixedValue('');
                                                                                }}
                                                                            >
                                                                                Thêm
                                                                            </button>
                                                                    </div>
                                                                    <ul>
                                                                        {
                                                                            table.rowTitleList[rowIndex].fixedValue.map((value, index) => (
                                                                                <li key={index} className='fixed_value_item'>
                                                                                    <span className='fixed_value_wrapper'>
                                                                                        <span className='fixed_value_icon'>
                                                                                            <FaCaretRight />
                                                                                        </span>
                                                                                        <span className='fixed_value'>
                                                                                            {value}
                                                                                        </span>
                                                                                    </span>
                                                                                    <div 
                                                                                        className='btn_del_fixed_value'
                                                                                        onClick={() => removeFixedValue(tableIndex, rowIndex, index)}
                                                                                    >
                                                                                        <AiFillCloseCircle />
                                                                                    </div>
                                                                                </li>
                                                                            ))
                                                                        }
                                                                    </ul>
                                                                </div>
                                                                )}
                                                            >
                                                                <div 
                                                                    className="add__col"
                                                                        onClick={() => {
                                                                            handleOpenModalAddFixedValue(tableIndex, rowIndex);
                                                                        }}
                                                                >
                                                                    <abbr title="Thêm giá trị cố định">
                                                                        <IoIosAddCircle /> 
                                                                    </abbr>
                                                                </div>
                                                            </Tippy>
                                                        
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