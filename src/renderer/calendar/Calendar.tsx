import { useState, useEffect } from 'react';
import { useAsync } from 'react-async-hook';
import dayjs from 'dayjs';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { CircularProgress } from '@mui/material';
import Month from './components/Month';
import CalendarState from './context/CalendarState';
import JobDialog from '../job/JobDialog';

const getMonth = (month = dayjs().month()) => {
    month = Math.floor(month);
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currMonthCount = 0 - firstDayOfTheMonth;

    return new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currMonthCount++;
            return dayjs(new Date(year, month, currMonthCount));
        });
    });
};

const Calendar = () => {
    const jobs = useAsync(httpsCallable(getFunctions(), 'getJobs'), []);

    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const [monthIndex, setMonthIndex] = useState<number>(10);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [isEdit, setIsEdit] = useState<boolean>(false); // If this is an edit or a new job

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

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
        .slice(0, 3);
    const recent = [
        ...CalendarState.events[taskDates[0]].map((e) => ({ ...e, date: taskDates[0] })),
        ...CalendarState.events[taskDates[1]].map((e) => ({ ...e, date: taskDates[1] })),
        ...CalendarState.events[taskDates[2]].map((e) => ({ ...e, date: taskDates[2] })),
    ].slice(0, 3);
    const formatDate = (date) => {
        const split = date.split('-');
        return `${split[1] === '11' ? 'November' : 'December'} ${(split[2] * 1).toString()}`;
    };

    return (
        <div className="h-screen flex flex-col">
            {modalOpen && (
                <JobDialog
                    setOpen={setModalOpen}
                    setCurrentJob={setCurrentJob}
                    jobData={currentJob}
                    isEdit={isEdit}
                    index={0}
                    state={[]}
                    setState={false}
                />
            )}
            <h1 className="grid place-content-center text-3xl mt-5">Upcoming Tasks</h1>
            <div className="grid grid-cols-3 gap-20 mx-20 h-40 my-5">
                <div
                    className="grid place-content-center bg-gray-200"
                    onClick={() => {
                        setCurrentJob(CalendarState.jobs[recent[0].id]);
                        setModalOpen(true);
                        setIsEdit(true);
                    }}
                >
                    <text className="text-3xl">{recent[0].title}</text>
                    {CalendarState.jobs[recent[0].id].position} |{' '}
                    {CalendarState.jobs[recent[0].id].company}
                    <br />
                    {formatDate(recent[0].date)}
                </div>
                <div
                    className="grid place-content-center bg-gray-200"
                    onClick={() => {
                        setCurrentJob(CalendarState.jobs[recent[1].id]);
                        setModalOpen(true);
                        setIsEdit(true);
                    }}
                >
                    <text className="text-3xl">{recent[1].title}</text>
                    {CalendarState.jobs[recent[1].id].position} |{' '}
                    {CalendarState.jobs[recent[1].id].company}
                    <br />
                    {formatDate(recent[1].date)}
                </div>
                <div
                    className="grid place-content-center bg-gray-200"
                    onClick={() => {
                        setCurrentJob(CalendarState.jobs[recent[2].id]);
                        setModalOpen(true);
                        setIsEdit(true);
                    }}
                >
                    <text className="text-3xl">{recent[2].title}</text>
                    {CalendarState.jobs[recent[2].id].position} |{' '}
                    {CalendarState.jobs[recent[2].id].company}
                    <br />
                    {formatDate(recent[2].date)}
                </div>
            </div>

            <h2 className="ml-20 text-2xl">
                {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
            </h2>
            <div className="flex flex-1 mb-10">
                <button type="button" onClick={() => setMonthIndex(monthIndex - 1)}>
                    <span className="material-icons-outlined cursor-pointer text-6xl text-gray-600 mx-2">
                        chevron_left
                    </span>
                </button>
                <Month
                    month={currentMonth}
                    setOpen={setModalOpen}
                    setJob={setCurrentJob}
                    setIsEdit={setIsEdit}
                />
                <button type="button" onClick={() => setMonthIndex(monthIndex + 1)}>
                    <span className="material-icons-outlined cursor-pointer text-6xl text-gray-600 mx-2">
                        chevron_right
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Calendar;
