import { useEffect, useState } from "react";
import {
    DialogContent,
    Tabs,
    Tab,
    TextField,
    Input,
    InputAdornment,
    Button,
    Dialog,
    CircularProgress,
    MenuItem,
    Menu,
    IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
    DescriptionOutlined,
    DriveFileRenameOutlineOutlined,
    CalendarMonthOutlined,
    QuizOutlined,
    ContactPageOutlined,
    AlternateEmailOutlined,
    LocationOnOutlined,
    Delete,
    AddCircleOutline,
    MoreVert,
} from "@mui/icons-material";
import { getFunctions, httpsCallable } from "firebase/functions";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const colTitles = ["Applications", "Interviews", "Offers", "Rejections"];
const priorities = ["High", "Medium", "Low"];

const Headings = ({ jobData, setJob }) => {
    const handleChange = (e) => {
        setJob({
            ...jobData,
            stage: colTitles.indexOf(e.target.value),
        });
    };
    return (
        <>
            <Input
                className="focus-only "
                placeholder="Job Title"
                value={jobData.position}
                onChange={(e) => {
                    setJob({
                        ...jobData,
                        position: e.target.value,
                    });
                }}
                style={styles.jobTitle}
            />
            {/* <h1
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: "20px",
                    margin: '0 1vw',
                }}>
                    @
                </h1> */}
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Input
                    placeholder="Company"
                    style={styles.Company}
                    value={jobData.company}
                    disableUnderline
                    onChange={(e) => {
                        setJob({ ...jobData, company: e.target.value });
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <AlternateEmailOutlined style={{ fontSize: 20 }} />
                        </InputAdornment>
                    }
                />
                <Input
                    placeholder="Location"
                    value={jobData.location}
                    disableUnderline
                    onChange={(e) => {
                        setJob({ ...jobData, location: e.target.value });
                    }}
                    style={styles.Location}
                    startAdornment={
                        <InputAdornment position="start">
                            <LocationOnOutlined style={{ fontSize: 20 }} />
                        </InputAdornment>
                    }
                />
            </div>
            {/* <h1>{jobData.position}</h1>
            <h3>{jobData.company}</h3> */}
        </>
    );
};

const Details = ({ value, index, jobData, setJob }) => {
    const handleChange = (e) => {
        setJob({ ...jobData, priority: e.target.value });
    };

    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <>{/* </div> */}</>
            <TextField
                select
                label="Column"
                value={colTitles[jobData.stage]}
                onChange={handleChange}
                style={{ marginTop: "2vh" }}
            >
                {colTitles.map((title) => (
                    <MenuItem value={title}>{title}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                value={jobData.priority}
                label="Priority"
                onChange={handleChange}
                style={{ marginTop: "2vh" }}
            >
                {priorities.map((p) => (
                    <MenuItem value={p}>{p}</MenuItem>
                ))}
            </TextField>
            <TextField
                label="Posting Link"
                value={jobData.link}
                style={styles.applicationLink}
                onChange={(e) => {
                    setJob({ ...jobData, link: e.target.value });
                }}
                InputProps={{
                    disableUnderline: true, // <== added this
                }}
            />
            <TextField
                label="Job details"
                style={styles.jobDescription}
                multiline
                rows={10}
                value={jobData.description}
                onChange={(e) => {
                    setJob({
                        ...jobData,
                        description: e.target.value,
                    });
                }}
                InputProps={{
                    disableUnderline: true, // <== added this
                }}
            />
        </div>
    );
};

const Notes = ({ value, index, jobData, setJob }) => {
    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <TextField
                style={{ marginTop: "2vh" }}
                label="Notes"
                multiline
                rows={10}
                value={jobData.notes}
                onChange={(e) => {
                    setJob({ ...jobData, notes: e.target.value });
                }}
            />
        </div>
    );
};

const Deadlines = ({ value, index, jobData, setJob }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [newDdl, setNewDdl] = useState({
        title: "",
        date: dayjs().unix(),
        location: "",
        link: "",
    });
    const addNewDdl = async () => {
        setJob({ ...jobData, deadlines: [newDdl, ...jobData.deadlines] });
        setOpen(false);
        await httpsCallable(
            getFunctions(),
            "addDeadline"
        )({ ...newDdl, jobId: jobData.id, company: jobData.company });
        setNewDdl({ title: "", date: dayjs().unix(), location: "", link: "" });
    };

    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <Button
                style={{ marginTop: "2vh", marginBottom: "2vh" }}
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AddCircleOutline />}
            >
                Add Deadline
            </Button>
            {jobData.deadlines &&
                jobData.deadlines.map((deadline) => (
                    <div style={{ marginBottom: "2vh" }}>
                        {" "}
                        <h2>{deadline.title}</h2>
                        <p>{dayjs.unix(deadline.date).toString()}</p>
                        <p>{deadline.location}</p>
                        <p>{deadline.link}</p>
                        <IconButton
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                            }}
                        >
                            <MoreVert></MoreVert>
                        </IconButton>
                        <Menu
                            open={menuOpen}
                            onClose={() => setAnchorEl(null)}
                            anchorEl={anchorEl}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setOpen(true);
                                    setNewDdl(deadline);
                                }}
                            >
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    // Delete function goes here
                                }}
                            >
                                Delete
                            </MenuItem>
                        </Menu>
                        <hr />
                    </div>
                ))}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 600,
                        alignItems: "center",
                    }}
                >
                    <p>Task title</p>
                    <TextField
                        label="Task title"
                        value={newDdl.title}
                        fullWidth
                        onChange={(e) => {
                            setNewDdl({ ...newDdl, title: e.target.value });
                        }}
                    />
                    <br />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <p>Date and time</p>
                        <br />
                        <DateTimePicker
                            label="Date and time"
                            value={dayjs.unix(newDdl.date)}
                            onChange={(val) => setNewDdl({ ...newDdl, date: val.unix() })}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <br />
                    <p>Location</p>
                    <TextField
                        label="Location"
                        value={newDdl.location}
                        fullWidth
                        onChange={(e) => {
                            setNewDdl({ ...newDdl, location: e.target.value });
                        }}
                    />
                    <br />
                    <p>Link to meeting (if applicable)</p>
                    <TextField
                        label="Link"
                        value={newDdl.link}
                        fullWidth
                        onChange={(e) => {
                            setNewDdl({ ...newDdl, link: e.target.value });
                        }}
                    />
                    <Button variant="contained" onClick={addNewDdl} style={{ width: 100 }}>
                        Save
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const Questions = ({ value, index, jobData, setJob }) => {
    const [open, setOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ name: "", description: "" });
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const addNewQuestion = async () => {
        setJob({ ...jobData, interviewQuestions: [newQuestion, ...jobData.interviewQuestions] });
        setOpen(false);
        await httpsCallable(
            getFunctions(),
            "addInterviewQuestion"
        )({ jobId: jobData.id, ...newQuestion });
        setNewQuestion({ name: "", description: "" });
    };

    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <Button
                style={{ marginTop: "2vh", marginBottom: "2vh" }}
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AddCircleOutline />}
            >
                Add a question
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 600,
                        alignItems: "center",
                    }}
                >
                    <p>Enter question title</p>
                    <TextField
                        label="Interview Question"
                        value={newQuestion.name}
                        fullWidth
                        onChange={(e) => {
                            setNewQuestion({ ...newQuestion, name: e.target.value });
                        }}
                    />
                    <br />
                    <p>Enter question description</p>
                    <TextField
                        label="Interview Question"
                        value={newQuestion.description}
                        fullWidth
                        onChange={(e) => {
                            setNewQuestion({ ...newQuestion, description: e.target.value });
                        }}
                    />
                    <br />

                    <Button variant="contained" onClick={addNewQuestion} style={{ width: 100 }}>
                        Add
                    </Button>
                </DialogContent>
            </Dialog>

            {jobData.interviewQuestions &&
                /* job.interviewQuestions.map((question: string) => (
                    <li>
                        <a
                            href={`https://www.google.com/search?q=${question.replaceAll(
                                ' ',
                                '+'
                            )}`}
                        >
                            {question}
                        </a>
                    </li> */
                jobData.interviewQuestions.map((question) => (
                    <div style={{ marginBottom: "2vh" }}>
                        <h2>{question.name}</h2>
                        <p>{question.description}</p>
                        <IconButton
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                            }}
                        >
                            <MoreVert></MoreVert>
                        </IconButton>
                        <Menu
                            open={menuOpen}
                            onClose={() => setAnchorEl(null)}
                            anchorEl={anchorEl}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setOpen(true);
                                    setNewQuestion(question);
                                }}
                            >
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    // Delete function goes here
                                }}
                            >
                                Delete
                            </MenuItem>
                        </Menu>
                        <hr />
                    </div>
                ))}
        </div>
    );
};

