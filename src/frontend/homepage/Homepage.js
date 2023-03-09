import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, Dialog, DialogContent, TextField, Box } from '@mui/material';
import { Add, East, KeyboardDoubleArrowRight, QueryBuilder, SkateboardingOutlined } from '@mui/icons-material';
import { useState } from 'react';
import JobDialog from '../reusable/JobDialog';
import AppScreen from '../reusable/AppScreen';
import EventCard from './components/EventCard';

const buttonStyles = { 
    position: 'relative',
    top: '75px',
    bottom: '0px',
    left: '75px',
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    color: 'black'
}
const Homepage = () => {
    const nav = useNavigate();
    const userData = useAsync(httpsCallable(getFunctions(), 'getHomepageData'), []);

    // For adding a new board
    const [dialogOpen, setDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState('');

    // For opening a job (when you click a deadline)
    const [modalOpen, setModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);

    if (userData.error) {
        return <p>Error: {userData.error.message}</p>;
    }

    const addNewBoard = async () => {
        const boardData = await httpsCallable(getFunctions(), 'addBoard')(boardName);
        userData.result.data.boards.push(boardData.data);
        setDialogOpen(false);
    }

    const renderBoards = (max) => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        return userData.result.data.boards.slice(0, max).map((board) => (
            <Button
                color="white"
                variant="contained"
                onClick={() => nav('/kanban', { state: { boardId: board.id } })}
                className='flex-1 space-between'
                fullWidth
                disableElevation
                sx={{
                    justifyContent: 'flex-start',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    padding: '1rem 1.5rem'
                }}
            >
                <Box>
                    <SkateboardingOutlined color="primary" fontSize='medium' className='mr-4' />
                    {board.name}
                </Box>
            </Button>
        ))
        const boardsHtml = [];
        userData.result.data.boards.forEach((board) => {
            boardsHtml.push(
                <div className="font-poppins bg-[#FFFFFF] border-2 border-black text-black bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full py-16"
                        onClick={() => nav('/kanban', { state: { boardId: board.id } })}
                    >
                        <span className="absolute bottom-5 left-5 ">{board.name}</span>
                    </button>
                    <svg style={{ position: 'relative', bottom: '100', left: '25' }} width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke="#7F5BEB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            );
        });
        return boardsHtml;
    };

    const renderEvents = (max) => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        return userData.result.data.events.slice(0, max).map((event) => (
            <EventCard
                title={
                    <>
                        <h1 className="text-3xl">
                            {event.title}
                        </h1>

                        <h1 className="text-md align-middle font-extralight">
                            @ {event.company}
                        </h1>
                    </>
                }
                bgColor='#7F5BEB'
                accentColor='white'
                textColor='white'
                background='blob-bg'
                handleClick={async (mouseEvent) => {
                    const job = await httpsCallable(getFunctions(), 'getJobData')(event.jobId)
                        .then((result) => result.data);
                    setCurrentJob(job);
                    setModalOpen(true);
                }}
                footer={
                    <>
                        <h1 className="text-md">
                            {new Date(event.date * 1000).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h1>
                        <h1 className='text-md flex items-center flex-wrap'>
                            <QueryBuilder />
                            <span className='ml-1 font-medium'>{new Date(event.date * 1000).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</span>
                        </h1>
                    </>
                }
            />
        ));
    }

    const renderGettingStarted = () => {

        const getStarted = [
            {
                title: 'Track',
                content: 'Lorem ipsum dolor sit amet, Lorem sit ipsum dolor sit amet',
                link: '#'
            },
            {
                title: 'Discover',
                content: 'Lorem ipsum dolor sit amet, Lorem sit ipsum dolor sit amet',
                link: '#'
            },
            {
                title: 'Prepare',
                content: 'Lorem ipsum dolor sit amet, Lorem sit ipsum dolor sit amet',
                link: '#'
        const eventsHtml = [];
        userData.result.data.events.forEach(
            (event) => {
                eventsHtml.push(
                    <div
                        className="p-5 place-content-between bg-gradient-to-tl from-[#7F5BEB] to-[#7F5BEB] rounded-2xl"
                        onClick={async (mouseEvent) => {
                            const job = await httpsCallable(getFunctions(), 'getJobData')(event.jobId)
                                .then((result) => result.data);
                            setCurrentJob(job);
                            setModalOpen(true);
                        }}>
                        <div className="ml-5">
                            <h1>
                                <span className="text-3xl">{event.title}</span>
                            </h1>
                        </div>

                        <div style={{ marginTop: '4%' }}>
                            <img src={taskLine} alt="Horizontal divider" />
                        </div>

                        <div className="ml-5 mt-2">
                            <h1 className="text-md align-middle">
                                <span className="material-icons-outlined text-xl">work</span>{' '}
                                {event.position}
                            </h1>
                        </div>
                        <div className="ml-5 mt-1">
                            <h1 className="text-md align-middle">
                                <span className="material-icons-outlined text-xl">schedule</span>{' '}
                                {new Date(event.date * 1000).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                                <br />
                                {new Date(event.date * 1000).toLocaleTimeString('en-US')}
                            </h1>
                        </div>
                        <div className="ml-5 mt-1">
                            <h1 className="text-md align-middle">
                                <span className="material-icons-outlined text-xl">location_on</span>{' '}
                                {event.company}
                            </h1>
                        </div>
                    </div>
                );
            }
        ]

        return (
            <Box className="p-3 grid grid-flow-row md:grid-flow-col md:flex-row gap-3">
                {getStarted.map(({ title, content, link }) => (
                    <Button
                        color="white"
                        variant="contained"
                        className="flex-1 space-between flex-col"
                        disableElevation
                        sx={{
                            alignContent: 'flex-start',
                            border: '1px solid #E0E0E0',
                            borderRadius: '8px',
                            padding: '1rem 1.5rem'
                        }}
                        onClick={() => { nav(link) }}
                    >
                        <h1 className='self-start text-neutral-800 text-l mb-4'>{title}</h1>
                        <Box className="flex items-center gap-3">
                            <East color="neutral" />
                            <div className="text-left max-w-[75%]">
                                {content}
                            </div>
                        </Box>
                    </Button>
                ))}
            </Box>
        )
    }

    return (
        <>
            <AppScreen
                isLoading={userData.loading}
                title='Welcome Back!'
            >

                <Box className="mx-10">
                    <Box>
                        <h1 className="text-neutral-800 text-2xl mt-2">Upcoming deadlines</h1>
                        <div className="grid grid-flow-row md:grid-flow-col md:auto-cols-fr md:gap-20 gap-3 my-5">
                            {renderEvents(4)}
                            {userData.result && userData.result.data.events.length < 3 && (
                                <EventCard
                                    title={
                                            <h1 className="text-2xl max-w-[75%]">
                                                Trace your Upcoming deadlines with Venato
                                            </h1>
                                    }
                                    bgColor='white'
                                    textColor="#333333"
                                    accentColor='#7F5BEB'
                                    background='wave-bg'
                                    footer={
                                        <Button
                                            color="white"
                                            variant="contained"
                                            disableElevation
                                            size='small'
                                            sx={{
                                                border: '1px solid #E0E0E0',
                                                borderRadius: '8px',
                                                padding: '1rem 1.5rem'
                                            }}
                                            endIcon={<KeyboardDoubleArrowRight />}
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
                        <h1 className="text-neutral-800 text-2xl">
                            Job Boards
                        </h1>
                        <Box className="grid grid-flow-row md:grid-flow-col md:grid-cols-[15rem_1fr] md:flex-row gap-3 gap-3 mt-5">
                            <Button
                                color="white"
                                sx={{
                                    border: '2px solid #7F5BEB',
                                    borderRadius: '8px'
                                }}
                                variant="contained"
                                startIcon={<Add />}
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
            <h1 className="text-neutral-500 text-3xl mt-4 ml-20">Welcome Back!</h1>

            <h1 className="text-neutral-500 text-xl mt-2 grid place-content-center uppercase">
                Upcoming Tasks
            </h1>
            <div className="grid grid-cols-3 gap-20 mx-20 h-40 my-5" style={{ color: 'white' }}>
                {renderEvents()}
            </div>
            <br />
            <br />

            <h1 className="text-neutral-500 text-xl mt-10 grid place-content-center mx-20 uppercase">
                Job Boards
            </h1>
            <br />
            <div className="flex justify-center">
                <Button
                    color="neutral"
                    variant="contained"
                    startIcon={<AddCircleOutline />}
                    onClick={() => setDialogOpen(true)}
                >
                    Create new board
                </Button>
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogContent
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 600,
                            alignItems: 'center',
                        }}
                    >
                        <p>Enter board name</p>
                        <TextField
                            label="Board name"
                            value={boardName}
                            fullWidth
                            onChange={(e) => setBoardName(e.target.value)}
                        />
                        <br />
                        <br />

                        <Button variant="contained" onClick={addNewBoard} style={{ width: 100 }}>
                            Add
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
            <br />
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white mx-20 ">
                {renderBoards()}
                {/* <div className="grid place-content-center">
                    <button
                        className="px-80 h-32 bg-gray-200"
                        onClick={() => {
                            nav('/kanban');
                        }}
                    >
                        <span className="material-icons-outlined">add_circle</span> Create Board
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default Homepage;
