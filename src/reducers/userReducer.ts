import { USER_LOGIN, USER_LOGOUT } from "../actions/userActions"

const initialState = {
    userid: "",
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
        case USER_LOGOUT:
            return{
                ...state,
                userid: "",
                username: "nanasi",
            };
        default:
            break;
    }
    return state;
}