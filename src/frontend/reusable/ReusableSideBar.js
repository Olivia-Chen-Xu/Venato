import { useNavigate } from 'react-router-dom';
import { AccountCircleOutlined, AutoAwesomeOutlined, CalendarMonthOutlined, ExpandMore, FolderOpenOutlined, FolderZipOutlined, HomeOutlined, NotificationsOutlined, QuizOutlined, SearchOutlined } from '@mui/icons-material';

import React, { useState } from 'react';
import { Button, Drawer, IconButton } from '@mui/material';
import Profile from '../auth/Profile';

const sidebarButtonOverrides = {
    justifyContent: 'left',
    color: '#333333',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '16px',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    padding: '1rem 0.5rem',
    textOverflow: 'clip'
}

export default function ReusableSideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const nav = useNavigate();
    return (
        <React.Fragment>
            <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
                <Profile />
            </Drawer>
            <div
                className="min-w-[15rem] max-w-[15%] flex-auto"
                style={{
                    boxShadow: '0px 5px 14px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E0E0E0',
                    background: 'white'
                }}
            >
                <div className='flex px-3 py-6'>
                    <span>
                        <button onClick={() => setIsOpen(true)}>
                            <AccountCircleOutlined></AccountCircleOutlined>
                            <ExpandMore fontSize="small"></ExpandMore>
                        </button>
                    </span>
                    <span className='ml-auto'>
                        <button>
                            <NotificationsOutlined></NotificationsOutlined>
                        </button>
                    </span>
                </div>
                <div className="mt-10 px-3 py-6 grid grid-rows-5 bg-white">

                    <Button onClick={() => nav('/home')} sx={sidebarButtonOverrides} startIcon={<HomeOutlined />}>
                        Home
                    </Button>

                    <Button onClick={() => { nav('/chooseKanban') }} sx={sidebarButtonOverrides} startIcon={<FolderZipOutlined/>}>
                        Job Boards
                    </Button>

                    <Button onClick={() => { nav('/calendar') }} sx={sidebarButtonOverrides} startIcon={<CalendarMonthOutlined />}>
                        Calendar
                    </Button>
                    <Button onClick={() => { nav('/job') }} sx={sidebarButtonOverrides} startIcon={<SearchOutlined />}>
                        Job Search
                    </Button>
                    <Button onClick={() => { nav('/questions') }} sx={sidebarButtonOverrides} startIcon={<QuizOutlined />}>
                        Interview Questions
                    </Button>
                    <Button
                        className='mt-10 p-3 justify-center items-center'
                        style={{
                            border: '2px solid #7F5BEB',
                            borderRadius: '8px',
                            marginTop: '3rem'
                        }}
                        sx={{
                            ...sidebarButtonOverrides,
                            justifyContent: 'center'
                        }}
                        startIcon={<AutoAwesomeOutlined />}
                    >
                        Upgrade
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
}
