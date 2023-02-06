import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

const ChooseKanban = () => {
    const boards = useAsync(httpsCallable(getFunctions(), 'getJobBoards'), []);

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

    const renderBoards = () => {
        if (!boards.result) {
            return <p>Error: Invalid state</p>;
        }

        const boardsHtml: JSX.Element[] = [];
        boards.result.data.forEach((board: { name: string; id: string }) => {
            boardsHtml.push(
                <div className="bg-[url('../../assets/home/board.png')] bg-[#793476] bg-right bg-no-repeat bg-contain rounded-2xl">
                    <button
                        className="relative w-full h-full py-16"
                        onClick={async () => {
                            console.log(JSON.stringify(board, null, 4));
                            await httpsCallable(getFunctions(), 'setKanbanBoard')(board.id);
                        }}
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
                <Button color="neutral" variant="contained" startIcon={<AddCircleOutline />}>
                    Create new board
                </Button>
            </div>
            <div className="mt-2 grid grid-rows-2 gap-y-4 text-2xl text-white mx-20 ">
                {renderBoards()}
            </div>
        </div>
    );
}

export default ChooseKanban;
