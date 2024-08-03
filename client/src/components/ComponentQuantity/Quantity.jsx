import { LuListRestart } from 'react-icons/lu';
import { MdSportsScore } from 'react-icons/md';
import { BsClipboard2X, BsClipboard2Check, BsClipboard2Minus } from 'react-icons/bs';

const Quantity = ({ annualActivitiesProgress }) => {
    const LIST_QUANTITY_OVERVIEW = [
        {
            text_heading: 'Hoạt động chờ duyệt',
            quantity: annualActivitiesProgress?.numberOfPendingActivity || 0,
            icon_after: <BsClipboard2Minus />,
            color_border: '#f0635c'
        },
        {
            text_heading: 'Hoạt động đã duyệt',
            quantity: annualActivitiesProgress?.numberOfAcceptedActivity || 0,
            icon_after: <BsClipboard2Check />,
            color_border: '#f0635c'
        },
        {
            text_heading: 'Hoạt động bị từ chối',
            quantity: annualActivitiesProgress?.numberOfRejectedActivity || 0,
            icon_after: <BsClipboard2X />,
            color_border: '#3E97FF'
        },
        {
            text_heading: 'Hoạt động phải nộp lại',
            quantity: annualActivitiesProgress?.numberOfResubmitedActivity || 0,
            icon_after: <LuListRestart />,
            color_border: '#6E6E6E'
        },
        {
            text_heading: 'Tổng điểm đã đạt',
            isTotalScore: true,
            quantity: annualActivitiesProgress?.totalScore || 0,
            icon_after: <MdSportsScore />,
            color_border: '#6E6E6E'
        }
    ];

    const returnListQuantity = LIST_QUANTITY_OVERVIEW.map((QUANTITY_OVERVIEW, index) => {
        return (
            <div key={index} className="item__quantity">
                <div className="icon_size">{QUANTITY_OVERVIEW.icon_after}</div>
                <div className="quantily__number">
                    <div className="text__heading">{QUANTITY_OVERVIEW.text_heading}</div>
                    <div className="number__quantity">{`${QUANTITY_OVERVIEW.isTotalScore ? 'Số điểm' : 'Số lượng'}: ${
                        QUANTITY_OVERVIEW.quantity
                    }`}</div>
                </div>
            </div>
        );
    });

    return (
        <div className="container__quantity">
            <div className="body__quantity">{returnListQuantity}</div>
        </div>
    );
};

export default Quantity;
