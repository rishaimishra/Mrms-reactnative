import {SET_LOGGED_OUT_USER, SET_PENDING_PROPERTIES} from "../actions/types";

const initialState = {
    properties: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SET_PENDING_PROPERTIES: {
            return {
                ...state,
                properties: action.properties
            };
        }
        case SET_LOGGED_OUT_USER: {
            return initialState;
        }
        default:
            return state;
    }
};