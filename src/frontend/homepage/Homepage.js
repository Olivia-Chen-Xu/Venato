import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress, Dialog, DialogContent, TextField } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import taskLine from '../../images/task-line.png';
import { useState } from 'react';

const bannerStyles = { 
    position: 'relative',
    top: '75px',
    bottom: '0px',
    left: '75px'
}
const Homepage = () => {
    const nav = useNavigate();
    const userData = useAsync(httpsCallable(getFunctions(), 'getHomepageData'), []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState('');

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

        const boardsHtml: JSX.Element[] = [];
        userData.result.data.boards.forEach((board: { name: string; id: string }) => {
            boardsHtml.push(
                <div className="bg-[#FFFFFF] border-2 border-black text-black bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full py-16"
                        onClick={() => nav('/kanban', { state: { boardId: board.id } })}
                    >
                        <span className="absolute bottom-5 left-5 ">{board.name}</span>
                    </button>
                </div>
            );
        });
        return boardsHtml;
    };

    // useEffect(() => {
    //     const fetchBoards = async () => {
    //         setLoading(true);
    //         const newState = [[], [], [], []];
    //         await httpsCallable(getFunctions(), 'getKanbanBoard')(boardId).then((res) => {
    //             res.data.jobs.forEach((job) => newState[job.stage].push(job));
    //             setKanbanState(newState);
    //             setBoardName(res.data.name);
    //             setBoardID(res.data.id);
    //             setLoading(false);
    //         });
    //
    //         return newState;
    //     };
    //
    //     fetchBoards();
    // }, []);

    const renderEvents = () => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        const eventsHtml: JSX.Element = [];
        userData.result.data.events.forEach(
            (event: { title: string; date: number; location: string; company: string; position: string; }) => {
                eventsHtml.push(
                    <div className="p-5 place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
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
            <h1 className="font-poppins font-medium color-black text-xl tracking-wider mt-10 grid place-content-left mx-20  uppercase">
                Upcoming Deadlines
            </h1>
            <div className="grid grid-cols-3 gap-20 mx-20 h-40 my-5" style={{ color: 'white' }}>
                {renderEvents()}
            </div>
            <br />
            <br />
            <h1 className="font-poppins font-medium color-black tracking-wider text-xl mt-10 grid place-content-left mx-20 uppercase">
                Get Started 
            </h1>
            <h2 className="font-poppins font-light color-black tracking-wider mt-5 grid place-content-left mx-20 uppercase">
                See what you can accomplish on Venato
            </h2>
            <br />
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
            <div className="mt-2 grid grid-cols-3 gap-x-5 text-2xl text-black mx-20">
                <h1 className="font-poppins font-medium gap-y-5 color-black tracking-wider text-xl uppercase">
                    Job Boards
                </h1>
            </div>
            <Button
                sx={bannerStyles}        
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
