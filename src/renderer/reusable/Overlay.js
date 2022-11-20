import React from 'react';
import { Calendar } from 'renderer/calendar/main';
import Homepage from 'renderer/homepage/Homepage';
import Job from 'renderer/job/Job';
import Kanban from 'renderer/kanban/Kanban';
import SearchBar from 'renderer/search/SearchBar';
import ReusableHeader from './ReusableHeader';
import ReusableSideBar from './ReusableSideBar';

export default function Overlay(props) {
    const page = props.page;
    let elem; // By default show home?
    if (page === 'jobs') {
        elem = <SearchBar />;
    } else if (page === 'cal') {
        elem = <Calendar />;
    } else if (page === 'kanban') {
        elem = <Kanban />;
    } else {
        elem = <Homepage />;
    }
    return (
        <React.Fragment>
        <div className="h-screen bg-[url('../../assets/home/bg.png')] bg-cover bg-fixed bg-center">
            <ReusableHeader />
            <div className="flex flex-1">
                <ReusableSideBar />
                <div className="w-full">{elem}</div>
            </div>
        </div>
        </React.Fragment>
    );
}
