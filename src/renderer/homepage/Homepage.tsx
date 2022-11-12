import React from 'react';
import { useNavigate } from 'react-router-dom';
import generateJobs from '../search/generateJobs';

export default function Homepage() {
    const nav = useNavigate();

    const goKanban = () => {
        nav('/kanban');
    };

    return (
        <div className="">
            <header className="w-full mt-5">
                <input className="h-65 w-357 text-2xl ml-5" type="text" placeholder="Search" />
                <button className="float-right">
                    <span className="material-icons-outlined cursor-pointer text-5xl mx-3">
                        settings
                    </span>
                </button>
                <div className="float-right cursor-pointer ml-5 bg-gray-200">
                    <button className="py-2 px-3 text-2xl">Premium</button>
                </div>
                <div className="float-right cursor-pointer bg-gray-200">
                    <button className="py-2 px-3 text-2xl">Find Jobs</button>
                </div>
            </header>

            <h1 className="text-center text-3xl mt-20">Welcome Back _________</h1>

            <div className="mt-20 grid grid-rows-3 gap-y-8 text-3xl">
                <div className="grid place-content-center">
                    <button className="px-80 h-32 bg-gray-200" onClick={goKanban}>
                        View Board 1
                    </button>
                </div>
                <div className="grid place-content-center">
                    <button className="px-80 h-32 bg-gray-200" onClick={goKanban}>
                        {' '}
                        View Board 2{' '}
                    </button>
                </div>
                <div className="grid place-content-center">
                    <button className="px-80 h-32 bg-gray-200" onClick={goKanban}>
                        <span className="material-icons-outlined">add_circle</span> Create Board
                    </button>
                </div>
            </div>

            <button
                onClick={() => {
                    generateJobs(20);
                }}
            >
                Generate jobs
            </button>
        </div>
    );
}
