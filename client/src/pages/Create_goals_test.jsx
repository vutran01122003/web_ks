import { Collapse } from 'antd'
import React from 'react'

const Create_goals_test = () => {


    const items = [
        {
            key: '1',
            label: 'NĂM 1 (ĐÃ XONG THÌ ĐÓNG)',
            children: <p>CÁC CHỈ TIÊU NĂM 1 </p>,
        },
        {
            key: '2',
            label: 'NĂM 2',
            children: <ul>
                <li>CÁC CHỈ TIÊU NĂM 2</li>
                <li>CÁC CHỈ TIÊU NĂM 2</li>
                <li>CÁC CHỈ TIÊU NĂM 2</li>
            </ul>,
        },
        {
            key: '3',
            label: 'NĂM 3',
            children: <p>CÁC CHỈ TIÊU NĂM 3</p>,
        },
        {
            key: '4',
            label: 'NĂM 4',
            children: <p>CÁC CHỈ TIÊU NĂM 4</p>,
        },
        {
            key: '5',
            label: 'NĂM 5',
            children: <p>CÁC CHỈ TIÊU NĂM 5</p>,
        },
    ];

    return (
        <div className="container_test">
            <h2>Quan ly chi tieu (ADMIN)</h2>
            <div className="row">
                <div>
                    <select>
                        <option value="1">Khoá </option>
                        <option value="1">Khoá 17</option>
                        <option value="1">Khoá 18</option>
                        <option value="1">Khoá 19</option>
                    </select>
                    <select>
                        <option value="1">Chuyen nganh </option>
                        <option value="1">Ki thuat phan mem</option>
                    </select>
                </div>
                <div>
                    <button className='btn_cr'>Tạo chỉ tiêu</button>
                </div>
            </div>
            <div className='list'>
                <Collapse accordion items={items} defaultActiveKey={['2']}  className="coll"/>
            </div>
        </div>
    )
}

export default Create_goals_test