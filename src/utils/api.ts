import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

async function post(path:string, data:object) {
    return await axios.post(URL + path, data=data)
        .then(res => {
            console.log(res);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

async function get(path:string) {
    await axios.get(URL + path)
        .then(res => {
            console.log(res);
            return res.data;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}


export async function signup(userId:string, userName:string, userPassword:string): Promise<boolean> {
    // TODO: 
    // - ID被りのレスポンス
    // - レスポンスのフォーマット
    const data = {
        "userId": userId,
        "userName": userName,
        "userPassword": userPassword
    }

    console.log(data);
    
    return await post("/user/signup", data)
        .then(res => {
            return res.result;
        })
        .catch(err => {
            throw err;
        });
}

export async function login(userId:string, userPassword:string): Promise<boolean> {
    const data = {
        userId: userId,
        userPassword: userPassword,
    }
    
    return await post("/user/login", data)
        .then(res => {
            return res.result;
        })
        .catch(err => {
            throw err;
        });
}

export async function meetingCreate(meetingName:string, meetingStartTime:string, presenters:string[]){
    // TODO: 
    // - startTimeのフォーマット
    const data = {
        meetingName: meetingName,
        meetingStartTime: meetingStartTime,
        presenters: presenters,
    }

    return await post("/meeting/create", data)
        .then(res => {
            return res;
        })
        .catch(err => {
            throw err;
        });
}

export async function meetingJoin(userId:string, meetingId:number){
    // TODO:
    // - startTimeのフォーマット
    // - return のフォーマット
    const data = {
        userId: userId,
        meetingId: meetingId,
    }

    return await post("/meeting/join", data)
        .then(res => {
            return res;
        })
        .catch(err => {
            throw err;
        });
}

export async function postDocument(userId:string, meetingId:string, file:string="", script:string=""){
    // TODO:
    // - fileの扱い(ファイルのパスを受け取って，ここでBase64エンコードするか)
    const data = {
        userId: userId,
        meetingId: meetingId,
        file: file,
        script: script,
    }

    return await post("/document", data)
    .then(res => {
        return res;
    })
    .catch(err => {
        throw err;
    });
}

export async function getDocument(documentId:string){
    const data = {
        documentId: documentId,
    }

    return await post("/document", data)
    .then(res => {
        return res;
    })
    .catch(err => {
        throw err;
    });
}