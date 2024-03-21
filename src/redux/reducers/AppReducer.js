import {SET_APP_LOADED, SET_DEFAULT_WARD, SET_NAME_AND_STREETS_OPTIONS} from "../actions/types";

const initialState = {
    loaded: false,
    defaultWard: '',
    firstNames: [],
    lastNames: [],
    streetNames: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SET_APP_LOADED: {
            return {
                ...state,
                loaded: true
            };
        }
        case SET_DEFAULT_WARD: {
            return {
                ...state,
                defaultWard: action.defaultWard
            };
        }
        case SET_NAME_AND_STREETS_OPTIONS: {
            return {
                ...state,
                firstNames: action.firstNames,
                lastNames: action.lastNames,
                streetNames: action.streetNames
            }
        }
        default:
            return state;
    }
};