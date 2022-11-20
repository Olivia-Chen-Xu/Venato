import React, { useEffect, useState } from 'react';
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
                className="focus-only"
                placeholder="job title"
                value={job.position}
                onChange={(e) => {
                    setJob({ ...job, position: e.target.value });
                }}
                style={styles.jobTitle}
            ></Input>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    placeholder="company"
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
                    placeholder="location"
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
                label="job description"
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
            <TextField
                label="application link"
                value={job.details.url}
                style={styles.applicationLink}
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
                label="notes"
                rows={4}
                value={job.notes}
                onChange={(e) => {
                    setJob({ ...job, notes: e.target.value });
                }}
                style={styles.Notes}
                InputProps={{sx: { height: 300 } }}
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

    return (
        <>
            <div hidden={value !== index}>
                    <div style={styles.interviewIcons}className="grid grid-cols-3 gap-20 mx-20 h-40 mt-5 text-white">
                        <div className="place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                            <div className="ml-5 mt-5">
                                <h1>
                                    <span className="text-3xl">Interview</span>
                                </h1>
                            </div>

                            <div className="ml-5 mt-8">
                                <h1 className="text-md align-middle">
                                    <span className="material-icons-outlined text-xl">
                                        schedule
                                    </span>{' '}
                                    Jan 1st - 4:00 PM
                                </h1>
                            </div>
                            <div className="ml-5 mt-1">
                                <h1 className="text-md align-middle">
                                    <span className="material-icons-outlined text-xl">
                                        location_on
                                    </span>{' '}
                                    Zoom
                                </h1>
                            </div>
                        </div>
                        <div className="place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                            <div className="ml-5 mt-5">
                                <h1>
                                    <span className="text-3xl">Interview</span>
                                </h1>
                            </div>

                            <div className="ml-5 mt-8">
                                <h1 className="text-md align-middle">
                                    <span className="material-icons-outlined text-xl">
                                        schedule
                                    </span>{' '}
                                    Jan 1st - 4:00 PM
                                </h1>
                            </div>
                            <div className="ml-5 mt-1">
                                <h1 className="text-md align-middle">
                                    <span className="material-icons-outlined text-xl">
                                        location_on
                                    </span>{' '}
                                    Zoom
                                </h1>
                            </div>
                        </div>
                        <div className="place-content-between bg-gradient-to-tl from-[#8080AE] to-[#C7C7E2] rounded-2xl">
                            <div className="ml-5 mt-5">
                                <h1>
                                    <span className="text-3xl">Interview</span>
                                </h1>
                            </div>

                            <div className="ml-5 mt-8">
                                <h1 className="text-md align-middle">
                                    <span className="material-icons-outlined text-xl">
                                        schedule
                                    </span>{' '}
                                    Jan 1st - 4:00 PM
                                </h1>
                            </div>
                            <div className="ml-5 mt-1">
                                <h1 className="text-md align-middle">
                                    <span className="material-icons-outlined text-xl">
                                        location_on
                                    </span>{' '}
                                    Zoom
                                </h1>
                            </div>
                        </div>
                    </div>
                

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
                            <h3>{ddl.date}</h3>
                            <p>{ddl.position}</p>
                        </div>
                    ))}
            </div>
        </>
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
            <TextField
                label="behavioural questions"
                style={styles.behaviouralQuestions}
                multiline
                rows={4}
                value={job.details.description}
                onChange={(e) => {
                    setJob({
                        ...job,
                        details: { ...job.details, description: e.target.value },
                    });
                }}
                InputProps={{
                    disableUnderline: true,
                }}
            />
            <TextField
                label="technical questions"
                style={styles.technicalQuestions}
                multiline
                rows={4}
                value={job.details.description}
                onChange={(e) => {
                    setJob({
                        ...job,
                        details: { ...job.details, description: e.target.value },
                    });
                }}
                InputProps={{
                    disableUnderline: true, 
                }}
            />
            <Button onClick={() => setOpen(true)}>Add a question</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent style={{ display: 'flex' }}>
                    <TextField
                        label="question"
                        value={newQuestion}
                        onChange={(e) => {
                            setNewQuestion(e.target.value);
                        }}
                    />

                    <Button onClick={addNewQuestion}>Add</Button>
                </DialogContent>
            </Dialog>
            {job.interviewQuestions &&
                job.interviewQuestions.map((q) => (
                    <div>
                        <h3>{q}</h3>
                    </div>
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

                    <Button style={{width: "57px", height: "27px", background: "#633175"}}onClick={addNewContact}>Add</Button>
                </DialogContent>
            </Dialog>
            {job.contacts &&
                job.contacts.map((contact) => (
                    <div>
                        <h3>{contact}</h3>
                    </div>
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
        await httpsCallable(
            getFunctions(),
            'addJob'
        )(job).then((res) => {
            newState[index] = [{ ...job, id: res.data }, ...state[index]];
            setState(newState);
        });
        setLoading(false);
        setOpen(false);
    };

    useEffect(() => {
        setJob(jobData ? jobData : { ...job, stage: index });
        console.log(job.stage);
    }, [jobData]);

    return (
        <Dialog open={true} onClose={handleClose} fullWidth={true} maxWidth={'lg'}>
            <DialogContent style={{ display: 'flex' }}>
                {loading ? (
                    <CircularProgress
                        style={{ position: 'absolute', right: 30 }}
                    ></CircularProgress>
                ) : (
                    <Button onClick={addNewJob} style={{ position: 'absolute', right: 30 }}>
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
        position: 'absolute',
        top: '20px',
        border: 'none',
        outline: 'none',
    },

    jobDescription: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: '750px',
        height: '250px',
        left: '310px',
        top: '120px',
        border: 'none',
        outline: 'none',
    },
    applicationLink: {
        border: 'none',
        outline: 'none',
        top: '20px',
        left: '0px',
    },

    Company: {
        border: 'none',
        outline: 'none',
        position: 'absolute',
        top: '60px',
        left: '310px',
    },
    Location: {
        border: 'none',
        outline: 'none',
        position: 'absolute',
        top: '60px',
        left: '550px',
    },

    Notes: {
        position: 'absolute',
        width: '800px',
        height: '1600px',
        left: '280px',
        top: '40px',
    },

    interviewIcons: {
        position: 'absolute',
        padding: '0px',
        gap: '42px',
        left: '230px',
        top: '65px',
    },

    deadlineButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 12px 16px 16px',
        gap: '10px',

        position: 'absolute',
        width: '152px',
        height: '51px',
        left: '589px',
        top: '614px',

        background: '#633175',
        borderRadius: '8px',
    },

    behaviouralQuestions: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: '700px',
        height: '250px',
        left: '320px',
        top: '75px',
        border: 'none',
        outline: 'none',
    },

    technicalQuestions: {
        boxSizing: 'border-box',
        position: 'absolute',
        width: '700px',
        height: '250px',
        left: '320px',
        top: '250px',
        border: 'none',
        outline: 'none',
    },
};

