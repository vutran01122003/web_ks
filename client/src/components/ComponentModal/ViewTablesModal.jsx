import { useEffect } from 'react';
import {AiOutlineClose} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getTables } from '../../redux/actions/tableAction';
import { tableSelector } from '../../redux/selector';

function ViewTablesModal({ handleHideViewTablesModal, subPageName}) {
    const dispatch = useDispatch();
    const table = useSelector(tableSelector);
    const handleClosePopup = () => {
        handleHideViewTablesModal();
    }

    useEffect(() => {
        dispatch(getTables({subPageName}));
    }, [])

    console.log(table);

    return (  
        <div 
            className="modal_overlap"
            onMouseUp={handleClosePopup}
        >   
            <div className="box_wrapper">
                <h2 className="modal_header">{subPageName}</h2>
                <div 
                    className="modal_close_icon_wrapper"
                    onClick={handleHideViewTablesModal}
                >
                    <AiOutlineClose />
                </div>
                <div className='view_tables_modal'>
                    {
                        table.tables.length === 0 ? 
                        <h3 className='notify_nothing_title'>Không có chỉ tiêu</h3>: 
                        <div className='tables_wrapper'>
                            {
                                table.tables.map((table, index) => 
                                    <div key={table._id}>
                                        <h4 className='table_label_goal'>Chỉ Tiêu {index + 1}</h4>
                                        <table className="table_detail_goal">
                                            <thead><th colSpan={table.rowTitleList.length}>{table.tableName}</th></thead>
                                            <tbody>
                                                {
                                                    table.rowTitleList.map((title) => 
                                                        <td key={table._id + title}><span>{title}</span></td>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default ViewTablesModal;