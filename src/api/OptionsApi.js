import axios from 'axios';
import store from './../redux/store';
import AsyncStorage from '@react-native-community/async-storage'
import { API_OPTIONS, API_NAME_STREET_NAME_OPTIONS } from "./api";
import { setOptions } from "../redux/actions/OptionActions";
import { setNamesAndStreetOptions } from '../redux/actions/AppActions';

const PROPERTY_OPTIONS = 'property_options';
const NAMES_OPTIONS = 'names_options';

const fixOptions = (options,isDistrict) => {
if(isDistrict){
    return options.map(option => ({
        amount: parseFloat(option.value),
        value: option.id,
        label: option.name
    }));

}else{
    return options.map(option => ({
        amount: parseFloat(option.value),
        value: option.id,
        label: option.label
    }));

}
 

};

export const loadOptions = async () => {
    try {

        const { data } = await axios.get(API_OPTIONS);
console.log("loadOptions"+JSON.stringify(data))
        const options = {
            categories: fixOptions(data.result.property_categories),
            wallMaterials: fixOptions(data.result.property_wall_materials),
            roofMaterials: fixOptions(data.result.property_roofs_materials),
            valueAdded: fixOptions(data.result.property_value_added),
            types: fixOptions(data.result.property_types),
            dimensions: fixOptions(data.result.property_dimension),
            district: fixOptions(data.result.district,"district"),
            propertyUse: fixOptions(data.result.property_use),
            zones: fixOptions(data.result.property_zones),
            swimmingPool: fixOptions(data.result.swimming_pools),
            gatedCommunity: parseFloat(data.result.gated_community),
            propertyInaccessibleOptions: data.result.property_inaccessible.map(function(item) {
                item.value = parseInt(item.value)
                return item;
            }),
            sigma_pay_url:data.result.sigma_pay_url
        };

        await store.dispatch(setOptions(options));
        await AsyncStorage.setItem(PROPERTY_OPTIONS, JSON.stringify(options));

        return Promise.resolve(options);

    } catch (error) {
        console.log('options error', error);
        return Promise.reject(error);
    }
};

export const getNamesFromServer = async () => {

    try {

        const { data } = await axios.get(API_NAME_STREET_NAME_OPTIONS);

        if (data.success) {
            await AsyncStorage.setItem(NAMES_OPTIONS, JSON.stringify(data.result));
            return Promise.resolve(data.result);
        }

        return Promise.reject();

    } catch (error) {
        return Promise.reject(error);
    }
};

export const getOptions = async () => {

    try {

        let options = await AsyncStorage.getItem(PROPERTY_OPTIONS);
//console.log("options"+options)
        //options = null;

        if (options) {
            
            options = JSON.parse(options);
        } else {
            options = await loadOptions();
        }

       // options = await loadOptions();

        return Promise.resolve(options);

    } catch (error) {
        console.log('Error for async options', error);
        return Promise.reject(error);
    }
};

export const getNamesAndStreetNamesOptions = async () => {

    try {

        let options = await AsyncStorage.getItem(NAMES_OPTIONS);

        if (!options) {
            options = await getNamesFromServer();
        } else {
            options = JSON.parse(options);

            getNamesFromServer().then(options => {
                store.dispatch( setNamesAndStreetOptions(options.firstNames, options.lastNames, options.streetNames) );
            }).catch(e => e);
        }

        store.dispatch( setNamesAndStreetOptions(options.firstNames, options.lastNames, options.streetNames) );
        return Promise.resolve(options);

    } catch (error) {
        console.log("Names options error", error);
        return Promise.reject();
    }
};
