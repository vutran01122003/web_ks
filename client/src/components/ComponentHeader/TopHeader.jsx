import React, { useEffect, useRef, useState } from 'react'
import { IoNotificationsSharp } from 'react-icons/io5';
import { BsDot } from 'react-icons/bs';
import { ImSearch } from 'react-icons/im';
import { Link } from 'react-router-dom';
import ComponentInput from '../ComponentForm/ComponentInput';
import ControlBoxAccount from './ComponentControl/ControlBoxAccount';
import Avatar from '../ComponentAvatar/ComponentAvatar';

const TopHeader = ({ auth }) => {
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

    const determineAuth = auth?.user?.roles.includes("0004") || auth?.user?.roles.includes("0003")

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

                        {determineAuth ? <div>
                            <div className='border__text--role'>
                                ADMIN
                            </div>
                        </div> : ""}


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
                                <Avatar url={auth?.user.avatar} size="small"/>
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