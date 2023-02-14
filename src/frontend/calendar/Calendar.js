import { useState, useEffect } from "react";
import { useAsync } from "react-async-hook";
import dayjs from "dayjs";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Checkbox, CircularProgress, FormControlLabel, FormGroup } from "@mui/material";
import Month from "./Month";
import JobDialog from "../reusable/JobDialog";

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
    const getDeadlines = useAsync(httpsCallable(getFunctions(), "getCalendarDeadlines"), []);

    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const [monthIndex, setMonthIndex] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [isEdit, setIsEdit] = useState(false); // If this is an edit or a new job

    const [viewApplications, setViewApplications] = useState(true);
    const [viewInterviews, setViewInterviews] = useState(true);

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

    const deadlines = getDeadlines.result.data;

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
                    isKanban={false}
                />
            )}

            <div className="h-5/6 mr-8 ml-6">
                <div className="flex mb-10">
                    <button type="button" onClick={() => setMonthIndex(monthIndex - 1)}>
                        <span className="material-icons-outlined cursor-pointer text-lg text-gray-600 mx-2 border-2 rounded-md">
                            chevron_left
                        </span>
                    </button>
                    <div className="flex flex-col mx-2">
                        <h2 className="text-lg text-center font-bold">
                            {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM")}
                        </h2>
                        <h2 className="text-md text-center font-md">
                            {dayjs(new Date(dayjs().year(), monthIndex)).format("YYYY")}
                        </h2>
                    </div>
                    <button type="button" onClick={() => setMonthIndex(monthIndex + 1)}>
                        <span className="material-icons-outlined cursor-pointer text-lg text-gray-600 mx-2 border-2 rounded-md">
                            chevron_right
                        </span>
                    </button>

                    <div className=" ml-auto border-2 border rounded-md text-base px-4">
                        <div>My calendars</div>
                        <div className="flex flex-1">
                            <div>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                defaultChecked
                                                onChange={() => {
                                                    setViewApplications(!viewApplications);
                                                }}
                                            />
                                        }
                                        label="Applications"
                                    />
                                </FormGroup>
                            </div>
                            <div>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                defaultChecked
                                                onChange={() => {
                                                    setViewInterviews(!viewInterviews);
                                                }}
                                            />
                                        }
                                        label="Interviews"
                                    />
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-full">
                    <Month
                        viewApp={viewApplications}
                        viewInt={viewInterviews}
                        month={currentMonth}
                        setOpen={setModalOpen}
                        setJob={setCurrentJob}
                        setIsEdit={setIsEdit}
                        deadlines={deadlines.filter((deadline) => {
                            let exampleDay = JSON.stringify(currentMonth[1][0]);
                            exampleDay = exampleDay.replaceAll('"', "");
                            return (
                                parseInt(exampleDay.split("-")[0], 10) === deadline.date.year &&
                                parseInt(exampleDay.split("-")[1], 10) === deadline.date.month
                            );
                        })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Calendar;
