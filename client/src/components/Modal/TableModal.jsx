import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { addRow } from '../../redux/actions/rowAction';
import ComponentProofFile from '../ProofFile/ComponentProofFile';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import FormControl from '../Form/FormControl';

const ComponentModal = ({ auth, rowInfo, handleHideModal, tableId, title, thead, page }) => {
    const dispatch = useDispatch();

    const [row, setRow] = useState(rowInfo?.rowValue ?? {});
    const [files, setFiles] = useState([]);
    const handleChangeRow = (e) => {
        setRow({ ...row, [e.target.name]: e.target.value });
    };

    const handleUpdateRow = (e) => {
        handleAddRow(e);
    };

    const handleAddRow = (e) => {
        e.preventDefault();

        const { _id, userId, faculty, major, cohort, levelYear } = auth?.user;
        const { pageId, pageStudentLevelYear, pathName } = page;

        if (levelYear > pageStudentLevelYear) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: `Hoạt động nộp minh chứng năm ${pageStudentLevelYear} đã kết thúc.`
                }
            });
            handleHideModal();
            return;
        }

        if (
            thead.find((head) => {
                return !head.requiredHeading && !row[head._id];
            }) ||
            files.length === 0
        ) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: 'Thông tin chưa đầy đủ'
                }
            });
            return;
        }

        const formData = new FormData();

        let rowData = {
            userId,
            user: _id,
            levelYear,
            path: pathName,
            faculty: faculty?.facultyName,
            major: major?.majorName,
            cohort: cohort?.cohortName,
            page: pageId,
            pageStudentLevelYear,
            table: tableId,
            tableName: title,
            content: JSON.stringify(row)
        };

        if (rowInfo)
            rowData = {
                ...rowData,
                deadline: rowInfo.deadline,
                rowListId: rowInfo.rowListId,
                contentId: rowInfo._id
            };

        formData.set('rowData', JSON.stringify(rowData));

        files.forEach((file) => {
            formData.append('files', file, file.name);
        });

        dispatch(
            addRow({
                formData
            })
        );

        handleHideModal();
    };

    const handleCloseModal = (e) => {
        if (e.currentTarget === e.target) {
            handleHideModal();
        }
    };

    return (
        <div className={`wrap__modal`} onDoubleClick={handleCloseModal}>
            <form className={`modal`}>
                <div className="head__modal">
                    <div className="head__modal__title ">
                        <span>{title}</span>
                        <span className="deadline_info">
                            {rowInfo?.deadline && `(Hạn nộp: ${new Date(rowInfo?.deadline).toLocaleString('en-GB')})`}
                        </span>
                    </div>
                    <button type="button" className="btn__close" onClick={() => handleHideModal()}>
                        <IoCloseOutline />
                    </button>
                </div>

                <div className="body__modal">
                    {thead &&
                        thead.map((item) => {
                            if (!item.isShow) return null;

                            if (item.typeInput === 'file') {
                                return <ComponentProofFile files={files} setFiles={setFiles} key={item.textHeading} />;
                            } else if (item.typeInput === 'text') {
                                return (
                                    <FormControl
                                        key={item.textHeading}
                                        label={item.textHeading}
                                        placeholder={item.textHeading}
                                        className="input__modal"
                                        type={item.typeInput}
                                        disabled={item.disabled}
                                        value={row[item._id] ? row[item._id] : ''}
                                        name={item._id}
                                        onChange={handleChangeRow}
                                        classNameInputItem={item.classNameInputItem}
                                    />
                                );
                            } else if (item.typeInput === 'select') {
                                return (
                                    <div className="select_modal_wrapper" key={item.textHeading}>
                                        <label>{item.textHeading}</label>
                                        <select
                                            className="select_modal"
                                            name={item._id}
                                            value={row[item._id] || ''}
                                            onChange={handleChangeRow}
                                        >
                                            <option key={item.textHeading} value="">
                                                {item.textHeading}
                                            </option>

                                            {item.fixedValueList.map((fixedValue, index) => (
                                                <option key={fixedValue.value + index} value={fixedValue.value}>
                                                    {`${fixedValue.value} | ${item.fixedScore || fixedValue.score} Điểm`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }

                            return null;
                        })}
                </div>

                <div className="button_add_row">
                    <button type="button" onClick={rowInfo ? handleUpdateRow : handleAddRow}>
                        {rowInfo ? 'Nộp Lại Hoạt Động' : 'Thêm Hoạt Động'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComponentModal;
