export const MEETING_JOIN = "MEETING_JOIN";
export const meetingJoinAction = (meetingId: number, meetingName: string, meetingStartTime: string, presenterIds: Array<string>, presenterNames: Array<string>, documentIds: Array<string>) => ({
    type: MEETING_JOIN,
    payload: {
        meetingId,
        meetingName,
        meetingStartTime,
        presenterIds,
        presenterNames,
        documentIds,
    }
});

export const GET_DOCUMENT = "GET_DOCUMENT";
export const getDocumentAction = (documentId: number, documentUrl: string, script: string) => ({
    type: GET_DOCUMENT,
    payload: {
        documentId,
        documentUrl,
        script,
    }
});

export const CHANGE_DOCUMENT_PAGE = "CHANGE_DOCUMENT_PAGE";
export const changeDocumentPageAction = (documentIdNow: number, documentPageNow: number) => ({
    type: CHANGE_DOCUMENT_PAGE,
    payload: {
        documentIdNow,
        documentPageNow,
    }
});