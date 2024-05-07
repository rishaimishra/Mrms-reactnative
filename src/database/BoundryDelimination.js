import db from './db';

const TABLE_NAME = 'boundary_delimitations';

export const deleteAllData = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {

            const SQL = `DELETE FROM ${TABLE_NAME}`;

            tx.executeSql(SQL, [], (tx, results) => {
               // console.log(results.rows)
                resolve(results.rows);
            })
        })
    })
};

export const InsertAllData = (data) => {
   // console.log(data.id)
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
           
           // const SQL = `INSERT INTO ${TABLE_NAME} ("id", "ward", "constituency", "section", "chiefdom", "district", "province") VALUES (${data.id}, ${data.ward}, ${data.constituency}, ${data.section}, ${data.chiefdom}, ${data.district}, ${data.province}) `;
           const SQL = `INSERT INTO ${TABLE_NAME} ("id", "ward", "constituency", "section", "chiefdom", "district", "province","prefix") VALUES (${parseInt(data.id)}, ${parseInt(data.ward)}, ${parseInt(data.constituency)}, "${data.section}","${data.chiefdom}", "${data.district}", "${data.province}","${data.prefix}") `;
          // console.log(SQL)
            tx.executeSql(SQL, [], (tx, results) => {
                //console.log(results.rows)

                resolve(results.rows);
            })
        })
    })
};
export const getWards = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {

            const SQL = `SELECT DISTINCT(ward) from ${TABLE_NAME}`;

            tx.executeSql(SQL, [], (tx, results) => {
                resolve(results.rows);
            })
        })
    })
};

export const getValuesFromWard = (field, ward) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {

            const SQL = `SELECT DISTINCT(trim(${field})) as '${field}' from ${TABLE_NAME} WHERE ward = ${ward}`;

            tx.executeSql(SQL, [], (tx, results) => {
                resolve(results.rows);
            })
        })
    })
};

export const buildOptions = (result, key, value) => {

    let rows = [];
    const len = result.length;

    for (let i = 0; i < len; i++) {
        let row = result.item(i);
        rows.push({
            label: row[value].toString(),
            value: row[key]
        });
    }

    return rows;
};


export const wardOptions = async () => {
    return new Promise(async (resolve) => {

        try {

            const wards = await getWards();
            resolve(buildOptions(wards, 'ward', 'ward'));

        } catch (error) {
            console.log('Ward Error', error);
        }
    });
};


export const constituencyFromWardOptions = async (ward) => {

    return new Promise(async (resolve, reject) => {

        try {

            const constituencies = await getValuesFromWard('constituency', ward);
            resolve(buildOptions(constituencies, 'constituency', 'constituency'));

        } catch (error) {
            reject(error);
        }
    });
};

export const sectionFromWardOptions = async (ward) => {


    return new Promise(async (resolve) => {

        try {

            const sections = await getValuesFromWard('section', ward);
            resolve(buildOptions(sections, 'section', 'section'));

        } catch (error) {
            console.log('Ward Error', error);
        }
    });
};

export const chiefdomFromWardOptions = async (ward) => {

    return new Promise(async (resolve) => {

        try {
            const sections = await getValuesFromWard('chiefdom', ward);
            resolve(buildOptions(sections, 'chiefdom', 'chiefdom'));

        } catch (error) {
            console.log('Ward Error', error);
        }
    });
};

export const districtFromWardOptions = async (ward) => {

    return new Promise(async (resolve) => {

        try {
            const sections = await getValuesFromWard('district', ward);
            resolve(buildOptions(sections, 'district', 'district'));

        } catch (error) {
            console.log('Ward Error', error);
        }
    });
};

export const provinceFromWardOptions = async (ward) => {

    return new Promise(async (resolve) => {

        try {
            const sections = await getValuesFromWard('province', ward);
            resolve(buildOptions(sections, 'province', 'province'));

        } catch (error) {
            console.log('Ward Error', error);
        }
    });
};
export const prefixFromWardOptions = async (ward) => {

    return new Promise(async (resolve) => {

        try {
            const sections = await getValuesFromWard('prefix', ward);
            resolve(buildOptions(sections, 'prefix', 'prefix'));

        } catch (error) {
            console.log('prefix Error', error);
        }
    });
};
