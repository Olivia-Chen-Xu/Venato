import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import LoadingButton from "@mui/lab/LoadingButton";
import Search from "@mui/icons-material/Search";
import { Button, Dialog, DialogContent, TextField, InputAdornment } from "@mui/material";
import AppScreen from "../reusable/AppScreen";
import { AlternateEmail, WorkOutline } from "@mui/icons-material";

const QuestionSearch = () => {
    const [query, setQuery] = useState({ company: "", position: "" });
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({});

    const handleSearch = async () => {
        setLoading(true);
        if (query.company.trim() === "" && query.position.trim() === "") {
            setMessage("Please enter a search query");
            setLoading(false);
            return;
        }

        setMessage("Loading questions...");
        const result = await httpsCallable(getFunctions(), "interviewQuestionSearch")(query);

        setQuestions(result.data);
        setLoading(false);
        setMessage("");
    };

    const displayQuestions = () => {
        if (questions.length === 0) {
            return <p align="center">⚠️No jobs found; please try another search.</p>;
        }

        return questions.map((question) => (
            <div className="ml-20">
                <li>
                    <text
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setDialogOpen(true);
                            setCurrentQuestion(question);
                        }}
                    >
                        {question.name}
                    </text>
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

    const inputBoxStyle = { outline: "1px solid black", width: "30%" };
    return (
        <AppScreen title="Interview Question Search">
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
                    label="company"
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
                {dialogOpen && (
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                        <DialogContent
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: 600,
                                alignItems: "center",
                            }}
                        >
                            <p>
                                <strong>
                                    <u>{currentQuestion.name}</u>
                                </strong>
                            </p>
                            <br />

                            {currentQuestion.description}
                            <br />
                            <br />

                            <Button
                                variant="contained"
                                href={`https://www.google.com/search?q=${currentQuestion.name.replaceAll(
                                    " ",
                                    "+"
                                )}`}
                                target={"_blank"}
                            >
                                Search on Google
                            </Button>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AppScreen>
    );
};

export default QuestionSearch;
