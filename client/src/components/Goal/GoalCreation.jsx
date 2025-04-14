import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { FaCaretRight } from 'react-icons/fa';
import { BiSolidAddToQueue } from 'react-icons/bi';
import { MdOutlineAddCircle } from 'react-icons/md';
import { IoIosAddCircle, IoMdMore } from 'react-icons/io';
import { AiFillCloseCircle, AiFillSave, AiOutlineClose, AiFillEdit } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { facultySelector } from '../../redux/selector';
import { createPage } from '../../redux/actions/pageAction';
import { getAllFaculties } from '../../redux/actions/facultyAction';
import ComponentButton from '../Button/ComponentButton';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import SearchFilterComponent from '../Filter/SearchFilter';

const { VITE_APP_GOAL_PAGE } = import.meta.env;

const GoalsCreation = ({ handleAddTable, handleUpdateTable, prevUpdatedTableData, tableDetailsData }) => {
    const dispatch = useDispatch();
    const facultyState = useSelector(facultySelector);
    const pageFaculty = facultyState.faculty;
    const [pageName, setPageName] = useState('');
    const [pageStudentCohort, setPageStudentCohort] = useState('');
    const [pageStudentMajor, setPageStudentMajor] = useState('');
    const [pageStudentLevelYear, setPageStudentLevelYear] = useState('');
    const [talentEngineerType, setTalentEngineerType] = useState('');
    const [fixedValue, setFixedValue] = useState('');
    const [scoreValue, setScoreValue] = useState('');
    const [visibleModal, setVisibleModal] = useState(false);
    const [indexTableValue, setIndexTableValue] = useState(null);
    const [indexRowValue, setIndexRowValue] = useState(null);
    const [FIXED_SCORE_TYPE, DYNAMIC_SCORE_TYPE] = [true, false];
    const [tables, setTables] = useState([
        {
            tableName: '',
            description: '',
            quantityDemanded: '',
            rowTitleList: [
                {
                    titleValue: '',
                    fixedValue: []
                }
            ],
            rowValueList: [],
            fixedScore: '',
            scoreType: FIXED_SCORE_TYPE
        }
    ]);

    const addTable = () => {
        setTables([
            ...tables,
            {
                tableName: '',
                description: '',
                quantityDemanded: '',
                rowTitleList: [
                    {
                        titleValue: '',
                        fixedValue: []
                    }
                ],
                rowValueList: [],
                fixedScore: '',
                scoreType: FIXED_SCORE_TYPE
            }
        ]);
    };

    const handleAddGoal = () => {
        const { notifyValue, isError } = checkError(tables);
        if (isError) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: notifyValue
                }
            });
        } else handleAddTable({ table: tables[0] });
    };

    const handleUpdateGoal = () => {
        handleUpdateTable({ checkError, table: tables[0] });
    };

    const updateTable = (index, key, value) => {
        const updatedTables = [...tables];
        if (key === 'scoreType') {
            updatedTables[index][key] = value === 'true';
        } else {
            updatedTables[index][key] = value;
        }
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

    const addFixedValue = (tableIndex, rowIndex, value, score) => {
        if (value.trim() && score !== '') {
            const updatedTables = [...tables];
            updatedTables[tableIndex].rowTitleList[rowIndex].fixedValue.push({
                value,
                score
            });
            setTables(updatedTables);
            setFixedValue('');
            setScoreValue('');
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui lòng nhập đầy đủ thông tin'
                }
            });
        }
    };

    const removeFixedValue = (tableIndex, rowIndex, index) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rowTitleList[rowIndex].fixedValue.splice(index, 1);
        setTables(updatedTables);
    };

    const addRowValue = (tableIndex) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].rowTitleList.push({
            titleValue: '',
            fixedValue: []
        });
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
    };

    const handleCloseModelAddFixedValue = () => {
        setIndexTableValue(null);
        setIndexRowValue(null);
        setVisibleModal(false);
    };

    const resetAllData = () => {
        setPageName('');
        setPageStudentMajor('');
        setPageStudentCohort('');
        setTalentEngineerType('');
        setPageStudentLevelYear('');
        setTables([
            {
                tableName: '',
                description: '',
                quantityDemanded: '',
                rowTitleList: [
                    {
                        titleValue: '',
                        fixedValue: []
                    }
                ],
                rowValueList: [],
                fixedScore: '',
                scoreType: FIXED_SCORE_TYPE
            }
        ]);
    };

    const checkError = (tables) => {
        let notifyValue = '';

        const isError = tables.some((table) => {
            if (table.rowTitleList.some((rowTitle) => rowTitle.titleValue.trim() === '')) {
                notifyValue = 'Tên cột không được rỗng';
                return true;
            }

            if (table.rowTitleList.length !== new Set(table.rowTitleList.map((rowTitle) => rowTitle.titleValue)).size) {
                notifyValue = 'Tên cột không được trùng';
                return true;
            }

            if (table.scoreType === FIXED_SCORE_TYPE && table.fixedScore === undefined) {
                notifyValue = 'Chưa nhập điểm cho chỉ tiêu';
                return true;
            }

            if (
                table.scoreType === DYNAMIC_SCORE_TYPE &&
                table.rowTitleList.every((rowTitleList) => rowTitleList.fixedValue.length === 0)
            ) {
                notifyValue = 'Chưa nhập điểm cho chỉ tiêu';
                return true;
            }
        });

        return {
            notifyValue,
            isError
        };
    };

    const handleCreatePage = async () => {
        if (!pageName || !pageStudentCohort || !pageStudentMajor || !pageFaculty || !pageStudentLevelYear) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Vui Lòng Điền Đầy Đủ Thông Tin'
                }
            });
            return;
        }

        const { notifyValue, isError } = checkError(tables);

        if (!isError) {
            const pageData = {
                pageName,
                pageType: VITE_APP_GOAL_PAGE,
                pageFaculty: pageFaculty.facultyName,
                pageStudentCohort: pageStudentCohort.cohortName,
                pageStudentMajor: pageStudentMajor.majorName,
                pageTalentEngineerType: talentEngineerType,
                pageStudentLevelYear: +pageStudentLevelYear,
                tables: tables.map((table) => {
                    const tableData = {
                        tableName: table.tableName,
                        quantityDemanded: table.quantityDemanded,
                        description: table.description,
                        rowTitleList: table.rowTitleList,
                        fixedScore: +table.fixedScore
                    };

                    if (!table.fixedScore) delete table.fixedScore;

                    return tableData;
                })
            };

            dispatch(createPage({ pageData, resetAllData }));
        } else {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: notifyValue
                }
            });
        }
    };

    useEffect(() => {
        if (facultyState.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    useEffect(() => {
        const initialTables = (tableData) => {
            setTables([
                {
                    ...tableData,
                    scoreType: tableData.fixedScore ? FIXED_SCORE_TYPE : DYNAMIC_SCORE_TYPE
                }
            ]);
        };

        if (prevUpdatedTableData) initialTables(prevUpdatedTableData);
        if (tableDetailsData) initialTables(tableDetailsData);
    }, [prevUpdatedTableData, tableDetailsData]);

    return (
        <div className="wrap__goals">
            <div className="body__goals">
                {!handleAddTable && !handleUpdateTable && !tableDetailsData && (
                    <div className="goals_info_wrapper">
                        <div className="faculty_info">
                            <SearchFilterComponent
                                setMajorValue={setPageStudentMajor}
                                setCohortValue={setPageStudentCohort}
                                setTalentEngineerType={setTalentEngineerType}
                                setCurrentLevelYearValue={setPageStudentLevelYear}
                                majorValue={pageStudentMajor}
                                cohortValue={pageStudentCohort}
                                talentEngineerType={talentEngineerType}
                                currentLevelYearValue={pageStudentLevelYear}
                                isLevelYearInput={true}
                            />
                        </div>
                    </div>
                )}

                {!handleAddTable && !handleUpdateTable && !tableDetailsData && (
                    <div className="filed__line">
                        <label>Tên Nhóm Chỉ Tiêu</label>
                        <input
                            type="text"
                            id="name__chi_tieu"
                            placeholder="Nhập Tên Nhóm Chỉ Tiêu"
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                        />
                    </div>
                )}
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
                                            readOnly={tableDetailsData ? true : false}
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
                                        readOnly={tableDetailsData ? true : false}
                                        placeholder="Nhập mô tả chi tiết chỉ tiêu"
                                        onChange={(e) => updateTable(tableIndex, 'description', e.target.value)}
                                        id="mo_ta_chi_tieu"
                                    />
                                </div>
                                <div className="flex__line_lable">
                                    <label htmlFor="mo_ta_chi_tieu">Số Lượng Tối Thiểu:</label>
                                    <input
                                        type="text"
                                        value={table.quantityDemanded}
                                        readOnly={tableDetailsData ? true : false}
                                        placeholder="Nhập số lượng hoạt động tối thiểu cần hoàn thành"
                                        onChange={(e) => {
                                            updateTable(
                                                tableIndex,
                                                'quantityDemanded',
                                                Number.parseInt(e.target.value) ? Number.parseInt(e.target.value) : ''
                                            );
                                        }}
                                        id="mo_ta_chi_tieu"
                                    />
                                </div>

                                <div className="flex__line_lable">
                                    <label>Loại Điểm Số:</label>
                                    {!tableDetailsData ? (
                                        <select
                                            value={tables[tableIndex].scoreType}
                                            onChange={(e) => {
                                                updateTable(tableIndex, 'scoreType', e.target.value);
                                            }}
                                        >
                                            <option value={FIXED_SCORE_TYPE}>Điểm số cố định</option>
                                            <option value={DYNAMIC_SCORE_TYPE}>Điểm số không cố định</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={
                                                tables[tableIndex].scoreType === FIXED_SCORE_TYPE
                                                    ? 'Điểm số cố định'
                                                    : 'Điểm số không cố định'
                                            }
                                            readOnly={true}
                                        />
                                    )}
                                </div>

                                {table.scoreType === FIXED_SCORE_TYPE && (
                                    <div className="flex__line_lable">
                                        <label htmlFor="score_input">
                                            {!tableDetailsData ? 'Nhập Điểm' : 'Điểm Số:'}
                                        </label>
                                        <input
                                            className={`score_input`}
                                            type="text"
                                            value={table.fixedScore}
                                            readOnly={tableDetailsData ? true : false}
                                            placeholder="Nhập điểm sẽ nhận được khi hoàn thành 1 hoạt động"
                                            id="score_input"
                                            onChange={(e) =>
                                                updateTable(
                                                    tableIndex,
                                                    'fixedScore',
                                                    /^\d*\.?\d*$/.test(e.target.value) ? e.target.value : ''
                                                )
                                            }
                                        />
                                    </div>
                                )}

                                <div className={`table__col--target ${tableDetailsData ? 'mt_40' : ''}`}>
                                    {!tableDetailsData && (
                                        <div className="flex__line">
                                            <ComponentButton
                                                onClick={() => addRowValue(tableIndex)}
                                                textButton="Thêm Cột"
                                                className="btn__add-col"
                                                icon_before={<MdOutlineAddCircle />}
                                            />
                                        </div>
                                    )}

                                    <div className="tr__line--cols">
                                        <div className="box__cols">
                                            {table.rowTitleList.map((rowTitle, rowIndex) => {
                                                return (
                                                    <div key={rowIndex} className="item__col">
                                                        <input
                                                            type="text"
                                                            value={rowTitle?.titleValue || ''}
                                                            readOnly={tableDetailsData ? true : false}
                                                            placeholder={`Cột ${rowIndex + 1}`}
                                                            onChange={(e) =>
                                                                updateRowTitle(tableIndex, rowIndex, e.target.value)
                                                            }
                                                        />

                                                        {table.rowTitleList.length > 1 && !tableDetailsData && (
                                                            <div
                                                                onClick={() => deleteRowValue(tableIndex, rowIndex)}
                                                                className={`del__col`}
                                                            >
                                                                <abbr title="Xóa cột">
                                                                    <AiFillCloseCircle />
                                                                </abbr>
                                                            </div>
                                                        )}

                                                        <Tippy
                                                            interactive
                                                            placement="top"
                                                            visible={
                                                                visibleModal &&
                                                                tableIndex === indexTableValue &&
                                                                rowIndex === indexRowValue
                                                            }
                                                            onClickOutside={handleCloseModelAddFixedValue}
                                                            render={(attrs) => (
                                                                <div className="add_value_col" tabIndex="-1" {...attrs}>
                                                                    <h3 className="add_fixed_heading">
                                                                        {!tableDetailsData
                                                                            ? 'THÊM GIÁ TRỊ ĐỊNH SẴN'
                                                                            : 'GIÁ TRỊ ĐỊNH SẴN'}

                                                                        <span>
                                                                            {rowTitle?.titleValue
                                                                                ? '(' + rowTitle?.titleValue + ')'
                                                                                : rowTitle?.titleValue}
                                                                        </span>
                                                                    </h3>
                                                                    {!tableDetailsData && (
                                                                        <div className="add_fixed_value_wrapper">
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Nhập giá trị"
                                                                                className="fixed_value_input"
                                                                                onChange={(e) => {
                                                                                    setFixedValue(e.target.value);
                                                                                }}
                                                                                value={fixedValue}
                                                                            />
                                                                            {table.scoreType === DYNAMIC_SCORE_TYPE && (
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Điểm"
                                                                                    className="score_value_input"
                                                                                    onChange={(e) => {
                                                                                        setScoreValue(
                                                                                            Number.parseInt(
                                                                                                e.target.value
                                                                                            )
                                                                                        );
                                                                                    }}
                                                                                    value={
                                                                                        isNaN(scoreValue)
                                                                                            ? ''
                                                                                            : scoreValue
                                                                                    }
                                                                                />
                                                                            )}
                                                                            <button
                                                                                className="add_fixed_value_btn"
                                                                                onClick={() => {
                                                                                    addFixedValue(
                                                                                        tableIndex,
                                                                                        rowIndex,
                                                                                        fixedValue,
                                                                                        table.scoreType ===
                                                                                            FIXED_SCORE_TYPE
                                                                                            ? 0
                                                                                            : scoreValue
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Thêm
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    <ul>
                                                                        {table.rowTitleList[rowIndex].fixedValue.map(
                                                                            (fixedValueObj, index) => (
                                                                                <li
                                                                                    key={index}
                                                                                    className="fixed_value_item"
                                                                                >
                                                                                    <span className="fixed_value_wrapper">
                                                                                        <span className="fixed_value_icon">
                                                                                            <FaCaretRight />
                                                                                        </span>
                                                                                        <span className="fixed_value">
                                                                                            {fixedValueObj.value}
                                                                                        </span>
                                                                                        {table.scoreType ===
                                                                                            DYNAMIC_SCORE_TYPE && (
                                                                                            <span className="score_value">
                                                                                                {'Điểm: ' +
                                                                                                    fixedValueObj.score}
                                                                                            </span>
                                                                                        )}
                                                                                    </span>

                                                                                    {!tableDetailsData && (
                                                                                        <div
                                                                                            className="btn_del_fixed_value"
                                                                                            onClick={() =>
                                                                                                removeFixedValue(
                                                                                                    tableIndex,
                                                                                                    rowIndex,
                                                                                                    index
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <AiFillCloseCircle />
                                                                                        </div>
                                                                                    )}
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        >
                                                            <div
                                                                className={
                                                                    tableDetailsData ? 'more_value_btn' : 'add__col'
                                                                }
                                                                onClick={() => {
                                                                    handleOpenModalAddFixedValue(tableIndex, rowIndex);
                                                                }}
                                                            >
                                                                {table.rowTitleList[rowIndex].fixedValue.length > 0 &&
                                                                    tableDetailsData && (
                                                                        <abbr title="Xem danh sách giá trị được định sẵn">
                                                                            <IoMdMore />
                                                                        </abbr>
                                                                    )}

                                                                {!tableDetailsData && (
                                                                    <abbr title="Tạo danh sách giá trị được định sẵn">
                                                                        <IoIosAddCircle />
                                                                    </abbr>
                                                                )}
                                                            </div>
                                                        </Tippy>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!tableDetailsData && (
                    <div className="line__flex">
                        <ComponentButton
                            onClick={handleAddTable ? handleAddGoal : handleUpdateTable ? handleUpdateGoal : addTable}
                            type="button"
                            textButton={handleUpdateTable ? 'Cập Nhật Chỉ Tiêu' : 'Thêm Chỉ Tiêu'}
                            className={`btn__add_table ${handleAddTable || handleUpdateTable ? 'active' : ''}`}
                            icon_before={handleUpdateTable ? <AiFillEdit /> : <BiSolidAddToQueue />}
                        />

                        {!handleAddTable && !handleUpdateTable && (
                            <ComponentButton
                                textButton="Tạo Nhóm Chỉ Tiêu"
                                onClick={handleCreatePage}
                                type="button"
                                className="btn__create--page"
                                icon_before={<AiFillSave />}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalsCreation;
