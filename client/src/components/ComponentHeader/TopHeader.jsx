import React, { useEffect, useRef, useState } from 'react'
import Avatar_default from "../../assets/avatar_default.jpg";
import { IoNotificationsSharp } from 'react-icons/io5';
import { BsDot } from 'react-icons/bs';
import { ImSearch } from 'react-icons/im';
import { Link } from 'react-router-dom';
import ComponentInput from '../ComponentForm/ComponentInput';
import ControlBoxAccount from './ComponentControl/ControlBoxAccount';

const TopHeader = () => {
    const [dropBoxAccount, setDropBoxAccount] = useState(false);

    let refBoxAccount = useRef();
    useEffect(() => {
        let hanlder = (e) => {
            if (!refBoxAccount.current.contains(e.target))
                setDropBoxAccount(false);
        }
        document.addEventListener("mousedown", hanlder);
        return () => document.removeEventListener("mousedown", hanlder);
    });

    return (
        <div className='container__header'>
            <div className="tr__header">
                <div className="flex__line">
                    <div>
                        <ComponentInput
                            iconBefore={<ImSearch />}
                            placeholder="Search"
                            className="box_search"
                            id="search_box"
                        />
                    </div>
                    <div className="box__control">
                        <div className="btn__noti">
                            <Link to="/notification">
                                <IoNotificationsSharp />
                                <div className="length__noti">
                                    <BsDot />
                                </div>
                            </Link>
                        </div>
                        <div className="border__account" ref={refBoxAccount}>
                            <div className="btn_dropdown" onClick={() => setDropBoxAccount(!dropBoxAccount)}>
                                <img src={Avatar_default} />
                            </div>
                            <div
                                className={`box__drop--account ${dropBoxAccount ? "active_drop_box" : "unactive_drop_box"}`}
                            >
                                <div className="pd__select">
                                    <ControlBoxAccount setState={setDropBoxAccount} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopHeader