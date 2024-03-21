import axios from 'axios';
import moment from 'moment';

import {API_GET_INCOMPLETE_PROPERTY, API_SYNC_PROPERTY} from './api';
import {deleteProperty, insertIfNotExists, updateProperty} from '../database/Property';

const fieldMap = {
    'isOrganization': 'is_organization',
    'isPropertyInaccessible': 'is_property_inaccessible',
    'propertyInaccessible': 'property_inaccessible[]',
    'organizationName': 'organization_name',
    'organizationType': 'organization_type',
    'organizationAddress': 'organization_address',

    'ownerFirstName': 'landlord_first_name',
    'ownerMiddleName': 'landlord_middle_name',
    'ownerSurname': 'landlord_surname',
    'ownerSex': 'landlord_sex',
    'tinNumber': 'organization_tin',
    'ownerIdType': 'landlord_id_type',
    'ownerIdNumber': 'landlord_id_number',
    'ownerIdPhoto': 'landlord_image',
    'ownerStreetNumber': 'landlord_street_number',
    'ownerEmail': 'landlord_email',
    'ownerStreetName': 'landlord_street_name',
    'ownerWardNumber': 'landlord_ward',
    'ownerConstituency': 'landlord_constituency',
    'ownerSection': 'landlord_section',
    'ownerChiefdom': 'landlord_chiefdom',
    'ownerDistrict': 'landlord_district',
    'ownerProvince': 'landlord_province',
    'ownerPostcode': 'landlord_postcode',
    'ownerMobile1': 'landlord_mobile_1',
    'ownerMobile2': 'landlord_mobile_2',

    'propertyStreetNumber': 'property_street_number',
    'propertyStreetName': 'property_street_name',
    'propertyWardNumber': 'property_ward',
    'propertyConstituency': 'property_constituency',
    'propertySection': 'property_section',
    'propertyChiefdom': 'property_chiefdom',
    'propertyDistrict': 'property_district',
    'propertyProvince': 'property_province',
    'propertyPostCode': 'property_postcode',
    'tenantOccupancy': 'occupancy_type[]',
    'tenantFirstName': 'occupancy_tenant_first_name',
    'tenantMiddleName': 'occupancy_middle_name',
    'tenantSurname': 'occupancy_surname',
    'tenantSex': 'occupancy_sex',
    'tenantMobile1': 'occupancy_mobile_1',
    'tenantMobile2': 'occupancy_mobile_2',

    'assessmentPropertyCategory': 'assessment_categories_id[]',
    'assessmentCompoundHouseName': 'compound_name',
    'assessmentTotalCompoundHouse': 'total_compound_house',
    'assessmentType': 'assessment_types[]',
    'assessmentTypeTotal': 'assessment_types_total[]',
    'assessmentMaterialUsedOnWall': 'assessment_wall_materials_id',
    'assessmentMaterialUsedOnRoof': 'assessment_roofs_materials_id',
    'assessmentPropertyDimension': 'assessment_dimension_id',
    'assessmentValueAdded': 'assessment_value_added_id[]',
    'assessmentTotalCommunicationMast': 'total_mast',
    'assessmentTotalShop': 'total_shops',
    'assessmentSwimmingPool': 'swimming_pool',
    'isGatedCommunity': 'gated_community',
    'assessmentPropertyUse': 'assessment_use_id',
    'assessmentPropertyZone': 'assessment_zone_id',
    'assessmentPropertyPhoto1': 'assessment_images_1',
    'assessmentPropertyPhoto2': 'assessment_images_2',

    'meters': 'registry',
    'plotTaggingLocation1': 'registry_point1',
    'plotTaggingLocation2': 'registry_point2',
    'plotTaggingLocation3': 'registry_point3',
    'plotTaggingLocation4': 'registry_point4',
    'plotTaggingLocation5': 'registry_point5',
    'plotTaggingLocation6': 'registry_point6',
    'plotTaggingLocation7': 'registry_point7',
    'plotTaggingLocation8': 'registry_point8',
    'digitalAddress': 'registry_digital_address',
    'doorLocation': 'dor_lat_long',

    'serverPropertyId': 'property_id',
    'isCompleted': 'is_completed',

    'isDraftDelivered': 'is_draft_delivered',
    'deliveryPersonPhoto': 'delivered_image',
    'deliveryPersonName': 'delivered_name',
    'deliveryPersonMobile': 'delivered_number',
};

