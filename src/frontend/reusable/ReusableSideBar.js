import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

export default function ReusableSideBar() {
    const nav = useNavigate();
    return (
        <div className="fixed left-0 h-fit">
            <div className="border border-black mt-10 px-3 py-6 rounded-tr-2xl rounded-br-2xl bg-gradient-to-t from-[#FFFFFF] to-[#FFFFFF] material-icons-outlined grid grid-rows-5 gap-y-6 text-black w-full h-96">
                <Tooltip title="Home" placement="right">
                    <button
                        className="material-icons-outlined text-5xl"
                        onClick={() => nav('/home')}
                    >
                        home
                    </button>
                </Tooltip>
                <Tooltip title="Job Tracking" placement="right">
                    <button
                        className="material-icons-outlined text-5xl"
                        onClick={() => {
                            nav('/chooseKanban');
                        }}
                    >
                        dashboard
                    </button>
                </Tooltip>

                <Tooltip title="Calendar" placement="right">
                    <button
                        className="material-icons-outlined text-5xl"
                        onClick={() => {
                            nav('/calendar');
                        }}
                    >
                        calendar_month
                    </button>
                </Tooltip>

                <Tooltip title="Search Interview Questions" placement="right">
                    <button
                        className="material-icons-outlined text-5xl"
                        onClick={() => {
                            nav('/questions');
                        }}
                    >
                        quiz
                    </button>
                </Tooltip>

                <Tooltip title="Search Jobs" placement="right">
                    <button
                        className="material-icons-outlined text-5xl"
                        onClick={() => {
                            nav('/job');
                        }}
                    >
                        travel_explore
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}
