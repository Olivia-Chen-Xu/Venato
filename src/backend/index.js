// import { purgeExpiredData, purgeUnverifiedUsers } from './src/cron.js';
// import { beforeSignIn, createAccount, onUserDeleted, onUserSignup } from './src/auth.js';
// import { onJobCreate, onJobPurge, onBoardPurge } from './src/firestore.js';
// import {
//     getCalendarDeadlines,
//     getHomepageData,
//     getJobBoards,
//     getJobData,
//     getKanbanBoard,
//     jobSearch,
//     interviewQuestionSearch,
// } from './src/getData.js';
// import {
//     addBoard,
//     addContact,
//     addDeadline,
//     addInterviewQuestion,
//     addJob,
//     addJobs,
//     deleteJob,
//     dragKanbanJob,
//     updateJob
// } from './src/mutateData.js';
//
// /**
//  * Entry point for cloud firestore functions deployment
//  *
//  * Writing functions:
//  *  -See https://firebase.google.com/docs/functions/get-started for some examples
//  *  -Generally you'll be making onCall functions (can be called from within the app), these
//  *   take a parameter (object) and implicit context (i.e. the currently logged-in user) and
//  *   need to return a promise (or a Promise.all(...))
//  *  -Best practice is to verify the user is authenticated and any data you are going to access they
//  *   have access to, then return the database operation promise(s) with a .then() and .catch(). The
//  *   .then() should return only the data the app needs, don't return metadata/ids/firestore objects
//  *
//  * Deploying & calling functions:
//  *  -Once the function is written, export it, import it here then export it from this file
//  *  -Initialize firebase (https://firebase.google.com/docs/functions/get-started#set-up-node.js-and-the-firebase-cli)
//  *  -To deploy, run 'firebase deploy --only functions:<FUNCTION NAME>'
//  *  -To call a callable function, use 'httpsCallable(getFunctions(), '<FUNCTION NAME>')(<PARAMETER>)'
//  *   (note: functions are async, you'll need an await)
//  *
//  * Notes/resources:
//  *  -Make sure to throw proper errors if something is wrong (usually either the user is unauthenticated
//  *   or invalid params). The format is 'throw new functions.https.HttpsError('<code>', '<message>')',
//  *   error messages is what went wrong (don't put the app's data in it like the context), codes are listed here:
//  *   https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode
//  *  -Samples: https://github.com/firebase/functions-samples
//  *
//  * You should be able to figure out what to do by going through existing functions, otherwise do a
//  * quick Stack Overflow search 🙂
//  */
//
// export {
//     purgeExpiredData,
//     purgeUnverifiedUsers,
//     createAccount,
//     onUserSignup,
//     onUserDeleted,
//     beforeSignIn,
//     onJobCreate,
//     onJobPurge,
//     onBoardPurge,
//     getHomepageData,
//     getJobBoards,
//     getKanbanBoard,
//     getJobData,
//     getCalendarDeadlines,
//     jobSearch,
//     interviewQuestionSearch,
//     addJobs,
//     addJob,
//     addDeadline,
//     addInterviewQuestion,
//     addContact,
//     updateJob,
//     dragKanbanJob,
//     deleteJob,
//     addBoard
// };


// import { purgeExpiredData, purgeUnverifiedUsers } from './src/cron.js';
// import { beforeSignIn, createAccount, onUserDeleted, onUserSignup } from './src/auth.js';
// import { onJobCreate, onJobPurge, onBoardPurge } from './src/firestore.js';
// import {
//     getCalendarDeadlines,
//     getHomepageData,
//     getJobBoards,
//     getJobData,
//     getKanbanBoard,
//     jobSearch,
//     interviewQuestionSearch,
// } from './src/getData.js';
// import {
//     addBoard,
//     addContact,
//     addDeadline,
//     addInterviewQuestion,
//     addJob,
//     addJobs,
//     deleteJob,
//     dragKanbanJob,
//     updateJob
// } from './src/mutateData.js';

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

exports.cron = require('./src/cron.js');
exports.auth = require('./src/auth.js');
exports.firestore = require('./src/firestore.js');
exports.getData = require('./src/getData.js');
exports.mutateData = require('./src/mutateData.js');

// export {
//     cron.purgeExpiredData,
//     cron.purgeUnverifiedUsers,
//     auth.createAccount,
//     auth.onUserSignup,
//     auth.onUserDeleted,
//     auth.beforeSignIn,
//     firestore.onJobCreate,
//     firestore.onJobPurge,
//     firestore.onBoardPurge,
//     getData.getHomepageData,
//     getData.getJobBoards,
//     getData.getKanbanBoard,
//     getData.getJobData,
//     getData.getCalendarDeadlines,
//     getData.jobSearch,
//     getData.interviewQuestionSearch,
//     mutateData.addJobs,
//     mutateData.addJob,
//     mutateData.addDeadline,
//     mutateData.addInterviewQuestion,
//     mutateData.addContact,
//     mutateData.updateJob,
//     mutateData.dragKanbanJob,
//     mutateData.deleteJob,
//     mutateData.addBoard,
// };
