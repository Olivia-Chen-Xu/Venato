import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './homepage/Homepage';
import Job from './job/Job';
import Kanban from './kanban/Kanban';
import { Calendar } from './calendar/main';
import Welcome from './auth/Welcome';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import PasswordReset from './auth/PasswordReset';
import './App.css';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/password-reset" element={<PasswordReset />} />

                <Route path="/home" element={<Homepage />} />
                <Route path="/job" element={<Job />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </Router>
    );
}
