import { useState } from 'react';
import icon from '../../assets/icon.svg';
import { getFunctions, httpsCallable } from 'firebase/functions';


export const QuickView = () => {
    // use states to store form data
    const [notes, setNotes] = useState('');
    const [questions, setInterviewQuestions] = useState('');
    const [recruiter, setRecruiter] = useState('');
    const [position, setPosition] = useState('');
    const [validLinkedin, setLinkedin] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    // function to update state of notes with user input
    const handleChange = (e: any) => {
        setNotes(e.target.value);
    };
    // function to update state of interview questions with user input
    const handleQuestionsChange = (e: any) => {
        setInterviewQuestions(e.target.value);
    };
    // function to update state of recruiter with user input
    const handleRecruiterChange = (e: any) => {
        setRecruiter(e.target.value);
    };
    // function to update state of job position with user input
    const handlePositionChange = (e: any) => {
        setPosition(e.target.value);
    };
    // function to update state of linkedin with user input
    const handleLinkedinChange = (e: any) => {
        setLinkedin(e.target.value);
    };

    // function to update state of password with user input
    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    };
    // function to update state of confirm password with user input
    const handleConfPasswordChange = (e: any) => {
        setConfPassword(e.target.value);
    };


    // function to send user inputs to firebase
    const onUserInput = httpsCallable(getFunctions(), 'onUserInput');

    // function to update user inputs in
    const onFieldUpdate = httpsCallable(getFunctions(), 'onFieldRemoval');

    // below function will be called when user click on submit button -> user must enter password for security purposes
    const handleSubmit = (e: any) => {
        if (password != confPassword) {
            alert('Passwords do not match. Please try again.');
        } else {
            // display alert box with user inputs
            onUserInput({
                notes: notes,
                questions: questions,
                position: position,
                validLinkedin: validLinkedin,
            });
            alert(
                'A form was submitted with Notes :"' +
                    notes +
                    '" ,Questions :"' +
                    questions +
                    '" ,Position :"' +
                    position +
                    '" ,and a valid Linkedin URL"' +
                    validLinkedin +
                    '"'
            );
        }
        e.preventDefault();
    };

    return (
        <div>
            <div className="Logo">
                <img width="100" height="100" alt="icon" src={icon} />
            </div>
            <h1 className="Title">Job Title</h1>
            <h2 className="Company">Company</h2>
            <div className="Form">
                <form
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                >
                    <label>Notes:</label>
                    <br />
                    <input
                        type="text"
                        value={notes}
                        required
                        onChange={(e) => {
                            handleChange(e);
                        }}
                    />
                    <br />
                    <label>Questions:</label>
                    <br />
                    <input
                        type="text"
                        value={questions}
                        required
                        onChange={(e) => {
                            handleQuestionsChange(e);
                        }}
                    />
                    <br />
                    <label>Recruiter:</label>
                    <br />
                    <input
                        type="text"
                        value={recruiter}
                        required
                        onChange={(e) => {
                            handleRecruiterChange(e);
                        }}
                    />
                    <br />
                    <label>Position:</label>
                    <br></br>
                    <input
                        type="text"
                        value={position}
                        required
                        onChange={(e) => {
                            handlePositionChange(e);
                        }}
                    ></input>
                    <br />
                    <label>Linkedin:</label>
                    <br />
                    <input
                        type="text"
                        value={validLinkedin}
                        required
                        onChange={(e) => {
                            handleLinkedinChange(e);
                        }}
                    ></input>
                    <br />
                    <label>Password:</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={(e) => {
                            handlePasswordChange(e);
                        }}
                    />
                    <br />
                    <label>Confirm Password:</label>
                    <br />
                    <input
                        type="password"
                        value={confPassword}
                        required
                        onChange={(e) => {
                            handleConfPasswordChange(e);
                        }}
                    />
                    <br />
                    <input className="Submit" type="submit" value="Submit" />
                </form>
            </div>
            <div className="Border">
                <h2
                    style={{
                        top: '300',
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: '400',
                    }}
                >
                    Location
                </h2>
            </div>
            <div className="Deadline-Divider"></div>
            <div className="Deadline-Tabs">Upcoming Deadlines</div>
            <div id="next-deadline" className="Deadline-Tabs">
                Next Deadline
            </div>
            <button
                onClick={(e) => {
                    onFieldUpdate(e);
                }}
                className="Edit"
            >
                Save Edits
            </button>
            <button className="ViewCal" type="button">
                View Calendar
            </button>
            <button className="DeleteCollection">
                Delete Information
            </button>
        </div>
    );
};
