import React, { useEffect, useRef, useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import ComponentInput from '../ComponentForm/ComponentInput'
import { useDispatch, useSelector } from 'react-redux'
import { addRow } from '../../redux/actions/pageAction'
import { authSelector } from '../../redux/selector'

const ComponentModal = ({ isDone, setIsDone, stateModal, setStateModal, tableId, title, thead, page }) => {
    let refBoxModal = useRef();
    const dispatch = useDispatch();
    const auth = useSelector(authSelector);
    const [row, setRow] = useState(null);
    const refButton = useRef();

	useEffect(() => {
		let hanlder = (e) => {
			if (!refBoxModal.current.contains(e.target)) setStateModal(false)
		}
		document.addEventListener('mousedown', hanlder)
		return () => document.removeEventListener('mousedown', hanlder)
	})

    const handleChangeRow = (e) => {
        setRow({...row, [e.target.name]: e.target.value});
    }


    const handleSubmitForm = (e) => {
        setStateModal(false);
        // setIsDone(true);
        refButton.current.click();
    }

    const handleAddRow = (e) => {
        e.preventDefault();
        const data = [];

        for(let key in row) {
            data.push(row[key]);
        }

        dispatch(addRow({
            user: auth?.user._id,
            page: page.pageId,
            table: tableId,
            content: data,
            pathName: page.pathName
        }))
    }

	if (stateModal) {
		window.body.style.overflow = 'hidden'
	} else {
		window.body.style.overflow = 'auto'
	}

	return (
		<div className={`wrap__modal ${stateModal ? 'active__modal' : 'unactive__modal'}`}>
			<form className={`modal`} ref={refBoxModal} onSubmit={handleAddRow}>
				<div className="head__modal">
					<div className="head__modal__title ">{title}</div>
					<button type="button" className="btn__close" onClick={() => setStateModal(false)}>
						<IoCloseOutline />
					</button>
				</div>
				<div className="body__modal">       
                   {   
                        thead &&
                        thead.map((item, index) => (
                            item.isShow ? (
                                <ComponentInput
                                    key={index}
                                    label={item.textHeading}
                                    placeholder={item.textHeading}
                                    className="input__modal"
                                    type={item.typeInput} // thead sẽ truyền type vào đây => hết
                                    disabled={item.disabled}
                                    value={item.value}
                                    name={index}
                                    onChange={handleChangeRow}
                                    classNameInputItem={item.classNameInputItem}
                                    labelTypeFile={item.labelTypeFile}
                                />
                            ) : null
                        ))
                   }
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'end',
						gap: '10px',
						padding: '10px 20px',
					}}
				>
					<button type="submit" onClick={handleSubmitForm} >Thêm</button>
					<button ref={refButton} type="reset">Reset</button>
				</div>
			</form>
		</div>
	)
}

export default ComponentModal
