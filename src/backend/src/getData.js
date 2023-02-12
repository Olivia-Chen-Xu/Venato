//import * as functions from 'firebase-functions';
const functions = require('firebase-functions');
// import {
//     getCollection,
//     getDoc,
//     getRelativeTimestamp,
//     verifyDocPermission,
//     verifyIsAuthenticated
// } from './helpers.js';
const helpers = require('./helpers.js');
const algoliaSearch = require('algoliasearch');

/**
 * Callable functions for getting data from firestore
 */

exports.getJobData = functions.https.onCall(async (jobId, context) => {
    if (!jobId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with a jobId'
        );
    }

    await helpers.verifyDocPermission(context, `jobs/${jobId}`);

    // @ts-ignore
    const job = await helpers.getDoc(`jobs/${jobId}`)
        .get()
        .then((doc) => ({ ...doc.data(), id: doc.id }));

    const promises = [];
    promises.push(
        helpers.getCollection(`deadlines`)
            .where('jobId', '==', jobId)
            .get()
            .then((deadlines) => {
                // @ts-ignore
                job.deadlines = deadlines.empty ? [] : deadlines.docs.map((doc) => {
                    return { ...doc.data(), date: doc.data().date._seconds };
                });
                return null;
            })
    );

    promises.push(
        helpers.getCollection(`interviewQuestions`)
            .where('jobId', '==', jobId)
            .get()
            .then((questions) => {
                // @ts-ignore
                job.interviewQuestions = questions.empty ? [] : questions.docs.map((doc) => doc.data());
                return null;
            })
    );

    promises.push(
        helpers.getCollection(`contacts`)
            .where('jobId', '==', jobId)
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
exports.getHomepageData = functions.https.onCall((data, context) => {
    helpers.verifyIsAuthenticated(context);

    if (data != null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with no arguments'
        );
    }

    const promises = [];

    promises.push(
        helpers.getCollection('deadlines')
            .where('userId', '==', context.auth.uid)
            .where('date', '>=', helpers.getRelativeTimestamp(0))
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
        helpers.getCollection(`boards`)
            .where('userId', '==', context.auth.uid)
            .get()
            .then((boards) => boards.empty ? [] : boards.docs.map((doc) => ({ id: doc.id, name: doc.data().name })))
            .catch((err) => functions.logger.log(`Error fetching user job boards: ${err}`))
    );

    return Promise.all(promises)
        .then((userData) => ({ events: userData[0], boards: userData[1] }))
        .catch((err) => `Error fetching homepage data: ${err}`);
});

exports.getJobBoards = functions.https.onCall((data, context) => {
    helpers.verifyIsAuthenticated(context);

    if (data != null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with no arguments'
        );
    }

    return helpers.getCollection(`boards`)
        .where('userId', '==', context.auth.uid)
        .get()
        .then((boards) => boards.empty ? [] : boards.docs.map((doc) => ({ id: doc.id, name: doc.data().name })))
        .catch((err) => functions.logger.log(`Error fetching user job boards: ${err}`));
});

// Gets all the jobs for a given kanban board
exports.getKanbanBoard = functions.https.onCall(async (boardId, context) => {
    if (!boardId || String(boardId) !== boardId || boardId.trim().length === 0) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            `The function must be called with a boardId. Parameter: '${boardId}'`
        );
    }

    const board = await helpers.getDoc(`boards/${boardId}`).get().then((doc) => doc.data());

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

    return helpers.getCollection('jobs')
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
exports.getCalendarDeadlines = functions.https.onCall((data, context) => {
    helpers.verifyIsAuthenticated(context);

    return helpers.getCollection('deadlines')
        .where('userId', '==', context.auth.uid)
        .get()
        .then((deadlines) => {
            if (deadlines.empty) {
                return [];
            }

            return deadlines.docs.map((deadline) => {
                const deadlineDate = deadline.data().date.toDate();
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
exports.jobSearch = functions.runWith({ secrets: ['ALGOLIA_API_KEY', 'ALGOLIA_APP_ID'] }).https.onCall(
    (queryData, context) => {
        helpers.verifyIsAuthenticated(context);

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

        const searchAll = { query: queryData.searchAll, valid: !nullOrWhitespace(queryData.searchAll) };
        const company = { query: queryData.company, valid: !nullOrWhitespace(queryData.company) };
        const position = { query: queryData.position, valid: !nullOrWhitespace(queryData.position) };
        const location = { query: queryData.location, valid: !nullOrWhitespace(queryData.location) };

        if (searchAll.valid) {
            if (company.valid || position.valid || location.valid) {
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    'You can either perform a full search (searchAll), or search by company and/or position. ' +
                    'You cannot define both searchAll and company/position'
                );
            }

            return algoliaSearch(AlgoliaAppId, AlgoliaApiKey)
                .initIndex('jobs')
                .search(queryData.searchAll)
                .then(({ hits }) => {
                    return hits.map((hit) => ({
                        jobId: hit.objectID,
                        company: hit.company,
                        position: hit.position,
                        description: hit.description,
                        location: hit.location,
                        link: hit.link,
                        salary: hit.salary,
                    }));
                })
                .catch(err => `Error querying interview questions: ${err}`);
        }

        if (!company.valid && !position.valid && !location.valid) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Please include either a searchAll query, or a company and/or position query'
            );
        }

        // TODO: Facet search
        return algoliaSearch(AlgoliaAppId, AlgoliaApiKey)
            .initIndex('jobs')
            .search(queryData.searchAll)
            .then(({ hits }) => hits)
            .catch(err => `Error querying interview questions: ${err}`);
    }
);

// Search for interview questions based on a company and/or position
exports.interviewQuestionSearch = functions.runWith({ secrets: ['ALGOLIA_API_KEY', 'ALGOLIA_APP_ID'] }).https.onCall(
    (queryData, context) => {
        helpers.verifyIsAuthenticated(context);

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

        const searchAll = { query: queryData.searchAll, valid: !nullOrWhitespace(queryData.searchAll) };
        const company = { query: queryData.company, valid: !nullOrWhitespace(queryData.company) };
        const position = { query: queryData.position, valid: !nullOrWhitespace(queryData.position) };

        if (searchAll.valid) {
            if (company.valid || position.valid) {
                throw new functions.https.HttpsError(
                    'invalid-argument',
                    'You can either perform a full search (searchAll), or search by company and/or position. ' +
                    'You cannot define both searchAll and company/position'
                );
            }

            return algoliaSearch(AlgoliaAppId, AlgoliaApiKey)
                .initIndex('interviewQuestions')
                .search(queryData.searchAll)
                .then(({ hits }) => {
                    return hits;
                })
                .catch(err => `Error querying interview questions: ${err}`);
        }

        if (!company.valid && !position.valid) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Please include either a searchAll query, or a company and/or position query'
            );
        }

        // TODO: Facet search
        return algoliaSearch(AlgoliaAppId, AlgoliaApiKey)
            .initIndex('interviewQuestions')
            .search(queryData.searchAll)
            .then(({ hits }) => hits)
            .catch(err => `Error querying interview questions: ${err}`);
    }
);

const nullOrWhitespace = (str) => str == null || str.trim().length === 0;
