import db from './db';
import _ from 'lodash';
import store from './../redux/store';
import {appPropertiesInList} from '../redux/actions/PropertyActions';
import {setSyncProperties} from '../redux/actions/SyncActions';

import IdTypes from './../data/idTypes';
import OrganizationTypes from './../data/organizationTypes';

const TABLE_NAME = 'properties';

const jsonInputs = [
    'assessmentType',
    'assessmentTypeTotal',

    'assessmentValueAdded',
    'assessmentAdjustment',
    'meters',
    'plotTaggingLocation1',
    'plotTaggingLocation2',
    'plotTaggingLocation3',
    'plotTaggingLocation4',
    'plotTaggingLocation5',
    'plotTaggingLocation6',
    'plotTaggingLocation7',
    'plotTaggingLocation8',
    'tenantOccupancy',
    'assessmentPropertyCategory',
    'propertyInaccessible',

];

const booleanInputs = [
    'useLandLordAddress',
    'isCompleted',
    'isOrganization',
    'isGatedCommunity',
    'isPropertyInaccessible',
    'isDraftDelivered',
];

const fillables = [
    'isOrganization',
    'isPropertyInaccessible',
    'propertyInaccessible',
    'organizationName',
    'organizationType',
    'organizationAddress',

    'ownerTitle',
    'ownerFirstName',
    'ownerMiddleName',
    'ownerSurname',
    'ownerSex',
    'tinNumber',
    'ownerIdType',
    'ownerIdNumber',
    'ownerIdPhoto',
    'ownerStreetNumber',
    'ownerStreetNumbernew',
    'ownerEmail',
    'ownerStreetName',
    'ownerWardNumber',
    'ownerConstituency',
    'ownerSection',
    'ownerChiefdom',
    'ownerDistrict',
    'ownerProvince',
    'ownerPostcode',
    'ownerMobile1',
    'ownerMobile2',

    'propertyStreetNumber',
    'propertyStreetNumbernew',
    'propertyStreetName',
    'propertyWardNumber',
    'propertyConstituency',
    'propertySection',
    'propertyChiefdom',
    'propertyDistrict',
    'propertyProvince',
    'propertyPostCode',

    'tenantOccupancy',
    'tenantFirstName',
    'tenantMiddleName',
    'tenantSurname',
    'tenantSex',
    'tenantMobile1',
    'tenantMobile2',
    'ownerTenantTitle',

    'assessmentPropertyCategory',
    'assessmentCompoundHouseName',
    'assessmentTotalCompoundHouse',
    'assessmentType',
    'assessmentTypeTotal',
    'assessmentMaterialUsedOnWall',
    'assessmentMaterialUsedOnRoof',
    'assessmentWindowType',
    //'assessmentPropertyDimension',
    'assessmentLength',
    'assessmentBreadth',
    'assessmentArea',
    //'assessmentSquareMeter',
    'assessmentValueAdded',
    'assessmentAdjustment',
    'assessmentSwimmingPool',
    'assessmentSanitation',
    'assessmentTotalCommunicationMast',
    'assessmentTotalShop',
    'assessmentPropertyUse',
    'assessmentPropertyZone',
    'assessmentRateWithoutGST',
    'assessmentRateWithGST',
    'isGatedCommunity',
    'assessmentPropertyPhoto1',
    'assessmentPropertyPhoto2',

    'meters',
    'totalMeter',
    'plotTaggingLocation1',
    'plotTaggingLocation2',
    'plotTaggingLocation3',
    'plotTaggingLocation4',
    'plotTaggingLocation5',
    'plotTaggingLocation6',
    'plotTaggingLocation7',
    'plotTaggingLocation8',
    'digitalAddress',
    'doorLocation',
    'isDraftDelivered',
    'deliveryPersonPhoto',
    'deliveryPersonName',
    'deliveryPersonMobile',
    'useLandLordAddress',
    'serverPropertyId',
    'lastSyncAt',
    'isCompleted',
    'random_id',
    'group_name',

    'roofPer',
    'roofType',
    'wallPer',
    'wallType',
    'windowPer',
    'windowType',
    'valuePer',
   'valueType',

//   
//    

    // 'wall_material_condition',
    // 'roof_material_condition',
    // 'value_added_condition',
    // 'window_type_condition'
    //02268170205---jayesh

];

export const saveProperty = (property) => {

    return new Promise((resolve, reject) => {

        const activeUser = store.getState().user.activeUser;

        const values = fillables.map(column => {

            const value = property[column];
console.log(column+"--"+property[column])
            if (column === 'ownerIdType' && value === 'Other') {
               // alert(property.ownerOtherIdType)

                return property.ownerOtherIdType;
            }

            if (column === 'organizationType' && value === 'Other') {
                return property.otherOrganizationType;
            }
            if (!property.id) {
                if (column === 'random_id') {
                    
                    var ts = String(new Date().getTime()),
                    i = 0,
                    out = '';
            
                for (i = 0; i < ts.length; i += 2) {
                    out += Number(ts.substr(i, 2)).toString(36);
                }
                               
                    //alert("timestamp_"+out)
                    return "timestamp_"+out;
                }
            }

            if (_.includes(jsonInputs, column)) {
                return JSON.stringify(value);
            }

            if (_.includes(booleanInputs, column)) {
                return value ? 1 : 0;
            }
            return value;
        });

        let SQL = '';

        if (property.id) {

            const columnsBind = fillables.map(column => {
                return column + ' = ?';
            }).join(',');

            SQL = `UPDATE ${TABLE_NAME} SET ${columnsBind} WHERE id = ${property.id}`;
        } else {
            SQL = `INSERT INTO ${TABLE_NAME} (${fillables.join(',')}, user_id) VALUES( ${new Array(fillables.length).fill('?').join(',')}, '${activeUser.id}' )`;
        }
//alert(SQL)
        db.transaction((tx) => {
            tx.executeSql(SQL, values, (tx, results) => {
                console.log(results)
                resolve(results);
            });
        });
    });
};

