import { CHANGE_DOCUMENT_PAGE, GET_DOCUMENT, MEETING_EXIT, MEETING_JOIN } from "../actions/meetingActions";

const initialState = {
    meetingId: 0,
    meetingName: "meeting",
    meetingStartTime: "1998/06/10 00:00:00",
    presenterIds: ['ishikawa1', 'yoshida1'],
    presenterNames: ["a","b"],
    documentIds: [0,],
    documentUrls: ["",],
    scripts: ["",],
    presenterIdNow: 0,
    documentPageNow: 1,
}

export default function reducer(state=initialState, action: any) {
    switch (action.type) {
        case MEETING_JOIN:
            return{
                ...state,
                meetingId: action.payload.meetingId,
                meetingName: action.payload.meetingName,
                meetingStartTime: action.payload.meetingStartTime,
                presenterIds: action.payload.presenterIds,
                presenterNames: action.payload.presenterNames,
                documentIds: action.payload.documentIds,
                documentUrls: ["https://hacku.blob.core.windows.net/pdfcontainer/react_newblob1646585180049", "https://hacku.blob.core.windows.net/pdfcontainer/react_newblob1646585610962"],//Array(action.payload.documentIds.length).fill(""),
                scripts: ["A", "B"], //Array(action.payload.documentIds.length).fill(""),
                presenterIdNow: action.payload.presenterIds[0],
                documentPageNow: 1,
            };
        
        case MEETING_EXIT:
            return{
                ...state,
                meetingId: 0,
                meetingName: "",
                meetingStartTime: "1998/06/10 00:00:00",
                presenterIds: ["",],
                presenterNames: ["",],
                documentIds: [0,],
                documentUrls: ["",],
                scripts: ["",],
                presenterIdNow: [""],
                documentPageNow: 1,
            };

        case GET_DOCUMENT:
            var documentUrls = state.documentUrls.slice();
            var scripts = state.scripts.slice();
            const idx = state.documentIds.indexOf(action.payload.documentId);
            documentUrls[idx] = action.payload.documentUrl;
            scripts[idx] = action.payload.script;
            return {
                ...state,
                documentUrls: documentUrls,
                scripts: scripts,
            };

        case CHANGE_DOCUMENT_PAGE:
            return {
                ...state,
                presenterIdNow: action.payload.presenterIdNow,
                documentPageNow: action.payload.documentPageNow,
            };
        
        default:
            break;
    }
    return state;
}