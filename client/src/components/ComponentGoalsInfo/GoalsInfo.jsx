import { IoMdArrowDropright } from "react-icons/io";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { Link } from "react-router-dom";

function GoalsInfo({goalsInfo}) {
    return ( 
        <div className="goals_info_container">
            <h2 className="goals_info_container_heading">Thông Tin Nhóm Chỉ Tiêu</h2>
           {
                goalsInfo.map((goals) => 
                    <div className="goals_info_wrapper" key={goals.pageId}>  
                        <Link to={`/page/${goals.pageName}`} className="goals_info_heading_wrapper">
                            <h2 className="goals_info_heading">{goals.pageName}</h2>
                        </Link>
                        {
                            Object.keys(goals.tables).map((key) => 
                                <div className="goal_info_wrapper" key={goals.tables[key].tableId}>
                                    
                                    <div className="goal_info_heading_wrapper">
                                        <MdOutlineLibraryBooks />
                                        <h3 className="goal_info_heading">{key}</h3>
                                        {
                                            goals.tables[key]?.quantityDemanded === goals.tables[key]?.completedTasksNum ?  
                                            <span className="goal_info_success_status">{"(Đã hoàn thành)"}</span> : 
                                            <span className="goal_info_dangerous_status">{"(Chưa hoàn thành)"}</span> 
                                        }
                                       
                                    </div>                  

                                    <div className="goal_info_desc">
                                        <div className="goal_info_desc_table_description">
                                            <div className="icon_wrapper">
                                                <IoMdArrowDropright />
                                            </div>
                                            <span className="goal_info_lable">Mô tả chỉ tiêu:</span>
                                            <span className="goal_info_value">{goals.tables[key]?.tableDescription || "Không có"}</span>
                                        </div>

                                        <div className="goal_info_desc_quantityDemanded">
                                            <div className="icon_wrapper">
                                                <IoMdArrowDropright />
                                            </div>
                                            <span className="goal_info_lable">Số lượng yêu cầu:</span>
                                            <span className="goal_info_value">{goals.tables[key]?.quantityDemanded || 0}</span>
                                        </div>

                                        <div className="goal_info_desc_completedTasksNum">
                                            <div className="icon_wrapper">
                                                <IoMdArrowDropright />
                                            </div>
                                            <span className="goal_info_lable">Số lượng đã hoàn thành:</span>
                                            <span className="goal_info_value">{goals.tables[key]?.completedTasksNum || 0}</span>
                                        </div>

                                        <div className="goal_info_desc_rejectTasksNum">
                                            <div className="icon_wrapper">
                                                <IoMdArrowDropright />
                                            </div>
                                            <span className="goal_info_lable">Số lượng bị từ chối:</span>
                                            <span className="goal_info_value">{goals.tables[key]?.rejectedTasksNum || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                   
                )
           } 
        </div> 
    );
}

export default GoalsInfo;