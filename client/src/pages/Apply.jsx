import { useState } from 'react';
import LogoIUH from '../assets/images/logo_iuh.png';
import ComponentProofFile from '../components/ComponentProofFile/ComponentProofFile';
import ComponentButton from '../components/ComponentButton/ComponentButton';
import { GrClose } from 'react-icons/gr';
const Apply = () => {
    const [files, setFiles] = useState([]);
    return (
        <div className="pageApply">
            <div className="form__apply">
                <div className="form__apply-header">
                    <img src={LogoIUH} alt="Logo IUH" className="logo__image" />
                    <div className="icon__close">
                        <GrClose />
                    </div>
                </div>
                <div className="form__apply-content">
                    <h1 className="title__content">Vui lòng điền thông tin của bạn</h1>
                    <div className="main__content">
                        <div className="content__item">
                            <label htmlFor="maSinhVien" className="label__item">
                                Mã số sinh viên
                            </label>
                            <input id="maSinhVien" type="text" className="input__text" required={true} />
                        </div>
                        <div className="content__item">
                            <label htmlFor="tenSinhVien" className="label__item">
                                Tên sinh viên
                            </label>
                            <input id="tenSinhVien" type="text" className="input__text" required={true} />
                        </div>
                        <div className="content__item">
                            <label htmlFor="ngaySinh" className="label__item">
                                Ngày sinh
                            </label>
                            <input id="ngaySinh" type="date" className="input__text" required={true} />
                        </div>
                        <div className="content__item">
                            <label htmlFor="diemDauVao" className="label__item">
                                Điểm đầu vào
                            </label>
                            <input id="diemDauVao" type="text" className="input__text" required={true} />
                        </div>
                        <div className="content__item">
                            <label htmlFor="khoa" className="label__item">
                                Khoa
                            </label>
                            <input id="khoa" type="text" className="input__text" required={true} />
                        </div>
                        <div className="content__item">
                            <label htmlFor="namHoc" className="label__item">
                                Sinh viên năm thứ
                            </label>
                            <input id="namHoc" type="text" className="input__text" required={true} />
                        </div>
                        <div className="content__item">
                            <div className="item__certifical">
                                <div className="select__input">
                                    <label htmlFor="chungChiTiengAnh" className="label__item">
                                        Loại
                                    </label>
                                    <select id="chungChiTiengAnh" className="input__text">
                                        <option value="toeic">TOEIC</option>
                                        <option value="ielts">IELTS</option>
                                    </select>
                                </div>
                                <div className="certifical__input">
                                    <label htmlFor="diem" className="label__item">
                                        Điểm
                                    </label>
                                    <input id="diem" type="text" className="input__text" />
                                </div>
                            </div>
                        </div>
                        <ComponentProofFile files={files} setFiles={setFiles} />
                    </div>

                    <ComponentButton className="btn__submit" textButton="Đăng ký" />
                </div>
            </div>
            {/* <div className="image">
				<img src={apply} />
			</div> */}
        </div>
    );
};

export default Apply;
