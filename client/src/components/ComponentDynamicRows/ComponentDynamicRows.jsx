import LayoutTable from '../ComponentTable/LayoutTable';
import { renderTable } from '../../helpers/renderTable';

function ComponentDynamicRows({ index, rowsType, dynamicRows, talentEngineerType }) {
    const table = renderTable({ dynamicRowsInfo: dynamicRows, rowsType });
    console.log(talentEngineerType);
    return (
        <div className="dynamic_goals_container">
            <LayoutTable
                isDynamicRows
                index={index}
                table={table}
                pendingTable={true}
                talentEngineerType={talentEngineerType}
            />
        </div>
    );
}

export default ComponentDynamicRows;
