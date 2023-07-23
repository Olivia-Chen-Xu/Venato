import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import LoadingButton from "@mui/lab/LoadingButton";
import Search from "@mui/icons-material/Search";
import { Button, Dialog, DialogContent, InputAdornment, TextField } from "@mui/material";
import AppScreen from "../reusable/AppScreen";
import { AlternateEmail, WorkOutline } from "@mui/icons-material";

const QuestionSearch = () => {
    const [query, setQuery] = useState({ company: "", position: "" });
    const [questions, setQuestions] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

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
        console.log(questions);
        setLoading(false);
        setMessage("");
        setHasSearched(true);
    };

    const displayQuestions = () => {
        if (hasSearched && questions.length === 0) {
            return <p align="center">⚠️No jobs found; please try another search.</p>;
        }

        return questions.map((question) => (
            <div
                style={{
                    backgroundColor: "white",
                    marginBottom: 20,
                    padding: 40,
                    borderRadius: 8,
                }}
            >
                <div style={{ fontWeight: 500, fontSize: 18 }}>{question.name}</div>
                <div style={{ display: "flex", flexDirection: "row", marginBlock: 20 }}>
                    <Button
                        style={{
                            backgroundColor: "#F2F9FA",
                            borderRadius: 8,
                            fontSize: 13,
                            paddingInline: 15,
                            color: "#003F4B",
                            fontWeight: 400,
                            height: 30,
                        }}
                        startIcon={<WorkOutline></WorkOutline>}
                    >
                        {question.position}
                    </Button>
                    <Button
                        style={{
                            backgroundColor: "#D8CFF3",
                            borderRadius: 8,
                            fontSize: 13,
                            paddingInline: 15,
                            color: "#3F15BB",
                            fontWeight: 400,
                            marginInlineStart: 10,
                            height: 30,
                        }}
                        startIcon={<AlternateEmail></AlternateEmail>}
                    >
                        {question.company}
                    </Button>
                </div>
                <div>{question.description}</div>
            </div>
        ));
    };

    const inputBoxStyle = { outline: "1px solid black", width: "30%" };
    return (
        <AppScreen title="Find interview questions">
            <div
                className="mx-10"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                }}
            >
                <TextField
                    label="Search job title or keyword"
                    style={{ width: "60%" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <WorkOutline/>
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => {
                        setQuery({ ...query, position: e.target.value });
                    }}
                ></TextField>
                <TextField
                    label="company"
                    style={{ width: "30%" }}
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
                    endIcon={<Search/>}
                    style={{ height: 56 }}
                >
                    {" "}
                    Search
                </LoadingButton>
            </div>

            <div className="mx-10">
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
                <br></br>
                <div className="grid place-content-center">{message}</div>
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
                            <br/>

                            {currentQuestion.description}
                            <br/>
                            <br/>

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