export const insertIfNotExists = (values) => {

    return new Promise((resolve, reject) => {

        const activeUser = store.getState().user.activeUser;

        const FIND_SQL = `SELECT COUNT(*) AS matches FROM ${TABLE_NAME} WHERE user_id = '${activeUser.id}' AND serverPropertyId = ${values.serverPropertyId}`;

        db.transaction((tx) => {
            tx.executeSql(FIND_SQL, [], (tx, results) => {

                if (results.rows.item(0).matches === 0) {

                    const columns = Object.keys(values);
                    let dbValues = Object.values(values);


                    const SQL = `INSERT INTO ${TABLE_NAME} ( ${columns.join(',')}, user_id ) VALUES ( ${new Array(columns.length).fill('?').join(',')}, '${activeUser.id}' )`;

                    db.transaction((tx) => {
                        tx.executeSql(SQL, dbValues, (tx, results) => {
                            resolve(true);
                            deleteDuplicateProperty(values.random_id)
                        });
                    });
                } else {
                    resolve(false);
                }
            });
        });
    });
};

export const updateProperty = (id, values) => {

    return new Promise((resolve, reject) => {

        const columnsBind = Object.keys(values).map(column => {
            return column + ' = ?';
        }).join(',');

        const SQL = `UPDATE ${TABLE_NAME} SET ${columnsBind} WHERE id = '${id}'`;

        db.transaction((tx) => {
            tx.executeSql(SQL, Object.values(values), (tx, results) => {
                resolve(results);
            });
        });
    });
};

export const deleteProperty = (id) => {

    return new Promise((resolve, reject) => {

        const SQL = `DELETE FROM ${TABLE_NAME} WHERE serverPropertyId = '${id}'`;

        db.transaction((tx) => {
            tx.executeSql(SQL, {}, (tx, results) => {
                //alert(JSON.stringify(results));
                resolve(results);
            });
        });
    });
};
export const deleteDuplicateProperty = (id) => {
///alert(id)
    return new Promise((resolve, reject) => {

        const SQL = `DELETE FROM ${TABLE_NAME} WHERE random_id = '${id}' AND ( lastSyncAt= '' OR lastSyncAt IS NULL )  `;

        db.transaction((tx) => {
            tx.executeSql(SQL, {}, (tx, results) => {
           // alert(JSON.stringify(results));
                resolve(results);
            });
        });
    });
};
export const autodeleteProperty = (id) => {

    return new Promise((resolve, reject) => {

        const SQL = `DELETE FROM ${TABLE_NAME} WHERE id = '${id}'`;

        db.transaction((tx) => {
            tx.executeSql(SQL, {}, (tx, results) => {
               // alert(JSON.stringify(results));
                resolve(results);
            });
        });
    });
};

export const loadPropertiesInList = (page = 1, searchText = '') => {

    return dispatch => {

        const activeUser = store.getState().user.activeUser;

        const PER_PAGE = 20;

        const limit = `${((page - 1) * PER_PAGE)}, ${PER_PAGE}`;

        let SQL = `SELECT * FROM ${TABLE_NAME} WHERE user_id = '${activeUser.id}'`;

        if(searchText.length > 0) {
            SQL += ` AND serverPropertyId = '${searchText}'`;
        }

        SQL += ` ORDER BY id DESC LIMIT ${limit}`

        db.transaction((tx) => {
            tx.executeSql(SQL, [], (tx, results) => {

                let rows = [];
                const len = results.rows.length;

                for (let i = 0; i < len; i++) {

                    let row = results.rows.item(i);

                    const columns = Object.keys(row);

                    for (let index in columns) {

                        const column = columns[index];
                        const value = row[column];


                        if (column === 'ownerIdType' && _.findIndex(IdTypes, {value}) === -1) {
                            row[column] = 'Other';
                            row['ownerOtherIdType'] = value;
                        }

                        if (column === 'organizationType' && _.findIndex(OrganizationTypes, {value}) === -1) {
                            row[column] = 'Other';
                            row['otherOrganizationType'] = value;
                        }

                        if (_.includes(jsonInputs, column)) {
                            row[column] = JSON.parse(value);
                        }

                        if (_.includes(booleanInputs, column)) {
                            row[column] = !!value;
                        }
                    }

                    rows.push(row);
                }
                dispatch(appPropertiesInList(rows, page));
            });
        });
    };
};


export const loadSyncProperties = () => {

    return dispatch => {

        const activeUser = store.getState().user.activeUser;

        let SQL = `SELECT * FROM ${TABLE_NAME} WHERE user_id = '${activeUser.id}' ORDER BY id DESC`;

        db.transaction((tx) => {
            tx.executeSql(SQL, [], (tx, results) => {

                let rows = [];
                const len = results.rows.length;

                for (let i = 0; i < len; i++) {

                    let row = results.rows.item(i);

                    const columns = Object.keys(row);

                    for (let index in columns) {

                        const column = columns[index];
                        const value = row[column];

                        if (_.includes(jsonInputs, column)) {
                            row[column] = JSON.parse(value);
                        }

                        if (_.includes(booleanInputs, column)) {
                            row[column] = !!value;
                        }
                    }

                    rows.push(row);
                }
                dispatch(setSyncProperties(rows));
            });
        });
    };
};
