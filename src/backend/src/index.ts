import { onUserSignup, onUserDeleted } from "./auth";
import { getEvents, getJobs, getJobBoards, getCalendarEvents, getAllCompanies, getAllLocations, jobSearch } from "./getData";
import { addEvent, addJobs, addJob, updateEvents, updateEventField, updateJob, deleteEvent } from "./mutateData";
import { purgeDeletedEvent, onJobCreate } from "./firestore";


/**
 * Helper functions
 */





/**
 * Callable functions - must be invoked from within the app
 */





export {
    onUserSignup,
    onUserDeleted,
    addEvent,
    addJobs,
    addJob,
    getEvents,
    getJobs,
    getJobBoards,
    updateEvents,
    updateEventField,
    updateJob,
    deleteEvent,
    getCalendarEvents,
    jobSearch,
    getAllCompanies,
    getAllLocations,
    purgeDeletedEvent,
    onJobCreate,
};

// Examples:
// Functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/functions/index.js
// Calling functions examples: https://github.com/iamshaunjp/firebase-functions/blob/lesson-18/public/js/app.js

// Docs:
// Calling functions docs: https://firebase.google.com/docs/functions/callable
// Auth triggers docs: https://firebase.google.com/docs/functions/auth-events
// Firestore triggers docs: https://firebase.google.com/docs/functions/firestore-events
