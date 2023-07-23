import Calendar from '../calendar/Calendar';
import Homepage from '../homepage/Homepage';
import Kanban from '../kanban/Kanban';
import JobSearch from '../search/JobSearch';
import QuestionSearch from '../search/QuestionSearch';
import ReusableHeader from './ReusableHeader';
import ReusableSideBar from './ReusableSideBar';
import ChooseKanban from '../kanban/ChooseKanban';

const Overlay = (props) => {
    const { page } = props;
    let elem;

    if (page === 'home') {
        elem = <Homepage/>;
    } else if (page === 'chooseKanban') {
        elem = <ChooseKanban/>;
    } else if (page === 'kanban') {
        elem = <Kanban/>;
    } else if (page === 'cal') {
        elem = <Calendar/>;
    } else if (page === 'jobs') {
        elem = <JobSearch/>;
    } else if (page === 'questions') {
        elem = <QuestionSearch/>;
    } else {
        throw new Error(`Invalid page for Overlay: ${page}.`);
    }

    return (
        <>
            <div id='app'>
                <ReusableSideBar/>
                <ReusableHeader/>
                <main className='bg-slate-50 h-full overflow-hidden flex flex-col'>{elem}</main>
            </div>
        </>
    );
}

export default Overlay;
