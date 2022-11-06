const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <text className="TopText">Sign in</text>
            <br />
            <text className="WelcomeText">Welcome back.</text>
            <br />

            <div style={{ marginTop: '20px' }}>
                <label>Email</label>
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

            <div>
                <label htmlFor="password">Password</label>
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
                <text
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCurrState(AuthState.PasswordReset)}
                >
                    Forgot your password?
                </text>
            </p>

            <br />
            {buttons.signin}
            <br />
            <p className="SwapAuthTextLeft">
                Don't have an account?
                <text
                    className="SwapAuthTextLink"
                    onClick={() => setCurrState(AuthState.SignUp)}
                >
                    Sign up
                </text>
            </p>
            <br />
            {errMsg}
        </div>
    )
}

export default SignIn;
