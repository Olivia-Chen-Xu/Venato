import { onUserSignup, onUserDeleted } from './auth';
import {
    getJobs,
    getJobBoards,
    getCalendarEvents,
    getAllCompanies,
    getAllLocations,
    jobSearch,
} from './getData';
import { addJobs, addJob, updateJob } from './mutateData';
import { onJobCreate } from './firestore';

/**
 * Entry point for cloud firestore functions deployment
 *
 * Writing functions:
 *  -See https://firebase.google.com/docs/functions/get-started for some examples
 *  -Generally you'll be making onCall functions (can be called from within the app), these
 *   take a parameter (object) and implicit context (i.e. the currently logged-in user) and
 *   need to return a promise (or a Promise.all(...))
 *  -Best practice is to verify the user is authenticated and any data you are going to access they
 *   have access to, then return the database operation promise(s) with a .then() and .catch(). The
 *   .then() should return only the data the app needs, don't return metadata/ids/firestore objects
 *
 * Deploying & calling functions:
 *  -Once the function is written, export it, import it here then export it from this file
 *  -Initialize firebase (https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli)
 *  -To deploy, run 'firebase deploy --only functions:<FUNCTION NAME>'
 *  -To call a function, use 'httpsCallable(getFunctions(), '<FUNCTION NAME>')(<PARAMETER>)'
 *   (note: functions are async, you'll need an await)
 *
 * You should be able to figure out what to do by going through existing functions, otherwise do a
 * quick Stack Overflow search 🙂
 */

export {
    onUserSignup,
    onUserDeleted,
    addJobs,
    addJob,
    getJobs,
    getJobBoards,
    updateJob,
    getCalendarEvents,
    jobSearch,
    getAllCompanies,
    getAllLocations,
    onJobCreate,
};