const Contacts = ({ value, index, jobData, setJob }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [newContact, setNewContact] = useState({
        name: "",
        title: "",
        company: "",
        email: "",
        phone: "",
        linkedin: "",
        notes: "",
    });

    const addNewContact = async () => {
        setJob({ ...jobData, contacts: [newContact, ...jobData.contacts] });
        setOpen(false);
        await httpsCallable(getFunctions(), "addContact")({ jobId: jobData.id, ...newContact });
        setNewContact({
            name: "",
            title: "",
            company: "",
            email: "",
            phone: "",
            linkedin: "",
            notes: "",
        });
    };

    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <Button
                style={{ marginTop: "2vh", marginBottom: "2vh" }}
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AddCircleOutline />}
            >
                Add Contact
            </Button>
            <Dialog
                open={open}
                onClose={async () => {
                    const contactUpdate = {
                        name: newContact.name,
                        title: newContact.title,
                        company: newContact.company,
                        email: newContact.email,
                        phone: newContact.phone,
                        linkedin: newContact.linkedin,
                        notes: newContact.notes,
                    };
                    await httpsCallable(getFunctions(), "updateContact")
                        ({ contactId: newContact.id, contact: contactUpdate })
                        .then(() => {
                            const contactIndex = jobData.contacts.findIndex((contact) => contact.id === newContact.id);
                            jobData.contacts[contactIndex] = newContact;
                        });
                    setOpen(false);
                }
            }>
                <DialogContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 600,
                        alignItems: "center",
                    }}
                >
                    <p>Contact name</p>
                    <TextField
                        label="Name"
                        value={newContact.name}
                        fullWidth
                        onChange={(e) => {
                            setNewContact({ ...newContact, name: e.target.value });
                        }}
                    />
                    <br />
                    <p>Job title</p>
                    <TextField
                        label="Job title"
                        value={newContact.title}
                        fullWidth
                        onChange={(e) => {
                            setNewContact({ ...newContact, title: e.target.value });
                        }}
                    />
                    <br />
                    <p>Company</p>
                    <TextField
                        label="Company"
                        value={newContact.company}
                        fullWidth
                        onChange={(e) => {
                            setNewContact({ ...newContact, company: e.target.value });
                        }}
                    />
                    <br />
                    <p>Link to LinkedIn</p>
                    <TextField
                        label="Link to LinkedIn"
                        value={newContact.linkedin}
                        fullWidth
                        onChange={(e) => {
                            setNewContact({ ...newContact, linkedin: e.target.value });
                        }}
                    />
                    <br />
                    <Button variant="contained" style={{ width: 100 }} onClick={addNewContact}>
                        Add
                    </Button>
                </DialogContent>
            </Dialog>
            {jobData.contacts &&
                jobData.contacts.map((contact) => (
                    <div style={{ marginBottom: "2vh" }}>
                        <h2>{contact.name}</h2>
                        <p>{contact.title}</p>
                        <p>{contact.company}</p>
                        <p>{contact.linkedin}</p>
                        <IconButton
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                            }}
                        >
                            <MoreVert></MoreVert>
                        </IconButton>
                        <Menu
                            open={menuOpen}
                            onClose={() => setAnchorEl(null)}
                            anchorEl={anchorEl}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setOpen(true);
                                    setNewContact(contact);
                                }}
                            >
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={async () => {
                                    await httpsCallable(getFunctions(), "deleteContact")(contact.id)
                                        .then(() => jobData.contacts = jobData.contacts.filter((c) => c.id !== contact.id));
                                }}
                            >
                                Delete
                            </MenuItem>
                        </Menu>
                        <hr />
                    </div>
                ))}
        </div>
    );
};

