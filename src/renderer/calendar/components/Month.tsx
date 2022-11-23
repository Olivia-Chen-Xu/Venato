import React from 'react';
import dayjs from 'dayjs';
import CalendarState from '../context/CalendarState';

const Day = ({ day, rowIdx, setOpen, setJob }) => {
    const getCurrentDayClass = () => {
        return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
            ? 'bg-blue-600 text-white rounded-full w-7'
            : '';
    };

    const getDayEvents = () => {
        let dayEvents = CalendarState.events[day.format('DD-MM-YY')];
        if (!dayEvents) {
            return [];
        }

        let overLimit = false;
        const size = dayEvents.length;
        if (dayEvents.length >= 2) {
            dayEvents = dayEvents.slice(0, 2);
            overLimit = true;
        }

        const jsx = dayEvents.map((evt, idx) => (
            <div
                key={idx}
                onClick={() => {
                    setJob(CalendarState.jobs[evt.id]);
                    console.log(evt.id);
                    console.log(CalendarState.jobs);
                    console.log(CalendarState.jobs[evt.id]);
                    setOpen(true);
                }}
                className="bg-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate"
            >
                {evt.title}
            </div>
        ));
        if (overLimit) {
            jsx.push(
                <div
                    key={3}
                    onClick={() => {}}
                    className="bg-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate"
                >
                    <i>{size - 2} more...</i>
                </div>
            );
        }
        return jsx;
    };

    return (
        <>
            <div className="border border-gray-200 flex flex-col">
                <header className="flex flex-col items-center">
                    {rowIdx === 0 && (
                        <p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>
                    )}
                    <p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>
                        {day.format('DD')}
                    </p>
                </header>
                <div
                    className="flex-1 cursor-pointer"
                >
                    {getDayEvents()}
                </div>
            </div>
        </>
    );
};

const Month = ({ month, setOpen, setJob }) => (
    <div className="flex-1 grid grid-cols-7 grid-rows-5">
        {month.map((row, i) => (
            <React.Fragment key={i}>
                {row.map((day, idx) => (
                    <Day day={day} key={idx} rowIdx={i} setOpen={setOpen} setJob={setJob} />
                ))}
            </React.Fragment>
        ))}
    </div>
);

export default Month;
