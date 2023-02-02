import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ControlPoint } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import JobDialog from 'renderer/job/JobDialog';

const colTitles = ['APPLICATIONS', 'INTERVIEWS', 'OFFERS', 'REJECTIONS'];

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
    padding: grid * 4,
    margin: `0 0 ${grid}px 0`,
    display: 'flex',
    flexDirection: 'column',
    background: isDragging ? '#C7ADD8' : 'none',
    //border: '1px solid #676767',
    borderRadius: 10,
    boxShadow: '2px 5px 5px #BEBEBE',
    ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
    padding: grid,
    width: (window.innerWidth - 200) / 4,
    height: window.innerHeight - 100,
    overflowY: 'scroll',
});

export default function Kanban() {
    const [state, setState] = useState([[], [], [], []]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [index, setIndex] = useState(0);
    const [currentJob, setCurrentJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [boardName, setBoardName] = useState<string>('');

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

    const handleAddClick = (idx) => {
        setIndex(idx);
        setCurrentJob(null);
        setIsEdit(false);
        setModalOpen(true);
    };

    const handleJobView = (job, idx) => {
        setIsEdit(true);
        setIndex(idx);
        setCurrentJob(job);
        setModalOpen(true);
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
                'dragKanbanJob'
            )({
                id: removed.id,
                newStage: dInd,
            });
        }
    }

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const newState = [[], [], [], []];
            await httpsCallable(getFunctions(), 'getKanbanBoard')().then((res) => {
                // console.log(JSON.stringify(res, null, 4));
                res.data.jobs.forEach((job) => newState[job.status.stage].push(job));
                setState(newState);
                setBoardName(res.data.name);
                setLoading(false);
            });

            return newState;
        };
        fetchJobs();
    }, []);

    return (
        <div
            style={{
                paddingLeft: 40,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
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
            {modalOpen && (
                <JobDialog
                    setCurrentJob={setCurrentJob}
                    setOpen={setModalOpen}
                    jobData={currentJob}
                    isEdit={isEdit}
                    index={index}
                    state={state}
                    setState={setState}
                />
            )}
            <h4
                style={{
                    alignSelf: 'flex-start',
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#676767',
                }}
            >
                {boardName}
            </h4>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* {jobs.map((job) => (
                    <div>{JSON.stringify(job)}</div>
                ))} */}

                {loading ? (
                    <CircularProgress />
                ) : (
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
                                <p
                                    style={{
                                        borderBottom: '1px solid #676767',
                                        width: '80%',
                                        textAlign: 'center',
                                        fontSize: 20,
                                        color: '#676767',
                                    }}
                                >
                                    {colTitles[ind]}
                                </p>
                                <IconButton onClick={() => handleAddClick(ind)}>
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
                                                <div onClick={() => handleJobView(job, ind)}>
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
                                                                <text
                                                                    style={{
                                                                        fontSize: 20,
                                                                        fontWeight: 300,
                                                                        color: '#633175',
                                                                        textAlign: 'right',
                                                                    }}
                                                                >
                                                                    {job.details.position}
                                                                </text>
                                                                <text
                                                                    style={{
                                                                        fontSize: 14,
                                                                        fontWeight: 300,
                                                                        color: '#633175',
                                                                        textAlign: 'right',
                                                                    }}
                                                                >
                                                                    {job.details.company}
                                                                </text>
                                                                {/* <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        justifyContent:
                                                                            'space-around',
                                                                    }}
                                                                >
                                                                    {colTitles[job.metadata.stage]}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newState = [...state];
                                                                        newState[ind].splice(
                                                                            index,
                                                                            1
                                                                        );
                                                                        setState(newState);
                                                                    }}
                                                                >
                                                                    delete
                                                                </button> */}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                </div>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </DragDropContext>
                )}
            </div>
        </div>
    );
}
