import { useNavigate } from 'react-router-dom';
import './auth.css';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="AuthMainDiv">
            <text className="TopText">Venato</text>
            <br />

            <button type="submit" className="auth-button" onClick={() => navigate('/sign-in')}>
                Sign In
            </button>
            <br />

            <button type="submit" className="auth-button" onClick={() => navigate('/sign-up')}>
                Sign Up
            </button>

            <button type="submit" className="auth-button" onClick={() => navigate('/home')}>
                Bypass sign-in
            </button>
            <br />
        </div>
    );
};

export default Welcome;
