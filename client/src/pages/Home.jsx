import React, { useCallback, useEffect, useRef, useState } from 'react'
import LayoutInfo from '../components/ComponentHome/LayoutInfo'
import LayoutChart from '../components/ComponentHome/LayoutChart'
import ApplyComponent from '../components/ComponentHome/ApplyComponent'
import CreatedNewsHistory from '../components/ComponentHome/CreatedNewsHistory'
import ChangeWebsiteHistory from '../components/ComponentHome/ChangeWebsiteHistory'
import ComponentPeddingRows from '../components/ComponentPeddingRows/ComponentPeddingRows'
import { useDispatch, useSelector } from 'react-redux'
import { rowSelector } from '../redux/selector'
import { getPeddingRows } from '../redux/actions/rowAction'
import CircularProgress from '@mui/material/CircularProgress';

const Home = ({ auth }) => {
	const row = useSelector(rowSelector)
    const observer = useRef();
    const dispatch = useDispatch();
    const [nextPage, setNextPage] = useState(1);

	const DATA_CHART = [
		{ caterogy: 'Hoạt động', value: 80 },
		{ caterogy: 'Chứng chỉ', value: 60 },
		{ caterogy: 'Nghiên cứu', value: 40 },
		{ caterogy: 'Thể thao', value: 100 },
	]

    const lastPostElementRef = useCallback(
        (elem) => {
            if (row.loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !row.maxPage) {
                    console.log('last elem')
                    setNextPage((prev) => prev + 1);
                }
            });
            if (elem) observer.current.observe(elem);
        },
        [row.loading]
    ); 
    
    useEffect(() => {
        if(auth?.user && auth?.user.roles.includes("0004")) {
          dispatch(getPeddingRows(
            {
                page: nextPage, 
                currentPeddingRows: row.currentPeddingRows,
                limit: 3
            }
          ))
        }
    }, [nextPage, auth?.user])

	return (
		<div className="pageHome">
			<div className="container__top">
				<LayoutInfo auth={auth} />
				<>
					{((auth?.user.roles.includes('0001') && auth?.user.roles.length === 1) ||
						auth?.user.roles.length === 0) && <ApplyComponent />}
					{auth?.user.roles.includes('0002') && <LayoutChart>{DATA_CHART}</LayoutChart>}
					{auth?.user.roles.includes('0003') && <CreatedNewsHistory />}
					{auth?.user.roles.includes('0004') && <ChangeWebsiteHistory />}
				</>
			</div>
			<div className="container__center">
				{auth?.user.roles.includes('0004') && row?.peddingRows.length > 0 && (
					<>
						{row?.peddingRows.map((penddingRows, index) => {
                            if(index === row?.peddingRows.length - 1 && row?.peddingRows.length != 0) {
                                return (
                                    <div 
                                        ref={lastPostElementRef}
                                        key={penddingRows?.table + index}     
                                    >
                                        <ComponentPeddingRows 
                                            penddingRows={penddingRows} 
                                        />
                                    </div>
                                )
                            }
                            
                            return (
                                <div key={penddingRows?.table + index}>
                                    <ComponentPeddingRows className="last" penddingRows={penddingRows} />
                                </div>
                            )
                        })}

                        {
                            row?.loading && 
                            <div className='loading_rows_pendding'>
                                <CircularProgress />
                            </div>
                        }
					</>
				)}
			</div>
		</div>
	)
}

export default Home
