import React from 'react';
import dayjs from 'dayjs';
import { getFunctions, httpsCallable } from 'firebase/functions';

const Day = ({ app, int, month, day, rowIdx, setOpen, setJob, setIsEdit, deadlines }) => {
    const getCurrentDayClass = () => {
        return day.format('YY-MM-DD') === dayjs().format('YY-MM-DD')
            ? 'bg-[#7F5BEB] text-white rounded-full w-8'
            : '';
    };

    const getCurrMonth = () => {
        return month === day.format('MM') ? '' : 'grayscale';
    }

    const getPriorityColor = (deadline) => {
        switch(deadline.priority){
            case 'High':
                return 'bg-[#FFE7E7] text-[#9B0909]';
            case 'Medium':
                return 'bg-[#FFF4E7] text-[#A4641B]';
            case 'Low':
                return 'bg-[#DEFFE5] text-[#166528]';
            default:
                return 'bg-slate-100';
        }
    }

    const checkInterview = (deadline) => {
        console.log(deadline, deadline.isInterview)
    }

    const getDayEvents = () => {
        if (!deadlines) {
            return [];
        }

        let overLimit = false;
        const size = deadlines.length;
        if (size > 2) {
            deadlines.splice(2);
            overLimit = true;
        }
        
        // if(deadlines.length > 0){
        //     deadlines.forEach((day, idx) => {
        //         console.log(day, day.isInterview);
                
        //     });
        // }

        console.log(app, int)
        const jsx = deadlines.map((deadline, idx) => (
            <div
                key={idx}
                onClick={async (event) => {
                    event.stopPropagation(); // So the day div onClick won't be triggered also
                    setJob(await httpsCallable(getFunctions(), 'getJobData')(deadline.jobId)
                        .then((result) => result.data));
                    setIsEdit(true);
                    setOpen(true);


                }}
                className={`bg-200 ${getPriorityColor(deadline)} ${getCurrMonth()} p-1 mr-2 ml-2 text-gray-600 text-sm rounded mb-1 truncate`}
            >
                {deadline.title}
            </div>
            ));
        if (overLimit) {
            jsx.push(
                <div
                    key={3}
                    onClick={() => {
                        // TODO: When clicking the 'more' options, open a menu
                    }}
                    className="bg-200 mr-2 ml-2 text-gray-600 text-sm rounded mb-1 truncate bg-slate-100"
                >
                    <i>{size - 2} more...</i>
                </div>
            );
        }
        return jsx;
    };

    return (
        <>
            <div className="border border-gray-300 flex flex-col">
                <header className="flex flex-col items-right">
                    {rowIdx === 0 && (
                        <p className="text-base -mt-7 text-center">{day.format('ddd')}</p>
                    )}
                    <p className={`p-1 my-1 text-center font-bold text-base ml-auto ${getCurrentDayClass()}`}>
                        {day.format('D')}
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

const Month = ({ viewApp, viewInt, month, setOpen, setJob, setIsEdit, deadlines }) => {
    return (
        <div className="h-5/6 grid grid-cols-7 grid-rows-5">
            {month.map((row, i) => (
                <React.Fragment key={i}>
                    {row.map((day, idx) => (
                        <Day
                            app = {viewApp}
                            int = {viewInt}
                            month={month[2][2].format('MM')}
                            day={day}
                            key={idx}
                            rowIdx={i}
                            setOpen={setOpen}
                            setJob={setJob}
                            setIsEdit={setIsEdit}
                            deadlines={deadlines.filter((deadline) => {
                                let dayString = JSON.stringify(day);
                                dayString.replaceAll('"', '');
                                return (
                                    parseInt(dayString.split('-')[2].slice(0, 2), 10) ===
                                    deadline.date.day
                                );
                            })}
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    )};

export default Month;
