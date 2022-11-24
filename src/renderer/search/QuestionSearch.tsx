import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAsync } from 'react-async-hook';
import { CircularProgress } from '@mui/material';

const QuestionSearch = () => {
    const companies = useAsync(httpsCallable(getFunctions(), 'getAllCompanies'), []);
    const locations = useAsync(httpsCallable(getFunctions(), 'getAllLocations'), []);

    const [company, setCompany] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [jobs, setJobs] = useState<object[]>([]);
    const [errMsg, setErrMsg] = useState<string>('');

    const handleSearch = async () => {
        if ((position?.trim()?.length || 0) === 0 && company === '') {
            setErrMsg('Please enter a position or company');
            return;
        }

        const result = await httpsCallable(getFunctions(), 'jobSearch')({ company, position });

        setJobs(result.data);
        setErrMsg('');
        console.log(`Company: '${company}' Position: '${position}'`);
    };

    return (
        <div>
            {(companies.error || locations.error || companies.loading || locations.loading) && (
                <CircularProgress />
            )}
            {companies.result && locations.result && (
                <div>
                    <br />
                    Interview question search
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
                    <button type="submit" onClick={handleSearch}>
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
                                {`Description: ${job.details.description}`}
                                <br />
                                Interview questions:{' '}
                                <ul>
                                    {job.interviewQuestions.map((question: string) => (
                                        <li>{question}</li>
                                    ))}
                                </ul>
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

export default QuestionSearch;
