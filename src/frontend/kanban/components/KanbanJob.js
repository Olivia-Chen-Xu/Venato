import { Draggable } from "react-beautiful-dnd";
import { Flag, MoreHoriz } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

const getJobStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    margin: `0 0 ${grid}px 0`,
    display: "flex",
    flexDirection: "column",
    background: isDragging ? "#C7ADD8" : "none",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    background: "white",
    ...draggableStyle,
});

const jobPrioityMapper = (priority) => {
    return {
        High: "error",
        Medium: "warning",
        Low: "success",
    }[priority];
};

const grid = 8;

export default function KanbanJob(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.edit(props.job, props.ind);
    };

    // const handleDelete = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     props.delete(props.job, props.ind);
    // };

    return (
        <Draggable key={props.job.id} draggableId={props.job.id} index={props.index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getJobStyle(snapshot.isDragging, provided.draggableProps.style)}
                    //className='min-h-[15%]'
                >
                    <div className="flex flex-col">
                        <IconButton
                            size="small"
                            sx={{
                                marginLeft: "auto",
                            }}
                            onClick={handleMenuOpen}
                        >
                            <MoreHoriz />
                        </IconButton>
                        <div
                            className="flex flex-row"
                            style={{
                                padding: grid * 4 + 5,
                                paddingTop: 0,
                                gap: "0.5rem",
                            }}
                        >
                            <Flag
                                color={jobPrioityMapper(props.job.priority) || "action"}
                                style={{
                                    marginTop: "4px",
                                    fontSize: 30,
                                }}
                            ></Flag>
                            <div className="flex flex-col">
                                <text
                                    className="truncate"
                                    style={{
                                        fontSize: 25,
                                        fontWeight: 300,
                                        //minHeight: '37.5px',
                                        //minWidth: '37.5px'
                                    }}
                                >
                                    {props.job.company}
                                </text>
                                <text
                                    className="truncate"
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 300,
                                    }}
                                >
                                    {props.job.position}
                                </text>
                            </div>
                        </div>
                    </div>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem
                            onClick={async (event) => {
                                event.stopPropagation();
                                const newState = [...props.kanbanState];
                                newState[props.index] = props.kanbanState[props.index].filter(
                                    (j) => j.id !== props.job.id
                                );
                                await httpsCallable(
                                    getFunctions(),
                                    "deleteJob"
                                )({ id: props.job.id });
                                props.setKanbanState(newState);
                                setAnchorEl(null);
                                // const deleteJob = async (jobData) => {
                                //     const newState = [...state];
                                //     newState[index] = state[index].filter((j) => j.id !== jobData.id);
                                //     await httpsCallable(getFunctions(), "deleteJob")({ id: jobData.id });
                                //     setState(newState);
                                //     setOpen(false);
                                // };
                            }}
                        >
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
            )}
        </Draggable>
    );
}
