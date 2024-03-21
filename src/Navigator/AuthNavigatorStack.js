import {createStackNavigator} from 'react-navigation-stack'

import AuthScreen from "../Screens/Auth/AuthScreen";
import ForgetPasswordScreen from "../Screens/Auth/ForgetPasswordScreen";
import AssessmentCalculatorScreen from '../Screens/AssesmentCalculatorScreen';

export default createStackNavigator({
    login: AuthScreen,
    forgetPassword: ForgetPasswordScreen,
    assessmentCalculator: AssessmentCalculatorScreen
});
