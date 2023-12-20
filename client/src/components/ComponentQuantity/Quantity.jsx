import React from 'react'
import { BiTaskX } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";

const Quantity = () => {

    const  LIST_QUANTITY_MEMBER = [
        {
            id:0,
            text_heading:"chỉ tiêu chưa duyệt",
            quantity:88,
            icon_after:<BiTaskX/>,
            color_border: "#FF5D53"
        },
        {
            id:1,
            text_heading:"thành viên kĩ sư",
            quantity:45,
            icon_after:<FaRegUser/>,
            color_border: "#3E97FF"
        },
        {
            id:2,
            text_heading:"số lượng tiến độ (năm)",
            quantity:246,
            icon_after:<GiProgression/>,
            color_border: "#6E6E6E"
        },
    ];

    const returnListQuantity = LIST_QUANTITY_MEMBER.map((index)=>{
        return (
            <div className="item__quantity" style={{borderColor:index.color_border}}>
                <div className="quantily__number">
                    <div className='text__heading'>{index.text_heading}</div>
                    <div className="number__quntity">{index.quantity}</div>
                </div>
                <div className='icon_size'>{index.icon_after}</div>
            </div>
        )
    })


    return (
        <div className='container__quantity transform__animation--top'>
            <div className="body__quantity">
                {returnListQuantity}
            </div>
        </div>
    )
}

export default Quantity