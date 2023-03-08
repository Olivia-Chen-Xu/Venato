import { purgeExpiredData, purgeUnverifiedUsers } from './cron';
import { beforeSignIn, createAccount, onUserDeleted, onUserSignup, passwordReset } from './auth';
import { onJobCreate, onJobPurge, onBoardPurge } from './firestore';
import {
    getCalendarDeadlines,
    getHomepageData,
    getJobBoards,
    getJobData,
    getKanbanBoard,
    jobSearch,
    interviewQuestionSearch,
} from './getData';
import {
    addBoard,
    addContact,
    updateContact,
    addDeadline,
    updateDeadline,
    addInterviewQuestion,
    updateInterviewQuestion,
    addJob,
    addJobs,
    deleteJob,
    dragKanbanJob,
    updateJob
} from './mutateData';

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
 *  -To call a callable function, use 'httpsCallable(getFunctions(), '<FUNCTION NAME>')(<PARAMETER>)'
 *   (note: functions are async, you'll need an await)
 *
 * Notes/resources:
 *  -Make sure to throw proper errors if something is wrong (usually either the user is unauthenticated
 *   or invalid params). The format is 'throw new functions.https.HttpsError('<code>', '<message>')',
 *   error messages is what went wrong (don't put the app's data in it like the context), codes are listed here:
 *   https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode
 *  -Samples: https://github.com/firebase/functions-samples
 *
 * You should be able to figure out what to do by going through existing functions, otherwise do a
 * quick Stack Overflow search 🙂
 */

export {
    purgeExpiredData,
    purgeUnverifiedUsers,
    createAccount,
    onUserSignup,
    onUserDeleted,
    beforeSignIn,
    passwordReset,
    onJobCreate,
    onJobPurge,
    onBoardPurge,
    getHomepageData,
    getJobBoards,
    getKanbanBoard,
    getJobData,
    getCalendarDeadlines,
    jobSearch,
    interviewQuestionSearch,
    addJobs,
    addJob,
    addDeadline,
    updateDeadline,
    addInterviewQuestion,
    updateInterviewQuestion,
    addContact,
    updateContact,
    updateJob,
    dragKanbanJob,
    deleteJob,
    addBoard
};
