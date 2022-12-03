import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import CalendarState from '../calendar/context/CalendarState';
import taskLine from '../../../assets/task-line.png';
import { AddCircleOutline } from '@mui/icons-material';

export default function Homepage() {
    const nav = useNavigate();
    const jobs = useAsync(httpsCallable(getFunctions(), 'getJobs'), []);
    const boards = useAsync(httpsCallable(getFunctions(), 'getJobBoards'), []);

    if (jobs.loading || boards.loading) {
        return (
            <div>
                <CircularProgress />
            </div>
        );
    }
    if (jobs.error || boards.error) {
        return <p>Error: {jobs.error.message}</p>;
    }

    // Events loaded
    CalendarState.addJobs(jobs.result.data);

    // Get the 3 most immediate tasks
    const taskDates = Object.entries(CalendarState.events)
        .map((elem) => elem[0])
        .sort()
        .filter((e) => e >= dayjs().format('YY-MM-DD'))
        .slice(0, 3);
    const recent = [
        ...CalendarState.events[taskDates[0]].map((e) => ({ ...e, date: taskDates[0] })),
        ...CalendarState.events[taskDates[1]].map((e) => ({ ...e, date: taskDates[1] })),
        ...CalendarState.events[taskDates[2]].map((e) => ({ ...e, date: taskDates[2] })),
    ].slice(0, 3);
    const formatDate = (date: string) => {
        const split = date.split('-');
        return `${split[1] === '11' ? 'Nov.' : 'Dec.'} ${(split[2] * 1).toString()}`;
    };

    const renderBoards = () => {
        const boardsHtml = [];
        boards.result.data.keys().forEach((name: string) => {
            boardsHtml.push(
                <div className="bg-[url('../../assets/home/board.png')] bg-[#793476] bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full py-16"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className="absolute bottom-5 left-5 ">name</span>
                    </button>
                </div>
            );
        });
        return boardsHtml;
    };

    return (
        <div>
            <h1 className="text-neutral-500 text-3xl mt-4 ml-20">Welcome Back!</h1>

            <h1 className="text-neutral-500 text-xl mt-2 grid place-content-center uppercase">
                Upcoming Tasks
            </h1>
            <div className="grid grid-cols-3 gap-20 mx-20 h-40 my-5" style={{ color: 'white' }}>
                <div className="p-5 place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                    <div className="ml-5">
                        <h1>
                            <span className="text-3xl">{recent[0].title}</span>
                        </h1>
                    </div>

                    <div style={{ marginTop: '4%' }}>
                        <img src={taskLine} alt="Horizontal divider" />
                    </div>

                    <div className="ml-5 mt-2">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">work</span>{' '}
                            {CalendarState.jobs[recent[0].id].info.position}
                        </h1>
                    </div>
                    <div className="ml-5 mt-1">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">schedule</span>{' '}
                            {formatDate(recent[0].date)}
                        </h1>
                    </div>
                    <div className="ml-5 mt-1">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">location_on</span>{' '}
                            {CalendarState.jobs[recent[0].id].info.company}
                        </h1>
                    </div>
                </div>
                <div className="p-5 place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                    <div className="ml-5">
                        <h1>
                            <span className="text-3xl">{recent[1].title}</span>
                        </h1>
                    </div>

                    <div style={{ marginTop: '4%' }}>
                        <img src={taskLine} alt="Horizontal divider" />
                    </div>

                    <div className="ml-5 mt-2">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">work</span>{' '}
                            {CalendarState.jobs[recent[1].id].info.position}
                        </h1>
                    </div>
                    <div className="ml-5 mt-1">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">schedule</span>{' '}
                            {formatDate(recent[1].date)}
                        </h1>
                    </div>
                    <div className="ml-5 mt-1">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">location_on</span>{' '}
                            {CalendarState.jobs[recent[1].id].info.company}
                        </h1>
                    </div>
                </div>
                <div className="p-5 place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                    <div className="ml-5">
                        <h1>
                            <span className="text-3xl">{recent[2].title}</span>
                        </h1>
                    </div>

                    <div style={{ marginTop: '4%' }}>
                        <img src={taskLine} alt="Horizontal divider" />
                    </div>

                    <div className="ml-5 mt-2">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">work</span>{' '}
                            {CalendarState.jobs[recent[2].id].info.position}
                        </h1>
                    </div>
                    <div className="ml-5 mt-1">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">schedule</span>{' '}
                            {formatDate(recent[2].date)}
                        </h1>
                    </div>
                    <div className="ml-5 mt-1">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">location_on</span>{' '}
                            {CalendarState.jobs[recent[2].id].info.company}
                        </h1>
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>

            <h1 className="text-neutral-500 text-xl mt-10 grid place-content-center mx-20 uppercase">
                Job Boards
            </h1>
            <br></br>
            <div className="flex justify-center">
                <Button color="neutral" variant="contained" startIcon={<AddCircleOutline />}>
                    Create new board
                </Button>
            </div>
            <br></br>
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white mx-20 ">
                {renderBoards()}
                <div className="bg-[url('../../assets/home/board.png')] bg-[#793476] bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full py-16"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className="absolute bottom-5 left-5 ">Summer Internships 2023</span>
                    </button>
                </div>
                <div className="bg-[url('../../assets/home/board.png')] bg-[#793476] bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className="absolute bottom-5 left-5">Summer Internships 2022</span>
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
        </div>
    );
}
