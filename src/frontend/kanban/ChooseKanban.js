import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress, Dialog, DialogContent, TextField } from '@mui/material';
import { Add, MoreVert, SkateboardingOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AppScreen from '../reusable/AppScreen';
import { ReactComponent as NoBoards } from '../../images/empty/no-boards.svg';

const ChooseKanban = () => {
    const nav = useNavigate();
    const boards = useAsync(httpsCallable(getFunctions(), 'getJobBoards'), []);
    const [loading, setLoading] = useState(true);
    const [empty, setEmpty] = useState(true);

    useEffect(() => {

        setLoading(boards.loading)

        if (!boards.loading) {
            setEmpty(boards.result.data.length === 0);
        }
    }, [boards])

    const [dialogOpen, setDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState('');

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
                            <SkateboardingOutlined color="primary" fontSize='large' />
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
        <AppScreen
            isLoading={loading}
            isEmpty={empty}
            empty={<NoBoards />}
            title="Job Boards"
            margin="20"
        >
            <Button
                color='white'
                variant="contained"
                startIcon={<Add />}
                onClick={() => setDialogOpen(true)}
                sx={{
                    border: '2px solid #7F5BEB',
                    borderRadius: '8px'
                }}
            >
                Create new board
            </Button>
            <div className="flex mt-8">
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
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white">
                {renderBoards()}
            </div>
        </AppScreen>
    );
}

export default ChooseKanban;
