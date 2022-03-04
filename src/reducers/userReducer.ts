import { USER_LOGIN } from "../actions/userActions"

const initialState = {
    userid: "0",
    username: "nanasi",
}

export default function reducer(state=initialState, action: any) {
    switch (action.type) {
        case USER_LOGIN:
            return{
                ...state,
                userid: action.payload.userid,
                username: action.payload.username,
            };
        
        default:
            break;
    }
    return state;
}