export const SyncProperty = (property, onProgress, cancelTokenCallback) => {

    return new Promise(async (resolve, reject) => {

        let CancelToken = axios.CancelToken;

        try {

            let formData = new FormData();

            formData.append('randomdata', 5452278);

            const columns = Object.keys(fieldMap);

            for (let index in columns) {

                const column = columns[index];
                const value = property[column];

                if (value || typeof value === 'boolean') {


                    if (column === 'meterPhoto' ||
                        column === 'assessmentPropertyPhoto1' ||
                        column === 'assessmentPropertyPhoto2' ||
                        column === 'ownerIdPhoto' ||
                        column === 'deliveryPersonPhoto'
                    ) {

                        if (value.indexOf('http') !== 0) {
                            formData.append(fieldMap[column], {
                                uri: value,
                                type: 'image/jpeg',
                                name: Math.random() + '.jpeg',
                            });
                        }

                        continue;

                    } else if ((
                        column === 'assessmentType' ||
                        column === 'assessmentTypeTotal' ||
                        column === 'assessmentValueAdded' ||
                        column === 'assessmentPropertyCategory' ||
                        column === 'tenantOccupancy' ||
                        column === 'propertyInaccessible'
                    ) && Array.isArray(value)) {

                        if (value.length > 0) {
                            value.map(assessment => {
                                formData.append(fieldMap[column], assessment.value);
                            });
                        }
                        continue;

                    } else if (value.hasOwnProperty('lat')) {

                        if (value.lat) {
                            formData.append(fieldMap[column], `${value.lat},${value.lng}`);
                        }
                        continue;

                    } else if (column === 'meters') {

                        for (let i = 0; i < value.length; i++) {

                            if (value[i].photo && value[i].photo.indexOf('http') !== 0) {
                                formData.append(`registry[${i}][meter_image]`, {
                                    uri: value[i].photo,
                                    type: 'image/jpeg',
                                    name: Math.random() + '.jpeg',
                                });
                            }

                            formData.append(`registry[${i}][meter_number]`, value[i].number);
                            formData.append(`registry[${i}][id]`, value[i].id);
                        }

                        continue;
                    } else if (column === 'tinNumber') {

                        formData.append(property.isOrganization ? 'organization_tin' : 'landlord_tin', value);

                        continue;
                    } else if (typeof (value) === 'boolean') {
                        formData.append(fieldMap[column], value ? 1 : 0);
                        continue;

                    } else if (column === 'digitalAddress') {
                        formData.append(fieldMap[column], value);
                    } else if (column === 'ownerIdType') {
                        formData.append(fieldMap[column], (value === 'Other' ? property.ownerOtherIdType : value));
                    } else if (column === 'organizationType') {
                        formData.append(fieldMap[column], value === 'Other' ? property.otherOrganizationType : value);
                    } else {
                        formData.append(fieldMap[column], value);
                    }
                }
            }

            const {data} = await axios.post(API_SYNC_PROPERTY, formData, {
                onUploadProgress: onProgress,
                cancelToken: new CancelToken(cancelTokenCallback),
            });


            if (data.success) {
                if (property.isDraftDelivered) {
                    await deleteProperty(property.id);
                } else {
                    await updateProperty(property.id, {
                        serverPropertyId: data.property_id,
                        lastSyncAt: moment().toISOString(),
                    });
                }
                resolve(data);
            } else {
                reject();
            }

        } catch (error) {
            reject(error);
        }
    });
};

const isEmpty = (data) => {
    return data === null || data === '' || data === undefined;
};

const normalizeValue = (value) => {
    return !isEmpty(value) ? value : '';
};

const normalizeInteger = (value) => {
    return !isEmpty(value) ? value : '';
};

const normalizeAssessment = (value) => {
    const data = !isEmpty(value) ? value.map(item => ({
        amount: parseFloat(item.value),
        label: item.label,
        value: item.id,
    })) : [];

    return JSON.stringify(data);
};

