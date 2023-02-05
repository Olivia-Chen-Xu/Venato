interface IDeadline {
    title: string;
    date: number;
    company: string;
    location: string;
    link: string;
    jobId: string;
}

interface IInterviewQuestion {
    name: string;
    description: string;
    company: string;
    jobId: string;
}

interface IContact {
    name: string;
    company: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    notes: string;
    jobId: string;
}
