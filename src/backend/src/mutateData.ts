import * as functions from 'firebase-functions';
import {
    auth,
    db,
    getCollection,
    getDoc, getFirestoreTimestamp,
    isValidObjectStructure,
    verifyDocPermission,
    verifyIsAuthenticated
} from './helpers';
import { IContact, IDeadline, IInterviewQuestion, IJob } from './DataInterfaces';

/**
 * Callable functions for mutating data in firestore (creating, updating or deleting)
 */

// Adds a list of jobs to firestore
// This is only used for generating jobs in development
const addJobs = functions.https.onCall(
    async (data: { jobs: IJob[]; boards: { userId: string, name: string, id: string }[] }, context: any) => {
        // Verify admin account is requesting this
        verifyIsAuthenticated(context);

        const userEmail = await auth.getUser(context.auth.token.uid)
            .then((user) => user.email);
        if (!userEmail || userEmail !== '18rem8@queensu.ca') {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Only the admin account can add jobs; contact Reid for details'
            );
        }

        // Verify params are valid
        const structure = {
            jobs: [],
            boards: [],
        };
        if (!isValidObjectStructure(data, structure)) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Must provide only an array of jobs and boards as arguments'
            );
        }

        // Add boards and jobs to db
        for (const board of data.boards) {
            await getCollection('boards').add({ userId: board.userId, name: board.name }).then((doc) => {
                data.jobs.filter((job) => job.boardId === board.id).forEach((job) => {
                    job.boardId = doc.id;
                });
            });
        }

        const jobsBatch = db.batch();
        data.jobs.forEach((job: any) => {
            job.userId = context.auth.uid;
            jobsBatch.set(db.collection('jobs').doc(), job);
        });
        return jobsBatch
            .commit()
            .then(() => 'Jobs added successfully')
            .catch((err: any) => `Error adding jobs: ${err}`);
    }
);

// Adds a job to firestore (structuring and back-end stuff is done with a trigger)
const addJob = functions.https.onCall(async (jobData: { boardId: string, stage: number }, context: any) => {
    const structure = {
        boardId: '',
        stage: 0
    };
    if (!isValidObjectStructure(jobData, structure)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a board id (string) and stage (number) as arguments'
        );
    }

    if (![0, 1, 2, 3].includes(jobData.stage)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide a valid stage (0, 1, 2 or 3)'
        );
    }

    await verifyDocPermission(context, `boards/${jobData.boardId}`);

    const defaultJob = {
        position: '',
        company: '',
        description: '',
        salary: '',
        location: '',
        link: '',
        notes: '',
        stage: jobData.stage,
        awaitingResponse: false,
        priority: '',

        deadlines: [],
        interviewQuestions: [],
        contacts: [],

        userId: context.auth.uid,
        boardId: jobData.boardId
    };

    return getCollection('jobs')
        .add(defaultJob)
        .then((docRef) => ({ ...defaultJob, id: docRef.id }))
        .catch((e) => `Failed to add job: ${JSON.stringify(e)}`);
});

const addDeadline = functions.https.onCall(async (deadline: IDeadline, context: any) => {
    await verifyDocPermission(context, `jobs/${deadline.jobId}`);

    return getCollection(`deadlines`)
        .add({ ...deadline, userId: context.auth.uid, date: getFirestoreTimestamp(deadline.date * 1000) })
        .then((result) => result.id)
        .catch((err) => `Failed to add deadline: ${err}`);
});

const updateDeadline = functions.https.onCall(async (data: { deadlineId: string, deadline: IDeadline }, context: any) => {
    // Verify params
    const structure = {
        deadlineId: '',
        deadline: {
            date: 0,
            isInterview: false,
            link: '',
            location: '',
            priority: '',
            title: '',
        }
    };
    if (!isValidObjectStructure(data, structure)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a contact id (string) and contact (see db for structure) as arguments'
        );
    }

    await verifyDocPermission(context, `contacts/${data.deadlineId}`);

    return getDoc(`contacts/${data.deadlineId}`)
        .update({ ...data.deadline, date: getFirestoreTimestamp(data.deadline.date) })
        .then(() => `Contact '${data.deadlineId}' updated successfully`)
        .catch((err) => `Failed to update contact '${data.deadlineId}': ${err}`);
});

const deleteDeadline = functions.https.onCall(async (deadlineId: string, context: any) => {
    // Verify params
    if (!deadlineId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a deadline id (string) as an argument'
        );
    }
    await verifyDocPermission(context, `deadlines/${deadlineId}`);

    return getDoc(`deadlines/${deadlineId}`)
        .delete()
        .then(() => `Deadline '${deadlineId}' deleted successfully`)
        .catch((err) => `Failed to delete deadline '${deadlineId}': ${err}`);
});

const addInterviewQuestion = functions.https.onCall(async (interviewQuestion: IInterviewQuestion, context: any) => {
    await verifyDocPermission(context, `jobs/${interviewQuestion.jobId}`);

    return getCollection(`interviewQuestions`)
        .add({ ...interviewQuestion, userId: context.auth.uid })
        .then((result) => result.id)
        .catch((err) => `Failed to add interview question: ${err}`);
});

