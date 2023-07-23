import {useNavigate} from "react-router-dom";
import {useAsync} from "react-async-hook";
import {getFunctions, httpsCallable} from "firebase/functions";
import {Box, Button, Dialog, DialogContent, TextField} from "@mui/material";
import {
    Add,
    East,
    KeyboardDoubleArrowRight,
    QueryBuilder,
    SkateboardingOutlined,
} from "@mui/icons-material";
import {useState} from "react";
import JobDialog from "../reusable/JobDialog";
import AppScreen from "../reusable/AppScreen";
import EventCard from "./components/EventCard";

const Homepage = () => {
    const nav = useNavigate();
    const userData = useAsync(httpsCallable(getFunctions(), "getHomepageData"), []);

    // For adding a new board
    const [dialogOpen, setDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState("");

    // For opening a job (when you click a deadline)
    const [modalOpen, setModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);

    if (userData.error) {
        return <p>Error: {userData.error.message}</p>;
    }

    const addNewBoard = async () => {
        if (boardName === '') return;

        const boardData = await httpsCallable(getFunctions(), 'addBoard')(boardName);
        userData.result.data.boards.push(boardData.data);
        setDialogOpen(false);
    };

    const renderBoards = (max) => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        return userData.result.data.boards.slice(0, max).map((board) => (
            <Button
                color="white"
                variant="contained"
                onClick={() => nav("/kanban", {state: {boardId: board.id}})}
                className="flex-1 space-between"
                fullWidth
                disableElevation
                sx={{
                    justifyContent: "flex-start",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    padding: "1rem 1.5rem",
                }}
            >
                <Box>
                    <SkateboardingOutlined color="primary" fontSize="medium" className="mr-4"/>
                    {board.name}
                </Box>
            </Button>
        ));
    };

    const renderEvents = (max) => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        return userData.result.data.events.slice(0, max).map((event) => (
            <EventCard
                title={
                    <>
                        <h1 className="text-3xl">{event.title}</h1>

                        <h1 className="text-md align-middle font-extralight">@ {event.company}</h1>
                    </>
                }
                bgColor="#7F5BEB"
                accentColor="white"
                textColor="white"
                background="blob-bg"
                handleClick={async (mouseEvent) => {
                    const job = await httpsCallable(
                        getFunctions(),
                        "getJobData"
                    )(event.jobId).then((result) => result.data);
                    setCurrentJob(job);
                    setModalOpen(true);
                }}
                footer={
                    <>
                        <h1 className="text-md">
                            {new Date(event.date * 1000).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </h1>
                        <h1 className="text-md flex items-center flex-wrap">
                            <QueryBuilder/>
                            <span className="ml-1 font-medium">
                                {new Date(event.date * 1000).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </h1>
                    </>
                }
            />
        ));
    };

    const renderGettingStarted = () => {
        const getStarted = [
            {
                title: "Track",
                content: "Track all of your applications in one place!",
                link: "/chooseKanban",
            },
            {
                title: "Discover",
                content: "Find your next dream job with our search functionality",
                link: "/job",
            },
            {
                title: "Prepare",
                content: "Check out what sort of interview questions you might get",
                link: "/questions",
            },
        ];

        return (
            <Box className="p-3 grid grid-flow-row md:grid-flow-col md:flex-row gap-3">
                {getStarted.map(({title, content, link}) => (
                    <Button
                        color="white"
                        variant="contained"
                        className="flex-1 space-between flex-col"
                        disableElevation
                        sx={{
                            alignContent: "flex-start",
                            border: "1px solid #E0E0E0",
                            borderRadius: "8px",
                            padding: "1rem 1.5rem",
                        }}
                        onClick={() => nav(link)}
                    >
                        <h1 className="self-start text-neutral-800 text-l mb-4">{title}</h1>
                        <Box className="flex items-center gap-3">
                            <East color="neutral"/>
                            <div className="text-left max-w-[75%]">{content}</div>
                        </Box>
                    </Button>
                ))}
            </Box>
        );
    };

    return (
        <>
            <AppScreen isLoading={userData.loading} title="Welcome Back!">
                <Box className="mx-10">
                    <Box>
                        <h1 className="text-neutral-800 text-2xl mt-2">Upcoming deadlines</h1>
                        <div
                            className="grid grid-flow-row md:grid-flow-col md:auto-cols-fr md:gap-20 gap-3 my-5">
                            {renderEvents(4)}
                            {userData.result && userData.result.data.events.length < 3 && (
                                <EventCard
                                    title={
                                        <h1 className="text-2xl max-w-[75%]">
                                            Trace your Upcoming deadlines with Venato
                                        </h1>
                                    }
                                    bgColor="white"
                                    textColor="#333333"
                                    accentColor="#7F5BEB"
                                    background="wave-bg"
                                    footer={
                                        <Button
                                            color="white"
                                            variant="contained"
                                            disableElevation
                                            size="small"
                                            sx={{
                                                border: "1px solid #E0E0E0",
                                                borderRadius: "8px",
                                                padding: "1rem 1.5rem",
                                            }}
                                            endIcon={<KeyboardDoubleArrowRight/>}
                                        >
                                            View calendar
                                        </Button>
                                    }
                                />
                            )}
                        </div>
                    </Box>
                    <Box className="mt-20">
                        <h1 className="text-neutral-800 text-2xl">Get started</h1>
                        <h2>See what you can accomplish with Venato</h2>
                        {renderGettingStarted()}
                    </Box>
                    <Box className="mt-10">
                        <h1 className="text-neutral-800 text-2xl">Job Boards</h1>
                        <Box
                            className="grid grid-flow-row md:grid-flow-col md:grid-cols-[15rem_1fr] md:flex-row gap-3 gap-3 mt-5">
                            <Button
                                color="white"
                                sx={{
                                    border: "2px solid #7F5BEB",
                                    borderRadius: "8px",
                                }}
                                variant="contained"
                                startIcon={<Add/>}
                                onClick={() => setDialogOpen(true)}
                            >
                                Create new board
                            </Button>
                            <Box className="min-w-[75%] gap-3 grid grid-flow-row md:grid-flow-col ">
                                {renderBoards(3)}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </AppScreen>
            {modalOpen && (
                <JobDialog
                    setOpen={setModalOpen}
                    setCurrentJob={setCurrentJob}
                    jobData={currentJob}
                    isEdit={false}
                    index={0}
                    state={[]}
                    setState={false}
                    isKanban={false}
                />
            )}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 600,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <p>Enter board name</p>
                    <br/>
                    <TextField
                        label="Board name"
                        value={boardName}
                        fullWidth
                        onChange={(e) => setBoardName(e.target.value)}
                    />

                    <br/>

                    <Button variant="contained" onClick={addNewBoard} style={{width: 100}}>
                        Add
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Homepage;
