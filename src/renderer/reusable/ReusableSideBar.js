import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReusableSideBar() {
    const nav = useNavigate();
    return (
        <div className="sticky left-0 top-16 h-fit">
        <div className="mt-10 mr-2 px-3 py-6 rounded-tr-2xl rounded-br-2xl bg-gradient-to-t from-[#ADADD8] to-[#C8ADD8] material-icons-outlined grid grid-rows-4 gap-y-6 text-white h-1/3">
            <button className="material-icons-outlined text-5xl" onClick={() => nav('/home')}>
                home
            </button>
            <button
                className="material-icons-outlined text-5xl"
                onClick={() => {
                    nav('/kanban');
                }}
            >
                dashboard
            </button>

            <button
                className="material-icons-outlined text-5xl"
                onClick={() => {
                    nav('/calendar');
                }}
            >
                calendar_month
            </button>

            <button
                className="material-icons-outlined text-5xl"
                onClick={() => {
                    nav('/job');
                }}
            >
                quiz
            </button>
        </div>
        </div>
    );
}
