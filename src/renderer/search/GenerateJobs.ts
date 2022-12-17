import { getFunctions, httpsCallable } from 'firebase/functions';

interface Job {
    info: {
        company: string;
        position: string;
        location: string;
    };

    details: {
        description: string;
        link: string;
        salary: string;
    };
    notes: string;
    deadlines: {
        title: string;
        date: number;
        location: string;
    }[];
    interviewQuestions: { name: string; description: string }[];
    contacts: {
        name: string;
        title: string;
        company: string;
        email: string;
        phone: string;
        linkedin: string;
        notes: string;
    }[];

    metadata: {
        stage: number;
        awaitingResponse: boolean;
    };
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
    {
        name: 'Reverse a linked list',
        description:
            'Given a pointer to the head node of a linked list, the task is to reverse the linked list. We need to reverse the list by changing the links between nodes.',
    },
    {
        name: 'Depth-first search',
        description:
            'Depth First Traversal (or Search) for a graph is similar to Depth First Traversal of a tree. The only catch here is, that, unlike trees, graphs may contain cycles (a node may be visited twice). To avoid processing a node more than once, use a boolean visited array. A graph can have more than one DFS traversal.',
    },
    {
        name: 'Breadth-first search',
        description:
            'Breadth-First Traversal (or Search) for a graph is similar to Breadth-First Traversal of a tree. \n' +
            'The only catch here is, that, unlike trees, graphs may contain cycles, so we may come to the same node again. To avoid processing a node more than once, we divide the vertices into two categories:\n' +
            'Visited and\n' +
            'Not visited.\n' +
            'A boolean visited array is used to mark the visited vertices. For simplicity, it is assumed that all vertices are reachable from the starting vertex. BFS uses a queue data structure for traversal.',
    },
    {
        name: 'Merge sort',
        description:
            'The Merge Sort algorithm is a sorting algorithm that is based on the Divide and Conquer paradigm. In this algorithm, the array is initially divided into two equal halves and then they are combined in a sorted manner.',
    },
    {
        name: 'Quick sort',
        description:
            'Like Merge Sort, QuickSort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot. There are many different versions of quickSort that pick pivot in different ways. \n' +
            'Always pick the first element as a pivot.\n' +
            'Always pick the last element as a pivot (implemented below)\n' +
            'Pick a random element as a pivot.\n' +
            'Pick median as the pivot.\n' +
            'The key process in quickSort is a partition(). The target of partitions is, given an array and an element x of an array as the pivot, put x at its correct position in a sorted array and put all smaller elements (smaller than x) before x, and put all greater elements (greater than x) after x. All this should be done in linear time.',
    },
    {
        name: 'Binary search',
        description:
            'Given a sorted array arr[] of n elements, write a function to search a given element x in arr[] and return the index of x in the array.',
    },
    {
        name: 'Linear search',
        description:
            'Given a unsorted array arr[] of n elements, write a function to search a given element x in arr[] and return the index of x in the array.',
    },
    {
        name: "Dijkstra's algorithm",
        description:
            "Dijkstra's algorithm allows us to find the shortest path between any two vertices of a graph.\n" +
            'It differs from the minimum spanning tree because the shortest distance between two vertices might not include all the vertices of the graph.',
    },
    {
        name: 'Bellman-Ford algorithm',
        description:
            'Given a graph and a source vertex src in the graph, find the shortest paths from src to all vertices in the given graph. The graph may contain negative weight edges. \n' +
            'We have discussed Dijkstra’s algorithm for this problem. Dijkstra’s algorithm is a Greedy algorithm and the time complexity is O((V+E)LogV) (with the use of the Fibonacci heap). Dijkstra doesn’t work for Graphs with negative weights, Bellman-Ford works for such graphs. Bellman-Ford is also simpler than Dijkstra and suites well for distributed systems. But time complexity of Bellman-Ford is O(V * E), which is more than Dijkstra. ',
    },
    {
        name: 'Floyd-Warshall algorithm',
        description:
            'The Floyd Warshall Algorithm is for solving all pairs shortest path problems. The problem is to find the shortest distances between every pair of vertices in a given edge-weighted directed Graph.',
    },
    {
        name: "Kruskal's algorithm",
        description:
            "Kruskal's algorithm is a minimum spanning tree algorithm that takes a graph as input and finds the subset of the edges of that graph which\n" +
            'form a tree that includes every vertex\n' +
            'has the minimum sum of weights among all the trees that can be formed from the graph',
    },
    {
        name: "Prim's algorithm",
        description:
            'We have discussed Kruskal’s algorithm for Minimum Spanning Tree. Like Kruskal’s algorithm, Prim’s algorithm is also a Greedy algorithm. Prim’s algorithm always starts with a single node and it moves through several adjacent nodes, in order to explore all of the connected edges along the way.',
    },
    {
        name: 'Dynamic programming',
        description:
            'Dynamic Programming is mainly an optimization over plain recursion. Wherever we see a recursive solution that has repeated calls for same inputs, we can optimize it using Dynamic Programming. The idea is to simply store the results of subproblems, so that we do not have to re-compute them when needed later. This simple optimization reduces time complexities from exponential to polynomial.\n' +
            'For example, if we write simple recursive solution for Fibonacci Numbers, we get exponential time complexity and if we optimize it by storing solutions of subproblems, time complexity reduces to linear.',
    },
    {
        name: 'Longest common subsequence',
        description:
            'Given two sequences, find the length of longest subsequence present in both of them. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous. For example, “abc”, “abg”, “bdf”, “aeg”, ‘”acefg”, .. etc are subsequences of “abcdefg”. So a string of length n has 2^n different possible subsequences.',
    },
    {
        name: 'Longest common substring',
        description: 'Given two strings, find the longest common substring.',
    },
    {
        name: 'A* algorithm',
        description:
            'A* is a computer algorithm that is widely used in pathfinding and graph traversal, which is the process of finding a path between multiple points, called nodes. It enjoys widespread use due to its performance and accuracy. ',
    },
    {
        name: 'Backtracking',
        description:
            'Backtracking is an algorithmic-technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem at any point of time (by time, here, is referred to the time elapsed till reaching any level of the search tree).',
    },
    {
        name: 'Greedy algorithm',
        description:
            'A greedy algorithm is an algorithmic paradigm that follows the problem solving heuristic of making the locally optimal choice at each stage with the hope of finding a global optimum. In many problems, a greedy strategy does not in general produce an optimal solution, but nonetheless a greedy heuristic may yield locally optimal solutions that approximate a global optimal solution in a reasonable time.',
    },
    {
        name: 'Knapsack problem',
        description:
            'Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.',
    },
    {
        name: '0-1 knapsack problem',
        description:
            'Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. In other words, given two integer arrays val[0..n-1] and wt[0..n-1] which represent values and weights associated with n items respectively. Also given an integer W which represents knapsack capacity, find out the maximum value subset of val[] such that sum of the weights of this subset is smaller than or equal to W. You cannot break an item, either pick the complete item, or don’t pick it (0-1 property).',
    },
    {
        name: 'Fractional knapsack problem',
        description:
            'Given weights and values of n items, we need to put these items in a knapsack of capacity W to get the maximum total value in the knapsack. In the 0-1 Knapsack problem, we are not allowed to break items. We either take the whole item or don’t take it. In Fractional Knapsack, we can break items for maximizing the total value of knapsack. This problem in which we can break an item is also called the fractional knapsack problem.',
    },
    {
        name: 'Breadth-first search',
        description:
            "Breadth-first search (BFS) is an algorithm for traversing or searching tree or graph data structures. It starts at the tree root (or some arbitrary node of a graph, sometimes referred to as a 'search key'), and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.",
    },
    {
        name: 'Depth-first search',
        description:
            'Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
    },
    {
        name: 'Dijkstra’s algorithm',
        description:
            'Dijkstra’s algorithm is very similar to Prim’s algorithm for minimum spanning tree. Like Prim’s MST, we generate a SPT (shortest path tree) with given source as root. We maintain two sets, one set contains vertices included in shortest path tree, other set includes vertices not yet included in shortest path tree. At every step of the algorithm, we find a vertex which is in the other set (set of not yet included) and has a minimum distance from the source.',
    },
    {
        name: 'Bellman-Ford algorithm',
        description:
            'The Bellman–Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra’s algorithm for the same problem, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.',
    },
    {
        name: 'Floyd-Warshall algorithm',
        description:
            'The Floyd–Warshall algorithm is an algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles).',
    },
    {
        name: 'Johnson’s algorithm',
        description:
            'Johnson’s algorithm is an algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles).',
    },
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
        const deadlines: { title: string; date: number; location: string }[] = [];

