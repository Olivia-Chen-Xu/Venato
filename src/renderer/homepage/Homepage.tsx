import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
    const nav = useNavigate();
    return (
        <React.Fragment>
            <h1 className="text-3xl mt-10">Welcome Back!</h1>

            <h1 className="text-2xl mt-10 grid place-content-center ">Upcoming Tasks</h1>
            <div className="grid grid-cols-3 gap-20 mx-20 h-40 mt-5 ">
                <div className="grid place-content-center bg-gray-200 rounded-2xl">
                    <span className="text-3xl">Task</span>
                </div>
                <div className="grid place-content-center bg-gray-200 rounded-2xl">
                    <span className="text-3xl">Task</span>
                </div>
                <div className="grid place-content-center bg-gray-200 rounded-2xl">
                    <span className="text-3xl">Task</span>
                </div>
            </div>

            <h1 className="text-2xl mt-10 grid place-content-center">Recent Boards</h1>
            <div className="mt-5 grid grid-rows-3 gap-y-8 text-3xl">
                <div className="grid place-content-center">
                    <button
                        className="px-80 h-32 bg-gray-200"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        View Board 1
                    </button>
                </div>
                <div className="grid place-content-center">
                    <button
                        className="px-80 h-32 bg-gray-200"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        {' '}
                        View Board 2{' '}
                    </button>
                </div>
                <div className="grid place-content-center">
                    <button
                        className="px-80 h-32 bg-gray-200"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className="material-icons-outlined">add_circle</span> Create Board
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}
