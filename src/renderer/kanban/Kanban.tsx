import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ControlPoint } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const colTitles = ['Applciations', 'Interviews', 'Offers', 'Rejections'];

const newJob = (idx: number) => {
    return {
        details: {
            description: 'Will be working on the Facebook Cloud Platform team',
            url: 'https://www.facebook.com/jobs/949752',
        },
        company: 'Facebook',
        stage: idx,
        location: 'San Jose, California',
        interviewQuestions: ['Binary search', 'Merge sort', 'Greedy algorithm', 'Prim algorithm'],
        contacts: [
            'https://www.linkedin.com/in/reid-moffat/',
            'https://www.linkedin.com/in/krishaan-thyagarajan/',
        ],
        notes: 'Have to travel to the US for this one',
        position: 'Data Engineer',
        deadlines: [
            {
                title: 'Submit resume + cover letter',
                date: 'December 14, 2022',
            },
            {
                title: 'Interview',
                date: 'December 29, 2022',
            },
        ],
    };
};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves a job from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    removed.stage = droppableDestination.droppableId;

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return [result, removed];
};
const grid = 8;

const getJobStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: (window.innerWidth - 100) / 4,
});

export default function Kanban() {
    const [state, setState] = useState([[], [], [], []]);

    const addJob = async (index) => {
        const newState = [...state];
        const job = newJob(index);
        await httpsCallable(
            getFunctions(),
            'addJob'
        )(job).then((res) => {
            newState[index] = [{ ...job, id: res.data }, ...state[index]];
            setState(newState);
        });
    };

    async function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const jobs = reorder(state[sInd], source.index, destination.index);
            const newState = [...state];
            newState[sInd] = jobs;
            setState(newState);
        } else {
            const [result, removed] = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState);
            // await move(state[sInd], state[dInd], source, destination).then((res) => {
            //     const newState = [...state];
            //     newState[sInd] = res[sInd];
            //     newState[dInd] = res[dInd];

            //     setState(newState);
            // });
            await httpsCallable(
                getFunctions(),
                'updateJobs'
            )({
                id: removed.id,
                newFields: {
                    stage: dInd,
                },
            });
        }
    }

    useEffect(() => {
        const fetchJobs = async () => {
            const newState = [[], [], [], []];
            await httpsCallable(getFunctions(), 'getJobs')().then((res) => {
                //console.log(res.data);
                for (const job of res.data) {
                    newState[job.stage].push(job);
                }
                setState(newState);
            });

            return newState;
        };
        fetchJobs();
    }, []);

    return (
        <div>
            {/* <button
                type="button"
                onClick={() => {
                    setState([...state, []]);
                }}
            >
                Add new group
            </button> */}
            {/* <button
                type="button"
                onClick={() => {
                    setState([...state, getJobs(1)]);
                }}
            >
                Add new job
            </button> */}

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* {jobs.map((job) => (
                    <div>{JSON.stringify(job)}</div>
                ))} */}
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((el, ind) => (
                        <div
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                display: 'flex',
                            }}
                        >
                            <p>{colTitles[ind]}</p>
                            <IconButton onClick={() => addJob(ind)}>
                                <ControlPoint />
                            </IconButton>
                            <Droppable key={ind} droppableId={`${ind}`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {el.map((job, index) => (
                                            <Draggable
                                                key={job.id}
                                                draggableId={job.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getJobStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-around',
                                                            }}
                                                        >
                                                            {job.position}
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-around',
                                                            }}
                                                        >
                                                            {job.company}
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-around',
                                                            }}
                                                        >
                                                            {colTitles[job.stage]}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newState = [...state];
                                                                newState[ind].splice(index, 1);
                                                                setState(newState);
                                                            }}
                                                        >
                                                            delete
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
}
