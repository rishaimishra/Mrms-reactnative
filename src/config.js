import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import Colors from "./Colors";
import { logout } from './api/UserApi';

axios.defaults.headers.common['Accept'] = 'application/json';

axios.interceptors.response.use(function (response) {

    const { data } = response;

    if (data.hasOwnProperty('success') && data.success === false) {

        let message = '';

        if (data.code === 422) {
            message = data.errors[Object.keys(data.errors)[0]][0];
        } else if (data.hasOwnProperty('message')) {
            message = data.message;
        }

        setTimeout(() => {
            ShowAppMessage(message);
        }, 50)
    }

    return Promise.resolve(response);

}, async (error) => {

    if (error.response && error.response.status === 401) {
        await logout();
    }
    else if(error.hasOwnProperty('response')) {
        console.log(JSON.stringify(error.response))
        ShowAppMessage(`Server error. error code ${JSON.stringify(error.Error)}`);
    }
    else {
        ShowAppMessage('Something went wrong.');
    }

    return Promise.reject(error);
});


global.ShowAppMessage = (title, duration = Snackbar.LENGTH_LONG) => {
    Snackbar.show({
        text: title,
        duration,
        textColor: Colors.white
    });
};
