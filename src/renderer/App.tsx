import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { signup, signin, signout, deleteAccount, passwordResetEmail } from '../components/auth';
import { useState } from "react";

const Hello = () => {
    const nameStyle = { textAlign: 'center' as const };

    const clearData = () => {
        setEmail("");
        setPassword("");
    }

    const handleSignup = () => {
        if (currState == 0) {
            setCurrState(1);
        } else {
            if (signup(email, password) == 1) {
                clearData();
                setCurrState(4);
            }
        }
    }

    const handleSignIn = () => {
        if (currState == 0) {
            setCurrState(2);
        } else {
            if (signin(email, password) == 1) {
                clearData();
                setCurrState(4);
            }
        }
    }

    const handlePassReset = () => {
        if (currState == 0) {
            setCurrState(3);
        } else {
            setCurrState(0);
        }
    }

    const handleSignOut = () => {
        if (signout() == 1) {
            setCurrState(0);
        }
    }

    const handleDeleteAccount = () => {
        if (deleteAccount() == 1) {
            setCurrState(0);
        }
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const buttons = {
        'signup': <button type="submit" onClick={handleSignup}>Sign up</button>,
        'signin': <button type="submit" onClick={handleSignIn}>Sign in</button>,
        'signout': <button type="submit" onClick={handleSignOut}>Sign out</button>,
        'deleteAccount': <button type="submit" onClick={handleDeleteAccount}>Delete account</button>,
        'passwordResetEmail': <button type="submit" onClick={handlePassReset}>Reset password</button>
    };
    const states = [
        <>{buttons['signup']}{buttons['signin']}{buttons['passwordResetEmail']}</>,
        <><input type="email" value={email} required placeholder="Email"
                 onChange={(e) => {setEmail(e.target.value)}} />
            <input type="password" value={password} required placeholder="Password"
                   onChange={(e) => {setPassword(e.target.value)}} />
            {buttons['signup']}</>,
        <><input type="email" value={email} required placeholder="Email"
                 onChange={(e) => {setEmail(e.target.value)}} />
            <input type="password" value={password} required placeholder="Password"
                   onChange={(e) => {setPassword(e.target.value)}} />
            {buttons['signin']}</>,
        <>{buttons['passwordResetEmail']}</>,
        <>{buttons['signout']}{buttons['deleteAccount']}</>
    ];
    const [currState, setCurrState] = useState(0);

    return (
        <div>
            <div className="Hello">
                <img width="200" alt="icon" src={icon} />
            </div>
            <h1 style={nameStyle}>electron-react-boilerplate</h1>
            <div className="Hello">
                {states[currState]}
            </div>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Hello />} />
            </Routes>
        </Router>
    );
}
