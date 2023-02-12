import Calendar from 'renderer/calendar/Calendar';
import Homepage from 'renderer/homepage/Homepage';
import Kanban from 'renderer/kanban/Kanban';
import JobSearch from 'renderer/search/JobSearch';
import Questions from 'renderer/search/QuestionSearch';
import ReusableHeader from './ReusableHeader';
import ReusableSideBar from './ReusableSideBar';
import ChooseKanban from '../kanban/ChooseKanban';

const Overlay = (props) => {
    const { page } = props;
    let elem; // By default show home?
    if (page === 'jobs') {
        elem = <JobSearch />;
    } else if (page === 'cal') {
        elem = <Calendar />;
    } else if (page === 'chooseKanban') {
        elem = <ChooseKanban />;
    } else if (page === 'kanban') {
        elem = <Kanban />;
    } else if (page === 'questions') {
        elem = <Questions />;
    } else {
        elem = <Homepage />;
    }
    return (
        <>
            {/*<div className="h-screen bg-[url('../../images/home/bg.png')] bg-cover bg-no-repeat bg-fixed bg-center">*/}
            {/*    <ReusableHeader />*/}
            {/*    <div className="flex flex-1 mt-16">*/}
            {/*        <ReusableSideBar />*/}
            {/*        <div className="ml-20 basis-full">{elem}</div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
}

export default Overlay;
