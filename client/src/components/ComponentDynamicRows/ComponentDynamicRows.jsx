import LayoutTable from '../ComponentTable/LayoutTable';
import { renderTable } from '../../helpers/renderTable';

function ComponentDynamicRows({ index, rowsType, dynamicRows }) {
    const table = renderTable({ dynamicRowsInfo: dynamicRows, rowsType });

    return (
        <div className='dynamic_goals_container'>
            <LayoutTable isDynamicRows index={index} table={table} pendingTable={true} />
        </div>
    );
}

export default ComponentDynamicRows;
