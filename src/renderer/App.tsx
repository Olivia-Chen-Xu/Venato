import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import {QuickView} from 'components/quickview';
import './App.css';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuickView />} />
            </Routes>
        </Router>
    );
}
