import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputLabel, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { signup } from './auth-functions';
import { btnStyle, inputStyle } from './authStyles';
import './auth.css';
import {
    VisibilityOffOutlined,
    VisibilityOutlined,
    WarningAmberRounded,
} from '@mui/icons-material';

const SignUp = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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
            <div className="flex flex-1">
                {errMsg === '' ? '' : <WarningAmberRounded color="error" className="mr-5" />}
                <text className="WelcomeText" style={errMsg === '' ? {} : { color: 'red' }}>
                    {' '}
                    {errMsg === '' ? 'Welcome!' : errMsg}
                </text>
            </div>
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
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                style={inputStyle}
                required
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                    setShowPassword(!showPassword);
                                }}
                            >
                                {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <div style={{ height: 20 }} />
            <InputLabel>Confirm password</InputLabel>
            <TextField
                variant="outlined"
                type={showPasswordConfirm ? 'text' : 'password'} // <-- This is where the magic happens
                placeholder="••••••••••"
                style={inputStyle}
                required
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                }}
                InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                    setShowPasswordConfirm(!showPasswordConfirm);
                                }}
                            >
                                {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <div className='mt-4 w-full'>
                <Button color="neutral" variant="contained" style={btnStyle} onClick={handleSignup}>
                    Sign Up
                </Button>
        </div>

                <div className="my-2 w-full">
                <Button
                    color="neutral"
                    variant="outlined"
                    style={btnStyle}
                    onClick={() => navigate('/sign-in')}
                >
                    Log In
                </Button>
            </div>
            </div>
    );
};

export default SignUp;
