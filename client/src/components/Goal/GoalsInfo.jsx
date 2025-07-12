import { Link } from 'react-router-dom';
import search from '../../assets/images/other/search.png';
import { capitalizeString } from '../../utils/handleString';
function GoalsInfo({ levelYear, goalsInfo }) {
    return (
        <div className="goals_info_container">
            <h2 className="goals_info_container_heading">Các Nhóm Chỉ Tiêu Năm {levelYear}</h2>
            {goalsInfo.length > 0 ? (
                goalsInfo.map((goals) => (
                    <div className="goals_info_wrapper" key={goals.pageId}>
                        <Link to={`/page/${goals.pageName}`} className="goals_info_heading_wrapper">
                            <h3 className="goals_info_heading">{goals.pageName}</h3>
                        </Link>

                        <table className="goal_info_table">
                            <thead className="goal_info_header">
                                <tr>
                                    <th>Tên Chỉ Tiêu</th>
                                    <th>Số Lượng Yêu Cầu</th>
                                    <th>Chờ Duyệt</th>
                                    <th>Từ Chối</th>
                                    <th>Phải Nộp Lại</th>
                                    <th>Hoàn Thành</th>
                                    <th>Tổng Điểm Yêu Cầu</th>
                                    <th>Tổng Điểm Hiện Tại</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>

                            <tbody className="goal_info_body">
                                {Object.keys(goals.tables).map((key, index) => {
                                    return (
                                        <tr key={key + index} className="goal_info">
                                            <td className="goal_info_item goal_name">{capitalizeString(key)}</td>
                                            <td className="goal_info_item">
                                                {goals.tables[key]?.quantityDemanded || 0}
                                            </td>
                                            <td className="goal_info_item">
                                                {goals.tables[key]?.pendingTasksNum || 0}
                                            </td>
                                            <td className="goal_info_item">
                                                {goals.tables[key]?.rejectedTasksNum || 0}
                                            </td>
                                            <td className="goal_info_item">
                                                {goals.tables[key]?.resubmitedTasksNum || 0}
                                            </td>
                                            <td className="goal_info_item">
                                                {goals.tables[key]?.acceptedTasksNum || 0}
                                            </td>
                                            <td className="goal_info_item">{goals.tables[key]?.totalScore || 0}</td>
                                            <td className="goal_info_item">
                                                {goals.tables[key]?.currentTotalScore || 0}
                                            </td>
                                            <td className="goal_info_item">
                                                {goals.tables[key]?.currentTotalScore >=
                                                    goals.tables[key]?.totalScore &&
                                                goals.tables[key]?.acceptedTasksNum >=
                                                    goals.tables[key]?.quantityDemanded ? (
                                                    <span className="goal_info_status goal_info_success_status">
                                                        Đạt
                                                    </span>
                                                ) : (
                                                    <span className="goal_info_status goal_info_dangerous_status">
                                                        Chưa Đạt
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <div className="notify_empty">
                    <img src={search} alt="no_data" />
                    <span>Các nhóm chỉ tiêu chưa được tạo</span>
                </div>
            )}
        </div>
    );
}

export default GoalsInfo;
