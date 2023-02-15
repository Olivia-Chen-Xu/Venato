import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputLabel, TextField, Button } from '@mui/material';
import { signup } from './auth-functions';
import { btnStyle, inputStyle } from './authStyles';
import './auth.css';

const SignUp = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match');
            return;
        }

        const signupResult = await signup(email, password);
        if (typeof signupResult === 'string') {
            setErrMsg(signupResult);
        }
    };

    return (
        <div className="AuthMainDiv" style={{ alignItems: 'flex-start ' }}>
            <text className="TopText">Sign up</text>
            <br />
            <text className="WelcomeText">Welcome!</text>
            <br />
            <InputLabel>Email</InputLabel>
            <TextField
                variant="outlined"
                placeholder="john.smith@gmail.com"
                style={inputStyle}
                required
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <div style={{ height: 20 }} />
            <InputLabel>Password</InputLabel>
            <TextField
                variant="outlined"
                type="password"
                placeholder="••••••••••"
                style={inputStyle}
                required
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <div style={{ height: 20 }} />
            <InputLabel>Confirm password</InputLabel>
            <TextField
                variant="outlined"
                type="password"
                placeholder="••••••••••"
                style={inputStyle}
                required
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                }}
            />
            <Button color="neutral" variant="contained" style={btnStyle} onClick={handleSignup}>
                Sign up
            </Button>
            <br />
            <div
                style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    display: 'flex',
                    width: '100%',
                }}
            >
                <p className="SwapAuthText">Already have an account?</p>
                <text className="SwapAuthTextLink" onClick={() => navigate('/sign-in')}>
                    Log in
                </text>
            </div>

            <br />
            <text style={{ color: 'red' }}>{errMsg}</text>
        </div>
    );
};

export default SignUp;
