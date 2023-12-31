import React from 'react'
import { BiTaskX } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";

const Quantity = () => {

    const LIST_QUANTITY_OVERVIEW = [
        {
            id: 0,
            text_heading: "Số lượng đơn chờ duyệt",
            quantity: 88,
            icon_after: <BiTaskX/>,
            color_border: "#f0635c"
        },
        {
            id: 1,
            text_heading: "Số lượng kĩ sư tài năng",
            quantity: 45,
            icon_after: <FaRegUser/>,
            color_border: "#3E97FF"
        },
        {
            id: 2,
            text_heading: "Tổng toàn bộ chỉ tiêu",
            quantity: 246,
            icon_after: <GiProgression/>,
            color_border: "#6E6E6E"
        },
    ];

    const returnListQuantity = LIST_QUANTITY_OVERVIEW.map((QUANTITY_OVERVIEW)=>{
        return (
            <div key={QUANTITY_OVERVIEW.id} className="item__quantity" style={{borderColor:QUANTITY_OVERVIEW.color_border}}>
                <div className="quantily__number">
                    <div className='text__heading'>{QUANTITY_OVERVIEW.text_heading}</div>
                    <div className="number__quntity">{QUANTITY_OVERVIEW.quantity}</div>
                </div>
                <div className='icon_size'>{QUANTITY_OVERVIEW.icon_after}</div>
            </div>
        )
    })


    return (
        <div className='container__quantity'>
            <div className="body__quantity">
                {returnListQuantity}
            </div>
        </div>
    )
}

export default Quantity