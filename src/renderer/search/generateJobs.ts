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
    title: string;
}

const jobs: Job[] = [
    {
        company: 'Google',
        contacts: [
            'https://www.linkedin.com/in/olivia-chen-xu/',
            'https://www.linkedin.com/in/cameron-beaulieu/',
        ],
        deadlines: [
            {
                date: 'November 17, 2022',
                title: 'Submit resume',
            },
            {
                date: 'November 30, 2022',
                title: 'Interview',
            },
        ],
        details: {
            description:
                "Will be working on the Google Cloud Platform team, which is responsible for building and maintaining the infrastructure that powers Google's cloud services.",
            url: 'https://www.linkedin.com/jobs/collections/recommended/?currentJobId=3332078940',
        },
        interviewQuestions: ['Reverse a linked list', 'Depth-first search'],
        location: 'San Francisco, California',
        notes: 'I REALLY want this job',
        stage: 0,
        title: 'Software Engineer Intern',
    },
];

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
    'Will be working on the Google Cloud Platform team',
    'Will be working on the Facebook Cloud Platform team',
    'Will be working on the Amazon Cloud Platform team',
    'Will be working on the Apple Cloud Platform team',
    'Will be working on the Microsoft Cloud Platform team',
    'Will be working on the Netflix Cloud Platform team',
    'Will be working on the Spotify Cloud Platform team',
    'Will be working on the Uber Cloud Platform team',
    'Will be working on the Airbnb Cloud Platform team',
    'Will be working on the Tesla Cloud Platform team',
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
    "Probabaly underqualified, but I'll try anyway",
    'I REALLY want this job',
    'This would be a good fit',
    'If it pays well, I might consider it',
    'If i get this... bill gates time 😎😎😎',
    'Have to travel to the US for this one',
    'holy fuck this is a good job',
    'I have no idea what this job is',
    "I'll probably get rejected",
    'I hope bezos sees this',
];
const jobTitles = [
    'Software Engineer Intern',
    'Software Engineer',
    'Software Developer',
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
        const month = Math.random() < 0.5 ? 'November' : 'December';

        const numDeadlines = Math.floor(Math.random() * 3) + 1;
        switch (numDeadlines) {
            case 1:
                deadlines.push({
                    date: `${month} ${Math.floor(Math.random() * 30)}, 2022`,
                    title: 'Job interview',
                });
                break;
            case 2:
                deadlines.push({
                    date: `${month} ${Math.floor(Math.random() * 15)}, 2022`,
                    title: 'Submit resume + cover letter',
                });
                deadlines.push({
                    date: `${month} ${Math.floor(Math.random() * 15) + 15}, 2022`,
                    title: 'Interview',
                });
                break;
            case 3:
                deadlines.push({
                    date: `${month} ${Math.floor(Math.random() * 10)}, 2022`,
                    title: 'Initial application due',
                });
                deadlines.push({
                    date: `${month} ${Math.floor(Math.random() * 10) + 10}, 2022`,
                    title: 'First round interview',
                });
                deadlines.push({
                    date: `${month} ${Math.floor(Math.random() * 10) + 20}, 2022`,
                    title: 'Final interview',
                });
                break;
            default:
                throw `Invalid num deadlines: ${numDeadlines}`;
        }

        return deadlines;
    };

    for (let i = 0; i < num; i += 1) {
        const company = Math.floor(Math.random() * companies.length);
        jobs.push({
            company: companies[company],
            contacts: [...contacts]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 3) + 1),
            deadlines: generateDeadlines(),
            details: {
                description: descriptions[company],
                url: `${urls[company]}/jobs/${Math.floor(Math.random() * 1000000)}`,
            },
            interviewQuestions: [...questions]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 5) + 1),
            location: locations[~~(Math.random() * locations.length)],
            notes: jobNotes[~~(Math.random() * jobNotes.length)],
            stage: Math.floor(Math.random() * 4),
            title: jobTitles[~~(Math.random() * jobTitles.length)],
        });
    }

    // Commit jobs to db
    const addJobs = httpsCallable(getFunctions(), 'addJobs');
    addJobs(jobs)
        .then(() => console.log('Successfully added jobs'))
        .catch((e) => console.log(`Failed to add jobs: ${JSON.stringify(e)}`));
};

export default generateJobs;
