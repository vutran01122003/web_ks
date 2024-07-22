import noSearchResult from '../../assets/images/no_search_result.png';

function EmptyDataNotification() {
    return (
        <div className="empty_data_notification_container">
            <img src={noSearchResult} alt="empty_data" />
            <span>Không có dữ liệu</span>
        </div>
    );
}

export default EmptyDataNotification;
