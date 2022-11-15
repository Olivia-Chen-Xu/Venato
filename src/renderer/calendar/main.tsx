import React, { useState, useContext, useEffect } from 'react';
import CalHeader from './components/CalHeader';
import Sidebar from './components/Sidebar';
import dayjs from 'dayjs';
import Month from './components/Month';
import EventModal from './components/EventModal';
import GlobalContext from './context/GlobalContext';
import ReusableHeader from 'renderer/reusable/ReusableHeader';
import dayjs from 'dayjs';

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
}

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const [monthIndex, setMonthIndex] = useState(10);
    const [showEventModal, setShowEventModal] = useState(false);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

    return (
        <>
            {showEventModal && <EventModal />}
            <div className="h-screen flex flex-col">
                <h1 className="grid place-content-center text-3xl mt-5">Upcoming Tasks</h1>
                <div className="grid grid-cols-3 gap-20 mx-20 h-40 my-5">
                    <div className="grid place-content-center bg-gray-200">
                        <span className="text-3xl">Task</span>
                    </div>
                    <div className="grid place-content-center bg-gray-200">
                        <span className="text-3xl">Task</span>
                    </div>
                    <div className="grid place-content-center bg-gray-200">
                        <span className="text-3xl">Task</span>
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
                    <Month month={currentMonth} />
                    <button type="button" onClick={() => setMonthIndex(monthIndex + 1)}>
                        <span className="material-icons-outlined cursor-pointer text-6xl text-gray-600 mx-2">
                            chevron_right
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Calendar;
