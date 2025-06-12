import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Modal from './Modal';
import AccountCreatetion from '../Permisson/AccountCreation';
import { getAllFaculties } from '../../redux/actions/facultyAction';

function AccountCreatetionModal({ facultyData, onToggleModal }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (facultyData.length === 0) dispatch(getAllFaculties());
    }, [dispatch]);

    return (
        <Modal headerTitle="Thêm quản lý chuyên ngành" onHiddenModal={onToggleModal}>
            <div className="permission_container">
                <AccountCreatetion facultyData={facultyData} onToggleModal={onToggleModal} />
            </div>
        </Modal>
    );
}

export default AccountCreatetionModal;
