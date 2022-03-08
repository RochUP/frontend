export const USER_LOGIN = "USER_LOGIN";
export const userLogin = (userid: string, username: string) => ({
    type: USER_LOGIN,
    payload: {
        userid,
        username,
    }
});

export const USER_LOGOUT = "USER_LOGOUT";
export const userLogout = () => ({
    type: USER_LOGOUT,
    payload: {
    }
});
