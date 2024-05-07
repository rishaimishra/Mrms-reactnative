import {SET_APP_LOADED, SET_DEFAULT_WARD, SET_NAME_AND_STREETS_OPTIONS} from "./types";

export const setAppLoaded = () => ({
    type: SET_APP_LOADED
});

export const setDefaultWard = (defaultWard) => ({
    type: SET_DEFAULT_WARD,
    defaultWard
});

export const setNamesAndStreetOptions = (firstNames, lastNames, streetNames) => ({
    type: SET_NAME_AND_STREETS_OPTIONS,
    firstNames, 
    lastNames, 
    streetNames
});

