import { useNavigate } from 'react-router-dom';
import './auth.css';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { signin } from './auth-functions';
import { auth } from '../../config/firebase';

const SignIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleSignIn = () => {
        const signInResult = signin(email, password);
        if (typeof signInResult === 'string') {
            setErrMsg(signInResult);
            return;
        }

        signInResult
            .then((r) => {
                console.log(JSON.stringify(r));
                // eslint-disable-next-line promise/always-return
                if (!r.user.emailVerified) {
                    setErrMsg('You need to verify your email first');
                    signOut(auth);
                } else {
                    console.log(`Successfully signed in user: ${email}, ${password}`);
                    // clearData();
                    navigate('/home');
                }
            })
            .catch((err) => {
                console.log(`Error signing in: ${JSON.stringify(err)}`);
                if (
                    err.code === 'auth/user-not-found' ||
                    err.code === 'auth/invalid-password' ||
                    err.code === 'auth/wrong-password'
                ) {
                    setErrMsg(`Error: account ${email} does not exist or password is incorrect`);
                } else {
                    setErrMsg(`Failed to sign in, error: ${JSON.stringify(err)}`);
                }
            });
    };

    return (
        <div className="AuthMainDiv">
            <text className="TopText">Sign in</text>
            <br />
            <text className="WelcomeText">Welcome back.</text>
            <br />

            <div style={{ marginTop: '20px' }}>
                <label htmlFor="email">
                    Email
                    <input
                        className="InputForms"
                        type="email"
                        name="email"
                        value={email}
                        placeholder="john.smith@gmail.com"
                        required
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </label>
            </div>

            <div>
                <label htmlFor="password">
                    Password
                    <input
                        className="InputForms"
                        type="password"
                        name="password"
                        value={password}
                        placeholder="••••••••••"
                        required
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </label>
            </div>

            <p
                style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    float: 'right',
                    textDecorationLine: 'underline',
                    fontStyle: 'italic',
                    color: '#676767',
                }}
            >
                <text style={{ cursor: 'pointer' }} onClick={() => navigate('/password-reset')}>
                    Forgot your password?
                </text>
            </p>

            <br />
            <button type="submit" className="auth-button" onClick={handleSignIn}>
                Sign in
            </button>
            <br />
            <p className="SwapAuthTextLeft">
                Don't have an account?
                <text className="SwapAuthTextLink" onClick={() => navigate('/sign-up')}>
                    Sign up
                </text>
            </p>
            <br />
            {errMsg}
        </div>
    );
};

export default SignIn;
