import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getEvents } from 'backend/src';
import { ControlPoint } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const colTitles = ['Applciations', 'Interviews', 'Offers', 'Rejections'];

const getJobs = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `${Math.random()}`,
        job_title: 'Job Title',
        company: 'company',
    }));

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

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
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
    const [state, setState] = useState([getJobs(10), getJobs(5), [], []]);
    const [jobs, setJobs] = useState([]);

    const addJob = (index) => {
        const newState = [...state];
        newState[index] = [...state[index], ...getJobs(1)];
        setState(newState);
    };

    function onDragEnd(result) {
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
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState);
        }
    }

    useEffect(() => {
        const fetchJobs = async () => {
            const jobs = await httpsCallable(getFunctions(), 'getEvents')();
            setJobs(jobs.data);
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
                                                            {job.job_title}
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-around',
                                                            }}
                                                        >
                                                            {job.company}
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
