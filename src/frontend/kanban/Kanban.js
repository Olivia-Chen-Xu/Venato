import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { CircularProgress } from '@mui/material';
import JobDialog from '../reusable/JobDialog';
import { useLocation } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import { StrictModeDroppable } from '../reusable/StrictModeDroppable';
import {ReactComponent as NoJobs} from '../../images/no-jobs.svg'
import PageTitle from '../reusable/PageTitle';
import KanbanJob from './components/KanbanJob';
import KanbanHeader from './components/KanbanHeader';

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


const getListStyle = (isDraggingOver) => ({
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    margin: '1rem',
});

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

    const handleDelete = (job, idx) => {
        console.error('not implmented')
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
            className='flex flex-col grow overflow-hidden'
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
            <PageTitle>
                {loading ? (
                    <Skeleton animation="wave" sx={{ fontSize: '1.875rem', lineHeight: '2.25rem', width: '25%' }} />
                ) : (
                    <h1 className='text-neutral-800 text-3xl'>{boardName}</h1>
                )}
            </PageTitle>
            <div
                className='overflow-hidden'
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '5',
                    flexBasis: 'max-content',
                    flexGrow: '1',
                }}
            >
                {/* {jobs.map((job) => (
                <div>{JSON.stringify(job)}</div>
            ))} */}

                {loading ? (
                    <div className="flex justify-center items-center flex-[1_1_100%]">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className='flex grow flex-col overflow-scroll h-full'>
                        <div className='flex flex-1 min-h-min'>
                            <DragDropContext onDragEnd={onDragEnd}>
                                {kanbanState.map((el, ind) => (
                                    <div
                                        className='flex flex-col items-center gap-3 flex-1 my-3 min-h-min'
                                        style={{
                                            minWidth: '24rem'
                                        }}
                                    >
                                        <KanbanHeader
                                            name={cols[ind].name}
                                            color={cols[ind].color}
                                            amount={kanbanState[ind].length}
                                            ind={ind}
                                            handleAddClick={handleAddClick}
                                            handleEditClick={() => console.warn('Not Implmented')}
                                            handleDeleteClick={() => console.warn('Not Implmented')}
                                        />
                                        <StrictModeDroppable key={`${cols[ind].name}-${ind}`} droppableId={`${ind}`}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className='flex-1 w-[85%] empty:min-w-0 empty:flex-[0_1_0]'
                                                    ref={provided.innerRef}
                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                    {...provided.droppableProps}
                                                >
                                                    {el.map((job, index) => (
                                                        <div onClick={() => handleJobView(job, ind)}>
                                                            <KanbanJob job={job} index={index} ind={ind} edit={handleJobView} delete={handleDelete}/>
                                                        </div>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </StrictModeDroppable>
                                    </div>
                                ))}
                            </DragDropContext>
                        </div>
                        { !kanbanState.reduce((p, c) => p || c.length > 0, false) &&
                            <div className='flex justify-center content-center my-[7rem]'>
                                <NoJobs />
                            </div>
                        }
                    </div>
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