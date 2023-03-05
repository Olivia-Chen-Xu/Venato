import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress, Dialog, DialogContent, TextField } from '@mui/material';
import { Add, MoreVert, SkateboardingOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SplitBackground from '../reusable/SplitBackground';
import IconButton from '@mui/material/IconButton';

const ChooseKanban = () => {
    const nav = useNavigate();
    const boards = useAsync(httpsCallable(getFunctions(), 'getJobBoards'), []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState('');

    if (boards.loading) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }
    if (boards.error) {
        return <p>Error: {boards.error.message}</p>;
    }

    const addNewBoard = async () => {
        const boardData = await httpsCallable(getFunctions(), 'addBoard')(boardName);
        boards.result.data.push(boardData.data);
        setDialogOpen(false);
    }

    const renderBoards = () => {
        if (!boards.result) {
            return <p>Error: Invalid state</p>;
        }

        const boardsHtml = [];
        boards.result.data.forEach((board) => {
            boardsHtml.push(
                <div className="rounded-2xl bg-white text-neutral-600 border-2 border-neutral-300 flex">
                    <button
                        className="py-8 flex grow"
                        onClick={() => nav('/kanban', { state: { boardId: board.id } })}
                    >
                        <div className="flex px-8 gap-3 grow items-center">
                            <SkateboardingOutlined color="primary" fontSize='large'/>
                            <span>{board.name}</span>
                            <IconButton 
                                sx={{
                                    marginLeft: 'auto'
                                }}
                            >
                                <MoreVert />
                            </IconButton>
                        </div>
                    </button>
                </div>
            );
        });
        return boardsHtml;
    };

    return (
        <div
            className='grow flex flex-col px-10'
        >
            <div className='mb-5'>
                <h1 className="text-neutral-500 text-3xl">
                    Job Boards
                </h1>
                <Button
                    sx={{
                        marginTop: '4.5rem',
                    }}
                    color='white'
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setDialogOpen(true)}
                >
                    Create new board
                </Button>
            </div>
            <div className="flex">
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogContent
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 600,
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
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white mx-20 ">
                {renderBoards()}
            </div>
        </div>
    );
}

export default ChooseKanban;
