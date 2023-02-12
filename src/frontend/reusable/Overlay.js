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
        elem = <Homepage />;
    } else if (page === 'chooseKanban') {
        elem = <ChooseKanban />;
    } else if (page === 'kanban') {
        elem = <Kanban />;
    } else if (page === 'cal') {
        elem = <Calendar />;
    } else if (page === 'jobs') {
        elem = <JobSearch />;
    } else if (page === 'questions') {
        elem = <QuestionSearch />;
    } else {
        throw new Error(`Invalid page for Overlay: ${page}.`);
    }

    return (
        <>
            <div className="h-screen bg-[url('./images/home/bg.png')] bg-cover bg-no-repeat bg-fixed bg-center">
                <ReusableHeader />
                <div className="flex flex-1 mt-16">
                    <ReusableSideBar />
                    <div className="ml-20 basis-full">{elem}</div>
                </div>
            </div>
        </>
    );
}

export default Overlay;
