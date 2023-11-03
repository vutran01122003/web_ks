import React, { useEffect, useState } from 'react'
import LayoutTable from '../components/ComponentTable/LayoutTable'
import { useSelector } from 'react-redux'
import { pageSelector } from '../redux/selector';

const DynamicPage = () => {
    const page = useSelector(pageSelector);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        if(page?.tables) {
            const arr = page.tables.map((table) => {
                const TABLE = {};
                TABLE.tableId = table._id;
                TABLE.title = table.tableName;
                TABLE.thead = table.rowTitleList.map((rowTitle) => {
                    return {
                        textHeading: rowTitle,
                        typeInput: 'text', 
					    isShow: true,
                    }
                })

                TABLE.thead = [
                    ...TABLE.thead, 
                    {
                        textHeading: "Minh Chứng",
                        typeInput: 'file',
                        isShow: true,
                    }, {
                        textHeading: "Trạng Thái",
                        typeInput: 'text',
                        isShow: false,
                    }
                ];

                if(table?.rowValueList?.length > 0) {
                    TABLE.tbody = table.rowValueList[0].content.map((rowValueItem) => {
                        return [...rowValueItem.rowValue, {
                            proofNameLabel: 'Xem Minh Chứng',
                            proofImages: rowValueItem.proofImageList
                        }, {
                            statusLabel: rowValueItem.status,
                            statusValue: rowValueItem.status === "Chờ Duyệt" ? null : 
                            (rowValueItem.status === "Đã Duyệt" ? true : false)
                        }];
                    })
                } 
               
                return TABLE
            })
            setTables(arr);
        }
    }, [page?.pageName, JSON.stringify(page?.tables)]);

	return (
		<div className="container__plan">
			{tables.map((table) => {
				return (
					<LayoutTable
						key={table.tableId}
						table={table} 
                        page={page}
					></LayoutTable>
				)
			})}
		</div>
	)
}

export default DynamicPage