import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAsync } from 'react-async-hook';

const SearchBar = () => {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState<object[]>([]);

    const companies = useAsync(httpsCallable(getFunctions(), 'getAllCompanies'), []);
    const locations = useAsync(httpsCallable(getFunctions(), 'getAllLocations'), []);

    const handleSearch = async () => {
        const result = await httpsCallable(
            getFunctions(),
            'jobSearch'
        )({ company, position, location });

        console.log(JSON.stringify(result, null, 4));
        setJobs(result.data);
    };

    return (
        <div>
            {(companies.error || locations.error || companies.loading || locations.loading) && (
                <div>Loading...</div>
            )}
            {companies.result && locations.result && (
                <div>
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
                            <option />
                            {companies.result.data.map((c) => (
                                <option value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    <label htmlFor="location">
                        Location:
                        <select name="location" onChange={(e) => setLocation(e.target.value)}>
                            <option />
                            {locations.result.data.map((c) => (
                                <option value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    <button type="submit" onClick={handleSearch}>
                        Search
                    </button>
                    <br />

                    {jobs.map((job: object, index: number) => {
                        return (
                            <div>
                                {`Job #${index + 1}:`}
                                <br />
                                {`Company: ${job.company}`}
                                <br />
                                {`Position: ${job.position}`}
                                <br />
                                {`Location: ${job.location}`}
                                <br />
                                {`Description: ${job.details.description}`}
                                <br />
                                Url: <a href={job.details.url}>{job.details.url}</a>
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

export default SearchBar;
