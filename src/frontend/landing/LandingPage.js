import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import track from "../../images/landing/track.png";
import logo from "../../images/venato-purple.png";
import whiteLogo from "../../images/logo-white.png";
import discover from "../../images/landing/discover.png";
import prepare from "../../images/landing/prepare.png";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div id="flex flex-col w-full gap-3">
            <header className="flex w-full shadow-xl p-4">
                <div className="flex w-full">
                    <img src={logo} className="object-contain object-left h-[5vh]" />
                    <span className="ml-auto flex justify-center align-items-center">
                        <Button
                            onClick={() => navigate("/welcome")}
                            color="neutral"
                            variant="contained"
                        >
                            Sign In
                        </Button>
                    </span>
                </div>
            </header>

            <Box className="w-full flex flex-col gap-20 mt-20">
                <Box className="flex justify-center w-full">
                    <div
                        className="blob-header flex flex-col text-white bg-purple p-10"
                        style={
                            {
                                //background: 'linear-gradient(90deg, #7F5BEB 0%, #926EFE 100%)'
                            }
                        }
                    >
                        <img
                            src={whiteLogo}
                            className="object-contain object-left h-[15vh] self-center"
                        />
                        <span className="self-center">Everything you need to secure a job.</span>
                    </div>
                </Box>

                <Box className="flex justify-center w-full">
                    <span className="self-center mx-40 font-extrabold text-4xl">
                        Track your applications.
                    </span>
                    <span>
                        <img src={track} className="self-center" />
                    </span>
                </Box>
                <Box className="flex justify-center w-full">
                    <img src={discover} className="self-center" />
                    <span className="self-center mx-40 font-extrabold text-4xl">
                        Discover new jobs.
                    </span>
                </Box>
                <Box className="flex justify-center w-full">
                    <span className="self-center mx-40 font-extrabold text-4xl">
                        Prepare for your interviews.
                    </span>
                    <img src={prepare} className="self-center" />
                </Box>
            </Box>
        </div>
    );
}
