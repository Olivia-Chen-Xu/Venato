import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import "../../App.css";
import "./job.css";
import Search from "@mui/icons-material/Search";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, InputAdornment } from "@mui/material";
import bar from "../../images/bar.png";
import PageTitle from "../reusable/PageTitle";
import AppScreen from "../reusable/AppScreen";
import { AlternateEmail, PlaceOutlined, WorkOutline } from "@mui/icons-material";

const JobSearch = () => {
    const [query, setQuery] = useState({ company: "", position: "", location: "" });
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState("");
    const [currJob, setcurrJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        if (query.company.trim() === "" && query.position.trim() === "" && query.location.trim() === "") {
            setMessage("Please enter a search query");
            setLoading(false);
            return;
        }

        setMessage("Loading jobs...");
        const result = await httpsCallable(getFunctions(), "jobSearch")(query);

        setJobs(result.data);
        setcurrJob(result.data[0]);
        setMessage("");
        setLoading(false);
        setHasSearched(true);
    };

    const displayJobs = () => {
        if (!hasSearched) {
            return <p align="center">Select or enter a search category to search</p>;
        }
        if (jobs.length === 0) {
            return <p align="center">⚠️No jobs found; please try another search.</p>;
        }

        return (
            <div className="w-full flex flex-1">
                <div id="res">
                    {jobs.map((job, index) => {
                        if (!job.position || !job.company || !job.location) {
                            return;
                        }
                        return (
                            <div
                                id="job"
                                onClick={() => setcurrJob(job)}
                                className="my-10 rounded-2xl text-white"
                            >
                                <div id="title">
                                    <h1>
                                        <span className="font-bold text-xl">
                                            {" "}
                                            {`${job.position}`}
                                        </span>
                                    </h1>
                                </div>
                                <img src={bar} alt="" className="w-full" />

                                <div className="mt-3">
                                    <h1 className="text-lg align-middle">
                                        <span className="material-icons-outlined">
                                            alternate_email
                                        </span>{" "}
                                        {`${job.company}`}
                                    </h1>
                                </div>
                                <div className="mt-1">
                                    <h1 className="text-lg align-middle">
                                        <span className="material-icons-outlined">location_on</span>{" "}
                                        {`${job.location}`}
                                    </h1>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {currJob && (
                    <div id="top" className="w-full h-fit">
                        <div className="mt-3 ml-5 mr-5 text-white">
                            <h1 className="text-2xl font-bold mb-1">{currJob.position}</h1>
                            <img src={bar} alt="" className="w-full" />
                            <div className="flex mb-2">
                                <div className="w-full text-xl">
                                    <h3>
                                        <span className="mt-1 material-icons-outlined">
                                            alternate_email
                                        </span>{" "}
                                        {currJob.company}
                                    </h3>
                                    <h3>
                                        {" "}
                                        <span className="material-icons-outlined">
                                            location_on
                                        </span>{" "}
                                        {currJob.location}
                                    </h3>
                                </div>
                                <div className="w-full mt-2">
                                    <button id="apply" className="px-5 text-xl">
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="bottom" className="mt-2 h-fit">
                            <div className="mt-5">
                                <h1 className="ml-5 mr-5">Job Details</h1>
                                <br />
                                <h2 className="ml-5 mr-5">{currJob.description}</h2>
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppScreen title="Job Search">
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TextField
                    label="Search job title or keyword"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <WorkOutline />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => {
                        setQuery({ ...query, position: e.target.value });
                    }}
                ></TextField>
                <TextField
                    label="Company"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AlternateEmail></AlternateEmail>
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => {
                        setQuery({ ...query, company: e.target.value });
                    }}
                ></TextField>
                <TextField
                    label="Location"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PlaceOutlined></PlaceOutlined>
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => {
                        setQuery({ ...query, location: e.target.value });
                    }}
                ></TextField>
                <LoadingButton
                    id="searchBtn"
                    onClick={handleSearch}
                    variant="contained"
                    loading={loading}
                    disableElevation
                    endIcon={<Search />}
                >
                    {" "}
                    Search
                </LoadingButton>
            </div>

            <br />
            <div className="grid place-content-center">{message}</div>
            <br />

            {displayJobs()}
        </AppScreen>
    );
};

export default JobSearch;
