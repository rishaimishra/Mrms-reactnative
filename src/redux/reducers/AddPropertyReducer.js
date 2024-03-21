import {
    RESET_PROPERTY,
    SET_LOGGED_OUT_USER,
    SET_METER_INFO,
    SET_PROPERTY,
    SET_PROPERTY_ADDRESS_LANDLORD,
    SET_PROPERTY_FIELD,
} from '../actions/types';

const initialState = {
    id: null,
    isPropertyInaccessible: false,
    propertyInaccessible: [],
    isOrganization: false,
    organizationName: '',
    organizationType: '',
    otherOrganizationType: '',
    organizationAddress: '',

    ownerFirstName: '',
    ownerMiddleName: '',
    ownerSurname: '',
    ownerSex: '',
    tinNumber: '',
    ownerIdType: '',
    ownerOtherIdType: '',
    ownerIdNumber: '',
    ownerIdPhoto: '',
    ownerStreetNumber: '',
    ownerEmail:'',
    ownerStreetName: '',
    ownerWardNumber: '',
    ownerConstituency: '',
    ownerSection: '',
    ownerChiefdom: '',
    ownerDistrict: '',
    ownerProvince: '',
    ownerPostcode: '',
    ownerMobile1: '+232',
    ownerMobile2: '+232',

    propertyStreetNumber: '',
    propertyStreetName: '',
    propertyWardNumber: '',
    propertyConstituency: '',
    propertySection: '',
    propertyChiefdom: '',
    propertyDistrict: '',
    propertyProvince: '',
    propertyPostCode: '',

    tenantOccupancy: [],
    tenantFirstName: '',
    tenantMiddleName: '',
    tenantSurname: '',
    tenantSex: '',
    tenantMobile1: '+232',
    tenantMobile2: '+232',

    assessmentPropertyCategory: [],
    assessmentCompoundHouseName: '',
    assessmentTotalCompoundHouse: '',
    assessmentType: [],
    assessmentTypeTotal: [],
    assessmentMaterialUsedOnWall: '',
    assessmentMaterialUsedOnRoof: '',
    assessmentPropertyDimension: '',
    assessmentValueAdded: [],
    assessmentSwimmingPool: '',
    assessmentTotalCommunicationMast: '',
    assessmentTotalShop: '',
    assessmentPropertyUse: '',
    assessmentPropertyZone: '',
    assessmentPropertyPhoto1: '',
    assessmentPropertyPhoto2: '',
    isGatedCommunity: false,

    meters: [{id: null, number: '', photo: ''}],
    totalMeter: 1,
    plotTaggingLocation1: {lat: '', lng: ''},
    plotTaggingLocation2: {lat: '', lng: ''},
    plotTaggingLocation3: {lat: '', lng: ''},
    plotTaggingLocation4: {lat: '', lng: ''},
    plotTaggingLocation5: {lat: '', lng: ''},
    plotTaggingLocation6: {lat: '', lng: ''},
    plotTaggingLocation7: {lat: '', lng: ''},
    plotTaggingLocation8: {lat: '', lng: ''},

    digitalAddress: '',
    doorLocation: '',
    digitalAddressLocation: '',
    isDraftDelivered: false,
    deliveryPersonPhoto: '',
    deliveryPersonName: '',
    deliveryPersonMobile: '',

    useLandLordAddress: false,
    serverPropertyId: null,
    lastSyncAt: null,
    isCompleted: false,
    isCompletedSaved: false,
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SET_PROPERTY_FIELD: {

            let newState = {...state};

            if (action.fieldName === 'totalMeter') {

                let meters = [];

                for (let i = 0; i < action.fieldValue; i++) {

                    let meter = typeof newState.meters[i] !== 'undefined' ? {
                        ...state.meters[i],
                    } : {
                        id: null,
                        number: '',
                        photo: '',
                    };

                    meters.push(meter);
                }

                newState['meters'] = meters;
                newState[action.fieldName] = action.fieldValue;

            } else if (action.fieldName === 'digitalAddressLocation') {


                newState.digitalAddress = `${state.propertyPostCode} ${action.fieldValue.latitude.toFixed(4)} ${action.fieldValue.longitude.toFixed(4)}`;
                newState.doorLocation = `${action.fieldValue.latitude},${action.fieldValue.longitude}`;
                newState[action.fieldName] = `${action.fieldValue.latitude.toFixed(4)} ${action.fieldValue.longitude.toFixed(4)}`;
            } else {
                newState[action.fieldName] = action.fieldValue;
            }

            if (state.useLandLordAddress && action.fieldName !== 'digitalAddressLocation') {

                newState[action.fieldName] = action.fieldValue;
                newState = {
                    ...newState,
                    propertyStreetNumber: newState.ownerStreetNumber,
                  //  propertyStreetNumber: state.ownerEmail,
                    propertyStreetName: newState.ownerStreetName,
                    propertyWardNumber: newState.ownerWardNumber,
                    propertyConstituency: newState.ownerConstituency,
                    propertySection: newState.ownerSection,
                    propertyChiefdom: newState.ownerChiefdom,
                    propertyDistrict: newState.ownerDistrict,
                    propertyProvince: newState.ownerProvince,
                    propertyPostCode: newState.ownerPostcode,
                };
            }

            if (
                action.fieldName === 'tenantOccupancy' &&
                action.fieldValue.length === 1 &&
                action.fieldValue[0].value === 'Owned Tenancy'
            ) {

                newState[action.fieldName] = action.fieldValue;

                newState = {
                    ...newState,
                    tenantFirstName: state.ownerFirstName,
                    tenantMiddleName: state.ownerMiddleName,
                    tenantSurname: state.ownerSurname,
                    tenantMobile1: state.ownerMobile1,
                    tenantMobile2: state.ownerMobile2,
                };
            }


            return newState;
        }
        case SET_METER_INFO: {

            let newState = {...state};

            newState.meters[action.index][action.fieldName] = action.fieldValue;

            return newState;
        }
        case SET_PROPERTY_ADDRESS_LANDLORD: {

            if (action.useLandLordAddress) {
                return {
                    ...state,
                    propertyStreetNumber: state.ownerStreetNumber,
                //    propertyStreetNumber: state.ownerEmail,
                    propertyStreetName: state.ownerStreetName,
                    propertyWardNumber: state.ownerWardNumber,
                    propertyConstituency: state.ownerConstituency,
                    propertySection: state.ownerSection,
                    propertyChiefdom: state.ownerChiefdom,
                    propertyDistrict: state.ownerDistrict,
                    propertyProvince: state.ownerProvince,
                    propertyPostCode: state.ownerPostcode,
                    useLandLordAddress: action.useLandLordAddress,
                };
            } else {
                return {
                    ...state,
                    useLandLordAddress: action.useLandLordAddress,
                };
            }
        }
        case RESET_PROPERTY: {
            return {
                ...initialState,
            };
        }

        case SET_PROPERTY: {

            let digitalAddressLocation = '';

            if (action.property.digitalAddress) {
                const digitalAddressArr = action.property.digitalAddress.split(' ');
                digitalAddressLocation = `${digitalAddressArr[1]} ${digitalAddressArr[2]}`;
            }

            return {
                ...state,
                ...action.property,
                digitalAddressLocation,
            };
        }
        case SET_LOGGED_OUT_USER: {
            return initialState;
        }

        default:
            return state;
    }
};
