interface IJob {
    position: string;
    company: string;
    description: string;
    salary: string;
    location: string;
    link: string;
    notes: string;
    stage: number;
    awaitingResponse: boolean;
    priority: string;

    deadlines: IDeadline[];
    interviewQuestions: IInterviewQuestion[];
    contacts: IContact[];

    boardId: string;
    userId: string;
}

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

export { IJob, IDeadline, IInterviewQuestion, IContact };
