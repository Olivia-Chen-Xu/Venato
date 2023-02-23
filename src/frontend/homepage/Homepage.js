import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress, Dialog, DialogContent, TextField } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import taskLine from '../../images/task-line.png';
import { useState } from 'react';
import JobDialog from '../reusable/JobDialog';

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

    if (userData.loading) {
        return (
            <div>
                <CircularProgress />
            </div>
        );
    }
    if (userData.error) {
        return <p>Error: {userData.error.message}</p>;
    }

    const addNewBoard = async () => {
        const boardData = await httpsCallable(getFunctions(), 'addBoard')(boardName);
        userData.result.data.boards.push(boardData.data);
        setDialogOpen(false);
    }

    const renderBoards = () => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

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

    const renderEvents = () => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

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
        );
        return eventsHtml;
    };

    return (
        <div>
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
            

            <h1 className="font-poppins font-medium color-black tracking-wider text-xl mt-10 grid place-content-left mx-20 uppercase">
                Upcoming Tasks
            </h1>

            <div className="grid grid-cols-3 gap-20 mx-20 h-40 my-5" style={{ color: 'white' }}>
                {renderEvents()}
            </div>
            <br />
            <br />
            <h1 className="font-poppins font-medium color-black tracking-wider text-xl mt-10 grid place-content-left mx-20 uppercase">
                Job Boards
            </h1>
            <h2 className="font-poppins font-light color-black tracking-wider mt-5 grid place-content-left mx-20 uppercase">
                See what you can accomplish on Venato
            </h2>
            <div className="absolute bottom-100">
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
            <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-4 text-2xl text-white mx-20 ">
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
            <Button
                sx={buttonStyles}        
                color="neutral"
                        variant="contained"
                        startIcon={<AddCircleOutline />}
                        onClick={() => setDialogOpen(true)}
                    >
                        Create new board
            </Button>
            
        </div>
        
    );
};

export default Homepage;
