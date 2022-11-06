import { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { signup } from './auth-functions';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const nav = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setErrMsg('Passwords do not match');
            return;
        }

        const signupResult = signup(email, password);
        if (typeof signupResult === 'string') {
            setErrMsg(signupResult);
            return;
        }

        signupResult
            // eslint-disable-next-line promise/always-return
            .then((r) => {
                console.log(
                    `Sign up success (check your email):` +
                        `\nEmail: ${JSON.stringify(r.user.email)}` +
                        `\nID: ${JSON.stringify(r.user.uid)}`
                );
                console.log(JSON.stringify(r));
                // eslint-disable-next-line promise/no-nesting
                sendEmailVerification(r.user)
                    // eslint-disable-next-line promise/always-return
                    .then(() => {
                        console.log(`Verification email sent successfully to ${r.user.email}`);
                        // This isn't an error, but I need to show the message
                        setErrMsg(`Please check your email`);
                        nav('/signin');
                    })
                    .catch((e) =>
                        console.error(`Error sending verification email to ${r.user.email}: ${e}`)
                    );
            })
            .catch((err) => {
                console.log(`Error creating user: ${err}`);
                if (err.code === 'auth/email-already-in-use') {
                    setErrMsg('The email you entered is already in use; please enter another one');
                } else {
                    setErrMsg('Failed to create user');
                }
            });
    };

    return (
        <div>
            <text className="TopText">Sign up</text>
            <br />
            <text className="WelcomeText">Welcome!</text>
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

            <div>
                <label htmlFor="passwordconfirm">
                    Confirm password
                    <input
                        className="InputForms"
                        type="password"
                        name="passwordconfirm"
                        value={confirmPassword}
                        placeholder="••••••••••"
                        required
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                    />
                </label>
            </div>

            <br />
            <button type="submit" className="auth-button" onClick={handleSignup}>
                Sign up
            </button>
            <br />
            <p className="SwapAuthTextLeft">
                Already have an account?
                <text className="SwapAuthTextLink" onClick={() => {}}> // TODO
                    Sign in
                </text>
            </p>
            <br />
            {errMsg}
        </div>
    );
};

export default SignUp;
