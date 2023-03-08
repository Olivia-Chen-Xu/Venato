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
            company: '',
            date: 0,
            isInterview: false,
            jobId: '',
            link: '',
            location: '',
            position: '',
            priority: '',
            title: '',
            userId: '',
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
            company: '',
            description: '',
            jobId: '',
            name: '',
            position: '',
            userId: '',
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
        .catch((err) => `Failed to update contact '${data.questionId}': ${err}`);
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
            jobId: '',
            linkedin: '',
            name: '',
            notes: '',
            phone: '',
            title: '',
            userId: '',
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

// Updates a job in firestore with the given data (fields not present in the header aren't overwritten)
const updateJob = functions.https.onCall(
    async (data: { id: string; tab: number; newFields: object }, context: any) => {
        // Verify params
        let errMSg = '';
        if (!data) {
            errMSg = 'No data provided';
        } else if (!data.id) {
            errMSg = 'No job id provided';
        } else if (!data.tab) {
            errMSg = 'No tab number provided';
        } else if (!data.newFields) {
            errMSg = 'No new field(s) provided';
        }
        if (errMSg !== '') {
            throw new functions.https.HttpsError('invalid-argument', errMSg);
        }
        await verifyDocPermission(context, `jobs/${data.id}`);

        const updatePromises: Promise<FirebaseFirestore.WriteResult>[] = [];
        switch (data.tab) {
            case 1:
                updatePromises.push(getDoc(`jobs/${data.id}`).update(data.newFields));
                break;
            case 2:
                updatePromises.push(getDoc(`jobs/${data.id}`).update({ notes: data.newFields }));
                break;
            case 3:
                // @ts-ignore
                data.newFields.forEach((deadline: { edited: boolean; id: string }) => {
                    if (deadline.edited) {
                        updatePromises.push(getDoc(`deadlines/${deadline.id}`).update(deadline));
                    }
                });
                break;
            case 4:
                // @ts-ignore
                data.newFields.forEach((question: { edited: boolean; id: string }) => {
                    if (question.edited) {
                        updatePromises.push(
                            getDoc(`interviewQuestions/${question.id}`).update(question)
                        );
                    }
                });
                break;
            case 5:
                // @ts-ignore
                data.newFields.forEach((contact: { edited: boolean; id: string }) => {
                    if (contact.edited) {
                        updatePromises.push(getDoc(`contacts/${contact.id}`).update(contact));
                    }
                });
                break;
            default:
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    'Tab number must an integer between 1 and 5 inclusive'
                );
        }

        return Promise.all(updatePromises)
            .then(() => `Successfully updated job '${data.id}`)
            .catch((e) => `Failed to update job '${data.id}': ${JSON.stringify(e)}`);
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

export {
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
    addBoard,
};
