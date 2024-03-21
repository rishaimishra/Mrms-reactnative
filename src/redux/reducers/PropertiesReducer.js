import {ADD_PROPERTIES_IN_LIST, SET_LOADING_PROPERTIES, SET_LOGGED_OUT_USER} from "../actions/types";

const initialState = {
    items: [],
    loading: true,
    currentPage: 0
};

export default (state = initialState, action) => {

    switch (action.type) {

        case ADD_PROPERTIES_IN_LIST: {

            const newState = {...state};

            newState.loading = false;
            newState.currentPage = action.currentPage;
            newState.items = action.currentPage === 1 ? action.properties : [...state.items, ...action.properties];

            return newState;
        }
        case SET_LOADING_PROPERTIES: {
            return {
                ...state,
                loading: true
            };
        }
        case SET_LOGGED_OUT_USER: {
            return initialState;
        }
        default:
            return state;
    }

};