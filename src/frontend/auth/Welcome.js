import { useNavigate } from "react-router-dom";
import "./auth.css";
import { useState } from "react";
import { Button } from "@mui/material";
import { btnStyle } from "./authStyles";
import logo from "../../graphics/venato-purple.png";
// import generateJobs from '../search/GenerateJobs';

const Welcome = () => {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");

    // const bypassSignIn = () => {
    //     const signInResult = signin('18rem8@queensu.ca', 'Username12345');
    //     if (typeof signInResult === 'string') {
    //         setErrMsg(`Error signing in to admin account: ${signInResult}`);
    //         return;
    //     }
    //
    //     signInResult
    //         .then(() => {
    //             navigate('/home');
    //         })
    //         .catch((err) => {
    //             setErrMsg(`Error signing in to admin account: ${err}`);
    //         });
    // };

    return (
        <div className="AuthMainDiv w-50">
            <img src={logo} alt="" width={200}/>
            <Button
                variant="contained"
                color="neutral"
                style={btnStyle}
                onClick={() => navigate("/sign-in")}
            >
                Log In
            </Button>

            <Button
                variant="contained"
                style={btnStyle}
                color="neutral"
                onClick={() => navigate("/sign-up")}
            >
                Sign Up
            </Button>

            {/*<Button variant="contained" color="neutral" style={btnStyle} onClick={bypassSignIn}>*/}
            {/*    {'Bypass sign-in (dev only)'}*/}
            {/*</Button>*/}
            {/*<br />*/}
            <br/>
            <text style={{color: "red"}}>{errMsg}</text>
        </div>
    );
};

export default Welcome;
