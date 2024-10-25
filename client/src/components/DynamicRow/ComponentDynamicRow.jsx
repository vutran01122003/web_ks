import LayoutTable from '../Table/LayoutTable';
import { renderTable } from '../../helpers/renderTable';

function ComponentDynamicRow({ index, rowsType, dynamicRows, talentEngineerType }) {
    const table = renderTable({ dynamicRowsInfo: dynamicRows, rowsType });

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

export default ComponentDynamicRow;
