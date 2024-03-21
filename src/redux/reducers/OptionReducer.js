import {SET_OPTIONS} from "../actions/types";

const initialState = {
    categories: [],
    wallMaterials: [],
    roofMaterials: [],
    valueAdded: [],
    types: [],
    dimensions: [],
    district:[],
    propertyUse: [],
    zones: [],
    swimmingPool: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SET_OPTIONS: {
            return {
                ...state,
                ...action.options
            };
        }

        default:
            return state;
    }
};