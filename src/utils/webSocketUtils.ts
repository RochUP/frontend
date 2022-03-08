import Socket from "./webSocket";

export function receiveData(data: string) {
    const data_json = JSON.parse(data);
    switch(data_json.messageType){
        case "question":
            return receiveQuestion(data_json);
        case "question_vote":
            return receiveQuestionVote(data_json);
        case "reaction":
            return receiveReaction(data_json);
        case "moderator_msg":
            return receiveModeratorMsg(data_json);
        case "handsup":
            return receiveHandsup(data_json);
        case "document_update":
            return receiveDocumentUpdate(data_json);
        case "message":
            return receiveMessage(data_json);
        default:
            return data_json;
    }
}

// receive
function receiveQuestion(data: any) {
    const res = {
        messageType: "question",
        questionId: data.questionId,
        meetingId: data.meetingId,
        questionBody: data.questionBody,
        documentId: data.documentId,
        documentPage: data.documentPage,
        questionTime: data.questionTime,
        presenterId: data.presenterId,
    }
    console.log(res)
    return res;
}

function receiveQuestionVote(data: any) {
    const res = {
        messageType: "question_vote",
        meetingId: data.meetingId,
        questionId: data.questionId,
        voteNum: data.voteNum,
    }
    return res;
}

function receiveReaction(data: any) {
    const res = {
        messageType: "reaction",
        meetingId: data.meetingId,
        documentId: data.documentId,
        documentPage: data.documentPage,
        reactionNum: data.reactionNum,
    }
    return res;
}

function receiveModeratorMsg(data: any) {
    const res = {
        messageType: "moderator_msg",
        meetingId: data.meetingId,
        moderatorMsgBody: data.moderatorMsgBody,
        isStartPresen: data.isStartPresen,
        questionId: data.questionId,
        userId: data.userId,
        presenterOrder: data.presenterOrder,
    }
    return res;
}

function receiveHandsup(data: any) {
    const res = {
        messageType: "handsup",
        meetingId: data.meetingId,
        userId: data.userId,
    }
    return res;
}

function receiveDocumentUpdate(data: any) {
    const res = {
        messageType: "document_update",
        meetingId: data.meetingId,
        documentId: data.documentId,
    }
    return res;
}

function receiveMessage(data: any) {
    const res = {
        messageType: "message",
        message: data.message,
    }
    return res;
}


// send
export function sendQuestion (
    socket: Socket, 
    userId: string, 
    meetingId: number, 
    questionBody: string, 
    documentId: number, 
    documentPage: number, 
    questionTime: string,
){
    console.log("sendQuestion");
    const data = {
        messageType: "question",
        userId: userId,
        meetingId: meetingId,
        questionBody: questionBody,
        documentId: documentId,
        documentPage: documentPage,
        questionTime: questionTime
    };
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
    
}

export function sendQuestionVote (
    socket: Socket, 
    questionId: number,
    isVote: boolean,
){
    console.log("sendQuestionVote");
    const data = {
        messageType: "question_vote",
        questionId: questionId,
        isVote: isVote,
    };
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
    
}

export function sendReaction (
    socket: Socket,
    documentId: number,
    documentPage: number,
    isReaction: boolean,
){
    console.log("sendReaction");
    const data = {
        messageType: "reaction",
        documentId: documentId,
        documentPage: documentPage,
        isReaction: isReaction,
    };
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendHandsup (
    socket: Socket,
    userId: string,
    documentId: number,
    documentPage: number,
    isUp: boolean,
){
    console.log("sendHandsup");
    const data = {
        messageType: "handsup",
        userId: userId,
        documentId: documentId,
        documentPage: documentPage,
        isUp: isUp,
    };
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendFinishword (
    socket: Socket,
    meetingId: number,
    presenterId: string,
    finishType: string, //"present" or "question"
){
    console.log("sendFinishword");
    const data = {
        messageType: "finishword",
        meetingId: meetingId,
        presenterId: presenterId,
        finishType: finishType,
    };
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}

export function sendMessage (
    socket: Socket,
    message: string,
){
    console.log("sendMessage");
    const data = {
        messageType: "message",
        message: message,
    };
    const data_str = JSON.stringify(data);
    socket.emit(data_str);
}