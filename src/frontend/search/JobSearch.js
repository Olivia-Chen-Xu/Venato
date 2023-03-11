import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import "../../App.css";
import "./job.css";
import Search from "@mui/icons-material/Search";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField, InputAdornment, Button } from "@mui/material";
import bar from "../../images/bar.png";
import PageTitle from "../reusable/PageTitle";
import AppScreen from "../reusable/AppScreen";
import { AlternateEmail, PlaceOutlined, WorkOutline, OutboundOutlined } from "@mui/icons-material";

const JobSearch = () => {
    const [query, setQuery] = useState({ company: "", position: "", location: "" });
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState("");
    const [currJob, setcurrJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        if (
            query.company.trim() === "" &&
            query.position.trim() === "" &&
            query.location.trim() === ""
        ) {
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
        if (hasSearched && jobs.length === 0) {
            return <p align="center">⚠️No jobs found; please try another search</p>;
        }

        return (
            <div className="flex flex-1 mx-10">
                <div style={{ width: 400 }}>
                    {jobs.map((job, index) => {
                        if (!job.position || !job.company || !job.location) {
                            return;
                        }
                        return (
                            <div
                                id="job"
                                onClick={() => setcurrJob(job)}
                                className="pt-3 pl-5 pr-5 text-black flex flex-col"
                                style={{
                                    height: 94,
                                    backgroundColor: "white",
                                    borderRadius: 8,
                                    justifyContent: "space-around",
                                    padding: 10,
                                    paddingInline: 20,
                                    borderColor: "#E0E0E0",
                                    borderWidth: 1,
                                }}
                            >
                                <div style={{ fontSize: 15 }}>{job.company}</div>
                                <div style={{ fontSize: 16, fontWeight: 500 }}>{job.position}</div>
                                <div className="flex w-full items-center" style={{ fontSize: 13 }}>
                                    {" "}
                                    <span
                                        className="material-icons-outlined"
                                        style={{ fontSize: 15 }}
                                    >
                                        location_on
                                    </span>{" "}
                                    {job.location}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {currJob && (
                    <div className="w-full">
                        <div
                            className="pt-3 pl-5 pr-5 text-white flex flex-col search-bg"
                            style={{
                                height: 94,
                                backgroundColor: "#7F5BEB",
                                borderRadius: 8,
                                justifyContent: "space-around",
                                padding: 10,
                                paddingInline: 20,
                                position: "relative",
                            }}
                        >
                            <div style={{ fontSize: 15 }}>{currJob.company}</div>
                            <div style={{ fontSize: 16, fontWeight: 500 }}>{currJob.position}</div>
                            <div className="flex w-full items-center" style={{ fontSize: 13 }}>
                                {" "}
                                <span className="material-icons-outlined" style={{ fontSize: 15 }}>
                                    location_on
                                </span>{" "}
                                {currJob.location}
                            </div>
                            <Button
                                variant="outlined"
                                endIcon={<OutboundOutlined></OutboundOutlined>}
                                style={{
                                    position: "absolute",
                                    backgroundColor: "white",
                                    right: 20,
                                    borderRadius: 8,
                                }}
                            >
                                Apply now
                            </Button>
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
        <AppScreen title="Find your next job">
            <div
                className="mx-10"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                    style={{ width: "50%" }}
                ></TextField>
                <TextField
                    label="Company"
                    style={{ width: "20%" }}
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
                    style={{ width: "20%" }}
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
                    startIcon={<Search />}
                    style={{ height: 56 }}
                >
                    {" "}
                    Search
                </LoadingButton>
            </div>

            <div className="grid place-content-center">{message}</div>
            <br />

            {displayJobs()}
        </AppScreen>
    );
};

export default JobSearch;
