import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'
import {API_LOGIN, API_RESET_PASSWORD_REQUEST, API_UPDATE_PROFILE} from "./api";
import {setActiveUser, setLoggedInUser} from "../redux/actions/UserActions";
import {loadOptions, getNamesAndStreetNamesOptions,fillDistrictData} from "./OptionsApi";
import {SET_LOGGED_OUT_USER} from "../redux/actions/types";
import {deleteAllData,InsertAllData} from "../../src/database/BoundryDelimination";

const AUTH_TOKEN = 'AUTH_TOKEN';
const ACTIVE_USER = 'ACTIVE_USER';

export const login = (email, password) => {

    return async dispatch => {
        try {

            const {data} = await axios.post(API_LOGIN, {email, password});
console.log(data)
            if (data.success) {
                await deleteAllData();

                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                await AsyncStorage.setItem(AUTH_TOKEN, data.token);
                await AsyncStorage.setItem(ACTIVE_USER, JSON.stringify(data.user));
                for (let dataObject of await fillDistrictData()) {
                    await InsertAllData(dataObject)
                }
                await dispatch(setLoggedInUser(data.token, data.user));
                await getNamesAndStreetNamesOptions();
                await loadOptions();

            }

            return Promise.resolve(data);

        } catch (error) {
            return Promise.reject(error);
        }
    };
};

export const UserToken = () => AsyncStorage.getItem(AUTH_TOKEN);

export const ActiveUser = async () => {

    const user = await AsyncStorage.getItem(ACTIVE_USER);

    if (user) {
        return JSON.parse(user);
    }
    return null;
};

export const updateProfile = (name, avatar = null) => {

    return async dispatch => {

        try {

            const formData = new FormData();

            formData.append('name', name);

            if (avatar) {
                formData.append('image', {
                    uri: avatar,
                    type: 'image/jpeg',
                    name: 'avatar.jpeg',
                });
            }

            const {data} = await axios.post(API_UPDATE_PROFILE, formData);

            if (data.success) {
                await AsyncStorage.setItem(ACTIVE_USER, JSON.stringify(data.user));
                await dispatch(setActiveUser(data.user));

                return Promise.resolve(data);
            }

            return Promise.reject(data);

        } catch (error) {

            console.log(error.response);

            return Promise.reject(error);
        }
    };
};

export const resetPasswordRequest = (email) => {
    return axios.post(API_RESET_PASSWORD_REQUEST, {
        email
    });
};

export const logout = () => {
    return async dispatch => {

        axios.defaults.headers.common['Authorization'] = '';
        await AsyncStorage.removeItem(AUTH_TOKEN);
        await AsyncStorage.removeItem(ACTIVE_USER);
        await AsyncStorage.removeItem('sigma_pay_url');

        await dispatch({type: SET_LOGGED_OUT_USER});

        return Promise.resolve();
    };
};