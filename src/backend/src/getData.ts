import * as functions from 'firebase-functions';
import { getDoc, getCollection } from './helpers';

/**
 * Callable functions for getting data from firestore
 */

// Gets events from the database
const getEvents = functions.https.onCall((data: object, context: any) => {
    return getCollection('events')
        .get()
        .then((events) => {
            const eventList: any = [];
            events.forEach((event) => {
                eventList.push(event.data());
            });
            return eventList;
        })
        .catch((err) => err);
});

// Returns all the jobs in the database
const getJobs = functions.https.onCall((data: object, context: any) => {
    return getCollection('jobs')
        .where('userId', '==', context.auth.uid)
        .get()
        .then((jobs) => {
            const jobList: any = [];
            jobs.forEach((job) => {
                // Remove the query helper fields (positionSearchable, userId) and add the job id
                const jobData = job.data(); // TODO : inline this (can be cleaned up)
                delete jobData.positionSearchable;
                delete jobData.userId;
                jobData.id = job.id;

                jobList.push(jobData);
            });
            return jobList;
        })
        .catch((err) => `Error fetching user jobs: ${err}`);
});

// Returns all job boards for the current signed-in user (name + array of job ids)
const getJobBoards = functions.https.onCall((data: object, context: any) => {
    return getDoc(`users/${context.auth.uid}`)
        .get()
        .then((doc) => {
            return doc.data()?.boards;
        })
        .catch((err) => `Error fetching user job boards: ${err}`);
});

const getCalendarEvents = functions.https.onCall((data: object, context: any) => {
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
        .catch((err) => `Error getting events: ${err}`);
});

// For search
const getAllCompanies = functions.https.onCall((data: object, context: any) => {
    return getCollection('companies')
        .get()
        .then((companies) => companies.docs.map((company) => company.id))
        .catch((err) => err);
});

const getAllLocations = functions.https.onCall((data: object, context: any) => {
    return getCollection('locations')
        .get()
        .then((locations) => locations.docs.map((location) => location.id))
        .catch((err) => err);
});

const jobSearch = functions.https.onCall(
    (data: { company: string; position: string; location: string }, context: any) => {
        // Check which of the three inputs are given
        const queries: { position: boolean; company: boolean; location: boolean } = {
            position: (data.position?.trim()?.length || 0) !== 0,
            company: (data.company?.trim()?.length || 0) !== 0,
            location: (data.location?.trim()?.length || 0) !== 0,
        };
        if (!queries.position && !queries.company && !queries.location) {
            return 'No query specified';
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

        // Execute and return the query
        return query
            .get()
            .then((jobs) => {
                const jobList: object[] = [];
                jobs.forEach((doc) => {
                    const job = doc.data();
                    delete job.positionSearchable;
                    delete job.userId;

                    jobList.push(job);
                });
                return jobList;
            })
            .catch((err) => `Error querying interview questions: ${err}`);
    }
);

export {
    getEvents,
    getJobs,
    getJobBoards,
    getCalendarEvents,
    getAllCompanies,
    getAllLocations,
    jobSearch,
};
