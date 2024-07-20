import { useEffect, useState } from 'react';
import { BiSolidAddToQueue } from 'react-icons/bi';
import Tippy from '@tippyjs/react/headless';
import { AiFillCloseCircle, AiFillSave, AiOutlineClose } from 'react-icons/ai';
import { FaCaretRight } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import { MdOutlineAddCircle } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { createPage } from '../redux/actions/pageAction';
import GLOBALTYPES from '../redux/actions/globalTypes';
import { facultySelector } from '../redux/selector';
import ComponentButton from '../components/ComponentButton/ComponentButton';
import { getAllFaculties } from '../redux/actions/facultyAction';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

const CreateGoals = ({ handleAddTable, handleUpdateTable, prevUpdatedTableData }) => {
    const dispatch = useDispatch();
    const faculty = useSelector(facultySelector);
    const [pageName, setPageName] = useState('');
    const [pageFaculty, setPageFaculty] = useState('');
    const [pageStudentCohort, setPageStudentCohort] = useState('');
    const [pageStudentMajor, setPageStudentMajor] = useState('');
    const [pageStudentLevelYear, setPageStudentLevelYear] = useState('');
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

    const handleChangeFacultySelect = (e) => {
        setPageFaculty(JSON.parse(e.target.value));
    };

    const handleChangeMajorSelect = (e) => {
        setPageStudentMajor(JSON.parse(e.target.value));
    };

    const handleChangeCohortSelect = (e) => {
        const cohortInfo = JSON.parse(e.target.value);
        setPageStudentCohort(cohortInfo);
        setPageStudentLevelYear(cohortInfo.currentLevelYear);
    };

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
        setPageFaculty('');
        setPageStudentCohort('');
        setPageStudentMajor('');
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
            if (
                table.rowTitleList.length !==
                new Set(table.rowTitleList.map((rowTitle) => JSON.stringify(rowTitle))).size
            ) {
                notifyValue = 'Các Cột Không Được Trùng Tên';
                return true;
            }

            if (table.scoreType === FIXED_SCORE_TYPE && !table.fixedScore) {
                notifyValue = 'Chưa Nhập Điểm Cho Chỉ Tiêu';
                return true;
            }

            if (
                table.scoreType === DYNAMIC_SCORE_TYPE &&
                table.rowTitleList.every((rowTitleList) => rowTitleList.fixedValue.length === 0)
            ) {
                notifyValue = 'Chưa Nhập Điểm Cho Chỉ Tiêu';
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
                pageType: 'chỉ tiêu',
                pageFaculty: pageFaculty.facultyName,
                pageStudentCohort: pageStudentCohort.cohortName,
                pageStudentMajor: pageStudentMajor.majorName,
                pageStudentLevelYear,
                tables: tables.map((table) => {
                    const tableData = {
                        tableName: table.tableName,
                        quantityDemanded: table.quantityDemanded,
                        description: table.description,
                        rowTitleList: table.rowTitleList,
                        fixedScore: table.fixedScore || 0
                    };

                    if (!table.fixedScore) delete tableData.fixedScore;

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
        if (faculty.facultyData.length === 0) dispatch(getAllFaculties());
    }, []);

    useEffect(() => {
        if (prevUpdatedTableData)
            setTables([
                {
                    ...prevUpdatedTableData,
                    scoreType: prevUpdatedTableData.fixedScore ? FIXED_SCORE_TYPE : DYNAMIC_SCORE_TYPE
                }
            ]);
    }, [prevUpdatedTableData]);

    // Reset filter
    useEffect(() => {
        setPageStudentMajor('');
        setPageStudentCohort('');
    }, [pageFaculty]);

    useEffect(() => {
        setPageStudentCohort('');
    }, [pageStudentMajor]);

    return (
        <div className="wrap__goals">
            <div className="body__goals">
                {!handleAddTable && !handleUpdateTable && (
                    <div className="goals_info_wrapper">
                        <div className="faculty_info">
                            <select
                                defaultValue={''}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setPageFaculty('');
                                        return;
                                    }
                                    handleChangeFacultySelect(e);
                                }}
                            >
                                <option value="">Chọn Khoa</option>
                                {faculty.facultyData.map((facultyItem) => (
                                    <option key={facultyItem._id} value={JSON.stringify(facultyItem)}>
                                        {capitalizeFirstLetter(facultyItem.facultyName)}
                                    </option>
                                ))}
                            </select>

                            <select
                                defaultValue={''}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setPageStudentMajor('');
                                        return;
                                    }
                                    handleChangeMajorSelect(e);
                                }}
                            >
                                {pageFaculty && pageFaculty?.majors ? (
                                    <>
                                        <option value="">Chọn Chuyên Ngành</option>

                                        {pageFaculty.majors.map((majorItem) => (
                                            <option key={majorItem._id} value={JSON.stringify(majorItem)}>
                                                {capitalizeFirstLetter(majorItem?.majorName)}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="">Chưa Chọn Khoa</option>
                                )}
                            </select>

                            <select
                                defaultValue={''}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setPageStudentCohort('');
                                        return;
                                    }
                                    handleChangeCohortSelect(e);
                                }}
                            >
                                {(pageStudentMajor || pageFaculty) && pageStudentMajor?.cohortList ? (
                                    <>
                                        <option value="">Chọn Khóa</option>

                                        {pageStudentMajor.cohortList.map((cohort) => (
                                            <option key={cohort._id} value={JSON.stringify(cohort)}>
                                                {capitalizeFirstLetter(cohort?.cohortName)}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="">Chưa Chọn Ngành</option>
                                )}
                            </select>

                            <input
                                className="year_info_input"
                                type="text"
                                readOnly
                                placeholder="Năm Học"
                                value={
                                    pageStudentCohort.currentLevelYear
                                        ? `Năm ${pageStudentCohort.currentLevelYear}`
                                        : ''
                                }
                            />
                        </div>
                    </div>
                )}

                {!handleAddTable && !handleUpdateTable && (
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
                                    <select
                                        value={tables[tableIndex].scoreType}
                                        onChange={(e) => {
                                            updateTable(tableIndex, 'scoreType', e.target.value);
                                        }}
                                    >
                                        <option value={FIXED_SCORE_TYPE}>Điểm số cố định</option>
                                        <option value={DYNAMIC_SCORE_TYPE}>Điểm số không cố định</option>
                                    </select>
                                </div>

                                {table.scoreType === FIXED_SCORE_TYPE && (
                                    <div className="flex__line_lable">
                                        <label htmlFor="score_input">Nhập Điểm:</label>
                                        <input
                                            className={`score_input`}
                                            type="text"
                                            placeholder="Nhập điểm số chỉ tiêu"
                                            value={table.fixedScore}
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

                                <div className="table__col--target">
                                    <div className="flex__line">
                                        <ComponentButton
                                            onClick={() => addRowValue(tableIndex)}
                                            textButton="Thêm Cột"
                                            className="btn__add-col"
                                            icon_before={<MdOutlineAddCircle />}
                                        />
                                    </div>

                                    <div className="tr__line--cols">
                                        <div className="box__cols">
                                            {table.rowTitleList.map((rowTitle, rowIndex) => {
                                                return (
                                                    <div key={rowIndex} className="item__col">
                                                        <input
                                                            type="text"
                                                            value={rowTitle?.titleValue || ''}
                                                            placeholder={`Cột ${rowIndex + 1}`}
                                                            onChange={(e) =>
                                                                updateRowTitle(tableIndex, rowIndex, e.target.value)
                                                            }
                                                        />
                                                        {table.rowTitleList.length > 1 && (
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
                                                                        Thêm Giá Trị Cố Định{' '}
                                                                        <span>
                                                                            {rowTitle?.titleValue
                                                                                ? '(' + rowTitle?.titleValue + ')'
                                                                                : rowTitle?.titleValue}
                                                                        </span>
                                                                    </h3>
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
                                                                                        Number.parseInt(e.target.value)
                                                                                    );
                                                                                }}
                                                                                value={
                                                                                    isNaN(scoreValue) ? '' : scoreValue
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
                                                                                    table.scoreType === FIXED_SCORE_TYPE
                                                                                        ? 0
                                                                                        : scoreValue
                                                                                );
                                                                            }}
                                                                        >
                                                                            Thêm
                                                                        </button>
                                                                    </div>
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
                                                                                </li>
                                                                            )
                                                                        )}
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
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="line__flex">
                    <ComponentButton
                        onClick={handleAddTable ? handleAddGoal : handleUpdateTable ? handleUpdateGoal : addTable}
                        type="button"
                        textButton={handleUpdateTable ? 'Cập Nhật Chỉ Tiêu' : 'Thêm Chỉ Tiêu'}
                        className={`btn__add_table ${handleAddTable || handleUpdateTable ? 'active' : ''}`}
                        icon_before={<BiSolidAddToQueue />}
                    />
                    {!handleAddTable && !handleUpdateTable && (
                        <ComponentButton
                            textButton="Tạo Trang"
                            onClick={handleCreatePage}
                            type="button"
                            className="btn__create--page"
                            icon_before={<AiFillSave />}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateGoals;
