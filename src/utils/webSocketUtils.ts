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
        case "document":
            return receiveDocument(data_json);
        case "message":
            return receiveMessage(data_json);
        default:
            return;
    }
}

// receive
function receiveQuestion(data: any) {
    const res = {
        messageType: "question",
        meetingId: data.meetingId,
        questionBody: data.questionBody,
        documentId: data.documentId,
        documentPage: data.documentPage,
        questionTime: data.questionTime,
    }
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
    }
    return res;
}

function receiveDocument(data: any) {
    const res = {
        messageType: "document",
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
    meetingId: number,
    userId: string,
    documentId: number,
    documentPage: number,
    isUp: boolean,
){
    console.log("sendHandsup");
    const data = {
        messageType: "handsup",
        meetingId: meetingId,
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
    documentId: number,
    finishType: string,
){
    console.log("sendFinishword");
    const data = {
        messageType: "finishword",
        meetingId: meetingId,
        presenterId: presenterId,
        documentId: documentId,
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