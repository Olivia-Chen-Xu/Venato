import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import CalendarState from '../calendar/context/CalendarState';
import taskLine from '../../../assets/task-line.png';
import { AddCircleOutline } from '@mui/icons-material';

const bannerStyles = {
    color: 'white',
    padding: '16px 16px 16px 24px',
    borderRadius: '12px',
}
const Homepage = () => {
    const nav = useNavigate();
    const jobs = useAsync(httpsCallable(getFunctions(), 'getJobs'), []);

    if (jobs.loading) {
        return (
            <div>
                <CircularProgress />
            </div>
        );
    }
    if (jobs.error) {
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

        const boardsHtml: JSX.Element[] = [];
        userData.result.data.boards.forEach((board: { name: string; userId: string; id: string }) => {
            boardsHtml.push(
                <div className="font-poppins tracking-tighter text-black w-64 border-2 border-black bg-[#FFFFFF]  rounded-2xl">
                    <button
                        className="relative w-full h-full py-16 bottom-100"
                        onClick={() => nav('/kanban', { state: { boardId: board.id } })}
                    >
                        <span className="absolute bottom-5 left-5 ">{board.name}</span>
                    </button>
                </div>
            );
        });
        return boardsHtml;
    };

    const renderEvents = () => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        const eventsHtml: JSX.Element = [];
        userData.result.data.events.forEach(
            (event: { title: string; date: number; location: string; company: string }) => {
                eventsHtml.push(
                    <div className="font-poppins tracking-tighter p-3 place-content-between bg-gradient-to-tl from-[#7F5BEB] to-[#7F5BEB] rounded-2xl">
                        <div className="ml-5">
                            <h1>
                                <span className="text-3xl">{event.title}</span>
                            </h1>
                        </div>

                    <div style={{ marginTop: '4%' }}>
                        <img src={taskLine} alt="Horizontal divider" />
                    </div>

                    <div className="ml-5 mt-2">
                        <h1 className="text-md align-middle">
                            <span className="material-icons-outlined text-xl">work</span>{' '}
                            {CalendarState.jobs[recent[1].id].position}
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
                            {CalendarState.jobs[recent[1].id].company}
                        </h1>
                    </div>
                </div>
                <div className="p-5 place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                    <div className="ml-5">
                        <h1>
                            <span className="text-3xl">{recent[2].title}</span>
                        </h1>
                    </div>

    return (
        <div>
            <h1 className=" font-poppins tracking-tighter font-medium left-100 text-black text-xl mt-2 grid place-content-center ">
                Upcoming Deadlines
            </h1>
            <div style={bannerStyles} className="grid grid-cols-3 gap-10 mx-30 h-20 my-5">
                {renderEvents()}
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div>
                <Button sx={{color: 'white'}}  variant="contained" startIcon={<AddCircleOutline />}>
                    Create new board
                </Button>
                <br></br>
            </div>
            <br />
            <div className="tracking-tighter mt-5 grid grid-cols-3 gap-3 gap-y-2 text-2xl text-white mx-10 ">
                {renderBoards()}
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
