import { CHANGE_DOCUMENT_PAGE, GET_DOCUMENT, MEETING_JOIN } from "../actions/meetingActions";

const initialState = {
    meetingId: 0,
    meetingName: "meeting",
    meetingStartTime: "1998/06/10 00:00:00",
    presenterIds: ['ishikawa1', 'yoshida1'],
    presenterNames: ["a","b"],
    documentIds: [0,],
    documentUrls: ["",],
    scripts: ["",],
    documentIdNow: 0,
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
                documentUrls: ["https://hacku.blob.core.windows.net/pdfcontainer/react_newblob1646585180049", "https://www.kansaigaidai.ac.jp/asp/img/pdf/82/7a79c35f7ce0704dec63be82440c8182.pdf"],//Array(action.payload.documentIds.length).fill(""),
                scripts: Array(action.payload.documentIds.length).fill(""),
                documentIdNow: action.payload.documentIds[0],
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
                documentIdNow: action.payload.documentIdNow,
                documentPageNow: action.payload.documentPageNow,
            };
        
        default:
            break;
    }
    return state;
}