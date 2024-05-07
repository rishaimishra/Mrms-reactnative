import React, {useState} from 'react';

export const useFields = (initialFields = {}) => {

    const [fields, setFieldData] = useState(initialFields);

    const getField = (name, defaultValue = '') => {
        return fields.hasOwnProperty(name) ? fields[name] : defaultValue;
    };

    const setField = (name, value) => {
        setFieldData(fields => ({
            ...fields,
            [name]: value,
        }));
    };

    return {getField, setField};
};