const updateInterviewQuestion = functions.https.onCall(async (data: { questionId: string, question: IInterviewQuestion }, context: any) => {
    // Verify params
    const structure = {
        questionId: '',
        question: {
            description: '',
            name: '',
        }
    };
    if (!isValidObjectStructure(data, structure)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a question id (string) and question (see db for structure) as arguments'
        );
    }

    await verifyDocPermission(context, `interviewQuestions/${data.questionId}`);

    return getDoc(`interviewQuestions/${data.questionId}`)
        .update(data.question)
        .then(() => `Question '${data.questionId}' updated successfully`)
        .catch((err) => `Failed to update interview question '${data.questionId}': ${err}`);
});

const deleteInterviewQuestion = functions.https.onCall(async (questionId: string, context: any) => {
    // Verify params
    if (!questionId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a question id (string) as an argument'
        );
    }
    await verifyDocPermission(context, `interviewQuestions/${questionId}`);

    return getDoc(`interviewQuestions/${questionId}`)
        .delete()
        .then(() => `Question '${questionId}' deleted successfully`)
        .catch((err) => `Failed to delete question '${questionId}': ${err}`);
});

const addContact = functions.https.onCall(async (contact: IContact, context: any) => {
    await verifyDocPermission(context, `jobs/${contact.jobId}`);

    return getCollection(`contacts`)
        .add({ ...contact, userId: context.auth.uid })
        .then((result) => result.id)
        .catch((err) => `Failed to add contact: ${err}`);
});

const updateContact = functions.https.onCall(async (data: { contactId: string, contact: IContact }, context: any) => {
    // Verify params
    const structure = {
        contactId: '',
        contact: {
            company: '',
            email: '',
            linkedin: '',
            name: '',
            notes: '',
            phone: '',
            title: '',
        }
    };
    if (!isValidObjectStructure(data, structure)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a contact id (string) and contact (see db for structure) as arguments'
        );
    }

    await verifyDocPermission(context, `contacts/${data.contactId}`);

    return getDoc(`contacts/${data.contactId}`)
        .update(data.contact)
        .then(() => `Contact '${data.contactId}' updated successfully`)
        .catch((err) => `Failed to update contact '${data.contactId}': ${err}`);
});

const deleteContact = functions.https.onCall(async (contactId: string, context: any) => {
    // Verify params
    if (!contactId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Must provide only a contact id (string) as an argument'
        );
    }
    await verifyDocPermission(context, `contacts/${contactId}`);

    return getDoc(`contacts/${contactId}`)
        .delete()
        .then(() => `Contact '${contactId}' deleted successfully`)
        .catch((err) => `Failed to delete contact '${contactId}': ${err}`);
});

// Updates job data (excluding deadlines, interview questions and contacts)
const updateJobData = functions.https.onCall(
    async (data: { jobId: string; jobData: object }, context: any) => {
        // Verify params
        const structure = {
            jobId : '',
            jobData: {
                awaitingResponse: false,
                boardId: '',
                company: '',
                description: '',
                link: '',
                location: '',
                notes: '',
                position: '',
                priority: '',
                salary: '',
                stage: 0,
                userId: '',
            }
        };
        if (!isValidObjectStructure(data, structure)) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Must provide only a job id (string) and job data (see db for structure) as arguments'
            );
        }

        await verifyDocPermission(context, `jobs/${data.jobId}`);

        return getDoc(`jobs/${data.jobId}`)
            .set(data.jobData)
            .then(() => `job '${data.jobId}' updated successfully`)
            .catch((err) => `Failed to update contact '${data.jobId}': ${err}`);
    }
);

const dragKanbanJob = functions.https.onCall(
    async (data: { id: string; newStage: number }, context: any) => {
        if (!data || !data.hasOwnProperty('id') || !data.hasOwnProperty('newStage')) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'A job id and new stage is required'
            );
        }
        if (data.newStage < 0 || data.newStage > 3) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Invalid job stage (must be between 0 and 3 inclusive)'
            );
        }

        await verifyDocPermission(context, `jobs/${data.id}`);

        return getDoc(`jobs/${data.id}`)
            .update({ stage: data.newStage })
            .then(() => `Successfully updated job stage`)
            .catch((err) => `Error updating job stage: ${err}`);
    }
);

// Deletes a job in firestore
const deleteJob = functions.https.onCall(async (data: { id: string }, context: any) => {
    await verifyDocPermission(context, `jobs/${data.id}`);

    return getDoc(`jobs/${data.id}`)
        .delete()
        .then(() => `Successfully deleted job '${data.id}'`)
        .catch((err) => `Error deleting job '${data.id}': ${err}`);
});

const addBoard = functions.https.onCall(async (data: string, context: any) => {
    if (!data) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'No board name provided'
        );
    }

    const newBoard = { name: data, userId: context.auth.uid };
    return getCollection('boards')
        .add({ name: data, userId: context.auth.uid })
        .then((result) => ({ id: result.id, name: newBoard.name }))
        .catch((e) => `Failed to create a board for user '${context.auth.uid}': ${JSON.stringify(e)}`);
});

const deleteBoard = functions.https.onCall(async (boardId: string, context: any) => {
    // Verify params
    if (!boardId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'No board id provided'
        );
    }
    await verifyDocPermission(context, `boards/${boardId}`);

    return getDoc(`boards/${boardId}`)
        .delete()
        .then(() => `Successfully deleted board '${boardId}'`)
        .catch((err) => `Error deleting board '${boardId}': ${err}`);
});

export {
    addJobs,
    addJob,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    addInterviewQuestion,
    updateInterviewQuestion,
    deleteInterviewQuestion,
    addContact,
    updateContact,
    deleteContact,
    updateJobData,
    dragKanbanJob,
    deleteJob,
    addBoard,
    deleteBoard,
};
