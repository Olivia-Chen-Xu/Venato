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
    const [message, setMessage] = useState<string>('');

    const handleSearch = async () => {
        if ((position?.trim()?.length || 0) === 0 && company === '') {
            setMessage('Please enter a position or company');
            return;
        }

        setMessage('Loading questions...');
        const result = await httpsCallable(getFunctions(), 'jobSearch')({ company, position });

        setJobs(result.data);
        setMessage('');
        console.log(`Company: '${company}' Position: '${position}'`);
    };

    const clearSearch = () => {
        setCompany('');
        setPosition('');
        setJobs([]);
        setMessage('');
    };

    const getQuestionLink = (question: string) => {
        // const makeHttpObject = () => {
        //     try {
        //         return new XMLHttpRequest();
        //     } catch (error) {}
        //     // try {
        //     //     return new ActiveXObject('Msxml2.XMLHTTP');
        //     // } catch (error) {}
        //     // try {
        //     //     return new ActiveXObject('Microsoft.XMLHTTP');
        //     // } catch (error) {}
        //
        //     throw new Error('Could not create HTTP request object.');
        // };

        const searchURL = `https://en.wikipedia.org/wiki/${question
            .trim()
            .toLowerCase()
            .replace(/(^\w)/g, (m: string) => m.toUpperCase())
            .replace(' ', '_')}`;

        // const request = makeHttpObject();
        // request.open('GET', searchURL, true);
        // request.send(null);
        // request.onreadystatechange = () => {
        //     if (request.readyState === 4) console.log(request.responseText);
        // };
        return searchURL;
    };

    const inputBoxStyle = { outline: '1px solid black', width: '30%' };
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
                            style={inputBoxStyle}
                            onChange={(e) => {
                                setPosition(e.target.value);
                            }}
                        />
                    </label>
                    <label htmlFor="company">
                        Company:{' '}
                        <select
                            name="company"
                            onChange={(e) => setCompany(e.target.value)}
                            style={{ outline: '1px solid black', borderRadius: '2px' }}
                        >
                            <option value="" />
                            {companies.result.data.map((c) => (
                                <option
                                    style={{ outline: '1px solid black', borderRadius: '2px' }}
                                    value={c}
                                >
                                    {c}
                                </option>
                            ))}
                        </select>
                    </label>
                    {'  '}
                    <button
                        type="submit"
                        onClick={handleSearch}
                        style={{ outline: '1px solid black', borderRadius: '2px' }}
                    >
                        Search
                    </button>
                    <button
                        type="submit"
                        onClick={clearSearch}
                        style={{
                            outline: '1px solid black',
                            borderRadius: '2px',
                            marginLeft: '1em',
                        }}
                    >
                        Clear search
                    </button>
                    <br />
                    {message}
                    <br />
                    {jobs.map((job: object, index: number) => {
                        return (
                            <div style={{ marginTop: '20px' }}>
                                <h4>{`Job #${index + 1}:`}</h4>
                                {`Company: ${job.company}`}
                                <br />
                                {`Position: ${job.position}`}
                                <br />
                                {`Description: ${job.details.description}`}
                                <br />
                                URL: <a href={job.details.url}>{job.details.url}</a>
                                <br />
                                <div style={{ width: '100%', float: 'left', marginTop: '10px' }}>
                                    <div style={{ float: 'left' }}>
                                        Interview questions:{' '}
                                        {job.interviewQuestions.map((question: string) => {
                                            const link = getQuestionLink(question);
                                            return (
                                                <li>
                                                    <a href={link}>{question}</a>
                                                </li>
                                            );
                                        })}
                                    </div>
                                    <div style={{ float: 'left', marginLeft: '5%' }}>
                                        Contacts:{' '}
                                        {job.contacts.map((contact) => (
                                            <div>
                                                <li>
                                                    <a href={contact}>{contact}</a>
                                                </li>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <br />
                                <text style={{ color: 'white' }}>.</text>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default QuestionSearch;
