import { useNavigate } from 'react-router-dom';
import './auth.css';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { signin } from './auth-functions';
import { auth } from '../../firebase';
import { Button, IconButton, InputAdornment, InputLabel, TextField } from '@mui/material';
import { btnStyle, iconStyle, inputStyle } from './authStyles';
import {
    VisibilityOffOutlined,
    VisibilityOutlined,
    WarningAmberRounded
} from '@mui/icons-material';

const SignIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPW, setShowPW] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const handleSignIn = () => {
        const signInResult = signin(email, password);
        if (typeof signInResult === "string") {
            setErrMsg(signInResult);
            return;
        }

        signInResult
            .then((r) => {
                console.log(JSON.stringify(r));
                if (!r.user.emailVerified) {
                    setErrMsg("You need to verify your email first");
                    signOut(auth);
                } else {
                    console.log(`Successfully signed in user: ${email}, ${password}`);
                    // clearData();
                    navigate("/home");
                }
            })
            .catch((err) => {
                console.log(`Error signing in: ${JSON.stringify(err)}`);
                if (
                    err.code === "auth/user-not-found" ||
                    err.code === "auth/invalid-password" ||
                    err.code === "auth/wrong-password"
                ) {
                    setErrMsg(`Error: account ${email} does not exist or password is incorrect`);
                } else {
                    setErrMsg(`Failed to sign in, error: ${JSON.stringify(err)}`);
                }
            });
    };

    return (
        <div className="h-screen grid place-content-center">
            <div style={{alignItems: 'flex-start '}}>
                <text className="TopText">Log in</text>
                <div className="flex flex-1 my-5">
                    {/* <p className="WelcomeText material-icons-outlined mr-5" style={{ color: 'red', fontSize: '32px'}}>
                    {errMsg === '' ? '' : '}
                </p>{' '} */}

                    {errMsg === '' ? '' : <WarningAmberRounded color='error' className='mr-5'/>}
                    <text className="WelcomeText" style={errMsg === '' ? {} : {color: 'red'}}>
                        {' '}
                        {errMsg === '' ? 'Welcome back!' : errMsg}
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
                <div style={{height: 20}}></div>
                <InputLabel>Password</InputLabel>
                <TextField
                    variant="outlined"
                    type={showPW ? 'text' : 'password'}
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
                                        setShowPW(!showPW);
                                    }}
                                >
                                    {showPW ? <VisibilityOutlined style={iconStyle}/> :
                                        <VisibilityOffOutlined/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                ></TextField>

                <p
                    className="my-5"
                    style={{
                        textAlign: 'right',
                        fontSize: '12px',
                        float: 'right',
                        textDecorationLine: 'underline',
                        fontStyle: 'italic',
                        color: '#333333',
                        alignSelf: 'flex-end',
                    }}
                >
                    <text style={{cursor: "pointer"}} onClick={() => navigate("/password-reset")}>
                        Forgot your password?
                    </text>
                </p>

                <Button color="neutral" variant="contained" style={btnStyle} onClick={handleSignIn}>
                    Log in
                </Button>
                <div className="my-2 w-full">
                    <Button
                        color="neutral"
                        variant="outlined"
                        style={btnStyle}
                        onClick={() => navigate('/sign-up')}
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