const JobDialog = ({ jobData, isEdit, setOpen, state, setState, index, isKanban }) => {
    const [job, setJob] = useState({
        position: "",
        company: "",
        description: "",
        salary: "",
        location: "",
        link: "",
        notes: "",
        stage: jobData.stage,
        awaitingResponse: false,
        priority: "",

        deadlines: [],
        interviewQuestions: [],
        contacts: [],
    });

    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleClose = async () => {
        setOpen(false);
        console.log(job);
        await updateJob(job);
    };

    const addNewJob = async () => {
        await httpsCallable(getFunctions(), "addJob")();
    };

    const deleteJob = async (jobData) => {
        const newState = [...state];
        newState[index] = state[index].filter((j) => j.id !== jobData.id);
        await httpsCallable(getFunctions(), "deleteJob")({ id: jobData.id });
        setState(newState);
        setOpen(false);
    };

    const updateJob = async (jobData) => {
        //const newState = [...state];

        const newJobData = {
            awaitingResponse: jobData.awaitingResponse,
            boardId: jobData.boardId,
            company: jobData.company,
            description: jobData.description,
            link: jobData.link,
            location: jobData.location,
            notes: jobData.notes,
            position: jobData.position,
            priority: jobData.priority,
            salary: jobData.salary,
            stage: jobData.stage,
            userId: jobData.userId,
        };
        await httpsCallable(getFunctions(), 'updateJobData')({ jobId: jobData.id, jobData: newJobData });

        // if (isKanban) {
        //     newState[index] = state[index].map((j) => (j.id === jobData.id ? jobData : j));
        //     setState(newState);
        // }
    };

    // const addNewJob = async () => {
    //     setLoading(true);
    //     const newState = [...state];
    //     // Extract id from job
    //     const { id } = job;
    //     console.log(id);
    //     const jobCopy = structuredClone(job);
    //     delete jobCopy.id;

    //     const functionName = isEdit ? 'updateJob' : 'addJob';
    //     const params = isEdit ? { id, newFields: jobCopy } : jobCopy;
    //     await httpsCallable(
    //         getFunctions(),
    //         functionName
    //     )(params).then((res) => {
    //         if (setState === false) {
    //             CalendarState.updateJob(job);
    //         } else {
    //             if (isEdit) {
    //                 // console.log(index);
    //                 newState[index] = state[index].map((j) => (j.id === params.id ? job : j));
    //             } else {
    //                 newState[index] = [{ ...job, id: res.data }, ...state[index]];
    //             }

    //             setState(newState);
    //         }
    //     });

    //     setLoading(false);
    //     setOpen(false);
    // };

    useEffect(() => {
        const fetchJob = async () => {
            console.log(jobData, index);
            setJob(jobData || { ...job, stage: index });
            if (jobData) {
                await httpsCallable(
                    getFunctions(),
                    "getJobData"
                )(jobData.id).then((res) => setJob(res.data));
            }
        };

        fetchJob();
    }, [jobData]);

    return (
        <Dialog fullWidth maxWidth="xl" onClose={async () => await handleClose()} open={true}>
            <DialogContent
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: 800,
                }}
            >
                <Headings jobData={job} setJob={setJob} />
                <Tabs
                    variant="scrollable"
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                >
                    <Tab icon={<DescriptionOutlined />} iconPosition="end" label="Job Details" />
                    <Tab
                        icon={<DriveFileRenameOutlineOutlined />}
                        iconPosition="end"
                        label="Notes"
                    />
                    <Tab icon={<CalendarMonthOutlined />} iconPosition="end" label="Deadlines" />
                    <Tab icon={<QuizOutlined />} iconPosition="end" label="Interview Questions" />
                    <Tab icon={<ContactPageOutlined />} iconPosition="end" label="Contacts" />
                </Tabs>
                <Details value={tabValue} index={0} jobData={job} setJob={setJob} />
                <Notes value={tabValue} index={1} jobData={job} setJob={setJob} />
                <Deadlines value={tabValue} index={2} jobData={job} setJob={setJob} />
                <Questions value={tabValue} index={3} jobData={job} setJob={setJob} />
                <Contacts value={tabValue} index={4} jobData={job} setJob={setJob} />
                {loading ? (
                    <CircularProgress style={{ position: "absolute", right: 30 }} />
                ) : (
                    <div style={{ position: "absolute", right: "2vw", top: "4vh" }}>
                        <Button
                            variant="outlined"
                            style={{
                                padding: "14px 12px 14px 14px",
                                gap: "10px",
                                height: "25px",
                                borderRadius: "4px",
                                marginInlineEnd: 5,
                            }}
                            onClick={() => deleteJob(job)}
                        >
                            <Delete />
                        </Button>
                        <Button
                            variant="contained"
                            onClick={addNewJob}
                            style={{
                                padding: "15px 12px 15px 14px",
                                gap: "10px",
                                width: "25px",
                                height: "25px",
                                borderRadius: "4px",
                            }}
                        >
                            {isEdit ? "Save" : "Add"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default JobDialog;

const styles = {
    jobTitle: {
        fontStyle: "normal",
        fontWeight: "200",
        fontSize: "36px",
        lineHeight: "44px",
        color: "#676767",
        margin: ".5vh 0",
    },

    jobDescription: {
        boxSizing: "border-box",
        border: "none",
        outline: "none",
    },
    applicationLink: {
        border: "none",
        outline: "none",
        margin: "2vh 0px",
    },

    Company: {
        outline: "none",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "20px",
        marginBottom: ".5vh",
        color: "#676767",
    },
    Location: {
        outline: "none",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "20px",
        color: "#676767",
    },

    interviewIcons: {
        width: "740px",
        gap: "42px",
    },

    deadlineButton: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 12px 16px 16px",
        gap: "10px",
        width: "145px",
        height: "51px",
        whiteSpace: "nowrap",

        background: "#633175",
        borderRadius: "8px",
    },

    interviewQuestions: {
        color: "#676767",
        width: "100%",
    },

    contactsBox: {
        color: "#676767",
        width: "100%",
    },

    deadlineTitle: {
        fontStyle: "normal",
        fontWeight: "200",
        fontSize: "36px",
        lineHeight: "44px",
        color: "#676767",
    },

    deadlineLocation: {
        outline: "none",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "12px",

        color: "#676767",
    },

    deadlineCompany: {
        outline: "none",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "12px",
        lineHeight: "19px",

        color: "#676767",
    },
};
