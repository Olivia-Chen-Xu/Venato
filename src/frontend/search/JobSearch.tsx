import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import '../App.css';
import './job.css';
import Search from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import bar from '../../../assets/bar.png';

const SearchBar = () => {
    const [query, setQuery] = useState<string>('');
    const [jobs, setJobs] = useState<object[]>([]);
    const [message, setMessage] = useState<string>('');
    const [currJob, setcurrJob] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        if (query.trim().length === 0) {
            setMessage('Please enter a search query');
            setLoading(false);
            return;
        }

        setMessage('Loading jobs...');
        const result = await httpsCallable(getFunctions(), 'jobSearch')({ searchAll: query });

        setJobs(result.data);
        setcurrJob(result.data[0]);
        setMessage('');
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
                    {jobs.map((job: object, index: number) => {
                        return (
                            <div
                                id="job"
                                onClick={() => setcurrJob(job)}
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
                                <img src={bar} alt="" className="w-full" />

                                <div className="mt-3">
                                    <h1 className="text-lg align-middle">
                                        <span className="material-icons-outlined">
                                            alternate_email
                                        </span>{' '}
                                        {`${job.company}`}
                                    </h1>
                                </div>
                                <div className="mt-1">
                                    <h1 className="text-lg align-middle">
                                        <span className="material-icons-outlined">location_on</span>{' '}
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
                                        </span>{' '}
                                        {currJob.company}
                                    </h3>
                                    <h3>
                                        {' '}
                                        <span className="material-icons-outlined">
                                            location_on
                                        </span>{' '}
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
                                <h2 className="ml-5 mr-5">job description</h2>
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
        <div className="ml-5 mr-5">
            <div className="grid place-content-center">
                <h1 className="grid place-content-center text-2xl mb-1">Job Search</h1>
                <div className="flex flex-1">
                    <div id="search" className="flex flex-1 drop-shadow-xl bg-white">
                        <div>
                            <label htmlFor="position">
                                <input
                                    id="position"
                                    type="email"
                                    name="email"
                                    // value={position}
                                    placeholder="Search by position, location or company"
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                    }}
                                />
                            </label>
                        </div>
                        {/*<div>*/}
                        {/*    <label htmlFor="company">*/}
                        {/*        <select*/}
                        {/*            id="company"*/}
                        {/*            name="company"*/}
                        {/*            select*/}
                        {/*            label="Company"*/}
                        {/*            value={company}*/}
                        {/*            onChange={(e) => setCompany(e.target.value)}*/}
                        {/*        >*/}
                        {/*            <option value="" selected>*/}
                        {/*                Company*/}
                        {/*            </option>*/}
                        {/*        </select>*/}
                        {/*    </label>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <label htmlFor="location">*/}
                        {/*        <select*/}
                        {/*            select*/}
                        {/*            sx={{*/}
                        {/*                height: 20,*/}
                        {/*            }}*/}
                        {/*            id="location"*/}
                        {/*            name="location"*/}
                        {/*            label="Location"*/}
                        {/*            value={location}*/}
                        {/*            onChange={(e) => setLocation(e.target.value)}*/}
                        {/*        >*/}
                        {/*            <option value="" selected>*/}
                        {/*                Location*/}
                        {/*            </option>*/}
                        {/*        </select>*/}
                        {/*    </label>*/}
                        {/*</div>*/}
                    </div>
                    <div className="h-full bg-transparent align-middle">
                        <LoadingButton
                            id="searchBtn"
                            onClick={handleSearch}
                            variant="contained"
                            loading={loading}
                            disableElevation
                            size="small"
                            sx={{
                                height: '80%',
                            }}
                            endIcon={<Search />}
                        >
                            {' '}
                            Search
                        </LoadingButton>
                    </div>
                </div>
            </div>

            <br />
            <div className="grid place-content-center">{message}</div>
            <br />

            {displayJobs()}
        </div>
    );
};

export default SearchBar;
