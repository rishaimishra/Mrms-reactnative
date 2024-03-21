import React, {Component} from 'react';
import axios from 'axios';
import {StatusBar, View, ActivityIndicator, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {getTheme, ThemeContext} from 'react-native-material-ui';
import {Provider} from 'react-redux';
import store from './redux/store';
import './config';

import Navigator from './Navigator';
import {ActiveUser, UserToken} from './api/UserApi';
import {setLoggedInUser} from './redux/actions/UserActions';
import {getNamesAndStreetNamesOptions, getOptions} from './api/OptionsApi';
import {setOptions} from './redux/actions/OptionActions';
import Colors from './Colors';
import {setAppLoaded, setDefaultWard} from './redux/actions/AppActions';
import SplashScreen from 'react-native-splash-screen';


const uiTheme = {
    palette: {
        primaryColor: Colors.primary,
    },
    checkbox: {
        label: {
            marginLeft: 0,
        },
    },
};


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            appLoading: true,
        };
    }


    async componentDidMount() {

        SplashScreen.hide();

        const options = await getOptions();
        store.dispatch(setOptions(options));

        const token = await UserToken();

        if (token) {

            const activeUser = await ActiveUser();

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await store.dispatch(setLoggedInUser(token, activeUser));


            const defaultWard = await AsyncStorage.getItem('default_ward', null);

            await getNamesAndStreetNamesOptions();


            await store.dispatch(setDefaultWard(defaultWard ? parseInt(defaultWard) : defaultWard));
        }

        await store.dispatch(setAppLoaded());

        this.setState({appLoading: false});
    }

    render() {

        return (
            <ThemeContext.Provider value={getTheme(uiTheme)}>
                <Provider store={store}>
                    {this.state.appLoading ? (
                        <View style={{
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}>
                            <ActivityIndicator color={Colors.primary} size={60}/>
                            <Text style={{ fontSize: 16, marginTop: 10 }}>Loading..</Text>
                        </View>
                    ) : <Navigator/>}
                    <StatusBar
                        barStyle={'dark-content'}
                        backgroundColor={'#fff'}
                    />
                </Provider>
            </ThemeContext.Provider>
        );
    }
}
