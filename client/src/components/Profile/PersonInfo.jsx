import moment from 'moment';
import LineItem from '../Home/LineItem';
const PersonInfo = ({ auth }) => {
    const user = auth?.user;

    return (
        <div className="person__info">
            <h1 className="heading-4 info__title">Thông tin cá nhân</h1>
            <div className="info__items">
                <div className="info__text">
                    <LineItem
                        label="Ngày sinh"
                        content={moment(user?.birthday).format('DD/MM/YYYY') || 'Chưa cập nhật'}
                    />
                    <LineItem label="CCCD" content={'Chưa cập nhật'} />
                    <LineItem label="Đối tượng" content="Chưa cập nhật" />
                </div>
                <div className="info__text">
                    <LineItem label="Dân tộc" content={'Chưa cập nhật'} />
                    <LineItem label="Số điện thoại" content={'Chưa cập nhật'} />
                    <LineItem label="Email" content={user?.email || 'Chưa cập nhật'} />
                </div>
                <div className="info__text item__full">
                    <LineItem label="Nơi sinh" content={'Chưa cập nhật'} className="" />
                </div>
                <div className="info__text item__full">
                    <LineItem label="Hộ khẩu thường trú" content={'Chưa cập nhật'} className="" />
                </div>
                <div className="info__text item__full">
                    <LineItem label="Hộ khẩu tạm trú" content={'Chưa cập nhật'} className="" />
                </div>
            </div>
        </div>
    );
};

export default PersonInfo;
