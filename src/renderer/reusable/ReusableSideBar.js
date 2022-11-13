import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReusableSideBar() {
    const nav = useNavigate();
    return (
        <div className="mt-20 mr-10 p-5 rounded-tr-2xl rounded-br-2xl bg-gradient-to-tr from-[#C8ADD8] to-[#ADADD8] material-icons-outlined grid grid-rows-4 gap-y-3 text-5xl text-white h-1/2">
            <button onClick={() => nav('/home')}>home</button>
             <button
                onClick={() => {
                    nav('/kanban');
                }}
            >
                dashboard
            </button>
           
            <button
                onClick={() => {
                    nav('/calendar');
                }}
            >
                calendar_month
            </button>

            <button
                onClick={() => {
                    nav('/job');
                }}
            >
                quiz
            </button>
        </div>
    );
}
