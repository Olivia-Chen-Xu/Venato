import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthScreens from '../components/auth-screens';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthScreens />} />
            </Routes>
        </Router>
    );
}
