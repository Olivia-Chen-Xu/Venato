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
    let title;
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
            <div className="flex bg-[url('./images/home/bg.png')] bg-cover bg-no-repeat bg-fixed bg-center overflow-hidden" id="app">
                <div className="flex flex-1 overflow-hidden">
                    <ReusableSideBar />
                    <div className='flex flex-col grow overflow-hidden' style={{backgroundColor: '#F6F6F6'}}>
                        <ReusableHeader/>
                        <div className='h-full overflow-hidden flex z-10 app-body'>{elem}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Overlay;
