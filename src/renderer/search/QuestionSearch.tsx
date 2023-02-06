import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAsync } from 'react-async-hook';
import { CircularProgress, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Search from '@mui/icons-material/Search';

const QuestionSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [questions, setQuestions] = useState<object[]>([]);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        if (query.trim().length === 0) {
            setMessage('Please enter a search query');
            setLoading(false);
            return;
        }

        setMessage('Loading questions...');
        const result = await httpsCallable(getFunctions(), 'interviewQuestionsSearch')(query);

        setQuestions(result.data);
        setLoading(false);
        setMessage('');
        setHasSearched(true);
    };

    const displayQuestions = () => {
        if (!hasSearched) {
            return <p align="center">Select or enter a search category to search</p>;
        }
        if (questions.length === 0) {
            return <p align="center">⚠️No jobs found; please try another search.</p>;
        }

        return questions.map((question) => (
            <div className="ml-20">
                <li>
                    <a
                        href={`https://www.google.com/search?q=${question.name.replaceAll(
                            ' ',
                            '+'
                        )}`}
                        title={question.description}
                    >
                        {question.name}
                    </a>
                </li>
            </div>
            // <div style={{ marginTop: '20px' }}>
            //     <h4>{`Job #${index + 1}:`}</h4>
            //     {`Company: ${job.company}`}
            //     <br />
            //     {`Position: ${job.position}`}
            //     <br />
            //     {`Description: ${job.details.description}`}
            //     <br />
            //     URL: <a href={job.details.url}>{job.details.url}</a>
            //     <br />
            //     <div style={{ width: '100%', float: 'left', marginTop: '10px' }}>
            //         <div style={{ float: 'left' }}>
            //             Interview questions:{' '}
            //             {job.interviewQuestions.map((question: string) => {
            //                 const link = `https://www.google.com/search?q=${question.replaceAll(
            //                     ' ',
            //                     '+'
            //                 )}`;

            //                 return (
            //                     <li>
            //                         <a href={link}>{question}</a>
            //                     </li>
            //                 );
            //             })}
            //         </div>
            //         <div style={{ float: 'left', marginLeft: '5%' }}>
            //             Contacts:{' '}
            //             {job.contacts.map((contact) => (
            //                 <div>
            //                     <li>
            //                         <a href={contact}>{contact}</a>
            //                     </li>
            //                 </div>
            //             ))}
            //         </div>
            //     </div>
            //     <br />
            //     <text style={{ color: 'white' }}>.</text>
            // </div>
        ));
    };

    const inputBoxStyle = { outline: '1px solid black', width: '30%' };
    return (
        <div>
            <div className="grid place-content-center">
                <h1 className="grid place-content-center text-2xl mb-1">
                    Interview Question Search
                </h1>
                <div className="flex flex-1">
                    <div id="search" className="flex flex-1 drop-shadow-xl bg-white">
                        <div>
                            <label htmlFor="position">
                                <input
                                    id="position"
                                    type="email"
                                    name="email"
                                    // value={position}
                                    placeholder="Position"
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
                        {/*            {companies.result.data.map((c) => (*/}
                        {/*                <option value={c}>{c}</option>*/}
                        {/*            ))}*/}
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

            <div>
                {/*

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
            </button> */}
                <br />
                <div className="grid place-content-center">{message}</div>
                <br />
                {displayQuestions()}
            </div>
        </div>
    );
};

export default QuestionSearch;
