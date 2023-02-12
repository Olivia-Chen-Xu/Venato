import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button, CircularProgress } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import taskLine from '../../../assets/task-line.png';

const bannerStyles = {
    color: 'white',
    padding: '16px 16px 16px 24px',
    borderRadius: '12px',
}
const Homepage = () => {
    const nav = useNavigate();
    const userData = useAsync(httpsCallable(getFunctions(), 'getHomepageData'), []);

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

    const formatDate = (date: string) => {
        const split = date.split('-');
        return `${split[1] === '11' ? 'Nov.' : 'Dec.'} ${(split[2] * 1).toString()}`;
    };

    const renderBoards = () => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        const boardsHtml: JSX.Element[] = [];
        userData.result.data.boards.forEach((board: { name: string; userId: string; id: string }) => {
            boardsHtml.push(
                <div className="font-poppins tracking-tighter text-black w-64 border-2 border-black bg-[#FFFFFF]  rounded-2xl">
                    <button
                        className="relative w-full h-full py-16 bottom-100"
                        onClick={() => nav('/kanban', { state: { boardId: board.id } })}
                    >
                        <span className="absolute bottom-5 left-5 ">{board.name}</span>
                    </button>
                </div>
            );
        });
        return boardsHtml;
    };

    const renderEvents = () => {
        if (!userData.result) {
            return <p>Error: Invalid state</p>;
        }

        const eventsHtml: JSX.Element = [];
        userData.result.data.events.forEach(
            (event: { title: string; date: number; location: string; company: string }) => {
                eventsHtml.push(
                    <div className="font-poppins tracking-tighter p-3 place-content-between bg-gradient-to-tl from-[#7F5BEB] to-[#7F5BEB] rounded-2xl">
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
                                position
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
            <h1 className=" font-poppins tracking-tighter font-medium left-100 text-black text-xl mt-2 grid place-content-center ">
                Upcoming Deadlines
            </h1>
            <div style={bannerStyles} className="grid grid-cols-3 gap-10 mx-30 h-20 my-5">
                {renderEvents()}
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div>
                <Button sx={{color: 'white'}}  variant="contained" startIcon={<AddCircleOutline />}>
                    Create new board
                </Button>
                <br></br>
            </div>
            <br />
            <div className="tracking-tighter mt-5 grid grid-cols-3 gap-3 gap-y-2 text-2xl text-white mx-10 ">
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
