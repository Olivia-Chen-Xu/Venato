import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import {QuickViewUI} from 'components/quickview';
import './App.css';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuickViewUI />} />
            </Routes>
        </Router>
    );
}
