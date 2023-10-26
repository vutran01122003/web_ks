import React, { useEffect, useState } from 'react'
import LayoutTable from '../components/ComponentTable/LayoutTable'
import { useSelector } from 'react-redux'
import { pageSelector } from '../redux/selector';

const DynamicPage = () => {
    const page = useSelector(pageSelector);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        if(page?.tables) {
            const arr = page.tables.map((table, index) => {
                const TABLE = {};
                TABLE.tableId = table._id;
                TABLE.title = table.tableName;
                TABLE.thead = table.rowTitleList.map((rowTitle) => {
                    return {
                        textHeading: rowTitle,
                        typeInput: 'text', // đây là lúc set => nó sẽ vào thằng Table.thead
					    isShow: true,
                    }
                })

                TABLE.thead = [
                    ...TABLE.thead, 
                    {
                        textHeading: "Minh Chứng",
                        typeInput: 'file',
                        id:"minhchung",
                        isShow: true,
                        classNameInputItem:"display_none",
                        labelTypeFile:"Nhấn vào để tải file minh chứng"
                    }, {
                        textHeading: "Trạng Thái",
                        typeInput: 'text',
                        isShow: false,
                    }
                ];

                if(table?.rowValueList?.length > 0) {
                    TABLE.tbody = table.rowValueList[0].content.map((rowValueItem) => {
                        return [...rowValueItem.rowValue, `Minh Chứng`, `${rowValueItem.status}`];
                    })
                } 
               
                return TABLE
            })
            setTables(arr);
        }
    }, [page?.pageName, JSON.stringify(page?.tables)]);

	return (
		<div className="container__plan">
			{tables.map((table, index) => {
				return (
					<LayoutTable
						key={index}
						table={table} // Table.thead sẽ nằm trong table
                        page={page}
					></LayoutTable>
				)
			})}
		</div>
	)
}

export default DynamicPage