        const generateDeadline = (title: string, day: number) => {
            const month = Math.floor(Math.random() * 4);
            const hours = Math.random() < 0.5 ? Math.floor(Math.random() * 3) + 9 : Math.floor(Math.random() * 4) + 13;
            const minutes = Math.random() < 0.3 ? 30 : 0;
            const date = new Date(2023, month, day, hours, minutes, 0, 0).getMilliseconds();

            const location = Math.random() < 0.5 ? 'Zoom meeting' : 'In-person';

            deadlines.push({ title, date, location });
        };

        const numDeadlines = Math.floor(Math.random() * 3) + 1;
        let title, day;
        switch (numDeadlines) {
            case 1:
                title = Math.random() < 0.5 ? '❗ Interview ❗' : 'Job interview';
                day = Math.floor(Math.random() * 29) + 1;
                generateDeadline(title, day);

                break;
            case 2:
                title = Math.random() < 0.5 ? '❗ Interview ❗' : 'Job interview';
                day = Math.floor(Math.random() * 14) + 1;
                generateDeadline(title, day);

                title = 'Interview';
                day = Math.floor(Math.random() * 15) + 15;
                generateDeadline(title, day);

                break;
            case 3:
                title = 'Initial application due';
                day = Math.floor(Math.random() * 9) + 1;
                generateDeadline(title, day);

                title = Math.random() < 0.5 ? 'First round interview' : 'Technical round';
                day = Math.floor(Math.random() * 10) + 10;
                generateDeadline(title, day);

                title = '❗ Final interview ❗';
                day = Math.floor(Math.random() * 10) + 20;
                generateDeadline(title, day);

                break;
            default:
                throw `Invalid num deadlines: ${numDeadlines}`;
        }
        return deadlines;
    };

    // Generate list of potential contacts
    const contactNames = [
        {
            name: 'Olivia Xu',
            linkedin: 'https://www.linkedin.com/in/olivia-chen-xu/',
        },
        {
            name: 'Cameron Beaulieu',
            linkedin: 'https://www.linkedin.com/in/cameron-beaulieu/',
        },
        {
            name: 'Reid Moffat',
            linkedin: 'https://www.linkedin.com/in/reid-moffat/',
        },
        {
            name: 'Daniel Joseph',
            linkedin: 'https://www.linkedin.com/in/danieljoseph8/',
        },
        {
            name: 'Krishaan Thyagarajan',
            linkedin: 'https://www.linkedin.com/in/krishaan-thyagarajan/',
        },
        {
            name: 'Wasiq Wadud',
            linkedin: 'https://www.linkedin.com/in/wasiq-wadud/',
        },
    ];
    const contacts: {
        // Note: company is added later with the job
        name: string;
        title: string;
        email: string;
        phone: string;
        linkedin: string;
        notes: string;
    }[] = [];
    const contactNotes = [
        'I know this person through a mutual friend',
        'I met this person at a hackathon',
        'They are a friend of a friend',
        'I met this person at a networking event',
        "I don't know who this is, but they reached out to me",
        'I met this person at a career fair',
        'I met this person through a mutual friend',
        "Gotta impress them... they're a big shot",
        "If I get this job, I'll have to thank this person",
        'They are pretty high up in the company',
        'They are a friend of a friend of a friend',
        'They are a friend of a friend of a friend of a friend',
        'They are a friend of a friend of a friend of a friend of a friend',
        'They are a friend of a friend of a friend of a friend of a friend of a friend',
        'They are a friend of a friend of a friend of a friend of a friend of a friend of a friend',
    ];
    contactNames.forEach((contact) => {
        const newContact = {
            name: contact.name,
            title: jobPositions[~~(Math.random() * jobPositions.length)]
                .replace('Intern', '')
                .trimEnd(),
            email: `${contact.name.toLowerCase().replace(' ', '.')}@gmail.com`,
            phone: Math.floor(Math.random() * 10000000000) < 1000000000 ? `0${num}` : `${num}`,
            linkedin: contact.linkedin,
            notes: Math.random() < 0.7 ? contactNotes[~~(Math.random() * contactNotes.length)] : '',
        };
        contacts.push(newContact);
    });

    const jobs: Job[] = [];
    for (let i = 0; i < num; ++i) {
        const company = Math.floor(Math.random() * companies.length);
        const job = {
            info: {
                company: companies[company],
                position: jobPositions[~~(Math.random() * jobPositions.length)],
                location: locations[~~(Math.random() * locations.length)],
            },

            details: {
                description: descriptions[company],
                link: `${urls[company]}/jobs/${Math.floor(Math.random() * 1000000)}`,
                salary: `${Math.floor(Math.random() * 100000) + 50000}USD`,
            },
            notes: jobNotes[~~(Math.random() * jobNotes.length)],
            deadlines: generateDeadlines(),
            interviewQuestions: [...questions]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 5) + 1),
            contacts: [...contacts]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 3) + 1)
                .map((contact) => ({ ...contact, company: companies[company] })),

            metadata: {
                stage: Math.floor(Math.random() * 4),
                awaitingResponse: Math.random() < 0.5,
            },

            userId:
                Math.random() < 0.5
                    ? 'WAtTku8XDtUyu9XpjOW3yB8vF0R2' // 18rem8@queensu.ca (admin account)
                    : 'glTn3bNtAgX6Ahy7SeOSMmU2txy1', // reid.moffat9@gmail.com
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
