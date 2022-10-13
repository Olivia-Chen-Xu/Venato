import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Calendar from './calendar/main';
import ContextWrapper from './calendar/context/ContextWrapper';

export default function App() {
  return (
    <Router>
      <ContextWrapper>
        <Routes>
          <Route path="/" element={<Calendar />} />
        </Routes>
      </ContextWrapper>
    </Router>
  );
}
