import React, { useRef, useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import ComponentInput from '../ComponentForm/ComponentInput'
import { useDispatch, useSelector } from 'react-redux'
import { addRow } from '../../redux/actions/pageAction'
import { authSelector } from '../../redux/selector'
import ComponentProofFile from '../ComponentForm/ComponentProofFile'
import GLOBALTYPES from '../../redux/actions/globalTypes'

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

        if(thead.some((item) => {
            return Object.keys(row).includes(item.textHeading) === false;
        }) && files.length === 0) {
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
        formData.set('page', page.pageId);
        formData.set('table', tableId);
        formData.set('path', page.pathName);

        for(let key in row) {
            formData.append('content', row[key]);
        }

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
            onClick={handleCloseModal}
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
                        thead.map((item) => (
                            item.isShow ? (
                                item.typeInput === 'file' ? 
                                <ComponentProofFile 
                                    files={files} 
                                    setFiles={setFiles}
                                    key={tableId + item.textHeading}
                                /> :
                                <ComponentInput
                                    key={tableId + item.textHeading}
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
                            ) : null
                        ))
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
