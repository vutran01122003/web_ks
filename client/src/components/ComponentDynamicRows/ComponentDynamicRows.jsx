import { useEffect, useState } from 'react';
import LayoutTable from '../ComponentTable/LayoutTable';
import { renderTable } from '../../helpers/renderTable';

function ComponentDynamicRows({ index, rowsType, dynamicRows }) {
    const [table, setTable] = useState(null);

    useEffect(() => {
       if(rowsType) {
            setTable(renderTable({dynamicRowsInfo: dynamicRows, rowsType}));
        }
    }, []);

    return (
        rowsType &&
        <div className='pedding_goals_container'>
            <div className='pedding_goals_wrapper'>
                <LayoutTable isDynamicRows index={index} table={table} pendingTable={true} />
            </div>
        </div>
    );
}

export default ComponentDynamicRows;