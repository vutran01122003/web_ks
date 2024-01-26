import React from 'react';
import moment from 'moment';
import { AiFillEdit } from 'react-icons/ai';
import { ImBin } from 'react-icons/im';
const page = {
    pageName: 'Quản lý Sinh viên',
    description: 'Hệ thống quản lý thông tin sinh viên',
    tables: [
        {
            tableName: 'Thông tin Sinh viên',
            description: 'Danh sách thông tin cơ bản của sinh viên',
            rowTitleList: [
                'Mã sinh viên',
                'Họ và tên',
                'Ngày sinh',
                'Địa chỉ',
                'Email',
                'Số điện thoại'
            ],
            rowValueList: [],
            _id: {
                $oid: '654711ba6dac669de7058b14'
            }
        },
        {
            tableName: 'Kết quả Học tập',
            description: 'Bảng điểm và kết quả học tập của sinh viên',
            rowTitleList: ['Mã sinh viên', 'Môn học', 'Điểm'],
            rowValueList: [],
            _id: {
                $oid: '654711ba6dac669de7058b15'
            }
        }
    ],
    createdAt: {
        $date: '2023-11-05T03:53:30.809Z'
    },
    updatedAt: {
        $date: '2023-11-05T03:53:30.809Z'
    },
    __v: 0
};

const GoalDetail = () => {
    return (
        <div className='pageGoalDetail'>
            <div className='generalInfo'>
                <h1 className='titlePage'>Thông tin chung</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Tên trang</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Tuỳ chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{page.pageName}</td>
                            <td>{moment(page.createdAt).format('DD/MM/YYYY')}</td>
                            <td>Đang hiển thị</td>
                            <td>
                                <div className='table_function'>
                                    <AiFillEdit className='edit' />
                                    <ImBin className='delete' />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='containerTable'>
                <h1 className='listTable'>Danh sách bảng</h1>
                {page.tables.map((table, index) => {
                    return (
                        <div key={index}>
                            <h1 className='titlePage'>{table.tableName}</h1>
                            <table>
                                <tbody>
                                    <tr>
                                        {table.rowTitleList.map((rowTitle, index) => {
                                            return <td key={index}>{rowTitle}</td>;
                                        })}
                                        <td>
                                            <div className='table_function'>
                                                <AiFillEdit className='edit' />
                                                <ImBin className='delete' />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalDetail;
