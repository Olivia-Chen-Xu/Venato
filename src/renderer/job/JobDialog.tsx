import React, { useEffect, useReducer, useState } from 'react';
import {
    DialogContent,
    Tabs,
    Tab,
    TextField,
    Input,
    InputAdornment,
    Button,
    Dialog,
    Backdrop,
    CircularProgress,
    Box,
    IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    DescriptionOutlined,
    DriveFileRenameOutlineOutlined,
    CalendarMonthOutlined,
    QuizOutlined,
    ContactPageOutlined,
    AlternateEmailOutlined,
    LocationOnOutlined,
    Delete,
} from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import CalendarState from '../calendar/context/CalendarState';

const Details = ({ value, index, job, setJob }) => {
    return (
        <div
            style={{
                flexDirection: 'column',
                display: value == index ? 'flex' : 'none',
                height: '100%',
                paddingBlock: 'auto',
            }}
        >
            <Input
                className="focus-only"
                placeholder="Job Title"
                value={job.position}
                onChange={(e) => {
                    setJob({ ...job, position: e.target.value });
                }}
                style={styles.jobTitle}
            ></Input>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    placeholder="Company"
                    style={styles.Company}
                    value={job.company}
                    disableUnderline
                    onChange={(e) => {
                        setJob({ ...job, company: e.target.value });
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <AlternateEmailOutlined style={{ fontSize: 20 }} />
                        </InputAdornment>
                    }
                />
                <Input
                    placeholder="Location"
                    value={job.location}
                    disableUnderline
                    onChange={(e) => {
                        setJob({ ...job, location: e.target.value });
                    }}
                    style={styles.Location}
                    startAdornment={
                        <InputAdornment position="start">
                            <LocationOnOutlined style={{ fontSize: 20 }} />
                        </InputAdornment>
                    }
                />
            </div>
            <br></br>
            <br></br>
            <TextField
                label="Job Description"
                style={styles.jobDescription}
                multiline
                rows={10}
                value={job.details.description}
                onChange={(e) => {
                    setJob({ ...job, details: { ...job.details, description: e.target.value } });
                }}
                InputProps={{
                    disableUnderline: true, // <== added this
                    sx: { width: 625 },
                }}
            />
            <br></br>
            <TextField
                label="Application Link"
                value={job.details.url}
                style={styles.applicationLink}
                onChange={(e) => {
                    setJob({ ...job, details: { ...job.details, url: e.target.value } });
                }}
                InputProps={{
                    disableUnderline: true, // <== added this
                    sx: { width: 625 },
                }}
            />
        </div>
    );
};

const Notes = ({ value, index, job, setJob }) => {
    return (
        <div hidden={value !== index}>
            <Input
                className="focus-only"
                placeholder="Job Title"
                value={job.position}
                onChange={(e) => {
                    setJob({ ...job, position: e.target.value });
                }}
                style={styles.jobTitle}
            ></Input>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    placeholder="Company"
                    style={styles.Company}
                    value={job.company}
                    onChange={(e) => {
                        setJob({ ...job, company: e.target.value });
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <AlternateEmailOutlined />
                        </InputAdornment>
                    }
                />
                <Input
                    placeholder="Location"
                    value={job.location}
                    onChange={(e) => {
                        setJob({ ...job, location: e.target.value });
                    }}
                    style={styles.Location}
                    startAdornment={
                        <InputAdornment position="start">
                            <LocationOnOutlined />
                        </InputAdornment>
                    }
                />
            </div>
            <TextField
                label="Notes"
                rows={4}
                value={job.notes}
                onChange={(e) => {
                    setJob({ ...job, notes: e.target.value });
                }}
                style={styles.Notes}
                InputProps={{
                    sx: { height: 200 },
                }}
            />
        </div>
    );
};

const Deadlines = ({ value, index, job, setJob }) => {
    const [open, setOpen] = useState(false);
    const [newDdl, setNewDdl] = useState({ date: null, position: '' });

    const addDdl = () => {
        // console.log(newDdl);
        setJob({ ...job, deadlines: [newDdl, ...job.deadlines] });
        setOpen(false);
        setNewDdl({ date: null, position: '' });
    };

    const dateToString = (date: string) => {
        const parts = date.split('-');
        return (parts[0] === '11' ? 'November ' : 'December ') + parts[0];
    };

    return (
        <div>
            <div hidden={value !== index}>
                <Input
                    className="focus-only"
                    placeholder="Job Title"
                    value={job.position}
                    onChange={(e) => {
                        setJob({ ...job, position: e.target.value });
                    }}
                    style={styles.deadlineTitle}
                ></Input>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Input
                        placeholder="Company"
                        style={styles.deadlineCompany}
                        value={job.company}
                        onChange={(e) => {
                            setJob({ ...job, company: e.target.value });
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <AlternateEmailOutlined />
                            </InputAdornment>
                        }
                    />
                    <Input
                        placeholder="Location"
                        value={job.location}
                        onChange={(e) => {
                            setJob({ ...job, location: e.target.value });
                        }}
                        style={styles.deadlineLocation}
                        startAdornment={
                            <InputAdornment position="start">
                                <LocationOnOutlined />
                            </InputAdornment>
                        }
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '150px',
                            left: '142px',
                            right: '100px',
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Deadline"
                                value={newDdl.date}
                                onChange={(newValue) => {
                                    setNewDdl({ ...newDdl, date: newValue.$d.toJSON() });
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <Button
                            style={{
                                position: 'absolute',
                                width: '150px',
                                top: '75px',
                                left: '0px',
                                right: '100px',
                            }}
                            variant="contained"
                            onClick={addDdl}
                        >
                            Add Deadline
                        </Button>
                    </div>
                </div>
            </div>
            {job.deadlines &&
                job.deadlines.map((ddl) => (
                    <div
                        style={{
                            position: 'absolute',
                            top: '365px',
                            left: '142px',
                            right: '125px',
                        }}
                    >
                        <strong>{dateToString(ddl.date)}</strong>: {ddl.title}
                    </div>
                ))}
        </div>
    );
};

const Questions = ({ value, index, job, setJob }) => {
    const [open, setOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');

    const addNewQuestion = () => {
        setJob({ ...job, interviewQuestions: [newQuestion, ...job.interviewQuestions] });
        setOpen(false);
        setNewQuestion('');
    };

    return (
        <div hidden={value !== index}>
            <Input
                className="focus-only"
                placeholder="Job Title"
                value={job.position}
                onChange={(e) => {
                    setJob({ ...job, position: e.target.value });
                }}
                style={styles.deadlineTitle}
            ></Input>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    placeholder="Company"
                    style={styles.deadlineCompany}
                    value={job.company}
                    onChange={(e) => {
                        setJob({ ...job, company: e.target.value });
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <AlternateEmailOutlined />
                        </InputAdornment>
                    }
                />
                <Input
                    placeholder="Location"
                    value={job.location}
                    onChange={(e) => {
                        setJob({ ...job, location: e.target.value });
                    }}
                    style={styles.deadlineLocation}
                    startAdornment={
                        <InputAdornment position="start">
                            <LocationOnOutlined />
                        </InputAdornment>
                    }
                />
            </div>
            <Button
                style={{
                    position: 'absolute',
                    width: '140px',
                    top: '280px',
                    left: '142px',
                    right: '100px',
                    whiteSpace: 'nowrap',
                }}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Add a question
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent style={{ display: 'flex' }}>
                    <TextField
                        label="Question"
                        value={newQuestion}
                        onChange={(e) => {
                            setNewQuestion(e.target.value);
                        }}
                    />

                    <Button
                        style={{ position: 'absolute', top: 300 }}
                        variant="contained"
                        onClick={addNewQuestion}
                    >
                        Add
                    </Button>
                </DialogContent>
            </Dialog>

            <div
                style={{
                    position: 'absolute',
                    width: '150px',
                    top: '125px',
                    left: '142px',
                    right: '100px',
                    whiteSpace: 'nowrap',
                }}
            >
                {job.interviewQuestions &&
                    job.interviewQuestions.map((q) => (
                        <TextField
                            label="Interview Questions"
                            style={styles.interviewQuestions}
                            multiline
                            rows={4}
                            value={q}
                            onChange={(e) => {
                                setJob({
                                    ...job,
                                    questions: { ...job.questions, questions: e.target.value },
                                });
                            }}
                            InputProps={{
                                disableUnderline: true, // <== added this
                                sx: { width: 480 },
                            }}
                        />
                    ))}
            </div>
        </div>
    );
};

const Contacts = ({ value, index, job, setJob }) => {
    const [open, setOpen] = useState(false);
    const [newContact, setNewContact] = useState('');

    const addNewContact = () => {
        setJob({ ...job, contacts: [newContact, ...job.contacts] });
        setOpen(false);
        setNewContact('');
    };

    return (
        <div hidden={value !== index}>
            <Input
                className="focus-only"
                placeholder="Job Title"
                value={job.position}
                onChange={(e) => {
                    setJob({ ...job, position: e.target.value });
                }}
                style={styles.deadlineTitle}
            ></Input>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    placeholder="Company"
                    style={styles.deadlineCompany}
                    value={job.company}
                    onChange={(e) => {
                        setJob({ ...job, company: e.target.value });
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <AlternateEmailOutlined />
                        </InputAdornment>
                    }
                />
                <Input
                    placeholder="Location"
                    value={job.location}
                    onChange={(e) => {
                        setJob({ ...job, location: e.target.value });
                    }}
                    style={styles.deadlineLocation}
                    startAdornment={
                        <InputAdornment position="start">
                            <LocationOnOutlined />
                        </InputAdornment>
                    }
                />
            </div>
            <TextField
                label="Job Description"
                style={styles.jobDescription}
                multiline
                rows={4}
                value={job.details.description}
                onChange={(e) => {
                    setJob({ ...job, details: { ...job.details, description: e.target.value } });
                }}
                InputProps={{
                    disableUnderline: true, // <== added this
                }}
            />
            <Button
                style={{
                    position: 'absolute',
                    width: '145px',
                    top: '280px',
                    left: '600px',
                    right: '100px',
                    whiteSpace: 'nowrap',
                }}
                variant="contained"
                onClick={() => setOpen(true)}
            >
                Add Contact
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent style={{ display: 'flex' }}>
                    <TextField
                        label="LinkedIn"
                        value={newContact}
                        onChange={(e) => {
                            setNewContact(e.target.value);
                        }}
                    />

                    <Button
                        style={{ width: '57px', height: '27px', background: '#633175' }}
                        onClick={addNewContact}
                    >
                        Add
                    </Button>
                </DialogContent>
            </Dialog>
            {job.contacts &&
                job.contacts.map((contact) => (
                    <TextField
                        label="Contacts"
                        style={styles.contactsBox}
                        multiline
                        rows={4}
                        value={contact}
                        onChange={(e) => {
                            setJob({
                                ...job,
                                contacts: { ...job.contacts, contacts: e.target.value },
                            });
                        }}
                        InputProps={{
                            disableUnderline: true, // <== added this
                            sx: { height: 150, width: 400 },
                        }}
                    />
                ))}
        </div>
    );
};

export default function JobDialog({ jobData, isEdit, setOpen, state, setState, index }) {
    const [job, setJob] = useState({
        company: '',
        contacts: [],
        deadlines: [],
        details: {
            description: '',
            url: '',
        },
        interviewQuestions: [],
        location: '',
        notes: '',
        stage: index,
        position: '',
    });

    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addNewJob = async () => {
        setLoading(true);
        const newState = [...state];
        // Extract id from job
        const { id } = job;
        const jobCopy = structuredClone(job);
        delete jobCopy.id;

        const functionName = isEdit ? 'updateJob' : 'addJob';
        const params = isEdit ? { id, newFields: jobCopy } : jobCopy;
        await httpsCallable(
            getFunctions(),
            functionName
        )(params).then((res) => {
            if (setState === false) {
                CalendarState.updateJob(job);
            } else {
                if (isEdit) {
                    //console.log(index);
                    newState[index] = state[index].map((j) => (j.id === params.id ? job : j));
                } else {
                    newState[index] = [{ ...job, id: res.data }, ...state[index]];
                }

                setState(newState);
            }
        });

        setLoading(false);
        setOpen(false);
    };

    useEffect(() => {
        setJob(jobData ? jobData : { ...job, stage: index });
        console.log(job.stage);
    }, [jobData]);

    return (
        <Dialog open={true} onClose={handleClose} maxWidth={'lg'}>
            <DialogContent
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: 600,
                    paddingRight: 50,
                    paddingTop: 30,
                }}
            >
                {loading ? (
                    <CircularProgress
                        style={{ position: 'absolute', right: 30 }}
                    ></CircularProgress>
                ) : (
                    <div style={{ position: 'absolute', right: 50, top: 20 }}>
                        <Button
                            variant="outlined"
                            style={{
                                padding: '14px 12px 14px 14px',
                                gap: '10px',
                                height: '25px',
                                borderRadius: '4px',
                                marginInlineEnd: 5,
                            }}
                        >
                            <Delete />
                        </Button>
                        <Button
                            variant="contained"
                            onClick={addNewJob}
                            style={{
                                padding: '15px 12px 15px 14px',
                                gap: '10px',
                                width: '25px',
                                height: '25px',
                                borderRadius: '4px',
                            }}
                        >
                            {isEdit ? 'Save' : 'Add'}
                        </Button>
                    </div>
                )}

                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{
                        borderRight: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Tab
                        icon={<DescriptionOutlined />}
                        iconPosition="end"
                        label="Job Details"
                        sx={{ alignSelf: 'end' }}
                    />
                    <Tab
                        icon={<DriveFileRenameOutlineOutlined />}
                        iconPosition="end"
                        label="Notes"
                        sx={{ alignSelf: 'end' }}
                    />
                    <Tab
                        sx={{ alignSelf: 'end' }}
                        icon={<CalendarMonthOutlined />}
                        iconPosition="end"
                        label="Deadlines"
                    />
                    <Tab
                        sx={{ alignSelf: 'end' }}
                        icon={<QuizOutlined />}
                        iconPosition="end"
                        label="Interview Questions"
                    />
                    <Tab
                        sx={{ alignSelf: 'end' }}
                        icon={<ContactPageOutlined />}
                        iconPosition="end"
                        label="Contacts"
                    />
                </Tabs>
                <div
                    style={{
                        marginInlineStart: 50,
                    }}
                >
                    <Details value={tabValue} index={0} job={job} setJob={setJob}></Details>
                    <Notes value={tabValue} index={1} job={job} setJob={setJob}></Notes>
                    <Deadlines value={tabValue} index={2} job={job} setJob={setJob}></Deadlines>
                    <Questions value={tabValue} index={3} job={job} setJob={setJob}></Questions>
                    <Contacts value={tabValue} index={4} job={job} setJob={setJob}></Contacts>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const styles = {
    jobTitle: {
        fontStyle: 'normal',
        fontWeight: '200',
        fontSize: '36px',
        lineHeight: '44px',
        color: '#676767',
    },

    jobDescription: {
        boxSizing: 'border-box',
        width: '480px',
        border: 'none',
        outline: 'none',
    },
    applicationLink: {
        border: 'none',
        outline: 'none',
    },

    Company: {
        outline: 'none',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '14px',

        color: '#676767',
    },
    Location: {
        outline: 'none',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '14px',
        marginLeft: 20,
        color: '#676767',
    },

    Notes: {
        height: '500px',
        width: '480px',
    },

    interviewIcons: {
        width: '740px',
        gap: '42px',
    },

    deadlineButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 12px 16px 16px',
        gap: '10px',
        width: '145px',
        height: '51px',
        whiteSpace: 'nowrap',

        background: '#633175',
        borderRadius: '8px',
    },

    interviewQuestions: {
        boxSizing: 'border-box',
        width: '250px',
        height: '250px',
        border: 'none',
        outline: 'none',
        color: '#676767',
    },

    contactsBox: {
        boxSizing: 'border-box',
        width: '250px',
        height: '120px',
        border: 'none',
        outline: 'none',
        color: '#676767',
    },

    deadlineTitle: {
        fontStyle: 'normal',
        fontWeight: '200',
        fontSize: '36px',
        lineHeight: '44px',
        color: '#676767',
    },

    deadlineLocation: {
        outline: 'none',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '12px',

        color: '#676767',
    },

    deadlineCompany: {
        outline: 'none',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '12px',
        lineHeight: '19px',

        color: '#676767',
    },
};
