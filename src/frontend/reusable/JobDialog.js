import { useEffect, useState } from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
    AccessTimeOutlined,
    AccountCircleOutlined,
    Add,
    AlternateEmailOutlined,
    CalendarMonthOutlined,
    ContactPageOutlined,
    Delete,
    DescriptionOutlined,
    DriveFileRenameOutlineOutlined,
    Flag,
    MoreHoriz,
    QuizOutlined,
    RoomOutlined,
} from "@mui/icons-material";
import { getFunctions, httpsCallable } from "firebase/functions";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { SocialIcon } from "react-social-icons";
import Checkbox from "@mui/material/Checkbox";
import LoadingButton from "@mui/lab/LoadingButton";

const colTitles = ["Applications", "Interviews", "Offers", "Rejections"];
const priorities = ["High", "Medium", "Low"];

const priorityColor = (p) => {
    switch (p) {
        case "High":
            return "text-[#E56464]";
        case "Medium":
            return "text-[#FF8900]";
        case "Low":
            return "text-[#0CBC8B]";
    }
};

const Headings = ({ jobData, setJob }) => {
    const handleChange = (e) => {
        setJob({
            ...jobData,
            stage: colTitles.indexOf(e.target.value),
        });
    };

    const priorityBg = (p) => {
        switch (p) {
            case "High":
                return "bg-[#FFE7E7]";
            case "Medium":
                return "bg-[#FFF4E7]";
            case "Low":
                return "bg-[#DEFFE5]";
        }
    };

    return (
        <>
            <div className="w-full">
                <div className="flex flex-row justify-center  align-center w-full">
                    <div className="grid grid-col-1 w-full pl-6 ">
                        <h1 className="text-3xl">{jobData.position}</h1>
                        <div className="flex flex-1 mt-4">
                            <h1
                                className="text-xl mr-6 flex flex-row justify-center items-center"
                                style={{ fontWeight: 400 }}
                            >
                                {" "}
                                <AlternateEmailOutlined className=""/>{" "}
                                <div className="">{jobData.company}</div>
                            </h1>
                            <TextField
                                select
                                value={colTitles[jobData.stage]}
                                onChange={handleChange}
                                size="small"
                                sx={{ padding: 0 }}
                                InputProps={{
                                    style: {
                                        borderRadius: "8px",
                                    },
                                }}
                            >
                                {colTitles.map((title) => (
                                    <MenuItem value={title}>{title}</MenuItem>
                                ))}
                            </TextField>
                            <div
                                className={`ml-5 ${priorityBg(jobData.priority)} ${priorityColor(
                                    jobData.priority
                                )}  rounded-lg flex flex-row py-1 px-2 items-center`}
                            >
                                <Flag/> <p className="text-base">{jobData.priority}</p>
                            </div>
                        </div>
                    </div>
                    {" "}
                </div>
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

    const priorityColor = (p) => {
        switch (p) {
            case "High":
                return "text-[#E56464]";
            case "Medium":
                return "text-[#FF8900]";
            case "Low":
                return "text-[#0CBC8B]";
        }
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
            <div className="mt-8 flex flex-row justify-center align-center h-full w-full">
                <div className="w-3/4">
                    <div className="flex flex-1 w-full mb-5">
                        <div className="flex flex-col w-full mr-8">
                            <h1>Job Title</h1>
                            <TextField
                                style={{ marginTop: "1vh" }}
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                                className="w-full"
                                value={jobData.position}
                                onChange={(e) => {
                                    setJob({ ...jobData, position: e.target.value });
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <h1>Priority</h1>
                            <TextField
                                select
                                style={{ marginTop: "1vh" }}
                                value={jobData.priority}
                                onChange={handleChange}
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                            >
                                {priorities.map((p) => (
                                    <MenuItem value={p}>
                                        <Flag className={priorityColor(p)}/>
                                    </MenuItem>
                                ))}
                            </TextField>{" "}
                        </div>
                    </div>
                    <div className="flex flex-1 w-full mb-5">
                        <div className="flex flex-col w-full mr-4">
                            <h1>Company</h1>
                            <TextField
                                value={jobData.company}
                                style={{ marginTop: "1vh" }}
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                                onChange={(e) => {
                                    setJob({ ...jobData, company: e.target.value });
                                }}
                            />
                        </div>
                        <div className="flex flex-col w-full ml-4">
                            <h1>Location</h1>
                            <TextField
                                style={{ marginTop: "1vh" }}
                                value={jobData.location}
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                                onChange={(e) => {
                                    setJob({ ...jobData, location: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 w-full mb-5">
                        <div className="flex flex-col w-full">
                            <h1>Posting Link</h1>
                            <TextField
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                                value={jobData.link}
                                style={{ marginTop: "1vh" }}
                                // style={styles.applicationLink}
                                onChange={(e) => {
                                    setJob({ ...jobData, link: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 w-full mb-5">
                        <div className="flex flex-col w-full">
                            <h1>Job Details</h1>
                            <TextField
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                                // style={styles.jobDescription}
                                style={{ marginTop: "1vh" }}
                                multiline
                                rows={5}
                                value={jobData.description}
                                onChange={(e) => {
                                    setJob({
                                        ...jobData,
                                        description: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
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
            <div className="mt-8 flex flex-row justify-center align-center w-full">
                <div className="w-3/4">
                    <h1>Notes</h1>
                    <TextField
                        InputProps={{
                            style: {
                                borderRadius: "8px",
                            },
                        }}
                        style={{ marginTop: "2vh", height: "100%", width: "100%" }}
                        multiline
                        rows={15}
                        size="small"
                        value={jobData.notes}
                        onChange={(e) => {
                            setJob({ ...jobData, notes: e.target.value });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const Deadlines = ({ value, index, jobData, setJob }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const menuOpen = Boolean(anchorEl);
    const [newDdl, setNewDdl] = useState({
        title: "",
        date: dayjs().unix(),
        location: "",
        link: "",
    });
    const [loading, setLoading] = useState(false);

    const addNewDdl = async () => {
        setLoading(true);
        await httpsCallable(
            getFunctions(),
            "addDeadline"
        )({ ...newDdl, jobId: jobData.id, company: jobData.company }).then((res) =>
            setNewDdl({ ...newDdl, id: res.result })
        );
        setJob({ ...jobData, deadlines: [newDdl, ...jobData.deadlines] });
        setOpen(false);
    };

    const updateDdl = async () => {
        const deadlineUpdate = {
            date: newDdl.date,
            isInterview: newDdl.isInterview,
            link: newDdl.link,
            location: newDdl.location,
            priority: newDdl.priority,
            title: newDdl.title,
        };
        await httpsCallable(
            getFunctions(),
            "updateDeadline"
        )({ deadlineId: newDdl.id, deadline: deadlineUpdate }).then(() => {
            const deadlineIndex = jobData.deadlines.findIndex(
                (deadline) => deadline.id === newDdl.id
            );
            jobData.deadlines[deadlineIndex] = newDdl;
        });
        setLoading(false);
        setOpen(false);
    };

    const uniqueDates = jobData.deadlines
        ? [
            ...new Set(
                jobData.deadlines.map((deadline) =>
                    dayjs.unix(deadline.date).format("MMMM D, YYYY")
                )
            ),
        ]
        : [];

    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <div className="flex flex-row justify-center align-center w-full">
                <div className="grid grid-col-1 w-4/5 place-content-end">
                    <LoadingButton
                        style={{
                            width: "fit-content",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                            padding: "1vh 1vw",
                            border: "2px solid #7F5BEB",
                        }}
                        sx={{ borderRadius: 2 }}
                        variant="outlined"
                        onClick={() => {
                            setIsAdding(true);
                            setOpen(true);
                        }}
                        startIcon={<Add/>}
                    >
                        Add Deadline
                    </LoadingButton>
                </div>
            </div>
            <div className="flex flex-row justify-center align-center w-full">
                <div className="w-4/5">
                    {uniqueDates &&
                        uniqueDates
                            .sort((a, b) => a - b)
                            .map((date) => (
                                <div key={date}>
                                    <h1 className="mb-4">{date}</h1>
                                    {jobData.deadlines &&
                                        jobData.deadlines
                                            .filter(
                                                (deadline) =>
                                                    dayjs
                                                        .unix(deadline.date)
                                                        .format("MMMM D, YYYY") === date
                                            )
                                            .sort((a, b) => a.date - b.date)
                                            .map((deadline) => (
                                                <div className="mb-2">
                                                    <div className="border rounded-lg mb-4">
                                                        <div
                                                            className="flex flex-row-reverse w-full mr-5">
                                                            <MoreHoriz
                                                                className="mr-4 cursor-pointer"
                                                                onClick={(e) => {
                                                                    setAnchorEl(e.currentTarget);
                                                                    setNewDdl(deadline);
                                                                }}
                                                            ></MoreHoriz>
                                                            <Menu
                                                                open={menuOpen}
                                                                onClose={() => setAnchorEl(null)}
                                                                anchorEl={anchorEl}
                                                                transformOrigin={{
                                                                    horizontal: "right",
                                                                    vertical: "top",
                                                                }}
                                                                anchorOrigin={{
                                                                    horizontal: "right",
                                                                    vertical: "bottom",
                                                                }}
                                                            >
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        setIsAdding(false);
                                                                        setOpen(true);
                                                                    }}
                                                                >
                                                                    Edit
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={async () => {
                                                                        await httpsCallable(
                                                                            getFunctions(),
                                                                            "deleteDeadline"
                                                                        )(deadline.id).then(
                                                                            () =>
                                                                                (jobData.deadlines =
                                                                                    jobData.deadlines.filter(
                                                                                        (c) =>
                                                                                            c.id !==
                                                                                            deadline.id
                                                                                    ))
                                                                        );
                                                                    }}
                                                                >
                                                                    Delete
                                                                </MenuItem>
                                                            </Menu>
                                                        </div>
                                                        {" "}
                                                        <div
                                                            className="flex flex-1 justify-between mb-3 -mt-2">
                                                            <div className="flex flex-1">
                                                                <Checkbox
                                                                    className="mr-5"
                                                                    style={{ padding: "0 1vw" }}
                                                                />
                                                                <h1 className="mt-1 font-medium">
                                                                    {deadline.title}
                                                                </h1>
                                                            </div>
                                                            <div
                                                                className="flex flex-1 justify-end">
                                                                <div
                                                                    className="border rounded-lg bg-[#F2F9FA] py-1 px-2">
                                                                    <div
                                                                        className="flex flex-1 text-[#003F4B]">
                                                                        <AccessTimeOutlined/>
                                                                        {/* {console.log(dayjs.unix(deadline.date).format('HH:mm'))} */}
                                                                        <h1 className="pl-1">
                                                                            {dayjs
                                                                                .unix(deadline.date)
                                                                                .format("h:mm A")}
                                                                        </h1>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="border rounded-lg bg-[#D8CFF3] py-1 ml-4 mr-12 px-2">
                                                                    <div
                                                                        className="flex flex-1 text-[#3F15BB]">
                                                                        <RoomOutlined/>
                                                                        <h1 className="pl-1">
                                                                            {deadline.location}
                                                                        </h1>
                                                                    </div>
                                                                </div>
                                                                {/* <h1>{deadline.link}</h1> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                </div>
                            ))}
                </div>
                {" "}
            </div>

            <Dialog
                fulLWidth
                maxWidth="xl"
                PaperProps={{
                    style: { borderRadius: 16, padding: "5vh 5vw" },
                }}
                open={open}
                onClose={() => {
                    setOpen(false);
                    setNewDdl({
                        title: "",
                        date: dayjs().unix(),
                        location: "",
                        link: "",
                    });
                }}
            >
                <DialogContent style={{ width: "50vw" }}>
                    <div className="flex flex-row justify-between mb-4">
                        <h1 className="text-xl w-full">Create Deadline</h1>
                        <div className="flex flex-row-reverse w-full">
                            <div className="ml-3">
                                <Button
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                    color="neutral"
                                    style={{ width: 100, border: "2px solid #7F5BEB" }}
                                    onClick={() => {
                                        setOpen(false);
                                        setLoading(false);
                                    }}
                                >
                                    Discard
                                </Button>
                            </div>
                            <LoadingButton
                                type="submit"
                                sx={{ borderRadius: 2 }}
                                variant="contained"
                                color="neutral"
                                style={{ width: 100 }}
                                onClick={async () => {
                                    isAdding ? await addNewDdl() : await updateDdl();
                                    setLoading(false);
                                }}
                                loading={loading}
                                disableElevation
                            >
                                {isAdding ? "Add" : "Save"}
                            </LoadingButton>
                        </div>
                    </div>
                    <div className="w-full mb-4">
                        <div className="flex flex-1 w-full mb-8">
                            <div className="flex flex-col w-full">
                                <h1>Task Title</h1>
                                <TextField
                                    className="w-full"
                                    style={{ marginTop: "1vh" }}
                                    value={newDdl.title}
                                    InputProps={{
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                    onChange={(e) => {
                                        setNewDdl({ ...newDdl, title: e.target.value });
                                    }}
                                />{" "}
                            </div>
                        </div>
                        <div className="flex flex-1 w-full mb-8">
                            <div className="flex flex-col w-full mr-4">
                                <h1>Date & Time</h1>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        value={dayjs.unix(newDdl.date)}
                                        InputProps={{
                                            style: {
                                                borderRadius: "16px",
                                            },
                                        }}
                                        onChange={(val) =>
                                            setNewDdl({ ...newDdl, date: val.unix() })
                                        }
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className="flex flex-1 w-full mb-8">
                            <div className="flex flex-col w-full mr-4">
                                <h1>Location</h1>
                                <TextField
                                    value={newDdl.location}
                                    style={{ marginTop: "1vh" }}
                                    InputProps={{
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                    onChange={(e) => {
                                        setNewDdl({
                                            ...newDdl,
                                            location: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            <div className="flex flex-col w-full ml-4">
                                <h1>Link (If Applicable)</h1>
                                <TextField
                                    style={{ marginTop: "1vh" }}
                                    value={newDdl.link}
                                    InputProps={{
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                    onChange={(e) => {
                                        setNewDdl({
                                            ...newDdl,
                                            link: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const Questions = ({ value, index, jobData, setJob }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ name: '', description: '', company: '' });

    const addNewQuestion = async () => {
        setLoading(true);
        setJob({ ...jobData, interviewQuestions: [newQuestion, ...jobData.interviewQuestions] });
        setOpen(false);
        await httpsCallable(
            getFunctions(),
            "addInterviewQuestion"
        )({ jobId: jobData.id, ...newQuestion });
        setNewQuestion({ name: '', description: '', company: '' });
        setLoading(false);
    };

    const updateQuesiton = async (questionId) => {
        const questionUpdate = {
            description: newQuestion.description,
            name: newQuestion.name,
        };

        await httpsCallable(
            getFunctions(),
            "updateInterviewQuestion"
        )({ questionId: questionId, question: questionUpdate }).then(() => {
            const questionIndex = jobData.interviewQuestions.findIndex(
                (question) => question.id === newQuestion.id
            );
            jobData.interviewQuestions[questionIndex] = newQuestion;
        });
        setOpen(false);
    };

    const renderQuestions = () => {
        if (!jobData.interviewQuestions) {
            return;
        }
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

        return jobData.interviewQuestions.map((question) => (
            <div className="border rounded-xl mb-8">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between ml-8 mt-4">
                        <h1 className="font-medium font-lg">{question.name}</h1>

                        <MoreHoriz
                            className="cursor-pointer mr-4"
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setNewQuestion(question);
                            }}
                        ></MoreHoriz>
                    </div>
                    <div className="mx-8 mt-2 mb-4">
                        <h1>{question.description}</h1>
                    </div>
                    <Menu
                        open={menuOpen}
                        onClose={() => setAnchorEl(null)}
                        anchorEl={anchorEl}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        <MenuItem
                            onClick={() => {
                                setIsEditing(true);

                                setOpen(true);
                            }}
                        >
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={async () => {
                                await httpsCallable(
                                    getFunctions(),
                                    "deleteInterviewQuestion"
                                )(question.id).then(
                                    () =>
                                        (jobData.interviewQuestions =
                                            jobData.interviewQuestions.filter(
                                                (c) => c.id !== question.id
                                            ))
                                );
                            }}
                        >
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        ));
    };

    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <div className="flex flex-row justify-center align-center w-full">
                <div className="grid grid-col-1 w-4/5 place-content-end">
                    <Button
                        style={{
                            width: "fit-content",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                            padding: "1vh 1vw",
                            border: "2px solid #7F5BEB",
                            borderRadius: "16px",
                        }}
                        sx={{ borderRadius: 2 }}
                        variant="outlined"
                        onClick={() => {
                            setIsEditing(false);
                            setOpen(true);
                        }}
                        startIcon={<Add/>}
                    >
                        Add Interview Question
                    </Button>
                </div>
            </div>
            <Dialog
                fulLWidth
                maxWidth="xl"
                PaperProps={{
                    style: { borderRadius: 16, padding: "5vh 5vw" },
                }}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <DialogContent style={{ borderRadius: 16, width: "50vw" }}>
                    <div className="flex flex-row justify-between mb-4">
                        <h1 className="text-xl w-full">
                            {isEditing ? "Edit Interview Question" : "Create Interview Question"}
                        </h1>
                        <div className="flex flex-row-reverse w-full">
                            <div className="ml-3">
                                <Button
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                    color="neutral"
                                    style={{ width: 100, border: "2px solid #7F5BEB" }}
                                    onClick={() => {
                                        setOpen(false);
                                        setLoading(false);
                                    }}
                                >
                                    Discard
                                </Button>
                            </div>
                            <LoadingButton
                                sx={{ borderRadius: 2 }}
                                variant="contained"
                                color="neutral"
                                style={{ width: 100 }}
                                onClick={async () => {
                                    isEditing
                                        ? await updateQuesiton(newQuestion.id)
                                        : await addNewQuestion();
                                }}
                                loading={loading}
                                disableElevation
                            >
                                {isEditing ? "Save" : "Add"}
                            </LoadingButton>
                        </div>
                    </div>
                    <div className="flex flex-1 w-full mb-8">
                        <div className="flex flex-col w-full">
                            <h1>Question title</h1>
                            <TextField
                                style={{ marginTop: "1vh" }}
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                                value={newQuestion.name}
                                fullWidth
                                onChange={(e) => {
                                    setNewQuestion({ ...newQuestion, name: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 w-full">
                        <div className="flex flex-col w-full">
                            <h1>Question description</h1>
                            <TextField
                                style={{ marginTop: "1vh" }}
                                InputProps={{
                                    style: {
                                        borderRadius: "16px",
                                    },
                                }}
                                multiline
                                rows={10}
                                value={newQuestion.description}
                                fullWidth
                                onChange={(e) => {
                                    setNewQuestion({ ...newQuestion, description: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex flex-row justify-center align-center w-full">
                <div className="w-4/5">{renderQuestions()}</div>
            </div>
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
    const [isEditing, setIsEditing] = useState(false);

    const addNewContact = async () => {
        setJob({ ...jobData, contacts: [newContact, ...jobData.contacts] });
        await httpsCallable(getFunctions(), "addContact")({ jobId: jobData.id, ...newContact });
        setOpen(false);
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

    const editContact = async () => {
        const updateContact = {
            company: newContact.company,
            email: newContact.email,
            linkedin: newContact.linkedin,
            name: newContact.name,
            notes: newContact.notes,
            phone: newContact.phone,
            title: newContact.title,
        };
        await httpsCallable(
            getFunctions(),
            "updateContact"
        )({ contactId: newContact.id, contact: updateContact });
        const newJob = jobData.contacts.map((c) => (c.id === newContact.id ? newContact : c));
        setJob({ ...jobData, contacts: newJob });
        setOpen(false);
    };

    return (
        <div
            style={{
                flexDirection: "column",
                display: value === index ? "flex" : "none",
                height: "100%",
            }}
        >
            <div className="flex flex-row justify-center align-center w-full">
                <div className="grid grid-col-1 w-4/5 place-content-end">
                    <Button
                        style={{
                            width: "fit-content",
                            marginTop: "2vh",
                            marginBottom: "2vh",
                            padding: "1vh 1vw",
                            border: "2px solid #7F5BEB",
                        }}
                        sx={{ borderRadius: 2 }}
                        variant="outlined"
                        onClick={() => {
                            setIsEditing(false);
                            setOpen(true);
                        }}
                        startIcon={<Add/>}
                    >
                        Add Contact
                    </Button>
                </div>
            </div>
            <Dialog
                fulLWidth
                maxWidth="xl"
                PaperProps={{
                    style: { borderRadius: 16, padding: "5vh 5vw" },
                }}
                open={open}
                onClose={async () => {
                    // const contactUpdate = {
                    //     name: newContact.name,
                    //     title: newContact.title,
                    //     company: newContact.company,
                    //     email: newContact.email,
                    //     phone: newContact.phone,
                    //     linkedin: newContact.linkedin,
                    //     notes: newContact.notes,
                    // };
                    // await httpsCallable(
                    //     getFunctions(),
                    //     "updateContact"
                    // )({ contactId: newContact.id, contact: contactUpdate }).then(() => {
                    //     const contactIndex = jobData.contacts.findIndex(
                    //         (contact) => contact.id === newContact.id
                    //     );
                    //     jobData.contacts[contactIndex] = newContact;
                    // });
                    setOpen(false);
                }}
            >
                <DialogContent style={{ width: "50vw" }}>
                    <div className="flex flex-row justify-between mb-4">
                        <h1 className="text-xl w-full">Create Contact</h1>
                        <div className="flex flex-row-reverse w-full">
                            <div className="ml-3">
                                <Button
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                    color="neutral"
                                    style={{ width: 100, border: "2px solid #7F5BEB" }}
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    Discard
                                </Button>
                            </div>
                            <Button
                                type="submit"
                                sx={{ borderRadius: 2 }}
                                variant="contained"
                                color="neutral"
                                style={{ width: 100 }}
                                onClick={async () => {
                                    isEditing ? await editContact() : await addNewContact();
                                }}
                            >
                                {isEditing ? "Save" : "Add"}
                            </Button>
                        </div>
                    </div>
                    <div className="w-full mb-4">
                        <div className="flex flex-1 w-full mb-8">
                            <div className="flex flex-col w-full">
                                <h1>Contact Name</h1>
                                <TextField
                                    className="w-full"
                                    style={{ marginTop: "1vh" }}
                                    value={newContact.name}
                                    InputProps={{
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                    onChange={(e) => {
                                        setNewContact({
                                            ...newContact,
                                            name: e.target.value,
                                        });
                                    }}
                                />{" "}
                            </div>
                        </div>
                        <div className="flex flex-1 w-full mb-8">
                            <div className="flex flex-col w-full mr-4">
                                <h1>Job Title</h1>
                                <TextField
                                    value={newContact.title}
                                    style={{ marginTop: "1vh" }}
                                    InputProps={{
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                    onChange={(e) => {
                                        setNewContact({
                                            ...newContact,
                                            title: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            <div className="flex flex-col w-full ml-4">
                                <h1>Company</h1>
                                <TextField
                                    style={{ marginTop: "1vh" }}
                                    value={newContact.company}
                                    InputProps={{
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                    onChange={(e) => {
                                        setNewContact({
                                            ...newContact,
                                            company: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-1 w-full">
                            <div className="flex flex-col w-full">
                                <h1>LinkedIn Profile Link</h1>
                                <TextField
                                    className="w-full"
                                    value={newContact.linkedin}
                                    style={{ marginTop: "1vh" }}
                                    InputProps={{
                                        style: {
                                            borderRadius: "16px",
                                        },
                                    }}
                                    onChange={(e) => {
                                        setNewContact({
                                            ...newContact,
                                            linkedin: e.target.value,
                                        });
                                    }}
                                />{" "}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="flex flex-row justify-center align-center w-full">
                <div className="grid grid-cols-3 gap-14 w-4/5">
                    {jobData.contacts &&
                        jobData.contacts.map((contact) => (
                            <div className="border rounded-xl">
                                <div className="flex flex-row-reverse w-full mr-5">
                                    <MoreHoriz
                                        className="mr-4 cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorEl(e.currentTarget);
                                            setNewContact(contact);
                                        }}
                                    ></MoreHoriz>
                                    <Menu
                                        open={menuOpen}
                                        onClose={() => setAnchorEl(null)}
                                        anchorEl={anchorEl}
                                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                setIsEditing(true);
                                                setOpen(true);
                                            }}
                                        >
                                            Edit
                                        </MenuItem>
                                        <MenuItem
                                            onClick={async () => {
                                                await httpsCallable(
                                                    getFunctions(),
                                                    "deleteContact"
                                                )(contact.id).then(
                                                    () =>
                                                        (jobData.contacts = jobData.contacts.filter(
                                                            (c) => c.id !== contact.id
                                                        ))
                                                );
                                            }}
                                        >
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </div>
                                <div className="mx-4 mb-4 -mt-2">
                                    <div className="flex flex-1 w-full mb-2">
                                        <div
                                            className="flex flex-row justify-center font-light align-center mr-2 mt-4 px-4">
                                            <AccountCircleOutlined
                                                className="scale-[2.25]"
                                                sx={{ stroke: "#ffffff", strokeWidth: 1 }}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <h2 className="text-lg font-medium">{contact.name}</h2>
                                            <p className="mt-1">{contact.title}</p>
                                            <p className="mb-1">@ {contact.company}</p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full border-2 border-[#367CFF]"
                                        color="info"
                                        style={{ border: "2px solid #367CFF" }}
                                        variant="outlined"
                                        sx={{ borderRadius: 2 }}
                                        onClick={() => {
                                            window.open(contact.linkedin, "_blank");
                                        }}
                                    >
                                        <SocialIcon
                                            className="w-1/2 mr-2"
                                            url="https://www.linkedin.com/in/"
                                            style={{ height: 20, width: 20 }}
                                        />
                                        Contact
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
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
        await httpsCallable(
            getFunctions(),
            "updateJobData"
        )({ jobId: jobData.id, jobData: newJobData });
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
        <Dialog
            fullWidth
            scroll="paper"
            className="overflow-hidden"
            maxWidth="xl"
            onClose={async () => await handleClose()}
            open={true}
        >
            <DialogContent
                className=""
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: "90vh",
                    background: "linear-gradient(180deg, #FFF 25%, #F6F6F6  0%)",
                    paddingBlock: 40,
                }}
            >
                <DialogTitle style={{ paddingInline: 0 }}>
                    <div className="bg-white -mt-5 overflow-hidden">
                        <Headings jobData={job} setJob={setJob}/>
                    </div>
                    <div
                        className="flex flex-row bg-white px-20 justify-center align-center w-full pt-5">
                        <div className="grid grid-col-1 w-full  place-content-evenly">
                            <Tabs
                                centered
                                className="w-full"
                                variant="fullWidth"
                                value={tabValue}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                            >
                                <Tab
                                    icon={<DescriptionOutlined/>}
                                    sx={{ marginRight: "3vw" }}
                                    iconPosition="start"
                                    label="Job Details"
                                />
                                <Tab
                                    sx={{ marginRight: "3vw" }}
                                    icon={<DriveFileRenameOutlineOutlined/>}
                                    iconPosition="start"
                                    label="Notes"
                                />
                                <Tab
                                    icon={<CalendarMonthOutlined/>}
                                    sx={{ marginRight: "3vw" }}
                                    iconPosition="start"
                                    label="Deadlines"
                                />
                                <Tab
                                    icon={<QuizOutlined/>}
                                    sx={{ marginRight: "3vw" }}
                                    iconPosition="start"
                                    label="Interview Questions"
                                />
                                <Tab
                                    icon={<ContactPageOutlined/>}
                                    iconPosition="start"
                                    label="Contacts"
                                />
                            </Tabs>{" "}
                        </div>
                        {" "}
                    </div>
                </DialogTitle>
                <Details value={tabValue} index={0} jobData={job} setJob={setJob}/>
                <Notes value={tabValue} index={1} jobData={job} setJob={setJob}/>
                <Deadlines value={tabValue} index={2} jobData={job} setJob={setJob}/>
                <Questions value={tabValue} index={3} jobData={job} setJob={setJob}/>
                <Contacts value={tabValue} index={4} jobData={job} setJob={setJob}/>
                {loading ? (
                    <CircularProgress style={{ position: 'absolute', right: 30 }}/>
                ) : (
                    <div style={{ position: 'absolute', right: '2vw', top: '4vh' }}>
                        <Button
                            variant="outlined"
                            style={{
                                padding: '14px 12px 14px 14px',
                                gap: '10px',
                                height: '25px',
                                borderRadius: '4px',
                                marginInlineEnd: 5,
                            }}
                            onClick={() => deleteJob(job)}
                        >
                            <Delete/>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={updateJob}
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
