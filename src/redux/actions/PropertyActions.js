import {
    ADD_PROPERTIES_IN_LIST,
    RESET_PROPERTY, SET_LOADING_PROPERTIES, SET_METER_INFO,
    SET_PROPERTY,
    SET_PROPERTY_ADDRESS_LANDLORD,
    SET_PROPERTY_FIELD
} from "./types";

export const setPropertyField = (fieldName, fieldValue) => ({
    type: SET_PROPERTY_FIELD,
    fieldName,
    fieldValue
});

export const setMeterField = (index, fieldName, fieldValue) => ({
    type: SET_METER_INFO,
    index,
    fieldName,
    fieldValue
});


export const setUseLandlordAddress = (useLandLordAddress) => ({
    type: SET_PROPERTY_ADDRESS_LANDLORD,
    useLandLordAddress
});

export const resetProperty = () => ({
    type: RESET_PROPERTY
});

export const appPropertiesInList = (properties, currentPage) => ({
    type: ADD_PROPERTIES_IN_LIST,
    properties,
    currentPage
});

export const setLoadingProperties = () => dispatch => dispatch({
    type: SET_LOADING_PROPERTIES
});

export const setProperty = (property) => dispatch => dispatch({
    type: SET_PROPERTY,
    property
});