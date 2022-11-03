import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import AuthScreens from './auth/auth-screens';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<AuthScreens />} />
            </Routes>
        </Router>
    );
}
