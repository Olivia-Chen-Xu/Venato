import React, { useState } from 'react';
import { Drawer } from '@mui/material';
import Profile from 'renderer/auth/Profile';
import logo from '../../../assets/logo.png'

export default function ReusableHeader() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <React.Fragment>
            <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
                <Profile />
            </Drawer>
            <div className='fixed top-0 w-full backdrop-blur-xl drop-shadow-2xl border-b-5 z-50'>
            <header className="mt-3">
                <img src={logo} alt="" className='float-left ml-3 w-12' />
                {/* Insert the search bar here */}
                <button onClick={() => setIsOpen(true)} className="float-right">
                    <span className="material-icons-outlined cursor-pointer text-4xl mr-3 ml-5">
                        account_circle
                    </span>
                </button>
                <button className="float-right">
                    <span className="material-icons-outlined cursor-pointer text-4xl ml-5">
                        settings
                    </span>
                </button>
                <button className="float-right">
                    <span className="material-icons-outlined cursor-pointer text-4xl ml-5">
                        notifications
                    </span>
                </button>
                <div className="float-right cursor-pointer bg-gradient-to-tr from-[#C8ADD8] to-[#ADADD8] text-white ml-5 drop-shadow-xl rounded-full">
                    <button className="py-1 px-5 text-xl">Upgrade</button>
                </div>
            </header>
            </div>
        </React.Fragment>
    );
}
