import moment from 'moment';
import { capitalizeFirstLetter, toFullName } from '../../utils/handleString';
import Avatar from '../Account/ComponentAvatar';
import LineItem from '../Home/LineItem';
const EducationInfo = ({ auth }) => {
    const userInfo = auth?.user;

    return (
        <div className="education__info">
            <div className="info__text">
                <Avatar size="large" />
                <LineItem label="Mã sinh viên" content={userInfo.userId || 'Chưa cập nhật'} className="id__info" />
            </div>
            <div className="main__info">
                <div className="heading-4 info__title">Thông tin cá nhân</div>
                <div className="info__items">
                    <div className="info__text">
                        <LineItem
                            label="Tên sinh viên"
                            content={toFullName({
                                lastName: userInfo.lastName,
                                firstName: userInfo.firstName
                            })}
                        />

                        <LineItem
                            label="Giới tính"
                            content={capitalizeFirstLetter(userInfo?.gender) || 'Chưa cập nhật'}
                        />
                        <LineItem
                            label="Ngày sinh"
                            content={moment(userInfo?.birthday).format('DD/MM/YYYY') || 'Chưa cập nhật'}
                        />
                        <LineItem
                            label="Khoa"
                            content={capitalizeFirstLetter(userInfo?.faculty?.facultyName) || 'Chưa cập nhật'}
                        />
                        <LineItem
                            label="Chuyên ngành"
                            content={capitalizeFirstLetter(userInfo?.major?.majorName) || 'Chưa cập nhật'}
                        />
                    </div>
                    <div className="info__text">
                        <LineItem
                            label="Khóa"
                            content={capitalizeFirstLetter(userInfo?.cohort?.cohortName) || 'Chưa cập nhật'}
                        />
                        <LineItem
                            label="Vai trò"
                            content={capitalizeFirstLetter(userInfo?.groups[0]?.name) || 'Chưa cập nhật'}
                        />
                        <LineItem label="Điện thoại" content={userInfo?.phone || 'Chưa cập nhật'} />
                        <LineItem label="Email" content={userInfo?.email || 'Chưa cập nhật'} />
                        <LineItem label="Cơ sở" content={'12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Hồ Chí Minh'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationInfo;
