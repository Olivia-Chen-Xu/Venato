import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, InputLabel, TextField } from '@mui/material';
import { passwordResetEmail } from './auth-functions';
import { btnStyle, inputStyle } from './authStyles';
import './auth.css';
import { WarningAmberRounded } from '@mui/icons-material';
import { getFunctions, httpsCallable } from "firebase/functions";

const PasswordReset = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handlePassReset = () => {
        const x = httpsCallable(getFunctions(), 'passwordReset')(email)
            .then(() => {
                console.log(`Password reset email sent to ${email}`);

                // This isn't an error, but I need to show the message
                setIsSubmitted(true);
                setErrMsg(`Password reset email sent!`);
            })
            .catch((err) => {
                if (err.code === 'auth/user-not-found') {
                    // We have to let the user know if the email is in use when signing up anyway
                    // So this just makes it easier for the user
                    setErrMsg(`No email found, make sure you typed it in correctly`);
                } else {
                    console.log(`Error sending password reset email to ${email}: ${err}`);
                    setErrMsg(`Error sending password reset email to ${email}`);
                }
            });
    };

    const renderEmailSent = () => {
        if (!isSubmitted) {
            return <></>;
        }

        return (
            <div
                style={{
                    borderRadius: '5%',
                    outline: '2px solid lime',
                    padding: '5px',
                    verticalAlign: 'middle',
                }}
            >
                {/* The LRM is an invisible character to get the spacing right */}
                <img width="20" src={checkMark} alt="Green check mark"/>‎ Email verification sent!
            </div>
        );
    };

    return (
        <>
            {!isSubmitted && (
                <div className="AuthMainDiv">
                    <text className="TopText">Password reset</text>
                    <br/>
                    <div className="flex flex-1">
                        {errMsg === '' ? '' : <WarningAmberRounded color="error" className="mr-5"/>}
                        <text className="WelcomeText" style={errMsg === '' ? {} : { color: 'red' }}>
                            {errMsg === '' ? '' : errMsg}
                        </text>
                    </div>
                    <br/>
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

                    <br/>
                    <div className="my-2 w-full">
                        <Button
                            color="neutral"
                            variant="contained"
                            style={btnStyle}
                            onClick={handlePassReset}
                        >
                            Reset password
                        </Button>
                    </div>
                    <div className="my-2 w-full">
                        <Button
                            color="neutral"
                            variant="outlined"
                            style={btnStyle}
                            onClick={() => navigate('/sign-in')}
                        >
                            Return to Log In
                        </Button>
                    </div>
                    <br/>
                </div>
            )}
            {
                isSubmitted && (
                    <div className='h-screen grid place-content-center'>
                        <div>
                            <h1 className='text-xl'>We’ve sent the verification to your email</h1>
                            <div className="mt-10 w-full">
                                <Button
                                    color="neutral"
                                    variant="contained"
                                    style={btnStyle}
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setErrMsg('')
                                    }}
                                >
                                    Resend
                                </Button>
                                <div className="my-2 w-full">
                                    <Button
                                        color="neutral"
                                        variant="outlined"
                                        style={btnStyle}
                                        onClick={() => navigate('/sign-in')}
                                    >
                                        Return to Log In
                                    </Button>
                                </div>
                            </div>
                            <br/>
                        </div>
                    </div>
                )
            }


        </>
    );
};

export default PasswordReset;
