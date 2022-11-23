import React from 'react';

/*
const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: (index) => {},

    smallCalendarMonth: null,
    setSmallCalendarMonth: (index) => {},

    daySelected: null,
    setDaySelected: (day) => {},

    showEventModal: false,
    setShowEventModal: () => {},

    dispatchCalEvents: (type, payload) => {},

    savedEvents: [],

    selectedEvent: null,
    setSelectedEvent: () => {},

    labels: [],
    setLabels: () => {},
    updateLabel: () => {},

    filterEvents: [],
    setFilterEvents: (events: object[]) => {
        this.filterEvents = events;
    },
});
*/

class CalendarState {
    static monthIndex: number = 0;

    static smallCalendarMonth: any = null;

    static daySelected: any = null;

    static showEventModal: boolean = false;

    static savedEvents: any[] = [];

    static selectedEvent: any = null;

    static labels: any[] = [];

    // The ID of the currently selected job (empty string for none selected)
    static currentJob: string = '';

    // Jobs include all the job data and are accessed by their id
    static jobs: { [id: string]: object } = {};

    static addJobs(jobs: object[]) {
        this.jobs = {};
        this.events = {};

        jobs.forEach((job) => {
            this.jobs[job.id] = job;

            job.deadlines.forEach((deadline: { date: string; title: any }) => {
                (this.events[deadline.date] = this.events[deadline.date] || []).push({
                    id: job.id,
                    title: deadline.title,
                });
            });
        });
    }

    static updateJob(job) {
        this.jobs[job.id] = job;
    }

    // Events are lightweight objects with minimum data mapped to by a date for easy access
    static events: { [date: string]: { id: string; title: string }[] } = {};
}

export default CalendarState;
