import { useAsync } from "react-async-hook";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Button, Dialog, DialogContent, TextField } from "@mui/material";
import { Add, MoreVert, SkateboardingOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AppScreen from "../reusable/AppScreen";
import { ReactComponent as NoBoards } from "../../graphics/empty/no-boards.svg";

const ChooseKanban = () => {
    const nav = useNavigate();
    const boards = useAsync(httpsCallable(getFunctions(), "getJobBoards"), []);
    const [loading, setLoading] = useState(true);
    const [empty, setEmpty] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState("");

    useEffect(() => {
        setLoading(boards.loading);

        if (!boards.loading) {
            setEmpty(boards.result.data.length === 0);
        }
    }, [boards]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState("");

    if (boards.error) {
        return <p>Error: {boards.error.message}</p>;
    }

    const addNewBoard = async () => {
        if (boardName === '') return;

        const boardData = await httpsCallable(getFunctions(), 'addBoard')(boardName);
        boards.result.data.push(boardData.data);
        setDialogOpen(false);
    };

    const getBoardName = () => {
        if (!boards.result || !deleteDialogOpen) return;
        return boards.result.data.find((b) => b.id === deleteDialogOpen).name;
    };

    const renderBoards = () => {
        if (!boards.result) {
            return <p>Error: Invalid state; no boards present</p>;
        }

        const boardsHtml = [];
        boards.result.data.forEach((board) => {
            boardsHtml.push(
                <div
                    className="rounded-2xl bg-white text-neutral-600 border-2 border-neutral-300 flex">
                    <button
                        className="py-8 flex grow"
                        onClick={() => nav("/kanban", {state: {boardId: board.id}})}
                    >
                        <div className="flex px-8 gap-3 grow items-center">
                            <SkateboardingOutlined color="primary" fontSize="large"/>
                            <span>{board.name}</span>
                            <IconButton
                                sx={{
                                    marginLeft: "auto",
                                }}
                            >
                                <MoreVert
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setDeleteDialogOpen(board.id);
                                    }}
                                />
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
            empty={<NoBoards/>}
            title="Job Boards"
            margin="mx-20"
        >
            <Button
                color="white"
                variant="contained"
                startIcon={<Add/>}
                onClick={() => setDialogOpen(true)}
                sx={{
                    border: "2px solid #7F5BEB",
                    borderRadius: "8px",
                }}
            >
                Create new board
            </Button>
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
            <div className="flex mt-8">
                <Dialog open={deleteDialogOpen !== ""} onClose={() => setDeleteDialogOpen("")}>
                    <DialogContent
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: 600,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p>Delete job board '{getBoardName()}'?</p>
                        <br/>
                        <strong>
                            ⚠️ WARNING: This board and ALL of its jobs will be deleted ⚠️
                        </strong>
                        <br/>

                        <Button variant="contained" style={{width: 100}}>
                            No
                        </Button>
                        <Button
                            onClick={async (event) => {
                                event.stopPropagation();
                                await httpsCallable(
                                    getFunctions(),
                                    "deleteBoard"
                                )(deleteDialogOpen).then(
                                    () =>
                                        (boards.result.data = boards.result.data.filter(
                                            (b) => b.id !== deleteDialogOpen
                                        ))
                                );
                                setDeleteDialogOpen("");
                            }}
                            style={{width: 100}}
                        >
                            Yes
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white">
                {renderBoards()}
            </div>
        </AppScreen>
    );
};

export default ChooseKanban;
