const PasswordReset = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
    <div>
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
        {buttons.passwordResetEmail}
        <p>
            <text
                className="SwapAuthTextLink"
                onClick={() => setCurrState(AuthState.SignIn)}
            >
                Sign in
            </text>
        </p>
        <br />
        {errMsg}
        <br />
        {renderEmailSent()}
    </div>
)
}

export default PasswordReset;
