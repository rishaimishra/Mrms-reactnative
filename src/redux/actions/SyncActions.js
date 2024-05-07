import {SET_PENDING_PROPERTIES} from "./types";

export const setSyncProperties = (properties) => ({
    type: SET_PENDING_PROPERTIES,
    properties
});



