import { MEETING_JOIN } from "../actions/meetingActions";

const initialState = {
    meetingId: 0,
    meetingName: "meeting",
    meetingStartTime: "1998/06/10 00:00:00",
    presenters: [],
    documentIds: [],
}

export default function reducer(state=initialState, action: any) {
    switch (action.type) {
        case MEETING_JOIN:
            return{
                ...state,
                meetingId: action.payload.meetingId,
                meetingName: action.payload.meetingName,
                meetingStartTime: action.payload.meetingStartTime,
                presenters: action.payload.presenters,
                documentIds: action.payload.documentIds,
            };
        
        default:
            break;
    }
    return state;
}