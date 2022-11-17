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

    static events: { [date: string]: { id: string; title: string }[] } = {};

    static addEvent(event: { id: string; title: string; date: string }) {
        (this.events[event.date] = this.events[event.date] || []).push({
            id: event.id,
            title: event.title,
        });
    }

    static clearEvents() {
        this.events = {};
    }
}

export default CalendarState;
