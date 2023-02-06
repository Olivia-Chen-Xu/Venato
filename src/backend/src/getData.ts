import * as functions from 'firebase-functions';
import {
    getCollection,
    getDoc,
    getRelativeTimestamp,
    verifyDocPermission,
    verifyIsAuthenticated
} from './helpers';
import algoliaSearch from 'algoliasearch';

/**
 * Callable functions for getting data from firestore
 */

const getJobData = functions.https.onCall(async (jobId: string, context: any) => {
    if (!jobId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with a jobId'
        );
    }

    await verifyDocPermission(context, `jobs/${jobId}`);

    // @ts-ignore
    const job: IJob = await getDoc(`jobs/${jobId}`)
        .get()
        .then((doc) => doc.data());

    const promises = [];
    promises.push(
        getCollection(`deadlines`)
            .where('jobId', '==', jobId)
            .get()
            .then((deadlines) => {
                // @ts-ignore
                job.deadlines = deadlines.empty ? [] : deadlines.docs.map((doc) => doc.data());
                return null;
            })
    );

    promises.push(
        getCollection(`interviewQuestions`)
            .where('jobId', '==', jobId)
            .get()
            .then((questions) => {
                // @ts-ignore
                job.interviewQuestions = questions.empty ? [] : questions.docs.map((doc) => doc.data());
                return null;
            })
    );

    promises.push(
        getCollection(`contacts`)
            .where('metaData.jobId', '==', jobId)
            .get()
            .then((contacts) => {
                // @ts-ignore
                job.contacts = contacts.empty ? [] : contacts.docs.map((doc) => doc.data());
                return null;
            })
    );

    return Promise.all(promises).then(() => job);
});

// Returns all job boards for the current signed-in user (each has a name + array of job ids)
const getHomepageData = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    const promises: Promise<any>[] = [];

    promises.push(
        getCollection('deadlines')
            .where('userId', '==', context.auth.uid)
            .where('date', '>=', getRelativeTimestamp(0))
            .orderBy('date')
            .limit(3)
            .get()
            .then((snapshot) =>
                snapshot.empty
                    ? []
                    : snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        date: doc.data().date._seconds
                    }))
            )
            .catch((err) => `Error fetching upcoming events: ${err}`)
    );

    promises.push(
        getCollection(`boards`)
            .where('userId', '==', context.auth.uid)
            .get()
            .then((boards) =>
                boards.empty
                    ? []
                    : boards.docs.map((doc) => doc.data()))
            .catch((err) => functions.logger.log(`Error fetching user job boards: ${err}`))
    );

    return Promise.all(promises)
        .then((userData) => ({ events: userData[0], boards: userData[1] }))
        .catch((err) => `Error fetching homepage data: ${err}`);
});

// Gets all the jobs for a given kanban board
const getKanbanBoard = functions.https.onCall(async (boardId: string, context: any) => {
    if (!boardId) {
        const lastBoardId = await getDoc(`users/${context.auth.uid}`)
            .get()
            .then((result) => {
                if (!result.exists) {
                    throw new functions.https.HttpsError('not-found', 'User not found');
                }

                // @ts-ignore
                if (result.data().kanbanBoard) {
                    // @ts-ignore
                    return result.data().kanbanBoard;
                }
            });
        if (lastBoardId != null) {
            return lastBoardId; // TODO
        }

        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with a boardId or you must have clicked from the homepage'
        );
    }

    const board = await getDoc(`boards/${boardId}`).get().then((doc) => doc.data());

    if (board == null) {
        throw new functions.https.HttpsError(
            'not-found',
            `Board with id '${boardId}' not found`
        );
    }
    if (board.userId !== context.auth.uid) {
        throw new functions.https.HttpsError(
            'permission-denied',
            `You do not have permission to access board with id '${boardId}'`
        );
    }

    return getCollection('jobs')
        .where('userId', '==', context.auth.uid)
        .where('boardId', '==', boardId)
        .get()
        .then(async (query) => {
            const jobs = query.empty? [] : query.docs.map((job) => ({ ...job.data(), id: job.id }));

            return { name: board.name, id: boardId, jobs };
        })
        .catch((err) => `Error getting kanban board with id ${boardId}: ${err}`);
});

// Returns all job deadlines for the currently signed-in user
const getCalendarDeadlines = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    return getCollection('deadlines')
        .where('userId', '==', context.auth.uid)
        .get()
        .then((deadlines) => {
            if (deadlines.empty) {
                return [];
            }

            return deadlines.docs.map((deadline) => {
                const deadlineDate: Date = deadline.data().date.toDate();
                const newDate = {
                    year: deadlineDate.getFullYear(),
                    month: deadlineDate.getMonth() + 1,
                    day: deadlineDate.getDate()
                };

                return { ...deadline.data(), date: newDate };
            });
        })
        .catch((err) => `Error getting calendar events: ${err}`);
});

// Search for a job by position, company, or location
const jobSearch = functions.runWith({ secrets: ['ALGOLIA_API_KEY', 'ALGOLIA_APP_ID'] }).https.onCall(
    (query: string, context: any) => {
        verifyIsAuthenticated(context);

        const AlgoliaApiKey = process.env.ALGOLIA_API_KEY;
        const AlgoliaAppId = process.env.ALGOLIA_APP_ID;
        if (AlgoliaApiKey == null) {
            throw new functions.https.HttpsError(
                'internal',
                'Algolia API key not found. Check Google cloud secrets for ALGOLIA_API_KEY'
            );
        }
        if (AlgoliaAppId == null) {
            throw new functions.https.HttpsError(
                'internal',
                'Algolia App ID not found. Check google cloud secrets for ALGOLIA_APP_ID'
            );
        }

        return algoliaSearch(AlgoliaAppId, AlgoliaApiKey)
            .initIndex('jobs')
            .search(query)
            .then(({ hits }) => hits)
            .catch(err => `Error querying interview questions: ${err}`);
    }
);

// Search for interview questions based on a company and/or position
const interviewQuestionSearch = functions.runWith({ secrets: ['ALGOLIA_API_KEY', 'ALGOLIA_APP_ID'] }).https.onCall(
    (query: string, context: any) => {
        verifyIsAuthenticated(context);

        const AlgoliaApiKey = process.env.ALGOLIA_API_KEY;
        const AlgoliaAppId = process.env.ALGOLIA_APP_ID;
        if (AlgoliaApiKey == null) {
            throw new functions.https.HttpsError(
                'internal',
                'Algolia API key not found. Check Google cloud secrets for ALGOLIA_API_KEY'
            );
        }
        if (AlgoliaAppId == null) {
            throw new functions.https.HttpsError(
                'internal',
                'Algolia App ID not found. Check google cloud secrets for ALGOLIA_APP_ID'
            );
        }

        return algoliaSearch(AlgoliaAppId, AlgoliaApiKey)
            .initIndex('interviewQuestions')
            .search(query)
            .then(({ hits }) => hits)
            .catch(err => `Error querying interview questions: ${err}`);
    }
);

export {
    getJobData,
    getHomepageData,
    getKanbanBoard,
    getCalendarDeadlines,
    jobSearch,
    interviewQuestionSearch
};
