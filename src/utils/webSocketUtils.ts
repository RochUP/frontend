import Socket from './webSocket';

export function receiveData(data: string) {
    const data_json = JSON.parse(data);
    console.log('receiveData', data_json);
    switch (data_json.messageType) {
        case 'question':
            return receiveQuestion(data_json);
        case 'question_vote':
            return receiveQuestionVote(data_json);
        case 'reaction':
            return receiveReaction(data_json);
        case 'moderator_msg':
            return receiveModeratorMsg(data_json);
        case 'handsup':
            return receiveHandsup(data_json);
        case 'document_update':
            return receiveDocumentUpdate(data_json);
        case 'message':
            return receiveMessage(data_json);
        default:
            return data_json;
    }
}

// receive
function receiveQuestion(data: any) {
    const res = {
        messageType: 'question',
        questionId: data.questionId,
        meetingId: data.meetingId,
        questionBody: data.questionBody,
        documentId: data.documentId,
        documentPage: data.documentPage,
        questionTime: data.questionTime,
        presenterId: data.presenterId,
    };
    console.log(res);
    return res;
}

function receiveQuestionVote(data: any) {
    const res = {
        messageType: 'question_vote',
        meetingId: data.meetingId,
        questionId: data.questionId,
        voteNum: data.voteNum,
    };
    return res;
}

function receiveReaction(data: any) {
    const res = {
        messageType: 'reaction',
        meetingId: data.meetingId,
        documentId: data.documentId,
        documentPage: data.documentPage,
        reactionNum: data.reactionNum,
    };
    return res;
}

function receiveModeratorMsg(data: any) {
    const res = {
        messageType: 'moderator_msg',
        meetingId: data.meetingId,
        moderatorMsgBody: data.moderatorMsgBody,
        isStartPresen: data.isStartPresen,
        questionId: data.questionId,
        userId: data.questionUserId,
        presenterOrder: data.presentOrder,
    };
    return res;
}

function receiveHandsup(data: any) {
    const res = {
        messageType: 'handsup',
        meetingId: data.meetingId,
        userId: data.userId,
    };
    return res;
}

function receiveDocumentUpdate(data: any) {
    const res = {
        messageType: 'document_update',
        meetingId: data.meetingId,
        documentId: data.documentId,
    };
    return res;
}

function receiveMessage(data: any) {
    const res = {
        messageType: 'message',
        message: data.message,
    };
    return res;
}

// send
export function sendQuestion(
    socket: Socket,
    userId: string,
    meetingId: number,
    questionBody: string,
    documentId: number,
    documentPage: number,
    questionTime: string
) {
    const data = {
        messageType: 'question',
        userId: userId,
        meetingId: meetingId,
        questionBody: questionBody,
        documentId: documentId,
        documentPage: documentPage,
        questionTime: questionTime,
    };
    console.log('sendQuestion', data);
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendQuestionVote(socket: Socket, questionId: number, isVote: boolean) {
    const data = {
        messageType: 'question_vote',
        questionId: questionId,
        isVote: isVote,
    };
    console.log('sendQuestionVote', data);
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendReaction(
    socket: Socket,
    documentId: number,
    documentPage: number,
    isReaction: boolean
) {
    const data = {
        messageType: 'reaction',
        documentId: documentId,
        documentPage: documentPage,
        isReaction: isReaction,
    };
    console.log('sendReaction', data);
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendHandsup(
    socket: Socket,
    userId: string,
    documentId: number,
    documentPage: number,
    isUp: boolean
) {
    const data = {
        messageType: 'handsup',
        userId: userId,
        documentId: documentId,
        documentPage: documentPage,
        isUp: isUp,
    };
    console.log('sendHandsup', data);
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendFinishword(
    socket: Socket,
    meetingId: number,
    presenterId: string,
    questionUserId: string,
    finishType: string //"present" or "question"
) {
    const data = {
        messageType: 'finishword',
        meetingId: meetingId,
        presenterId: presenterId,
        questionUserId: questionUserId,
        finishType: finishType,
    };
    console.log('sendFinishword', data);
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendMessage(socket: Socket, message: string) {
    const data = {
        messageType: 'message',
        message: message,
    };
    console.log('sendMessage', data);
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}
