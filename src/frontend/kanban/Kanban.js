import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Add, Flag, MoreHoriz } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import JobDialog from '../reusable/JobDialog';
import { useLocation } from 'react-router-dom';
import SplitBackground from '../reusable/SplitBackground';
import Skeleton from '@mui/material/Skeleton';
import { StrictModeDroppable } from '../reusable/StrictModeDroppable';

const cols = [
    { name: 'APPLICATIONS', color: '#926EFE' },
    { name: 'INTERVIEWS', color: '#FF8900' },
    { name: 'OFFERS', color: '#84FF9F' },
    { name: 'REJECTIONS', color: '#00819B' },
]

const newJob = (idx) => {
    return {
        details: {
            position: '',
            company: '',
            description: '',
            salary: '',
            location: '',
            link: ''
        },

        notes: '',
        deadlines: [],
        interviewQuestions: [],
        contacts: [],

        status: {
            stage: idx,
            awaitingResponse: false,
            priority: ''
        }
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
    margin: `0 0 ${grid}px 0`,
    display: 'flex',
    flexDirection: 'column',
    background: isDragging ? '#C7ADD8' : 'none',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    background: 'white',
    ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
    //padding: grid,
    // width: (window.innerWidth - 200) / 4,
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    //borderRadius: '16px',
});

const someAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
}

