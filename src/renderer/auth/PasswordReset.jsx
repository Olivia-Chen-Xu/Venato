import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordResetEmail } from './auth-functions';
import checkMark from '../../../assets/checkMark.png';
import './auth.css';

const PasswordReset = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handlePassReset = () => {
        const passResetResult = passwordResetEmail(email);
        if (typeof passResetResult === 'string') {
            setErrMsg(passResetResult);
            return;
        }

        passResetResult
            // eslint-disable-next-line promise/always-return
            .then(() => {
                console.log(`Password reset email sent to ${email}`);

                // This isn't an error, but I need to show the message
                setIsSubmitted(true);
                setErrMsg(`Password reset email sent!`);
            })
            .catch((e) => {
                if (e.code === 'auth/user-not-found') {
                    // When signing up, we have to tell the user if the email is in use
                    // so there is no point in hiding it here (also makes it harder)
                    setErrMsg(`No email found, make sure you typed it in correctly`);
                } else {
                    console.log(`Error sending password reset email to ${email}: ${e}`);
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
                <img width="20" src={checkMark} alt="Green check mark" />‎ Email verification sent!
            </div>
        );
    };

    return (
        <div className="AuthMainDiv">
            <text className="TopText">Password reset</text>
            <br />
            <br />

            <div>
                <label htmlFor="email">Email</label>
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
            </div>

            <br />
            <button type="submit" className="auth-button" onClick={handlePassReset}>
                Reset password
            </button>
            <p>
                <text className="SwapAuthTextLink" onClick={() => navigate('/sign-in')}>
                    Sign in
                </text>
            </p>
            <br />
            {errMsg}
            <br />
            {renderEmailSent()}
        </div>
    );
};

export default PasswordReset;
