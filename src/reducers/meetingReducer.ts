import {
    ADD_QUESTION,
    ADD_QUESTION_VOTE,
    CHANGE_DOCUMENT_PAGE,
    GET_DOCUMENT,
    MEETING_EXIT,
    MEETING_JOIN,
} from '../actions/meetingActions';

type Question = {
    meetingId: number;
    questionId: number;
    questionBody: string;
    documentId: number;
    documentPage: number;
    questionTime: string;
    voteNum: number;
    isVote: boolean;
};

const initialState = {
    meetingId: 0,
    meetingName: 'meeting',
    meetingStartTime: '1998/06/10 00:00:00',
    presenterIds: ['ishikawa1', 'yoshida1'],
    presenterNames: ['a', 'b'],
    documentIds: [0],
    documentUrls: [''],
    scripts: [''],
    presenterIdNow: 0,
    documentPageNow: 1,
    questionList: Array<Array<Question>>(),
};

export default function reducer(state = initialState, action: any) {
    switch (action.type) {
        case MEETING_JOIN:
            return {
                ...state,
                meetingId: action.payload.meetingId,
                meetingName: action.payload.meetingName,
                meetingStartTime: action.payload.meetingStartTime,
                presenterIds: action.payload.presenterIds,
                presenterNames: action.payload.presenterNames,
                documentIds: action.payload.documentIds,
                documentUrls: Array(action.payload.documentIds.length).fill(''),
                scripts: Array(action.payload.documentIds.length).fill(''),
                presenterIdNow: action.payload.presenterIds[0],
                documentPageNow: 1,
                questionList: Array(action.payload.presenterIds.length)
                    .fill(null)
                    .map((_) => new Array<Question>(action.payload.presenterIds.length)),
            };

        case MEETING_EXIT:
            return {
                ...state,
                meetingId: 0,
                meetingName: '',
                meetingStartTime: '1998/06/10 00:00:00',
                presenterIds: [''],
                presenterNames: [''],
                documentIds: [0],
                documentUrls: [''],
                scripts: [''],
                presenterIdNow: [''],
                documentPageNow: 1,
                questionList: Array<Array<Question>>(),
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
            const index = state.presenterIds.indexOf(action.payload.question.presenterId);
            if (index !== -1) {
                const questionList = state.questionList.slice();
                const question = {
                    meetingId: action.payload.question.meetingId,
                    questionId: action.payload.question.questionId,
                    questionBody: action.payload.question.questionBody,
                    documentId: action.payload.question.documentId,
                    documentPage: action.payload.question.documentPage,
                    questionTime: action.payload.question.questionTime,
                    voteNum: 0,
                    isVote: false,
                };
                questionList[index].push(question);
                return {
                    ...state,
                    questionList: questionList,
                };
            } else {
                return state;
            }

        case ADD_QUESTION_VOTE:
            const questionList = state.questionList.slice();
            questionList.map((questions) => {
                return questions.map((q) => {
                    q.questionId === action.payload.questionId &&
                        (q.voteNum = action.payload.voteNum);
                    return q;
                });
            });
            return {
                ...state,
                questionList: questionList,
            };

        default:
            break;
    }
    return state;
}
