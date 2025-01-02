import search from '../../assets/images/other/search.png';

function EmptyDataNotification() {
    return (
        <div className="empty_data_notification_container">
            <img src={search} alt="empty_data" />
            <span>Không có dữ liệu</span>
        </div>
    );
}

export default EmptyDataNotification;
