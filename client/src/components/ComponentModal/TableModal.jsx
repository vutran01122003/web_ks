import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { addRow } from '../../redux/actions/rowAction';
import ComponentProofFile from '../ComponentProofFile/ComponentProofFile';
import GLOBALTYPES from '../../redux/actions/globalTypes';
import FormControl from '../ComponentForm/FormControl';

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

        if (
            thead.find((head) => {
                return !head.requiredHeading && !row[head.textHeading];
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
            user: auth?.user._id,
            studentId: auth?.user.studentId,
            faculty: auth?.user.faculty,
            major: auth?.user.major,
            cohort: auth?.user.cohort,
            tableName: title,
            page: page.pageId,
            table: tableId,
            path: page.pathName,
            content: JSON.stringify(row)
        };

        if (rowInfo) rowData = { ...rowData, rowListId: rowInfo.rowListId, contentId: rowInfo._id };

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
        <div className={`wrap__modal`} onMouseUp={handleCloseModal}>
            <form className={`modal`}>
                <div className='head__modal'>
                    <div className='head__modal__title '>{title}</div>
                    <button type='button' className='btn__close' onClick={() => handleHideModal()}>
                        <IoCloseOutline />
                    </button>
                </div>

                <div className='body__modal'>
                    {thead &&
                        thead.map((item, index) => {
                            if (!item.isShow) return null;

                            if (item.typeInput === 'file') {
                                return (
                                    <ComponentProofFile
                                        files={files}
                                        setFiles={setFiles}
                                        key={item.textHeading + index}
                                    />
                                );
                            } else if (item.typeInput === 'text') {
                                return (
                                    <FormControl
                                        key={item.textHeading + index}
                                        label={item.textHeading}
                                        placeholder={item.textHeading}
                                        className='input__modal'
                                        type={item.typeInput}
                                        disabled={item.disabled}
                                        value={row[item.textHeading] ? row[item.textHeading] : ''}
                                        name={item.textHeading}
                                        onChange={handleChangeRow}
                                        classNameInputItem={item.classNameInputItem}
                                    />
                                );
                            } else if (item.typeInput === 'select') {
                                return (
                                    <div
                                        className='select_modal_wrapper'
                                        key={item.textHeading + index}
                                    >
                                        <label>{item.textHeading}</label>
                                        <select
                                            className='select_modal'
                                            defaultValue={row[item.textHeading] || ''}
                                            name={item.textHeading}
                                            onChange={handleChangeRow}
                                        >
                                            <option key={item.textHeading} value=''>
                                                {item.textHeading}
                                            </option>
                                            {item.fixedValueList.map((fixedValue) => (
                                                <option
                                                    key={fixedValue.value}
                                                    value={fixedValue.value}
                                                >
                                                    {fixedValue.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }

                            return null;
                        })}
                </div>

                <div className='button_add_row'>
                    <button type='button' onClick={rowInfo ? handleUpdateRow : handleAddRow}>
                        {rowInfo ? 'Nộp Lại Hoạt Động' : 'Thêm Hoạt Động'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComponentModal;
