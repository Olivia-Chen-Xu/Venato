import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import CalendarState from '../context/CalendarState';

const Day = ({ day, rowIdx }) => {
    const [dayEvents, setDayEvents] = useState([{ title: 'init state...', label: '' }]);
    // const { setDaySelected, setShowEventModal, setSelectedEvent } = useContext(CalendarState);

    // const { filterEvents } = useContext(CalendarState);
    // useEffect(() => {
    //     // console.log(filterEvents);
    //     const events = filterEvents.filter((evt) => {
    //         console.log(`Component : ${day.format('DD-MM-YY')}`);
    //         console.log(`Input : ${evt.day.format('DD-MM-YY')}`);
    //         return evt.day.format('DD-MM-YY') === day.format('DD-MM-YY');
    //     });
    //     setDayEvents(events);
    // }, [filterEvents, day]);

    const getCurrentDayClass = () => {
        return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
            ? 'bg-blue-600 text-white rounded-full w-7'
            : '';
    };

    // First onclick
    // setDaySelected(day);
    //                         setShowEventModal(true);

    // Second: setSelectedEvent(evt)

    const getDayEvents = () => {
        if (!CalendarState.events[day.format('DD-MM-YY')]) {
            return [];
        }
        return CalendarState.events[day.format('DD-MM-YY')].map((evt, idx) => (
            <div
                key={idx}
                onClick={() => {}}
                className="bg-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate"
            >
                {evt.title}
            </div>
        ));
    };

    return (
        <>
            {}
            <div className="border border-gray-200 flex flex-col">
                <header className="flex flex-col items-center">
                    {rowIdx === 0 && (
                        <p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>
                    )}
                    <p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>
                        {day.format('DD')}
                    </p>
                </header>
                <div onClick={() => {}} className="flex-1 cursor-pointer">
                    {getDayEvents()}
                </div>
            </div>
        </>
    );
};

const Month = ({ month }) => {
    return (
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
            {month.map((row, i) => (
                <React.Fragment key={i}>
                    {row.map((day, idx) => (
                        <Day day={day} key={idx} rowIdx={i} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Month;
