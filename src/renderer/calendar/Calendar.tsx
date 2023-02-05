import { useState, useEffect } from 'react';
import { useAsync } from 'react-async-hook';
import dayjs from 'dayjs';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { CircularProgress } from '@mui/material';
import Month from './components/Month';
import JobDialog from '../job/JobDialog';

const getMonth = (month = Math.floor(dayjs().month())) => {
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currMonthCount = 0 - firstDayOfTheMonth;

    return new Array(5)
        .fill([])
        .map(() =>
            new Array(7).fill(null).map(() => dayjs(new Date(year, month, ++currMonthCount)))
        );
};

const Calendar = () => {
    const getDeadlines = useAsync(httpsCallable(getFunctions(), 'getCalendarDeadlines'), []);

    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const [monthIndex, setMonthIndex] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [isEdit, setIsEdit] = useState<boolean>(false); // If this is an edit or a new job

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

    if (getDeadlines.loading) {
        return (
            <div>
                <CircularProgress />
            </div>
        );
    }
    if (getDeadlines.error) {
        return <p>Error: {getDeadlines.error.message}</p>;
    }

    const deadlines: {
        company: string;
        date: { year: number; month: number; day: number };
        title: string;
        jobId: string;
        link: string;
    }[] = getDeadlines.result.data;

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
            <h2 className="ml-20 text-2xl">
                {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
            </h2>
            <br />
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
                    deadlines={deadlines.filter((deadline) => {
                        let exampleDay = JSON.stringify(currentMonth[1][0]);
                        exampleDay = exampleDay.replaceAll('"', '');
                        return (
                            parseInt(exampleDay.split('-')[0], 10) === deadline.date.year &&
                            parseInt(exampleDay.split('-')[1], 10) === deadline.date.month
                        );
                    })}
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
