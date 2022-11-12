import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReusableSideBar() {
    const nav = useNavigate();
    return (
        <div className="ml-3 mt-5 bg bg-gray-200 material-icons-outlined grid grid-rows-4 gap-y-3 text-5xl h-1/2">
            <button onClick={() => nav('/home')}>home</button>
            <button
                onClick={() => {
                    nav('/job');
                }}
            >
                folder
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
                layers
            </button>
        </div>
    );
}
