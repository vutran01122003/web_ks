import { useState } from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import { TiDeleteOutline } from 'react-icons/ti';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { createMajors } from '../../redux/actions/facultyAction';

function CreateMajorModal({ onHiddenModal, facultyId }) {
    const dispatch = useDispatch();

    const [majorList, setMajorList] = useState([]);
    const [majorName, setMajorName] = useState('');

    const handleChangeMajorName = (e) => {
        setMajorName(e.target.value);
    };

    const addMajor = () => {
        if (majorName.trim()) setMajorList((prev) => Array.from(new Set([...prev, majorName])));
        setMajorName('');
    };

    const deleteMajor = (majorData) => {
        setMajorList((prev) => prev.filter((majorItem) => majorItem !== majorData));
    };

    const onCreateMajors = (facultyId) => {
        dispatch(createMajors({ facultyId, majorNameList: majorList }));
    };

    return (
        <Modal onHiddenModal={onHiddenModal} headerTitle="Thêm Chuyên Ngành">
            <form className="major_form">
                <fieldset>
                    <div className="input_item_wrapper">
                        <label htmlFor="major_input">Tên Chuyên Ngành:</label>
                        <input
                            id="major_input"
                            type="text"
                            onChange={handleChangeMajorName}
                            value={majorName}
                            placeholder="Nhập tên chuyên ngành"
                        />
                        <button type="button" onClick={addMajor} className="add_major_btn">
                            Thêm
                        </button>
                    </div>

                    {majorList.length > 0 && (
                        <div className="major_list">
                            <h5 className="major_list_title title">Danh sách chuyên ngành: </h5>
                            {majorList.map((major, index) => (
                                <div key={index} className="major_item">
                                    <div className="major_item_content">
                                        <IoMdArrowDropright />
                                        <span> {major} </span>
                                    </div>

                                    <div
                                        className="major_item_delete_btn"
                                        onClick={() => {
                                            deleteMajor(major);
                                        }}
                                    >
                                        <TiDeleteOutline />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </fieldset>

                <button type="button" className="create_new_major_btn" onClick={onCreateMajors}>
                    Thêm Chuyên Ngành
                </button>
            </form>
        </Modal>
    );
}

export default CreateMajorModal;
