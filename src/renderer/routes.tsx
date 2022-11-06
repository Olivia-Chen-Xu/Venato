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
    return (
        <ContextWrapper>
            <div className="space-x-5">
                <button
                    onClick={() => {
                        nav('/home');
                    }}
                >
                    Home
                </button>
                <button
                    onClick={() => {
                        nav('/kanban');
                    }}
                >
                    Kanban
                </button>
                <button
                    onClick={() => {
                        nav('/job');
                    }}
                >
                    Job
                </button>
                <button
                    onClick={() => {
                        nav('/calendar');
                    }}
                >
                    Cal
                </button>
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
