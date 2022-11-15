import React, { useState, useContext, useEffect } from 'react';
import { getMonth } from './getMonth';
import CalHeader from './components/CalHeader';
import Sidebar from './components/Sidebar';
import dayjs from 'dayjs';
import Month from './components/Month';
import EventModal from './components/EventModal';
import GlobalContext from './context/GlobalContext';
import ReusableHeader from 'renderer/reusable/ReusableHeader';

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const { monthIndex, setMonthIndex, showEventModal } = useContext(GlobalContext);
    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex]);

    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
    }
    function handleNextMonth() {
        setMonthIndex(monthIndex + 1);
    }

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
                    <button type="button" onClick={handlePrevMonth}>
                        <span className="material-icons-outlined cursor-pointer text-6xl text-gray-600 mx-2">
                            chevron_left
                        </span>
                    </button>
                    <Month month={currentMonth} />
                    <button type="button" onClick={handleNextMonth}>
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
