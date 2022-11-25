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
} from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import CalendarState from '../calendar/context/CalendarState';

const Details = ({ value, index, job, setJob }) => {
    return (
        <div
            style={{
                justifyContent: 'space-around',
                flexDirection: 'column',
                display: value == index ? 'flex' : 'none',
                height: '100%',
            }}
        >
            <Input
                placeholder="Job Title"
                value={job.position}
                onChange={(e) => {
                    setJob({ ...job, position: e.target.value });
                }}
                style={{ border: 'none' }}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    placeholder="Company"
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
                    startAdornment={
                        <InputAdornment position="start">
                            <LocationOnOutlined />
                        </InputAdornment>
                    }
                />
            </div>
            <TextField
                label="Job description"
                multiline
                rows={4}
                value={job.details.description}
                onChange={(e) => {
                    setJob({ ...job, details: { ...job.details, description: e.target.value } });
                }}
            />
            <TextField
                label="Application link"
                value={job.details.url}
                onChange={(e) => {
                    setJob({ ...job, details: { ...job.details, url: e.target.value } });
                }}
            />
        </div>
    );
};

const Notes = ({ value, index, job, setJob }) => {
    return (
        <div hidden={value !== index}>
            <TextField
                label="Notes"
                multiline
                rows={4}
                value={job.notes}
                onChange={(e) => {
                    setJob({ ...job, notes: e.target.value });
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
        return (parts[1] === '11' ? 'Nov. ' : 'Dec. ') + (parts[2] * 1).toString();
    };

    return (
        <div hidden={value !== index}>
            <Button onClick={() => setOpen(true)}>Add a deadline</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent style={{ display: 'flex' }}>
                    <TextField
                        label="What is due"
                        value={newDdl.position}
                        onChange={(e) => {
                            setNewDdl({ ...newDdl, position: e.target.value });
                        }}
                    />
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
                    <Button onClick={addDdl}>Add</Button>
                </DialogContent>
            </Dialog>
            {job.deadlines &&
                job.deadlines.map((ddl) => (
                    <div>
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
            <Button onClick={() => setOpen(true)}>Add a question</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent style={{ display: 'flex' }}>
                    <TextField
                        label="What was the question"
                        value={newQuestion}
                        onChange={(e) => {
                            setNewQuestion(e.target.value);
                        }}
                    />

                    <Button onClick={addNewQuestion}>Add</Button>
                </DialogContent>
            </Dialog>
            {job.interviewQuestions &&
                job.interviewQuestions.map((question: string) => (
                    <li>
                        <a
                            href={`https://www.google.com/search?q=${question.replaceAll(
                                ' ',
                                '+'
                            )}`}
                        >
                            {question}
                        </a>
                    </li>
                ))}
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
            <Button onClick={() => setOpen(true)}>Add A New Contact</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent style={{ display: 'flex' }}>
                    <TextField
                        label="What was their LinkedIn"
                        value={newContact}
                        onChange={(e) => {
                            setNewContact(e.target.value);
                        }}
                    />

                    <Button onClick={addNewContact}>Add</Button>
                </DialogContent>
            </Dialog>
            {job.contacts &&
                job.contacts.map((contact) => (
                    <div>
                        <a href={contact}>{contact}</a>
                    </div>
                ))}
        </div>
    );
};

export default function JobDialog({
    setCurrentJob,
    jobData,
    isEdit,
    setOpen,
    state,
    setState,
    index,
}) {
    const [job, setJob] = useState({
        awaitingResponse: false,
        company: '',
        contacts: [],
        deadlines: [],
        details: {
            description: '',
            url: '',
        },
        id: '', // Id is needed to identify the job in the database
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
        setCurrentJob(null);
    };

    const commitJob = async () => {
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
                    // console.log(index);
                    newState[index] = state[index].map((j) => (j.id === params.id ? job : j));
                } else {
                    newState[index] = [{ ...job, id: res.data }, ...state[index]];
                }

                setState(newState);
            }
        });

        setLoading(false);
        setOpen(false);
        setCurrentJob(null);
    };

    useEffect(() => {
        setJob(jobData || { ...job, stage: index });
    }, [jobData]);

    return (
        <Dialog open onClose={handleClose} fullWidth maxWidth="lg">
            <DialogContent style={{ display: 'flex' }}>
                {loading ? (
                    <CircularProgress style={{ position: 'absolute', right: 30 }} />
                ) : (
                    <Button
                        onClick={async () => {
                            await commitJob();
                        }}
                        style={{ position: 'absolute', right: 30 }}
                    >
                        {isEdit ? 'Save' : 'Add'}
                    </Button>
                )}

                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<DescriptionOutlined />} iconPosition="start" label="Job Details" />
                    <Tab
                        icon={<DriveFileRenameOutlineOutlined />}
                        iconPosition="start"
                        label="Notes"
                    />
                    <Tab icon={<CalendarMonthOutlined />} iconPosition="start" label="Deadlines" />
                    <Tab icon={<QuizOutlined />} iconPosition="start" label="Interview Questions" />
                    <Tab icon={<ContactPageOutlined />} iconPosition="start" label="Contacts" />
                </Tabs>
                <div
                    style={{
                        marginInlineStart: 50,
                    }}
                >
                    <Details value={tabValue} index={0} job={job} setJob={setJob} />
                    <Notes value={tabValue} index={1} job={job} setJob={setJob} />
                    <Deadlines value={tabValue} index={2} job={job} setJob={setJob} />
                    <Questions value={tabValue} index={3} job={job} setJob={setJob} />
                    <Contacts value={tabValue} index={4} job={job} setJob={setJob} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
