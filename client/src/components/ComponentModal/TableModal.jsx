import React, { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { addRow } from '../../redux/actions/rowAction'
import { authSelector } from '../../redux/selector'
import ComponentProofFile from '../ComponentForm/ComponentProofFile'
import GLOBALTYPES from '../../redux/actions/globalTypes'
import FormControl from '../ComponentForm/FormControl'

const ComponentModal = ({stateModal, setStateModal, tableId, title, thead, page }) => {
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const [row, setRow] = useState({});
    const [files, setFiles] = useState([]);
    const handleChangeRow = (e) => {
        setRow({...row, [e.target.name]: e.target.value});
    }

    const handleAddRow = (e) => {
        e.preventDefault();

        if(thead.find((head) => { 
            return !head.requiredHeading && !row[head.textHeading]
        }) || files.length === 0) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: "Thông tin chưa đầy đủ"
                }
            })
            return;
        } 

        const formData = new FormData();

        formData.set('user', auth?.user._id);
        formData.set('studentId', auth?.user.studentId);
        formData.set('page', page.pageId);
        formData.set('table', tableId);
        formData.set('path', page.pathName);
        formData.set('content', JSON.stringify(row));

        files.forEach((file) => {
            formData.append('files', file, file.name); 
        })

        setStateModal(false);
        dispatch(addRow({
            formData
        }))
    }

    const handleCloseModal = (e) => {
        if(e.currentTarget === e.target) {
            setStateModal(false);     
        }
    }

	return (
		<div 
            className={`wrap__modal ${stateModal ? 'active__modal' : 'unactive__modal'}`}
            onMouseUp={handleCloseModal}
        >
			<form className={`modal`} >
				<div className="head__modal">
					<div className="head__modal__title ">{title}</div>
					<button type="button" className="btn__close" onClick={() => setStateModal(false)}>
						<IoCloseOutline />
					</button>
				</div>

				<div className="body__modal">       
                   {   
                        thead &&
                        thead.map((item, index) => {
                            if(!item.isShow) return null;

                            if(item.typeInput === 'file' )  {
                                return (
                                    <ComponentProofFile 
                                        files={files} 
                                        setFiles={setFiles}
                                        key={item.textHeading + index}
                                    /> 
                                )
                            }
                                   
                            if(item.typeInput === 'text') {
                                return (
                                    <FormControl
                                        key={item.textHeading + index}
                                        label={item.textHeading}
                                        placeholder={item.textHeading}
                                        className="input__modal"
                                        type={item.typeInput} 
                                        disabled={item.disabled}
                                        value={item.value}
                                        name={item.textHeading}
                                        onChange={handleChangeRow}
                                        classNameInputItem={item.classNameInputItem}
                                    />
                                )
                            }  
                            
                            if(item.typeInput === 'select') {
                               return (
                               <div 
                                    className='select_modal_wrapper'
                                    key={item.textHeading + index}
                                >
                                    <label>{item.textHeading}</label>
                                    <select 
                                        className='select_modal' 
                                        defaultValue="" 
                                        name={item.textHeading}
                                        onChange={handleChangeRow}
                                    >
                                        <option key={item.textHeading} value="">
                                            {item.textHeading}
                                        </option>
                                        {
                                            item.fixedValueList.map((fixedValue) => (
                                                <option key={fixedValue} value={fixedValue} >
                                                    {fixedValue}
                                                </option>
                                            ))   
                                        }
                                    </select>
                               </div>
                               )
                            }
                            
                            return null;
                        })
                   }
				</div>

				<div className='button_add_row'>
					<button type="button" onClick={handleAddRow} >Thêm</button>
				</div>
			</form>
		</div>
	)
}

export default ComponentModal
