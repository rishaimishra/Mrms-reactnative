import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import store from '../redux/store';
import AsyncStorage from '@react-native-community/async-storage'
import {connect} from 'react-redux'

import { API_GET_INCOMPLETE_PROPERTY, API_SYNC_PROPERTY,API_INACCESSABLE_PROPERTY } from './api';
import { autodeleteProperty, insertIfNotExists, updateProperty } from '../database/Property';

const fieldMap = {
    'isOrganization': 'is_organization',
    'isPropertyInaccessible': 'is_property_inaccessible',
    'propertyInaccessible': 'property_inaccessible[]',
    'organizationName': 'organization_name',
    'organizationType': 'organization_type',
    'organizationAddress': 'organization_address',

   'ownerTitle': 'landlord_ownerTitle_id',
    'ownerFirstName': 'landlord_first_name',
    'ownerMiddleName': 'landlord_middle_name',
    'ownerSurname': 'landlord_surname',
    'ownerSex': 'landlord_sex',
    'tinNumber': 'organization_tin',
    'ownerIdType': 'landlord_id_type',
    'ownerIdNumber': 'landlord_id_number',
    'ownerIdPhoto': 'landlord_image',
    'ownerStreetNumber': 'landlord_street_number',
    'ownerStreetNumbernew': 'landlord_street_numbernew',

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
    'propertyStreetNumbernew': 'property_street_numbernew',
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
    'ownerTenantTitle': 'tenant_ownerTitle_id',

    'assessmentPropertyCategory': 'assessment_categories_id[]',
    'assessmentCompoundHouseName': 'compound_name',
    'assessmentTotalCompoundHouse': 'total_compound_house',
    'assessmentType': 'assessment_types[]',
    'assessmentTypeTotal': 'assessment_types_total[]',
    'assessmentMaterialUsedOnWall': 'assessment_wall_materials_id',
    'assessmentMaterialUsedOnRoof': 'assessment_roofs_materials_id',
    'assessmentWindowType': 'assessment_window_type_id',
    'assessmentSanitation': 'assessment_sanitation_id',
    // 'assessmentPropertyDimension': 'assessment_dimension_id',

    'assessmentLength': 'assessment_length',
    'assessmentBreadth': 'assessment_breadth',
    'assessmentArea': 'assessment_area',
    'assessmentSquareMeter': 'assessment_square_meter',

    'assessmentValueAdded': 'assessment_value_added_id[]',
    'assessmentAdjustment': 'adjustment_ids[]',
    'assessmentTotalCommunicationMast': 'total_mast',
    'assessmentTotalShop': 'total_shops',
    'assessmentSwimmingPool': 'swimming_pool',
    'isGatedCommunity': 'gated_community',
    'assessmentPropertyUse': 'assessment_use_id',
    'assessmentPropertyZone': 'assessment_zone_id',
    'assessmentRateWithGST':'assessment_rate_with_gst',
    'assessmentRateWithoutGST':'assessment_rate_without_gst',
    'assessmentPropertyPhoto1': 'assessment_images_1',
    'assessmentPropertyPhoto2': 'assessment_images_2',
    'assessmentRandomValueId':'assessment_randomvalue_id',

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
    'random_id': 'random_id',
    'group_name': 'group_name',

    'wall_material_condition': 'wall_material_condition[]',
    'roof_material_condition':'roof_material_condition',
    'value_added_condition':'value_added_condition',
    'window_type_condition':'window_type_condition',

    'roofPer':'roofPer',
    'roofType':'roofType',
    'wallPer':'wallPer',
    'wallType':'wallType',
    'windowPer':'windowPer',
    'windowType':'windowType',
    'valuePer':'valuePer',
    'valueType':'valueType',

   

    



};

export const inAccessableProperty = async (property, onProgress, cancelTokenCallback) => {
    

    return new Promise(async (resolve, reject) => {

        let CancelToken = axios.CancelToken;

        try {
         
            let formData = new FormData();
            
            console.log("Property data");
            console.log(property);
            console.log("Property data end");
            //console.log(user.name);
            //return;
            let imagefile = {
                uri: property.path,
                type: 'image/jpeg',
                name: Math.random() + '.jpeg'
            }
            formData.append('inaccessible_property_image', imagefile);
           // formData.append("inaccessible_property_image", property.path, property.name+".jpg");
            formData.append("reason", property.id[0].value.toString());
            formData.append("lat", property.lat.toString());
            formData.append("long", property.lng.toString());
            formData.append("enumerator", property.enumerator.toString());
            
            


            console.log("formData inaccessable" + JSON.stringify(formData))
        
            const { data } = await axios.post(API_INACCESSABLE_PROPERTY, formData, 
            {
                headers: {
                   'Content-Type': 'multipart/form-data',
                }
             },{
                onUploadProgress: onProgress,
                cancelToken: new CancelToken(cancelTokenCallback),

            });

            console.log("res" + JSON.stringify(data))

            if (data.success) {
                
                resolve(data);
            } else {
                console.log("error")

                reject();
            }

        } catch (error) {
            console.log("error :" + error)
            reject(error);
        }
    });
};

