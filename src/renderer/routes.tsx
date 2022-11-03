import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import './calendar/main';
import { Calendar } from './calendar/main';
import Homepage from './homepage/Homepage';
import Job from './job/Job';
import Kanban from './kanban/Kanban';
import ContextWrapper from './calendar/context/ContextWrapper';

export default function AppRoutes() {
    const nav = useNavigate();

    const goHome = () => {
        nav('/');
    };

    const goKanban = () => {
        nav('/kanban');
    };

    const goJob = () => {
        nav('/job');
    };

    const goCal = () => {
        nav('/calendar');
    };

    return (
        <ContextWrapper>
            <div className="space-x-5">
                <button onClick={goHome}>Home</button>
                <button onClick={goKanban}>Kanban</button>
                <button onClick={goJob}>Job</button>
                <button onClick={goCal}>Cal</button>
            </div>
            <Routes>
                <Route path="/home" element={<Homepage />} />
                <Route path="/job" element={<Job />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </ContextWrapper>
    );
}
