import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

async function post(path:string, data:object) {
    await axios.post(URL + path, data)
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


export function signup(userId:string, userName:string, userPassword:string){
    const data = {
        userId: userId,
        userName: userName,
        userPassword: userPassword,
    }
    
    post("/user/signup", data);
}

export function login(userId:string, userPassword:string){
    const data = {
        userId: userId,
        userPassword: userPassword,
    }
    
    post("/user/login", data);
}