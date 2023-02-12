import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputLabel, TextField, Button } from "@mui/material";
import { passwordResetEmail } from "./auth-functions";
import checkMark from "../../images/checkMark.png";
import { btnStyle, inputStyle } from "./authStyles";
import "./auth.css";
import { getFunctions, httpsCallable } from 'firebase/functions';

const PasswordReset = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errMsg, setErrMsg] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handlePassReset = async () => {
        const passResetResult = await httpsCallable(getFunctions(), 'passwordReset')(email);
        // if (typeof passResetResult === "string") {
        //     setErrMsg(passResetResult.data);
        //     return;
        // }
        //
        // passResetResult
        //     .then(() => {
        //         console.log(`Password reset email sent to ${email}`);
        //
        //         // This isn't an error, but I need to show the message
        //         setIsSubmitted(true);
        //         setErrMsg(`Password reset email sent!`);
        //     })
        //     .catch((e) => {
        //         if (e.code === "auth/user-not-found") {
        //             // When signing up, we have to tell the user if the email is in use
        //             // so there is no point in hiding it here (also makes it harder)
        //             setErrMsg(`No email found, make sure you typed it in correctly`);
        //         } else {
        //             console.log(`Error sending password reset email to ${email}: ${e}`);
        //             setErrMsg(`Error sending password reset email to ${email}`);
        //         }
        //     });

        setErrMsg(passResetResult.data);
    };

    const renderEmailSent = () => {
        if (!isSubmitted) {
            return <></>;
        }

        return (
            <div
                style={{
                    borderRadius: "5%",
                    outline: "2px solid lime",
                    padding: "5px",
                    verticalAlign: "middle",
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

            <br />
            <Button
                color="neutral"
                variant="contained"
                className="auth-button"
                onClick={async () => await handlePassReset()}
            >
                Reset password
            </Button>
            <br />
            <p style={{ alignSelf: "flex-end" }}>
                <text className="SwapAuthTextLink" onClick={() => navigate("/sign-in")}>
                    Sign in
                </text>
            </p>
            <br />
            <text style={{ color: "red" }}>{errMsg}</text>
            <br />
            {renderEmailSent()}
        </div>
    );
};

export default PasswordReset;
