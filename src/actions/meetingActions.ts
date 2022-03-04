export const MEETING_JOIN = "MEETING_JOIN";
export const meetingJoin = (meetingId: number, meetingName: string, meetingStartTime: string, presenters: Array<string>, documentIds: Array<string>) => ({
    type: MEETING_JOIN,
    payload: {
        meetingId,
        meetingName,
        meetingStartTime,
        presenters,
        documentIds,
    }
});