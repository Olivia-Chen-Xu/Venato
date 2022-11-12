import React, { useState } from 'react';
import { Drawer } from '@mui/material';
import AuthScreens from 'renderer/auth/auth-screens';

export default function ReusableHeader() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <React.Fragment>
            <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
                <AuthScreens />
            </Drawer>
            <header className="w-full mt-5">
                <button className="material-icons-outlined text-4xl ml-3 mr-5">panorama</button>
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
                <div className="float-right cursor-pointer ml-5 border-2 border-black rounded-full">
                    <button className="py-1 px-5 text-xl">Upgrade</button>
                </div>
            </header>
        </React.Fragment>
    );
}
