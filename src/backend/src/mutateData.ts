import * as functions from 'firebase-functions';
import {
    db,
    getCollection,
    getDoc,
    isValidObjectStructure,
    verifyDocPermission,
    verifyIsAuthenticated
} from './helpers';

/**
 * Callable functions for mutating data in firestore (creating, updating or deleting)
 */

// Adds a list of jobs to firestore
// This is only used for generating jobs in development
const addJobs = functions.https.onCall(
    async (data: { jobs: object[]; boards: { userId: string, name: string, id: number }[] }, context: any) => {
        verifyIsAuthenticated(context);

        for (const board of data.boards) {
            await getCollection('boards').add(board).then((doc) => {
                data.jobs.filter((job) => job.boardId === board.id).forEach((job) => {
                    job.boardId = doc.id;
                });
            });
        }

        // Add all the jobs to the db
        const jobsBatch = db.batch();
        data.jobs.forEach((job: any) => {
            jobsBatch.set(db.collection('jobs').doc(), job);
        });
        return jobsBatch
            .commit()
            .then(() => 'Jobs added successfully')
            .catch((err: any) => `Error adding jobs: ${err}`);

        /*
        // Wait for the db trigger to take effect - otherwise it will override the boardId we add later
        await new Promise((resolve) => setTimeout(resolve, 10000));

        // Generate job boards
        const jobs = await getCollection('jobs').get();

        if (jobs.empty) {
            throw new functions.https.HttpsError(
                'not-found',
                'Error: no jobs in the db (not added correctly?)'
            );
        }

        for (let i = 0; i < data.users.length; ++i) {
            const userJobs = jobs.docs
                .filter((job) => job.data().metaData.userId === data.users[i])
                .map((job) => ({
                    id: job.id,
                    board: Math.floor(Math.random() * 3),
                    company: job.data().details.company,
                    position: job.data().details.position,
                    stage: job.data().status.stage
                }));
            const boards: {
                [name: string]: {
                    id: string;
                    board: number;
                    company: string;
                    position: string;
                    stage: number;
                }[];
            } = {
                'Summer 2021 internships': userJobs.filter((job) => job.board === 0),
                'Summer 2022 internships': userJobs.filter((job) => job.board === 1),
                'Summer 2023 internships': userJobs.filter((job) => job.board === 2)
            };

            for (const name of Object.keys(boards)) {
                const boardId = await getCollection('boards')
                    .add({
                        name,
                        metaData: {
                            userId: data.users[i]
                        }
                    })
                    .then((doc) => doc.id);

                for (const job of boards[name]) {
                    await getDoc(`jobs/${job.id}`)
                        .update({ 'metaData.boardId': boardId })
                        .then(() =>
                            functions.logger.log(`Board '${boardId}' added to job '${job.id}'`)
                        );
                }
            }
        }
         */
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
        .add({ ...deadline, userId: context.auth.uid })
        .then((result) => result.id)
        .catch((err) => `Failed to add deadline: ${err}`);
});

const addInterviewQuestion = functions.https.onCall(async (interviewQuestion: IInterviewQuestion, context: any) => {
    await verifyDocPermission(context, `jobs/${interviewQuestion.jobId}`);

    return getCollection(`interviewQuestions`)
        .add({ ...interviewQuestion, userId: context.auth.uid })
        .then((result) => result.id)
        .catch((err) => `Failed to add interview question: ${err}`);
});

const addContact = functions.https.onCall(async (contact: IContact, context: any) => {
    await verifyDocPermission(context, `jobs/${contact.jobId}`);

    return getCollection(`contacts`)
        .add({ ...contact, userId: context.auth.uid })
        .then((result) => result.id)
        .catch((err) => `Failed to add contact: ${err}`);
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
            errMSg = 'No new fields provided';
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data.newFields.forEach((deadline: { edited: boolean; id: string }) => {
                    if (deadline.edited) {
                        updatePromises.push(getDoc(`deadlines/${deadline.id}`).update(deadline));
                    }
                });
                break;
            case 4:
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
            .update({ [`status.stage`]: data.newStage })
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

// Set the current kanban board for the user
const setKanbanBoard = functions.https.onCall(async (data: string, context: any) => {
    if (!data || Object.prototype.toString.call(data) !== '[object String]') {
        throw new functions.https.HttpsError('invalid-argument', 'A board id is required');
    }
    await verifyDocPermission(context, `boards/${data}`);

    return getDoc(`users/${context.auth.uid}`).update({ kanbanBoard: data });
});

const addBoard = functions.https.onCall(async (data: string, context: any) => {
    return getCollection('boards')
        .add({ name: data, metaData: { userId: context.auth.uid } })
        .then((result) => result.id)
        .catch(
            (e) => `Failed to create a board for user '${context.auth.uid}': ${JSON.stringify(e)}`
        );
});

export {
    addJobs,
    addJob,
    addDeadline,
    addInterviewQuestion,
    addContact,
    updateJob,
    dragKanbanJob,
    deleteJob,
    setKanbanBoard,
    addBoard
};
