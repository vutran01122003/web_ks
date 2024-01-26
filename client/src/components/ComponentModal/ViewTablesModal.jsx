import { useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getTables } from '../../redux/actions/tableAction';
import { tableSelector } from '../../redux/selector';

function ViewTablesModal({ handleHideViewTablesModal, subPageName }) {
    const dispatch = useDispatch();
    const table = useSelector(tableSelector);
    const handleClosePopup = (e) => {
        if (e.target === e.currentTarget) {
            handleHideViewTablesModal();
        }
    };

    useEffect(() => {
        dispatch(getTables({ subPageName }));
    }, []);

    return (
        <div className='modal_overlap' onMouseUp={handleClosePopup}>
            <div className='box_wrapper'>
                <h2 className='modal_header'>{subPageName}</h2>
                <div className='modal_close_icon_wrapper' onClick={handleHideViewTablesModal}>
                    <AiOutlineClose />
                </div>
                <div className='view_tables_modal'>
                    {table.tables.length === 0 ? (
                        <h3 className='notify_nothing_title'>Không có chỉ tiêu</h3>
                    ) : (
                        <div className='tables_wrapper'>
                            {table.tables.map((table, index) => (
                                <div key={table._id + index}>
                                    <h4 className='table_label_goal'>Chỉ Tiêu {index + 1}</h4>
                                    <table className='table_detail_goal'>
                                        <thead>
                                            <tr>
                                                <td
                                                    className='table_header'
                                                    colSpan={table.rowTitleList.length}
                                                >
                                                    {table.tableName}
                                                </td>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                {table.rowTitleList.map((rowTitleItem, index) => (
                                                    <td key={index + rowTitleItem.titleValue}>
                                                        <span>{rowTitleItem.titleValue}</span>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewTablesModal;
