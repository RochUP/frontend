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