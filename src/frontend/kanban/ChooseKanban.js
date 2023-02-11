import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress, Dialog, DialogContent, TextField } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ChooseKanban = () => {
    const nav = useNavigate();
    const boards = useAsync(httpsCallable(getFunctions(), 'getJobBoards'), []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState('');

    if (boards.loading) {
        return (
            <div>
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

        const boardsHtml: JSX.Element[] = [];
        boards.result.data.forEach((board: { name: string; id: string }) => {
            boardsHtml.push(
                <div className="bg-[url('./images/home/board.png')] bg-[#793476] bg-right bg-no-repeat bg-contain rounded-2xl">
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

    return (
        <div>
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
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white mx-20 ">
                {renderBoards()}
            </div>
        </div>
    );
}

export default ChooseKanban;
