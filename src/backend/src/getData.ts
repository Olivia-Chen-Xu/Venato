import * as functions from 'firebase-functions';
import { getCollection, getDoc, verifyIsAuthenticated } from './helpers';

/**
 * Callable functions for getting data from firestore
 */

// Returns all job boards for the current signed-in user (each has a name + array of job ids)
const getJobBoards = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    return getDoc(`users/${context.auth.uid}`)
        .get()
        .then((doc) => {
            return doc.data()?.boards;
        })
        .catch((err) => `Error fetching user job boards: ${err}`);
});

// Returns the next 3 job events for the currently signed-in user
const getUpcomingEvents = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    // TODO: need to move deadlines to their own collection for querying (right now they're an
    //  array in the job object)
    return getCollection('deadlines')
        .where('userId', '==', context.auth.uid)
        .where('time', '>=', Date.now())
        .orderBy('time')
        .limit(3)
        .get()
        .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
        .catch((err) => `Error fetching upcoming events: ${err}`);
});

// Returns all the jobs that belong to the currently signed-in user
const getJobs = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    return getCollection('jobs')
        .where('userId', '==', context.auth.uid)
        .get()
        .then((jobs) => {
            const jobList: any = [];
            jobs.forEach((job) => {
                // Remove the query helper fields (positionSearchable, userId) and add the job id
                const jobData = job.data(); // TODO: inline this (can be cleaned up)
                delete jobData.positionSearchable;
                delete jobData.userId;
                jobData.id = job.id;

                jobList.push(jobData);
            });
            return jobList;
        })
        .catch((err) => `Error fetching user jobs: ${err}`);
});

// Returns all job events (to display on the calendar) for the currently signed-in user
const getCalendarEvents = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    return getCollection('jobs')
        .get()
        .then((jobs) => {
            const events: { id: string; title: string; date: string }[] = [];
            jobs.docs.forEach((job) => {
                job.data().deadlines.forEach((event: { date: any }) => {
                    events.push({
                        id: job.id,
                        title: job.data().position,
                        date: event.date,
                    });
                });
            });
            return events;
        })
        .catch((err) => `Error getting calendar events: ${err}`);
});

// For searching or adding jobs, we need all the possible companies and/or locations
const getAllCompanies = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    return getCollection('companies')
        .get()
        .then((companies) => companies.docs.map((company) => company.id))
        .catch((err) => err);
});
const getAllLocations = functions.https.onCall((data: object, context: any) => {
    verifyIsAuthenticated(context);

    return getCollection('locations')
        .get()
        .then((locations) => locations.docs.map((location) => location.id))
        .catch((err) => err);
});

// Search for a job by position, company, or location
const jobSearch = functions.https.onCall(
    (data: { company: string; position: string; location: string }, context: any) => {
        verifyIsAuthenticated(context);

        // Check which of the three inputs are given
        const queries: { position: string; company: string; location: string } = {
            position: data.position?.replace(/ +/g, ' ').trim() || '',
            company: data.company?.replace(/ +/g, ' ').trim() || '',
            location: data.location?.replace(/ +/g, ' ').trim() || '',
        };
        if (!queries.position && !queries.company && !queries.location) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'A company, position or location is required to search for jobs'
            );
        }

        // Build the query
        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = getCollection('jobs');
        if (queries.position) {
            query = query.where(
                'positionSearchable',
                'array-contains-any',
                data.position.toLowerCase().split(' ')
            );
        }
        if (queries.company) {
            query = query.where('info.company', '==', data.company);
        }
        if (queries.location) {
            query = query.where('info.location', '==', data.location);
        }

        // Execute the query and return the result
        return query
            .get()
            .then((jobs) => {
                return jobs.docs.map((doc) => ({
                    details: doc.data().details,
                    info: doc.data().info,
                    interviewQuestions: doc.data().interviewQuestions,
                }));
            })
            .catch((err) => `Error querying jobs questions: ${err}`);
    }
);

// Search for interview questions based on a company and/or position
const interviewQuestionsSearch = functions.https.onCall(
    (data: { position: string; company: string }, context: any) => {
        verifyIsAuthenticated(context);

        // Parse the search queries and verify at least one valid is given
        const queries: { position: string; company: string } = {
            position: data.position?.replace(/ +/g, ' ').trim() || '',
            company: data.company?.replace(/ +/g, ' ').trim() || '',
        };
        if (!queries.position && !queries.company) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'A company or position is required to search for interview questions'
            );
        }

        // Build the query
        let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = getCollection('jobs');
        if (queries.position) {
            query = query.where(
                'positionSearchable',
                'array-contains-any',
                data.position.toLowerCase().split(' ')
            );
        }
        if (queries.company) {
            query = query.where('info.company', '==', data.company);
        }

        // Execute the query and return the result
        return query
            .get()
            .then((jobs) => jobs.docs.map((job) => job.data().interviewQuestions).flat())
            .catch((err) => `Error querying interview questions: ${err}`);
    }
);

export {
    getJobBoards,
    getUpcomingEvents,
    getJobs,
    getCalendarEvents,
    getAllCompanies,
    getAllLocations,
    jobSearch,
    interviewQuestionsSearch,
};
