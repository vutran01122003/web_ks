import GoalsCreation from '../components/ComponentGoal/GoalCreation';
import GoalsManagement from '../components/ComponentGoal/GoalManagement';
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
        }
    ];

    return (
        <div className="goal_container">
            <Tabs className="tab__tables--goal-feature" defaultActiveKey="1" items={items} />
        </div>
    );
}

export default GoalManagement;
