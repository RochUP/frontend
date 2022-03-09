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
export const changeDocumentPageAction = (presenterIdNow: number, documentPageNow: number) => ({
    type: CHANGE_DOCUMENT_PAGE,
    payload: {
        presenterIdNow,
        documentPageNow,
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
