import { getFunctions, httpsCallable } from 'firebase/functions';

interface Job {
    company: string;
    contacts: string[];
    deadlines: { date: string; title: string }[];
    details: {
        description: string;
        url: string;
    };
    interviewQuestions: string[];
    location: string;
    notes: string;
    stage: number;
    position: string;
    awaitingResponse: boolean;
}

const companies = [
    'Google',
    'Facebook',
    'Amazon',
    'Apple',
    'Microsoft',
    'Netflix',
    'Spotify',
    'Uber',
    'Airbnb',
    'Tesla',
];
const contacts = [
    'https://www.linkedin.com/in/olivia-chen-xu/',
    'https://www.linkedin.com/in/cameron-beaulieu/',
    'https://www.linkedin.com/in/reid-moffat/',
    'https://www.linkedin.com/in/krishaan-thyagarajan/',
    'https://www.linkedin.com/in/danieljoseph8/',
    'https://www.linkedin.com/in/wasiq-wadud/',
];
const descriptions = [
    "Will be working on the Google Cloud Platform team, which is responsible for building and maintaining the infrastructure that powers Google's cloud services.",
    'Aiding a METAverse architect with QA and efficiency',
    "Working with Amazon's product recommendation team",
    'Will be working on a Tech support related internal tool',
    'This position includes work with the Microsoft bug fixer dashboard',
    "Netflix's recommendation API will be the main part of this job",
    "Spotify is know for it's easy-to-use and powerful desktop app, which is what you will be working on",
    "Uber is applauded for it's incredibly simple UI, which oyu will be helping maintain",
    'This job entails improving facilitation of client-renter contract',
    "Working with the immense data collected by Tesla's self-driving cars",
];
const urls = [
    'https://www.google.com',
    'https://www.facebook.com',
    'https://www.amazon.com',
    'https://www.apple.com',
    'https://www.microsoft.com',
    'https://www.netflix.com',
    'https://www.spotify.com',
    'https://www.uber.com',
    'https://www.airbnb.com',
    'https://www.tesla.com',
];
const questions = [
    'Reverse a linked list',
    'Depth-first search',
    'Breadth-first search',
    'Merge sort',
    'Quick sort',
    'Binary search',
    'Linear search',
    "Dijkstra's algorithm",
    'Bellman-Ford algorithm',
    'Floyd-Warshall algorithm',
    'Kruskal algorithm',
    'Prim algorithm',
    'A* algorithm',
    'D* algorithm',
    'Dynamic programming',
    'Greedy algorithm',
];
const locations = [
    'San Francisco, California',
    'New York, New York',
    'Seattle, Washington',
    'Austin, Texas',
    'Los Angeles, California',
    'Chicago, Illinois',
    'Boston, Massachusetts',
    'San Jose, California',
    'Washington, D.C.',
    'Atlanta, Georgia',
];
const jobNotes = [
    "Probably under-qualified, but I'll try anyway",
    'I REALLY want this job',
    'This would be a good fit',
    'If it pays well, I might consider it',
    'If i get this... bill gates time 😎😎😎',
    'Have to travel to the US for this one',
    'jeeeeeeez this is a good job',
    'I have no idea what this job is',
    "I'll probably get rejected",
    'I hope bezos sees this',
    'Salary: good. Company: good. Location: good. Travel? huge PITA',
];
const jobPositions = [
    'Software Engineer Intern',
    'Software Engineer',
    'Software Developer',
    'Software Developer Intern',
    'Data Scientist',
    'Data Analyst',
    'Data Engineer',
    'Product Manager',
    'Product Designer',
    'Product Marketer',
    'Product Analyst',
];

// Add example jobs
const generateJobs = async (num: number) => {
    const generateDeadlines = () => {
        const deadlines = [];
        const month = Math.random() < 0.5 ? '11' : '12';

        const numDeadlines = Math.floor(Math.random() * 3) + 1;
        switch (numDeadlines) {
            case 1:
                const temp = Math.floor(Math.random() * 29) + 1;
                deadlines.push({
                    date: `22-${month}-${temp < 10 ? `0${temp}` : `${temp}`}`,
                    title: Math.random() < 0.5 ? '❗ Interview ❗' : 'Job interview',
                });
                break;
            case 2:
                const temp2 = Math.floor(Math.random() * 14) + 1;
                deadlines.push({
                    date: `22-${month}-${temp2 < 10 ? `0${temp2}` : `${temp2}`}`,
                    title:
                        Math.random() < 0.5
                            ? 'Submit resume + cover letter'
                            : 'Fill out application',
                });
                deadlines.push({
                    date: `22-${month}-${Math.floor(Math.random() * 15) + 15}`,
                    title: 'Interview',
                });
                break;
            case 3:
                deadlines.push({
                    date: `22-${month}-0${Math.floor(Math.random() * 9) + 1}`,
                    title: 'Initial application due',
                });
                deadlines.push({
                    date: `22-${month}-${Math.floor(Math.random() * 10) + 10}`,
                    title: Math.random() < 0.5 ? 'First round interview' : 'Technical round',
                });
                deadlines.push({
                    date: `22-${month}-${Math.floor(Math.random() * 10) + 20}`,
                    title: '❗ Final interview ❗',
                });
                break;
            default:
                throw `Invalid num deadlines: ${numDeadlines}`;
        }
        return deadlines;
    };

    const jobs: Job[] = [];
    for (let i = 0; i < num; i += 1) {
        const company = Math.floor(Math.random() * companies.length);
        const job = {
            info: {
                company: companies[company],
                position: jobPositions[~~(Math.random() * jobPositions.length)],
                location: locations[~~(Math.random() * locations.length)],
            },

            details: {
                description: descriptions[company],
                url: `${urls[company]}/jobs/${Math.floor(Math.random() * 1000000)}`,
            },
            notes: jobNotes[~~(Math.random() * jobNotes.length)],
            deadlines: generateDeadlines(),
            interviewQuestions: [...questions]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 5) + 1),
            contacts: [...contacts]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 3) + 1),

            metadata: {
                stage: Math.floor(Math.random() * 4),
                awaitingResponse: Math.random() < 0.5,
            },
        };
        jobs.push(job);
    }

    // Commit jobs to db
    const addJobs = httpsCallable(getFunctions(), 'addJobs');
    addJobs(jobs)
        .then(() => console.log('Successfully added jobs'))
        .catch((e) => console.log(`Failed to add jobs: ${JSON.stringify(e)}`));
};

export default generateJobs;
