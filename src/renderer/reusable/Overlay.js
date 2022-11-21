import React from 'react';
import Calendar from 'renderer/calendar/Calendar';
import Homepage from 'renderer/homepage/Homepage';
import Kanban from 'renderer/kanban/Kanban';
import SearchBar from 'renderer/search/SearchBar';
import ReusableHeader from './ReusableHeader';
import ReusableSideBar from './ReusableSideBar';
import Questions from 'renderer/questions/Questions';

export default function Overlay(props) {
    const { page } = props;
    let elem; // By default show home?
    if (page === 'jobs') {
        elem = <SearchBar />;
    } else if (page === 'cal') {
        elem = <Calendar />;
    } else if (page === 'kanban') {
        elem = <Kanban />;
    } else if (page === 'questions'){
        elem = <Questions />
    }    else {
        elem = <Homepage />;
    }
    return (
        <React.Fragment>
        <div className="h-screen bg-[url('../../assets/home/bg.png')] bg-cover bg-no-repeat bg-fixed bg-center">
            <ReusableHeader />
            <div className="flex flex-1 mt-16">
                <ReusableSideBar />
                <div className="ml-20 basis-full">{elem}</div>
            </div>
        </div>
        </React.Fragment>
    );
}
