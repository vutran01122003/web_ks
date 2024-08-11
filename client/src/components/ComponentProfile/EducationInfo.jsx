import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import Avatar from '../ComponentAccount/ComponentAvatar';
import LineItem from '../ComponentHome/LineItem';
const EducationInfo = ({ auth }) => {
    const userInfo = auth?.user;

    return (
        <div className="education__info">
            <div className="info__text">
                <Avatar size="large" />
                <LineItem info="Mã sinh viên" text={userInfo.userId || 'Chưa cập nhật'} className="id__info" />
            </div>
            <div className="main__info">
                <div className="heading-4 info__title">Thông tin học vấn</div>
                <div className="info__items">
                    <div className="info__text">
                        <LineItem
                            info="Tên sinh viên"
                            text={toFullName({
                                lastName: userInfo.lastName,
                                firstName: userInfo.firstName
                            })}
                        />

                        <LineItem info="Giới tính" text={capitalizeFirstLetter(userInfo?.gender) || 'Chưa cập nhật'} />
                        <LineItem info="Trạng thái" text={userInfo?.isActive ? 'Hoạt Động' : 'Đã Khóa'} />
                        <LineItem
                            info="Chuyên ngành"
                            text={capitalizeFirstLetter(userInfo?.major) || 'Chưa cập nhật'}
                        />
                    </div>
                    <div className="info__text">
                        <LineItem info="Cơ sở" text={'12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Hồ Chí Minh'} />
                        <LineItem info="Khoa" text={capitalizeFirstLetter(auth?.user?.faculty) || 'Chưa cập nhật'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationInfo;
