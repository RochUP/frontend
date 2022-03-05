import { combineReducers } from "redux";

import userReducer from "./userReducer"
import meetingReducer from "./meetingReducer"

export default combineReducers({
    userReducer,
    meetingReducer,
})