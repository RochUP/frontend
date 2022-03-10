import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

async function post(path: string, data: object) {
    console.log('post', path, data);
    return await axios
        .post(URL + path, (data = data))
        .then((res) => {
            console.log('response', res);
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}

async function get(path: string) {
    await axios
        .get(URL + path)
        .then((res) => {
            console.log(res);
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}

export async function signup(userId: string, userName: string, userPassword: string) {
    // TODO:
    // - ID被りのレスポンス
    // - レスポンスのフォーマット
    const data = {
        userId: userId,
        userName: userName,
        userPassword: userPassword,
    };

    console.log(data);

    return await post('/user/signup', data)
        .then((res) => {
            const res_data = {
                result: res.result,
                userId: userId, //res.userId,
                userName: userName, //res.userName,
            };
            return res_data;
        })
        .catch((err) => {
            throw err;
        });
}

export async function login(userId: string, userPassword: string) {
    const data = {
        userId: userId,
        userPassword: userPassword,
    };

    return await post('/user/login', data)
        .then((res) => {
            const res_data = {
                result: res.result,
                userId: userId, //res.userId,
                userName: res.userName,
            };
            return res_data;
        })
        .catch((err) => {
            throw err;
        });
}

export async function meetingCreate(
    meetingName: string,
    meetingStartTime: string,
    presenterIds: string[]
) {
    // TODO:
    // - startTimeのフォーマット
    const data = {
        meetingName: meetingName,
        meetingStartTime: meetingStartTime,
        presenterIds: presenterIds,
    };

    return await post('/meeting/create', data)
        .then((res) => {
            const res_data = {
                result: res.meetingId != -1,
                meetingId: res.meetingId,
                meetingName: res.meetingName,
            };
            return res_data;
        })
        .catch((err) => {
            throw err;
        });
}

export async function meetingJoin(userId: string, meetingId: number) {
    // TODO:
    // - startTimeのフォーマット
    // - return のフォーマット
    const data = {
        userId: userId,
        meetingId: meetingId,
    };

    return await post('/meeting/join', data)
        .then((res) => {
            const res_data = {
                result: res.result,
                meetingName: res.meetingName,
                meetingStartTime: res.meetingStartTime,
                presenterNames: res.presenterNames,
                presenterIds: res.presenterIds,
                documentIds: res.documentIds,
            };
            return res_data;
        })
        .catch((err) => {
            throw err;
        });
}

export async function registerDocument(
    documentId: number,
    documentUrl: string | null = null,
    script: string | null = null
) {
    const data = {
        documentId: documentId,
        documentUrl: documentUrl,
        script: script,
    };

    return await post('/document/register', data)
        .then((res) => {
            const res_data = {
                result: res.result,
            };
            return res_data;
        })
        .catch((err) => {
            throw err;
        });
}

export async function getDocument(documentId: string) {
    const data = {
        documentId: documentId,
    };

    return await post('/document/get', data)
        .then((res) => {
            const res_data = {
                result: res.result,
                documentUrl: res.documentUrl,
                script: res.script,
            };
            return res_data;
        })
        .catch((err) => {
            throw err;
        });
}

export async function getQuestions(meetingId: string) {
    const data = {
        meetingId: meetingId,
    };

    return await post('/questions', data)
        .then((res) => {
            const res_data = {
                result: res.result,
                meetingId: res.meetingId,
                questionIds: res.questionIds,
                questionBodys: res.questionBodys,
                documentIds: res.documentIds,
                documentPages: res.documentPages,
                questionTimes: res.questionTimes,
                presenterIds: res.presenterIds,
                voteNums: res.voteNums,
            };
            return res_data;
        })
        .catch((err) => {
            throw err;
        });
}
