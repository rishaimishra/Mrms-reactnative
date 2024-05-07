import {SET_OPTIONS} from "../actions/types";

const initialState = {
    categories: [],
    wallMaterials: [],
    roofMaterials: [],
    windowType:[],
    valueAdded: [],
    adjustment_values:[],
    characteristic_values:[],
    title:[],
    types: [],
    dimensions: [],
    district:[],
    propertyUse: [],
    zones: [],
    swimmingPool: [],
    sanitation: []
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