import React from 'react';
import { useNavigate } from 'react-router-dom';
import generateJobs from '../search/generateJobs';
import SearchBar from '../search/SearchBar';

export default function Homepage() {
    const nav = useNavigate();
    return (
        <React.Fragment>
            <h1 className="text-3xl mt-3">Welcome Back!</h1>

            <h1 className="text-xl mt-2 grid place-content-center uppercase">Upcoming Tasks</h1>
            <div className="grid grid-cols-3 gap-20 mx-20 h-40 mt-5 text-white">
                <div className="place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                    <div className='ml-5 mt-5'>
                        <h1><span className="text-3xl">Interview</span></h1>
                    </div>
                  
                    <div className='ml-5 mt-8'>
                        <h1 className='text-md align-middle'><span className="material-icons-outlined text-xl">schedule</span> Jan 1st - 4:00 PM</h1>
                    </div>
                    <div className='ml-5 mt-1'>
                        <h1 className='text-md align-middle'><span className="material-icons-outlined text-xl">location_on</span> Zoom</h1>
                    </div>
                </div>
                <div className="place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                    <div className='ml-5 mt-5'>
                        <h1><span className="text-3xl">Interview</span></h1>
                    </div>
                  
                    <div className='ml-5 mt-8'>
                        <h1 className='text-md align-middle'><span className="material-icons-outlined text-xl">schedule</span> Jan 1st - 4:00 PM</h1>
                    </div>
                    <div className='ml-5 mt-1'>
                        <h1 className='text-md align-middle'><span className="material-icons-outlined text-xl">location_on</span> Zoom</h1>
                    </div>
                </div><div className="place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                    <div className='ml-5 mt-5'>
                        <h1><span className="text-3xl">Interview</span></h1>
                    </div>
                  
                    <div className='ml-5 mt-8'>
                        <h1 className='text-md align-middle'><span className="material-icons-outlined text-xl">schedule</span> Jan 1st - 4:00 PM</h1>
                    </div>
                    <div className='ml-5 mt-1'>
                        <h1 className='text-md align-middle'><span className="material-icons-outlined text-xl">location_on</span> Zoom</h1>
                    </div>
                </div>
            </div>

            <h1 className="text-xl mt-10 grid place-content-center mx-20 uppercase">Recent Boards</h1>
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white mx-20 ">
                <div className="bg-[url('../../assets/home/board.png')] bg-[#793476] bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full py-16"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className='absolute bottom-5 left-5 '>Summer Internships 2023</span>
                    </button>
                </div>
                <div className="bg-[url('../../assets/home/board.png')] bg-[#793476] bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className='absolute bottom-5 left-5'>Summer Internships 2022</span>
                    </button>
                </div>
                {/* <div className="grid place-content-center">
                    <button
                        className="px-80 h-32 bg-gray-200"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className="material-icons-outlined">add_circle</span> Create Board
                    </button>
                </div> */}
            </div>
        </React.Fragment>
    );
}
