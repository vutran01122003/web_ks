import React from 'react';
import { LuListRestart } from 'react-icons/lu';
import { MdPeopleAlt } from 'react-icons/md';
import { RiNumbersFill } from 'react-icons/ri';
import { ImNewspaper } from 'react-icons/im';
import { Link } from 'react-router-dom';

const Quantity = () => {
    const LIST_QUANTITY_OVERVIEW = [
        {
            id: 0,
            text_heading: 'Số lượng hoạt động chờ duyệt',
            quantity: 9,
            icon_after: <LuListRestart />,
            color_border: '#f0635c',
            link: '/activity-approval'
        },
        {
            id: 1,
            text_heading: 'Số lượng hoạt động bị từ chối',
            quantity: 1,
            icon_after: <MdPeopleAlt />,
            color_border: '#3E97FF',
            link: '#'
        },
        {
            id: 2,
            text_heading: 'Số lượng hoạt động phải nộp lại',
            quantity: 2,
            icon_after: <RiNumbersFill />,
            color_border: '#6E6E6E',
            link: '#'
        },
        {
            id: 3,
            text_heading: 'Tổng điểm đã đạt',
            isTotalScore: true,
            quantity: 10,
            icon_after: <ImNewspaper />,
            color_border: '#6E6E6E',
            link: '#'
        }
    ];

    const returnListQuantity = LIST_QUANTITY_OVERVIEW.map((QUANTITY_OVERVIEW) => {
        return (
            <Link to={QUANTITY_OVERVIEW.link} key={QUANTITY_OVERVIEW.id} className='item__quantity'>
                <div className='icon_size'>{QUANTITY_OVERVIEW.icon_after}</div>
                <div className='quantily__number'>
                    <div className='text__heading'>{QUANTITY_OVERVIEW.text_heading}</div>
                    <div className='number__quantity'>{`${QUANTITY_OVERVIEW.isTotalScore ? 'Số điểm' : 'Số lượng'}: ${
                        QUANTITY_OVERVIEW.quantity
                    }`}</div>
                </div>
            </Link>
        );
    });

    return (
        <div className='container__quantity'>
            <div className='body__quantity'>{returnListQuantity}</div>
        </div>
    );
};

export default Quantity;
