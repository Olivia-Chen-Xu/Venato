import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, InputAdornment, InputLabel, TextField } from '@mui/material';
import { signup } from './auth-functions';
import { btnStyle, iconStyle, inputStyle } from './authStyles';
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
    const [successMsg, setSuccessMsg] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match');
            return;
        }

        const signupResult = await signup(email, password)
            .then((res) => {
                setErrMsg('');
                setSuccessMsg('Sign up success! Check your email for a verification link');
            })
            .catch((err) => {
                setSuccessMsg('');
                if (err.code === 'functions/already-exists') {
                    setErrMsg('Email in use, please try another email');
                } else {
                    setErrMsg('Error creating account, please try again later');
                }
            });
    };

    return (
        <div className="h-screen grid place-content-center">
            <div style={{ alignItems: 'flex-start ' }}>
                <text className="TopText">Sign Up</text>
                <div className="flex flex-1 my-5">
                    {/* <p className="WelcomeText material-icons-outlined mr-5" style={{ color: 'red', fontSize: '32px'}}>
                    {errMsg === '' ? '' : '}
                </p>{' '} */}

                    {errMsg === '' ? '' : <WarningAmberRounded color='error' className='mr-5'/>}
                    <text className="WelcomeText"
                          style={errMsg === '' ? (successMsg === '' ? {} : { color: 'green' }) : { color: 'red' }}>
                        {' '}
                        {errMsg === '' ? (successMsg === '' ? 'Welcome!' : successMsg) : errMsg}
                    </text>
                </div>
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
                ></TextField>
                <div style={{ height: 20 }}></div>
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
                                    {showPassword ? <VisibilityOutlined style={iconStyle}/> :
                                        <VisibilityOffOutlined/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                ></TextField>
                <div style={{ height: 20 }}></div>
                <InputLabel>Confirm Password</InputLabel>
                <TextField
                    variant="outlined"
                    type={showPasswordConfirm ? 'text' : 'password'}
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
                                    {showPasswordConfirm ? <VisibilityOutlined style={iconStyle}/> :
                                        <VisibilityOffOutlined/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                ></TextField>

                <Button color="neutral" variant="contained" style={btnStyle} onClick={handleSignup}>
                    Sign Up
                </Button>
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
        </div>
    );
};

export default SignUp;
