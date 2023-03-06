import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MemoryRouter as Router } from 'react-router';
import { Route, Routes } from 'react-router-dom';
import Welcome from './frontend/auth/Welcome';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignIn from './frontend/auth/SignIn';
import SignUp from './frontend/auth/SignUp';
import PasswordReset from './frontend/auth/PasswordReset';
import Overlay from './frontend/reusable/Overlay';

const theme = createTheme({
    palette: {
        primary: {
            main: '#633175',
        },
        neutral: {
            main: '#7F5BEB',
            contrastText: '#fff',
        },
        info: {
            main: '#367CFF'
        }
    },
    typography:{
        fontFamily:[
            'Poppins'
        ].join(',')
    },
});

function App() {
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
                    <Route path="/questions" element={<Overlay page={'questions'} />} />
                    <Route path="/chooseKanban" element={<Overlay page={'chooseKanban'} />} />
                    <Route path="/kanban" element={<Overlay page={'kanban'} />} />
                    <Route path="/calendar" element={<Overlay page={'cal'} />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
