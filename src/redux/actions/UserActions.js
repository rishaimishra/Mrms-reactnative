import {SET_ACTIVE_USER, SET_LOGGED_IN_USER} from "./types";

export const setLoggedInUser = (token, activeUser) => ({
    type: SET_LOGGED_IN_USER,
    token,
    activeUser
});

export const setActiveUser = (activeUser) => ({
    type: SET_ACTIVE_USER,
    activeUser
});