const Kanban = () => {
    const [kanbanState, setKanbanState] = useState([[], [], [], []]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [index, setIndex] = useState(0);
    const [currentJob, setCurrentJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [boardID, setBoardID] = useState(null);

    const boardId = useLocation().state.boardId;

    const addJob = async (index) => {
        const newState = [...kanbanState];
        const job = newJob(index);
        await httpsCallable(
            getFunctions(),
            'addJob'
        )({ boardId: boardID, stage: index }).then((res) => {
            newState[index] = [{ ...job, id: res.data.id }, ...kanbanState[index]];
            setKanbanState(newState);
            setCurrentJob({ ...job, id: res.data.id });
            // console.log(currentJob);
        });
    };

    const handleAddClick = async (idx) => {
        setIndex(idx);
        setCurrentJob(null);
        setIsEdit(false);
        await addJob(idx);
        setModalOpen(true);
    };

    const handleJobView = (job, idx) => {
        setIsEdit(true);
        setIndex(idx);
        setCurrentJob(job);
        setModalOpen(true);
    };

    const jobPrioityMapper = (priority) => {
        return {
            'High': "error",
            'Medium': 'warning',
            'Low': 'success'
        }[priority]
    }

    async function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const jobs = reorder(kanbanState[sInd], source.index, destination.index);
            const newState = [...kanbanState];
            newState[sInd] = jobs;
            setKanbanState(newState);
        } else {
            const [result, removed] = move(kanbanState[sInd], kanbanState[dInd], source, destination);
            const newState = [...kanbanState];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setKanbanState(newState);
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
                newStage: dInd
            });
        }
    }

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const newState = [[], [], [], []];
            await httpsCallable(getFunctions(), 'getKanbanBoard')(boardId).then((res) => {
                res.data.jobs.forEach((job) => newState[job.stage].push(job));
                setKanbanState(newState);
                setBoardName(res.data.name);
                setBoardID(res.data.id);
                setLoading(false);
            });

            return newState;
        };

        fetchJobs();
    }, []);



    return (
        <div
            className='h-full flex flex-col grow'
            style={{
                background: SplitBackground('bottom', 'white', '#F6F6F6', 15)
            }}
        >
            {modalOpen && (
                <JobDialog
                    setCurrentJob={setCurrentJob}
                    setOpen={setModalOpen}
                    jobData={currentJob}
                    isEdit={isEdit}
                    index={index}
                    state={kanbanState}
                    setState={setKanbanState}
                    isKanban={true}
                />
            )}
            <div className='px-8 mb-11'>
                {loading ? (
                    <Skeleton animation="wave" sx={{ fontSize: '1.875rem', lineHeight: '2.25rem', width: '25%' }} />
                ) : (
                    <h1 className='text-neutral-800 text-3xl'>{boardName}</h1>
                )}
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '5',
                overflowX: 'auto',
                overflowY: 'hidden',
                flexBasis: 'max-content',
                flexGrow: '1',
            }}>
                {/* {jobs.map((job) => (
                <div>{JSON.stringify(job)}</div>
            ))} */}

                {loading ? (
                    <div className="h-full w-full flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        {kanbanState.map((el, ind) => (
                            <div
                                className='flex flex-col items-center h-full gap-3 flex-1 my-3 w-0'
                                style={{
                                    minWidth: '24rem'
                                }}
                            >
                                <div
                                    className='flex flex-row items-center gap-2 w-[85%]'
                                    style={{
                                        borderTop: `4px solid ${cols[ind].color || '#676767'}`,
                                        padding: '8px',
                                        paddingLeft: '16px',
                                        textAlign: 'center',
                                        fontSize: 20,
                                        boxShadow: '0px 5px 14px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '4px',
                                        background: 'white',
                                    }}
                                >
                                    <span>{cols[ind].name}</span>
                                    <div
                                        style={{
                                            border: '1px solid #32363d',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            padding: '4px',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <span
                                            className='flex items-center text-center'
                                            style={{
                                                lineHeight: '16px',
                                                fontSize: '13px',
                                                fontWeight: '400',
                                                letterSpacing: '0.04em'
                                            }}
                                        >
                                            {kanbanState[ind].length}
                                        </span>
                                    </div>
                                    <IconButton
                                        onClick={async () => await handleAddClick(ind)}
                                        style={{ marginLeft: 'auto' }}
                                        sx={{
                                            flexShrink: 1,
                                            padding: 0
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                    <IconButton
                                        sx={{
                                            flexShrink: 1,
                                            padding: 0
                                        }}
                                    >
                                        <MoreHoriz />
                                    </IconButton>
                                </div>
                                <StrictModeDroppable key={`${cols[ind].name}-${ind}`} droppableId={`${ind}`}>
                                    {(provided, snapshot) => (
                                        <div
                                            className='flex-1 w-[85%]'
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
                                                                className='min-h-[15%]'
                                                            >
                                                                <div className='flex flex-col'>
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{
                                                                            marginLeft: 'auto'
                                                                        }}
                                                                        onClick={someAction}
                                                                    >
                                                                        <MoreHoriz />
                                                                    </IconButton>
                                                                    <div
                                                                        className='flex flex-row'
                                                                        style={{
                                                                            padding: grid * 4 + 5,
                                                                            paddingTop: 0,
                                                                            gap: '0.5rem'
                                                                        }}
                                                                    >
                                                                        <Flag
                                                                            color={jobPrioityMapper(job.priority) || 'action'}
                                                                            style={{
                                                                                marginTop: '4px',
                                                                                fontSize: 30
                                                                            }}
                                                                        ></Flag>
                                                                        <div className='flex flex-col'>
                                                                            <text
                                                                                className='truncate'
                                                                                style={{
                                                                                    fontSize: 25,
                                                                                    fontWeight: 300,
                                                                                    minHeight: '37.5px',
                                                                                    minWidth: '37.5px'
                                                                                }}
                                                                            >
                                                                                {job.company}
                                                                            </text>
                                                                            <text
                                                                                className='truncate'
                                                                                style={{
                                                                                    fontSize: 16,
                                                                                    fontWeight: 300,
                                                                                }}
                                                                            >
                                                                                {job.position}
                                                                            </text>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )}
                                                    </Draggable>
                                                </div>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </StrictModeDroppable>
                            </div>
                        ))}
                    </DragDropContext>
                )}
            </div>
        </div>
    );
}

export default Kanban;

/* <div
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
</button> */