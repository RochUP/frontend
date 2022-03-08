import { ADD_QUESTION, CHANGE_DOCUMENT_PAGE, GET_DOCUMENT, MEETING_EXIT, MEETING_JOIN } from "../actions/meetingActions";

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
    questionList: [[{}],],
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
                documentUrls: Array(action.payload.documentIds.length).fill(""),
                scripts: ["A", "B"], //Array(action.payload.documentIds.length).fill(""),
                presenterIdNow: action.payload.presenterIds[0],
                documentPageNow: 1,
                questionList: Array(action.payload.presenterIds.length).fill(null).map(item => new Array()),
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
                questionList: Array(action.payload.presenterIds.length).fill(null).map(item => new Array()),
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

        case ADD_QUESTION:
            const index = state.presenterIds.indexOf(action.payload.question.presenterId)
            if (index !== -1) {
                var questionList = state.questionList.slice();
                const question = {
                    meetingId: action.payload.question.meetingId,
                    questionId: action.payload.question.questionId,
                    questionBody: action.payload.question.questionBody,
                    documentId: action.payload.question.documentId,
                    documentPage: action.payload.question.documentPage,
                    questionTime: action.payload.question.questionTime,
                    voteNum: 0,
                    isVote: false,
                }
                questionList[index].push(question);
                return {
                    ...state,
                    questionList: questionList,
                };
            }else{
                return state;
            }
        
        default:
            break;
    }
    return state;
}