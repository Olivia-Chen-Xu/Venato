import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAsync } from 'react-async-hook';
import { CircularProgress } from '@mui/material';

const JobSearch = () => {
    const companies = useAsync(httpsCallable(getFunctions(), 'getAllCompanies'), []);
    const locations = useAsync(httpsCallable(getFunctions(), 'getAllLocations'), []);

    const [company, setCompany] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [jobs, setJobs] = useState<object[]>([]);
    const [errMsg, setErrMsg] = useState<string>('');

    const handleSearch = async () => {
        if ((position?.trim()?.length || 0) === 0 && company === '' && location === '') {
            setErrMsg('Please enter a position, company, or location');
            return;
        }

        const result = await httpsCallable(
            getFunctions(),
            'jobSearch'
        )({ company, position, location });

        setJobs(result.data);
        setErrMsg('');
        console.log(`Company: '${company}' Position: '${position}' Location: '${location}'`);
    };

    return (
        <div>
            {(companies.error || locations.error || companies.loading || locations.loading) && (
                <CircularProgress />
            )}
            {companies.result && locations.result && (
                <div>
                    <br />
                    {isJobSearch ? 'Job search' : 'Interview question search'}
                    <br />

                    <label htmlFor="position">
                        Position
                        <input
                            type="email"
                            name="email"
                            value={position}
                            placeholder=""
                            onChange={(e) => {
                                setPosition(e.target.value);
                            }}
                        />
                    </label>

                    <label htmlFor="company">
                        Company:
                        <select name="company" onChange={(e) => setCompany(e.target.value)}>
                            <option value="" />
                            {companies.result.data.map((c) => (
                                <option value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    <label htmlFor="location">
                        Location:
                        <select name="location" onChange={(e) => setLocation(e.target.value)}>
                            <option value="" />
                            {locations.result.data.map((c) => (
                                <option value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="submit"
                        onClick={handleSearch}
                        style={{ outline: '1px solid black', borderRadius: '2px' }}
                    >
                        Search
                    </button>
                    <br />
                    {errMsg}
                    <br />

                    {jobs.map((job: object, index: number) => {
                        return (
                            <div>
                                <h4>{`Job #${index + 1}:`}</h4>
                                {`Company: ${job.company}`}
                                <br />
                                {`Position: ${job.position}`}
                                <br />
                                {`Location: ${job.location}`}
                                <br />
                                {`Description: ${job.details.description}`}
                                <br />
                                URL: <a href={job.details.url}>{job.details.url}</a>
                                <br />
                                Contacts:{' '}
                                {job.contacts.map((contact) => (
                                    <div>
                                        <a href={contact}>{contact}</a>
                                        <br />
                                    </div>
                                ))}
                                <br />
                                <br />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default JobSearch;