export const SyncProperty = async (property, onProgress, cancelTokenCallback) => {
    return new Promise(async (resolve, reject) => {
        console.log("Property assessment ----->");
        
        
        console.log(property);
        let CancelToken = axios.CancelToken;

        try {
            // alert(property["wallPer"]+"-"+property["wallType"])
            // alert(property["roofPer"]+"-"+property["roofType"])
            //var group_name=_.find(district, { value: store.getState().user.activeUser.assign_district_id }).group_name;
            const obj = {
                percentage: 2,
                type: "A"
            }
            let formData = new FormData();
            formData.append('randomdata', 5452278);
            formData.append("group_name", property["group_name"]);
            formData.append("ownerTitle", property["ownerTitle"]);
            formData.append("ownerTenantTitle", property["ownertenantTitle"]);
            formData.append("assessmentRateWithoutGST", property["assessmentRateWithoutGST"]);
            formData.append("assessmentRateWithGST", property["assessmentRateWithGST"]);


            formData.append("sanitation", property["assessmentSanitation"]);
            formData.append("wall_material_condition", property["group_name"] );
            // formData.append("roof_material_condition", {
            //     percentage: property["roofPer"],
            //     type: property["roofType"]
            // });
            // formData.append("value_added_condition", {
            //     percentage: property["valuePer"],
            //     type: property["valueType"]
            // });
            // formData.append("window_type_condition", {
            //     percentage: property["windowPer"],
            //     type:property["windowType"]
            // });

            const columns = Object.keys(fieldMap);
            console.log("call 1")
            for (let index in columns) {

                const column = columns[index];
                const value = property[column];
                if (column === 'assessmentSquareMeter') {
if(property['assessmentBreadth']>1){
    value = property['assessmentBreadth'] * property['assessmentLength'];

}else{
    value = property['assessmentArea'] ;

}
                }
                if (value || typeof value === 'boolean') {

                    //console.log(column +","+value)

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
                        column === 'assessmentAdjustment' ||
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

                    } else if (column === 'assessmentSquareMeter') {
                        formData.append(fieldMap[column], value);
                    }
                    else if (column === 'ownerIdType') {
                        formData.append(fieldMap[column], (value === 'Other' ? property.ownerOtherIdType : value));
                    } else if (column === 'organizationType') {
                        formData.append(fieldMap[column], value === 'Other' ? property.otherOrganizationType : value);
                    }
                    else {
                        formData.append(fieldMap[column], value);
                    }
                }

            }

            console.log("formData1" + JSON.stringify(formData))
            // console.log("cancelTokenCallback: "+json)
            //console.log(property.id)
            //return;
            const { data } = await axios.post(API_SYNC_PROPERTY, formData, {
                onUploadProgress: onProgress,
                cancelToken: new CancelToken(cancelTokenCallback),

            });

            console.log("res" + data)

            if (data.success) {
                if (property.isDraftDelivered) {
                    await autodeleteProperty(property.id);
                } else {
                    await updateProperty(property.id, {
                        serverPropertyId: data.property_id,
                        lastSyncAt: moment().toISOString(),
                    });
                }
                resolve(data);
            } else {
                console.log("error")

                reject();
            }

        } catch (error) {
            console.log("error :" + error)
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

const normalizeAssessmentAdjustment = (value) => {
    const data = !isEmpty(value) ? value.map(item => ({
        amount: parseFloat(item.percentage),
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

    let value = { lat: '', lng: '' };

    if (latLng) {
        const spited = latLng.split(',');
        value = { lat: spited[0].trim(), lng: spited[1].trim() };
    }

    return JSON.stringify(value);
};

function normalizeBool(value) {
    return value ? 1 : 0;
}


export const ImportProperties = () => {

    return new Promise(async (resolve, reject) => {

        try {

            const { data } = await axios.get(API_GET_INCOMPLETE_PROPERTY);
            if (data.success) {
                console.log("Incomplete")
                console.log(data)

                const properties = data.property;
const values_adjustment=data.values_adjustment;
                let inserted = 0;
                // alert(properties)
                for (let propertyIndex in properties) {

                    const serverProperty = properties[propertyIndex];
                    console.log("--------data from server --------- assessment");
                    
                    console.log(normalizeInteger(serverProperty.assessment.sanitation === null ? "2": serverProperty.assessment.sanitation+""));
                    if(serverProperty.landlord !== null){
                        
                     //alert(serverProperty.landlord.ownerTitle)
                    let property = {
                        serverPropertyId: serverProperty.id,
                        'random_id': normalizeValue(serverProperty.random_id),
                        'isOrganization': normalizeBool(serverProperty.is_organization),
                        'isPropertyInaccessible': normalizeBool(serverProperty.is_property_inaccessible),
                        'propertyInaccessible': JSON.stringify(serverProperty.property_inaccessible.map(item => ({
                            label: item.label,
                            value: parseInt(item.id),
                        }))),
                        'organizationName': normalizeValue(serverProperty.organization_name),
                        'organizationType': normalizeValue(serverProperty.organization_type),
                        'organizationAddress': normalizeValue(serverProperty.organization_addresss),

                        'ownerFirstName': normalizeValue(serverProperty.landlord.first_name?serverProperty.landlord.first_name:''),
                        'ownerMiddleName': normalizeValue(serverProperty.landlord.middle_name),
                        'ownerSurname': normalizeValue(serverProperty.landlord.surname),
                        'ownerSex': normalizeValue(serverProperty.landlord.sex),
                        'tinNumber': normalizeValue(serverProperty.is_organization ? serverProperty.organization_tin : serverProperty.landlord.tin),
                        'ownerIdType': normalizeValue(serverProperty.landlord.id_type),
                        'ownerIdNumber': normalizeValue(serverProperty.landlord.id_number),
                        'ownerIdPhoto': normalizeValue(serverProperty.landlord.large_preview),
                       
                        'ownerStreetNumber': normalizeValue(serverProperty.landlord.street_number),
                        'ownerStreetNumbernew': normalizeValue(serverProperty.landlord.street_numbernew),
                       
                        'ownerEmail': normalizeValue(serverProperty.landlord.email),
                        'ownerStreetName': normalizeValue(serverProperty.landlord.street_name),
                        'ownerWardNumber': normalizeValue(serverProperty.landlord.ward),
                        'ownerConstituency': normalizeInteger(serverProperty.landlord.constituency),
                        'ownerSection': normalizeValue(serverProperty.landlord.section),
                        'ownerChiefdom': normalizeValue(serverProperty.landlord.chiefdom),
                        'ownerDistrict': normalizeValue(serverProperty.landlord.district),
                        'ownerProvince': normalizeValue(serverProperty.landlord.province),
                        'ownerPostcode': normalizeValue(serverProperty.landlord.postcode),
                        'ownerTitle': normalizeInteger(serverProperty.landlord.ownerTitle),
                        
                        'ownerMobile1': normalizeValue(serverProperty.landlord.mobile_1),
                        'ownerMobile2': normalizeValue(serverProperty.landlord.mobile_2),

                        'propertyStreetNumber': normalizeValue(serverProperty.street_number),
                        'propertyStreetNumbernew': normalizeValue(serverProperty.street_numbernew),
                        
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
                        'ownerTenantTitle': normalizeInteger(serverProperty.occupancy.ownerTenantTitle),


                        'assessmentPropertyCategory': normalizeAssessment(serverProperty.assessment.categories),
                        'assessmentCompoundHouseName': normalizeValue(serverProperty.assessment.compound_name),
                        'assessmentTotalCompoundHouse': normalizeInteger(serverProperty.assessment.no_of_compound_house),
                        'assessmentType': normalizeAssessment(serverProperty.assessment.types),
                        'assessmentTypeTotal': normalizeAssessment(serverProperty.assessment.types),

                        'assessmentMaterialUsedOnWall': normalizeInteger(serverProperty.assessment.property_wall_materials),
                        'assessmentMaterialUsedOnRoof': normalizeInteger(serverProperty.assessment.roofs_materials),

                        'assessmentWindowType': normalizeInteger(serverProperty.assessment.property_window_type),
                        //'assessmentSwimmingPoolID': normalizeInteger(serverProperty.assessment.swimming_pool),
                        //'assessmentRandomValueId':normalizeInteger(serverProperty.assessment.swimming_pool),
                        'assessmentSanitation': normalizeInteger(serverProperty.assessment.sanitation === null ? '2': serverProperty.assessment.sanitation+''),
                        'group_name': normalizeInteger(serverProperty.assessment.group_name),

                        'roofPer': normalizeInteger(serverProperty.assessment.roofPer),
                        'roofType': normalizeInteger(serverProperty.assessment.roofType),

                        'wallType': normalizeInteger(serverProperty.assessment.wallType),
                        'wallPer': normalizeInteger(serverProperty.assessment.wallPer),

                        'windowPer': normalizeInteger(serverProperty.assessment.windowPer),
                        'windowType': normalizeInteger(serverProperty.assessment.property_window_type),

                        'valuePer': normalizeInteger(serverProperty.assessment.valuePer),
                        'valueType': normalizeInteger(serverProperty.assessment.valueType),


                        //'assessmentPropertyDimension': normalizeInteger(serverProperty.assessment.property_dimension),
                        'assessmentLength': normalizeInteger(serverProperty.assessment.assessment_length),
                        'assessmentBreadth': normalizeInteger(serverProperty.assessment.assessment_breadth),
                        'assessmentArea': normalizeInteger(serverProperty.assessment_area),

                        'assessmentValueAdded': normalizeAssessment(serverProperty.assessment.values_added),
                        //'assessmentAdjustment': normalizeAssessment(serverProperty.assessment.values_adjustment),

                        'assessmentAdjustment': normalizeAssessmentAdjustment(serverProperty.values_adjustment),

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
                
                    console.log("Adjustment Values in Property");
                    console.log(property);
                    const result = await insertIfNotExists(property);
            
                    if (result) {
                        inserted++;
                    }
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