const normalizeTenantOccupancy = (value) => {
    const data = !isEmpty(value) ? value.map(item => ({
        label: item.occupancy_type,
        value: item.occupancy_type,
    })) : [];

    return JSON.stringify(data);
};

const normalizePhotoArray = (photos, index) => {
    return typeof (photos[index]) !== 'undefined' ? photos[index].large_preview : '';
};

const normalizeLatLong = (latLng) => {

    let value = {lat: '', lng: ''};

    if (latLng) {
        const spited = latLng.split(',');
        value = {lat: spited[0].trim(), lng: spited[1].trim()};
    }

    return JSON.stringify(value);
};

function normalizeBool(value) {
    return value ? 1 : 0;
}


export const ImportProperties = () => {

    return new Promise(async (resolve, reject) => {

        try {

            const {data} = await axios.get(API_GET_INCOMPLETE_PROPERTY);

            if (data.success) {

                const properties = data.property;

                let inserted = 0;

                for (let propertyIndex in properties) {

                    const serverProperty = properties[propertyIndex];

                    let property = {
                        serverPropertyId: serverProperty.id,

                        'isOrganization': normalizeBool(serverProperty.is_organization),
                        'isPropertyInaccessible': normalizeBool(serverProperty.is_property_inaccessible),
                        'propertyInaccessible': JSON.stringify(serverProperty.property_inaccessible.map(item => ({
                            label: item.label,
                            value: parseInt(item.id),
                        }))),
                        'organizationName': normalizeValue(serverProperty.organization_name),
                        'organizationType': normalizeValue(serverProperty.organization_type),
                        'organizationAddress': normalizeValue(serverProperty.organization_addresss),

                        'ownerFirstName': normalizeValue(serverProperty.landlord.first_name),
                        'ownerMiddleName': normalizeValue(serverProperty.landlord.middle_name),
                        'ownerSurname': normalizeValue(serverProperty.landlord.surname),
                        'ownerSex': normalizeValue(serverProperty.landlord.sex),
                        'tinNumber': normalizeValue(serverProperty.is_organization ? serverProperty.organization_tin : serverProperty.landlord.tin),
                        'ownerIdType': normalizeValue(serverProperty.landlord.id_type),
                        'ownerIdNumber': normalizeValue(serverProperty.landlord.id_number),
                        'ownerIdPhoto': normalizeValue(serverProperty.landlord.large_preview),
                        'ownerStreetNumber': normalizeValue(serverProperty.landlord.street_number),
                        'ownerEmail': normalizeValue(serverProperty.landlord.email),
                        'ownerStreetName': normalizeValue(serverProperty.landlord.street_name),
                        'ownerWardNumber': normalizeValue(serverProperty.landlord.ward),
                        'ownerConstituency': normalizeInteger(serverProperty.landlord.constituency),
                        'ownerSection': normalizeValue(serverProperty.landlord.section),
                        'ownerChiefdom': normalizeValue(serverProperty.landlord.chiefdom),
                        'ownerDistrict': normalizeValue(serverProperty.landlord.district),
                        'ownerProvince': normalizeValue(serverProperty.landlord.province),
                        'ownerPostcode': normalizeValue(serverProperty.landlord.postcode),
                        'ownerMobile1': normalizeValue(serverProperty.landlord.mobile_1),
                        'ownerMobile2': normalizeValue(serverProperty.landlord.mobile_2),

                        'propertyStreetNumber': normalizeValue(serverProperty.street_number),
                        'propertyStreetName': normalizeValue(serverProperty.street_name),
                        'propertyWardNumber': normalizeInteger(serverProperty.ward),
                        'propertyConstituency': normalizeInteger(serverProperty.constituency),
                        'propertySection': normalizeValue(serverProperty.section),
                        'propertyChiefdom': normalizeValue(serverProperty.chiefdom),
                        'propertyDistrict': normalizeValue(serverProperty.district),
                        'propertyProvince': normalizeValue(serverProperty.province),
                        'propertyPostCode': normalizeValue(serverProperty.postcode),

                        'tenantOccupancy': normalizeTenantOccupancy(serverProperty.occupancies),
                        'tenantFirstName': normalizeValue(serverProperty.occupancy.tenant_first_name),
                        'tenantMiddleName': normalizeValue(serverProperty.occupancy.middle_name),
                        'tenantSurname': normalizeValue(serverProperty.occupancy.surname),
                        'tenantMobile1': normalizeValue(serverProperty.occupancy.mobile_1),
                        'tenantMobile2': normalizeValue(serverProperty.occupancy.mobile_2),

                        'assessmentPropertyCategory': normalizeAssessment(serverProperty.assessment.categories),
                        'assessmentCompoundHouseName': normalizeValue(serverProperty.assessment.compound_name),
                        'assessmentTotalCompoundHouse': normalizeInteger(serverProperty.assessment.no_of_compound_house),
                        'assessmentType': normalizeAssessment(serverProperty.assessment.types),
                        'assessmentTypeTotal': normalizeAssessment(serverProperty.assessment.types),

                        'assessmentMaterialUsedOnWall': normalizeInteger(serverProperty.assessment.property_wall_materials),
                        'assessmentMaterialUsedOnRoof': normalizeInteger(serverProperty.assessment.roofs_materials),
                        'assessmentPropertyDimension': normalizeInteger(serverProperty.assessment.property_dimension),
                        'assessmentValueAdded': normalizeAssessment(serverProperty.assessment.values_added),
                        'assessmentTotalCommunicationMast': normalizeInteger(serverProperty.assessment.no_of_mast),
                        'assessmentTotalShop': normalizeInteger(serverProperty.assessment.no_of_shop),
                        'assessmentPropertyUse': normalizeInteger(serverProperty.assessment.property_use),
                        'assessmentPropertyZone': normalizeInteger(serverProperty.assessment.zone),
                        'assessmentSwimmingPool': normalizeInteger(serverProperty.assessment.swimming_pool),
                        'assessmentPropertyPhoto1': normalizeValue(serverProperty.assessment.large_preview_one),
                        'assessmentPropertyPhoto2': normalizeValue(serverProperty.assessment.large_preview_two),
                        'isGatedCommunity': normalizeBool(serverProperty.assessment.gated_community),
                        'meters': JSON.stringify(serverProperty.registry_meters.map(item => ({
                            id: item.id,
                            number: normalizeValue(item.number),
                            photo: normalizeValue(item.large_preview),
                        }))),
                        'totalMeter': serverProperty.registry_meters.length,
                        'plotTaggingLocation1': normalizeLatLong(serverProperty.geo_registry.point1),
                        'plotTaggingLocation2': normalizeLatLong(serverProperty.geo_registry.point2),
                        'plotTaggingLocation3': normalizeLatLong(serverProperty.geo_registry.point3),
                        'plotTaggingLocation4': normalizeLatLong(serverProperty.geo_registry.point4),
                        'plotTaggingLocation5': normalizeLatLong(serverProperty.geo_registry.point5),
                        'plotTaggingLocation6': normalizeLatLong(serverProperty.geo_registry.point6),
                        'plotTaggingLocation7': normalizeLatLong(serverProperty.geo_registry.point7),
                        'plotTaggingLocation8': normalizeLatLong(serverProperty.geo_registry.point8),
                        'digitalAddress': normalizeValue(serverProperty.geo_registry.digital_address),
                        'doorLocation': normalizeValue(serverProperty.geo_registry.dor_lat_long),
                        'openLocationCode': normalizeValue(serverProperty.geo_registry.open_location_code),
                        'isDraftDelivered': normalizeBool(serverProperty.assessment.is_demand_note_delivered),
                        'deliveryPersonPhoto': normalizeValue(serverProperty.assessment.demand_note_recipient_photo_url),
                        'deliveryPersonName': normalizeValue(serverProperty.assessment.demand_note_recipient_name),
                        'deliveryPersonMobile': normalizeValue(serverProperty.assessment.demand_note_recipient_mobile),
                        'lastSyncAt': moment().toISOString(),
                    };

                    const result = await insertIfNotExists(property);

                    if (result) {
                        inserted++;
                    }
                }
                resolve(inserted);

            }
        } catch (error) {

            console.log(error);

            reject(error);
        }
    });
};


