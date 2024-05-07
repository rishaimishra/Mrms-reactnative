import {SET_ACTIVE_USER, SET_LOGGED_IN_USER, SET_LOGGED_OUT_USER} from "../actions/types";

const initialState = {
    isLoggedIn: false,
    token: null,
    activeUser: {
        small_preview: '',
        name: ''
    }
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SET_LOGGED_IN_USER: {
            return {
                ...state,
                isLoggedIn: true,
                token: action.token,
                activeUser: action.activeUser
            };
        }
        case SET_LOGGED_OUT_USER: {
            return initialState;
        }
        case SET_ACTIVE_USER: {
            return {
                ...state,
                activeUser: action.activeUser
            };
        }
        default: {
            return state;
        }
    }
};