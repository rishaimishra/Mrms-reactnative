import {createStackNavigator} from 'react-navigation-stack'

import LockScreen from "../Screens/Auth/LockScreen";
import AssessmentCalculatorScreen from '../Screens/AssesmentCalculatorScreen';

export default createStackNavigator({
    forgetPassword: LockScreen,
    assessmentCalculator: AssessmentCalculatorScreen
});
