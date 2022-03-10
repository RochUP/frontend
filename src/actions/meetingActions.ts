export const MEETING_JOIN = 'MEETING_JOIN';
export const meetingJoinAction = (
    meetingId: number,
    meetingName: string,
    meetingStartTime: string,
    presenterIds: Array<string>,
    presenterNames: Array<string>,
    documentIds: Array<string>
) => ({
    type: MEETING_JOIN,
    payload: {
        meetingId,
        meetingName,
        meetingStartTime,
        presenterIds,
        presenterNames,
        documentIds,
    },
});

export const MEETING_EXIT = 'MEETING_EXIT';
export const meetingExitAction = () => ({
    type: MEETING_EXIT,
    payload: {},
});

export const PRESENT_CHANGE = 'PRESENT_CHANGE';
export const presentChangeAction = (presentOrder: number) => ({
    type: PRESENT_CHANGE,
    payload: { presentOrder },
});

export const GET_DOCUMENT = 'GET_DOCUMENT';
export const getDocumentAction = (documentId: number, documentUrl: string, script: string) => ({
    type: GET_DOCUMENT,
    payload: {
        documentId,
        documentUrl,
        script,
    },
});

export const CHANGE_DOCUMENT_PAGE = 'CHANGE_DOCUMENT_PAGE';
export const changeDocumentPageAction = (presenterIdNow: string, documentPageNow: number) => ({
    type: CHANGE_DOCUMENT_PAGE,
    payload: {
        presenterIdNow,
        documentPageNow,
    },
});

export const GET_QUESTIONS = 'GET_QUESTIONS';
export const getQuestionsAction = (
    questionIds: number[],
    questionBodys: string[],
    documentIds: number[],
    documentPages: number[],
    questionTimes: string[],
    presenterIds: string[]
) => ({
    type: GET_QUESTIONS,
    payload: {
        questionIds,
        questionBodys,
        documentIds,
        documentPages,
        questionTimes,
        presenterIds,
    },
});

export const ADD_QUESTION = 'ADD_QUESTION';
export const addQuestionAction = (question: any) => ({
    type: ADD_QUESTION,
    payload: {
        question,
    },
});

export const ADD_QUESTION_VOTE = 'ADD_QUESTION_VOTE';
export const addQuestionVoteAction = (questionId: number, voteNum: number) => ({
    type: ADD_QUESTION_VOTE,
    payload: {
        questionId,
        voteNum,
    },
});

export const CHANGE_QUESTION_ISVOTE = 'CHANGE_QUESTION_ISVOTE';
export const changeQuestionIsVote = (questionId: number, isVote: boolean) => ({
    type: CHANGE_QUESTION_ISVOTE,
    payload: {
        questionId,
        isVote,
    },
});

export const SORT_QUESTIONS_BY_TIME = 'SORT_QUESTIONS_BY_TIME';
export const sortQuestionsByTimeAction = () => ({
    type: SORT_QUESTIONS_BY_TIME,
});

export const SORT_QUESTIONS_BY_VOTE = 'SORT_QUESTIONS_BY_VOTE';
export const sortQuestionsByVoteAction = () => ({
    type: SORT_QUESTIONS_BY_VOTE,
});
