import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './auth/Welcome';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import PasswordReset from './auth/PasswordReset';
import './App.css';
import Overlay from './reusable/Overlay';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#633175',
        },
    },
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/password-reset" element={<PasswordReset />} />

                    <Route path="/home" element={<Overlay page={'home'} />} />
                    <Route path="/job" element={<Overlay page={'jobs'} />} />
                    <Route path="/kanban" element={<Overlay page={'kanban'} />} />
                    <Route path="/calendar" element={<Overlay page={'cal'} />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}
