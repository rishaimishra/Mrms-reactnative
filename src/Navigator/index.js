import {enableScreens} from 'react-native-screens';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import AuthNavigatorStack from './../Navigator/AuthNavigatorStack';
import MainStack from './MainStack';
import LockScreenStack from './LockScreenStack';

enableScreens();

const AppNavigator = createSwitchNavigator({
    lock: LockScreenStack,
    auth: AuthNavigatorStack,
    main: MainStack,
}, {
    //initialRouteName: 'main'
});

export default createAppContainer(AppNavigator);

