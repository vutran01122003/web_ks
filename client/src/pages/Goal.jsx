import DeadlineManagement from '../components/Goal/DeadlineManagement';
import GoalsCreation from '../components/Goal/GoalCreation';
import GoalsManagement from '../components/Goal/GoalManagement';
import { Tabs } from 'antd';

function GoalManagement() {
    const items = [
        {
            key: 'goalsCreation',
            label: 'Tạo Nhóm Chỉ Tiêu',
            children: <GoalsCreation />
        },
        {
            key: 'goalsManagement',
            label: 'Quản Lý Nhóm Chỉ Tiêu',
            children: <GoalsManagement />
        },
        {
            key: 'deadlineManagement',
            label: 'Quản Lý Thời Hạn',
            children: <DeadlineManagement />
        }
    ];

    return (
        <div className="goal_container">
            <Tabs className="tab__tables--goal-feature" defaultActiveKey="1" items={items} />
        </div>
    );
}

export default GoalManagement;
