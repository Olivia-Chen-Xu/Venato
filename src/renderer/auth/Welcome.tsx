import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div>
            <text className="TopText">Venato</text>
            <br />

            <button
                type="submit"
                className="auth-button"
                onClick={() => {
                    navigate('/sign-in');
                }}
            >
                Sign In
            </button>
            <br />

            <button
                type="submit"
                className="auth-button"
                onClick={() => {
                    navigate('/sign-up');
                }}
            >
                Sign Up
            </button>
        </div>
    );
};

export default Welcome;
