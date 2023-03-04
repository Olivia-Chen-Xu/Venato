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
            <div className="h-screen w-screen bg-[url('./images/home/bg.png')] bg-cover bg-no-repeat bg-fixed bg-center">
                <div className="flex w-full h-full">
                    <ReusableSideBar />
                    <div className='flex flex-col grow'>
                        <ReusableHeader />
                        <div className='h-full overflow-hidden flex'>{elem}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Overlay;
