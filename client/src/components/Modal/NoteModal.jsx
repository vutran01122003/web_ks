import { AiOutlineClose } from 'react-icons/ai';
import { formatTimeStr } from '../../utils/formatDatetime';

function NoteModal({ handleHiddenNoteModal, noteList }) {
    const handleHiddenPopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHiddenNoteModal(e);
        }
    };

    return (
        <div className="modal_overlap" onDoubleClick={handleHiddenPopup}>
            <div className="note_modal">
                <div className="note_modal_header">
                    <h3>{'Lịch sử ghi chú của hoạt động'}</h3>
                    <div className="modal_close_btn" onClick={handleHiddenNoteModal}>
                        <AiOutlineClose />
                    </div>
                </div>
                <div className="note_modal_body">
                    {noteList.length > 0
                        ? noteList.map((note) => (
                              <div className="note_wrapper" key={note._id}>
                                  <span className="note_time">
                                      {formatTimeStr(note.createdAt)}
                                      {': '}
                                  </span>
                                  <span className="note_value">{note.value}</span>
                              </div>
                          ))
                        : 'Chưa có ghi chú'}
                </div>
            </div>
        </div>
    );
}

export default NoteModal;
