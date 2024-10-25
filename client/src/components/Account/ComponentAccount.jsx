import ControlBoxAccount from '../Modal/ControlBoxAccount';
import Avatar from './ComponentAvatar';
import { toFullName } from '../../utils/handleString';

function Account({ inModal, userInfo, refBoxAccount, dropBoxAccount, setDropBoxAccount }) {
    const toggleBoxAccountDisplay = () => {
        if (setDropBoxAccount) setDropBoxAccount(!dropBoxAccount);
    };

    return (
        <div className={`border__account ${inModal && 'in_modal'}`} ref={refBoxAccount ? refBoxAccount : null}>
            <div className={`btn_dropdown ${inModal && 'in_modal'}`} onClick={toggleBoxAccountDisplay}>
                <div className="info__user">
                    <div id="name__user">
                        {toFullName({ lastName: userInfo.lastName, firstName: userInfo.firstName }) || ''}
                    </div>
                    <div id="studentId__user">{`ID : ${userInfo?.userId || ''}`}</div>
                </div>
                <Avatar url={userInfo.avatar} size="small" className={dropBoxAccount ? 'border__avatar' : ''} />
            </div>

            {setDropBoxAccount && (
                <div className={`box__drop--account ${dropBoxAccount ? 'active_drop_box' : 'unactive_drop_box'}`}>
                    <div className="pd__select">
                        <ControlBoxAccount setState={setDropBoxAccount} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Account;
