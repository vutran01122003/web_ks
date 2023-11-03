import React from 'react'
import LayoutInfo from '../components/ComponentHome/LayoutInfo'
import LayoutChart from '../components/ComponentHome/LayoutChart'
import ApplyComponent from '../components/ComponentHome/ApplyComponent'
import CreatedNewsHistory from '../components/ComponentHome/CreatedNewsHistory'
import ChangeWebsiteHistory from '../components/ComponentHome/ChangeWebsiteHistory'
import ComponentPeddingRows from '../components/ComponentPeddingRows/ComponentPeddingRows'
import { useSelector } from 'react-redux'

const Home = ({ auth }) => {
    const row = useSelector((state) => state.row);

	const DATA_CHART = [
		{ caterogy: 'Hoạt động', value: 80 },
		{ caterogy: 'Chứng chỉ', value: 60 },
		{ caterogy: 'Nghiên cứu', value: 40 },
		{ caterogy: 'Thể thao', value: 100 },
	]

	return (
		<div className="pageHome">
			<div className="container__top">
				<LayoutInfo auth={auth}/>
                <>
                    {   
                        ((auth?.user.roles.includes("0001") && auth?.user.roles.length === 1) || 
                        (auth?.user.roles.length === 0)) && <ApplyComponent />
                    }
                    {auth?.user.roles.includes("0002") && <LayoutChart>{DATA_CHART}</LayoutChart>}
                    {auth?.user.roles.includes("0003") && <CreatedNewsHistory />}
                    {auth?.user.roles.includes("0004") &&  <ChangeWebsiteHistory />}
                </>
				
			</div>
			<div className="container__center">
				{
                    auth?.user.roles.includes("0004") && row?.peddingRows.length > 0 &&
                    <>
                        {
                            row?.peddingRows.map((penddingRows) => 
                            <ComponentPeddingRows key={penddingRows?.table} penddingRows={penddingRows}/> )
                        }
                    </>
                }
			</div>
		</div>
	)
}

export default Home
