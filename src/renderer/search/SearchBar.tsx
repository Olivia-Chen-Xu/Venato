import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAsync } from 'react-async-hook';
import { CircularProgress } from '@mui/material';
import '../App.css';
import './job.css';
import bar from '../../../assets/bar.png';

const jobView = (job: object) => {
    return <h1>TEST</h1>;
};

const SearchBar = () => {
    let elem;
    const [company, setCompany] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [jobs, setJobs] = useState<object[]>([]);
    const [isJobSearch, setIsJobSearch] = useState<boolean>(true);
    const [errMsg, setErrMsg] = useState<string>('');
    const [currJob, setcurrJob] = useState<any>(null);

    const companies = useAsync(httpsCallable(getFunctions(), 'getAllCompanies'), []);
    const locations = useAsync(httpsCallable(getFunctions(), 'getAllLocations'), []);
    const handleJob = (job: object) => {
        setcurrJob(job);
        elem = jobView(job);
        console.log(currJob);
    };

    const handleSearch = async () => {
        if (
            (position?.trim()?.length || 0) === 0 &&
            company === '' &&
            (!isJobSearch || (isJobSearch && location === ''))
        ) {
            setErrMsg('Please enter a position, company, or location');
            return;
        }

        const result = await httpsCallable(
            getFunctions(),
            'jobSearch'
        )(isJobSearch ? { company, position, location } : { company, position });

        setJobs(result.data);
        setErrMsg('');
        console.log(`Company: '${company}' Position: '${position}' Location: '${location}'`);
    };

    return (
        <div className="ml-5 mr-5">
            <div className="grid place-content-center">
                {(companies.error || locations.error || companies.loading || locations.loading) && (
                    <CircularProgress></CircularProgress>
                )}
            </div>
            {companies.result && locations.result && (
                <div>
                    <div className="flex flex-1 drop-shadow-xl">
                        <div>
                            <label htmlFor="position">
                                <input
                                    id="position"
                                    type="email"
                                    name="email"
                                    value={position}
                                    placeholder="Position"
                                    onChange={(e) => {
                                        setPosition(e.target.value);
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="company">
                                <select
                                    id='company'
                                    name="company"
                                    onChange={(e) => setCompany(e.target.value)}
                                >
                                    <option value="" selected>
                                        Company
                                    </option>
                                    {companies.result.data.map((c) => (
                                        <option value={c}>{c}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="location">
                                <select
                                    id='location'
                                    name="location"
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="" selected>
                                        Location
                                    </option>
                                    {locations.result.data.map((c) => (
                                        <option value={c}>{c}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <button type="submit" onClick={handleSearch}>
                        Search
                    </button>
                    <br />
                    {errMsg}
                    <br />

                    <div className="w-full flex flex-1">
                        <div id="res">
                            {jobs.map((job: object, index: number) => {
                                return (
                                    <div>
                                        <div
                                            id="job"
                                            onClick={() => handleJob(job)}
                                            className="my-10 rounded-2xl text-white"
                                        >
                                            <div id="title">
                                                <h1>
                                                    <span className="font-bold text-xl">
                                                        {' '}
                                                        {`${job.position}`}
                                                    </span>
                                                </h1>
                                            </div>
                                            <img
                                                src={bar}
                                                alt=""
                                                className="w-full"
                                            />

                                            <div className="mt-3">
                                                <h1 className="text-lg align-middle">
                                                    <span className="material-icons-outlined">
                                                        alternate_email
                                                    </span> {' '}
                                                    {`${job.company}`}
                                                </h1>
                                            </div>
                                            <div className="mt-1">
                                                <h1 className="text-lg align-middle">
                                                    <span className="material-icons-outlined">
                                                        location_on
                                                    </span>{' '}
                                                    Zoom
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div id="top" className="w-full">
                            {elem}
                            <div className="mt-3 ml-5 mr-5 text-white">
                                <h1 className="text-2xl font-bold mb-1">Job title</h1>
                                <img src={bar} alt="" className="w-full" />
                                <div className="flex mb-2">
                                    <div className="w-full text-xl">
                                        <h3>
                                            <span className="mt-1 material-icons-outlined">
                                                alternate_email
                                            </span>{' '}
                                            Company
                                        </h3>
                                        <h3>
                                            {' '}
                                            <span className="material-icons-outlined">
                                                location_on
                                            </span>{' '}
                                            Location
                                        </h3>
                                    </div>
                                    <div className="w-full mt-2">
                                        <button id="apply" className="px-5 text-xl">
                                            Apply Now
                                        </button>
                                    </div>
                                    {/* .comapany, .position, .location, .details.description */}
                                </div>
                            </div>
                            <div id="bottom" className='h-full'>
                                <div className="mt-5">
                                    <h1 className="ml-5 mr-5">Job Details</h1>
                                    <br />
                                    <h2 className="ml-5 mr-5">Job Description</h2>
                                    <br />
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
