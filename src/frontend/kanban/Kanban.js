import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { getFunctions, httpsCallable } from 'firebase/functions';
import JobDialog from '../reusable/JobDialog';
import { useLocation } from 'react-router-dom';
import { StrictModeDroppable } from '../reusable/StrictModeDroppable';
import { ReactComponent as NoJobs } from '../../images/no-jobs.svg'
import AppScreen from '../reusable/AppScreen';
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
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    margin: '1rem',
    borderRadius: '14px',
    backgroundColor: isDraggingOver ? 'rgb(233 213 255 / var(--tw-bg-opacity))' : 'rgb(248 250 252 / var(--tw-bg-opacity))',
    alignSelf: 'stretch'
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
    const [empty, setEmpty] = useState(true);

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
                setEmpty(newState.every(arr => arr.length === 0));
                setLoading(false);
            });

            return newState;
        };

        fetchJobs();
    }, []);

    return (
        <AppScreen
            isLoading={loading}
            isEmpty={empty}
            empty={<NoJobs />}
            title={boardName}
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
            <div
                className='overflow-auto'                
                style={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridAutoColumns: '24rem',
                    height: empty ? 'fit-content' : '100%',                         // Set height so that scrollbar will show
                    padding: '0 1.5rem'
                }}
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    {kanbanState.map((el, ind) => (
                        <div 
                            className='flex flex-col items-center gap-3'
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
                                        // If no jobs, collapse to make room for graphic
                                        className={`flex-1 p-1 ${empty && 'empty:min-w-0 empty:flex-[0_1_0]'}`}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {el.map((job, index) => (
                                            <div onClick={() => handleJobView(job, ind)}>
                                                <KanbanJob job={job} index={index} ind={ind} edit={handleJobView} delete={handleDelete} />
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
        </AppScreen>
    );
}

export default Kanban;
