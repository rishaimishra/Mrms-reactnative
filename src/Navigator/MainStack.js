import {createStackNavigator} from "react-navigation-stack";
import OwnerDetailsScreen from "../Screens/AddProperty/OwnerDetailsScreen";
import PropertiesScreen from "../Screens/Property/PropertiesScreen";
import AssessmentScreen from "../Screens/AddProperty/AssessmentScreen";
import GeoRegistryScreen from "../Screens/AddProperty/GeoRegistryScreen";
import ProfileScreen from "../Screens/Profile/ProfileScreen";
import SyncScreen from "../Screens/Property/SyncScreen";
import MapNavigationScreen from '../Screens/MapNavigationScreen';


export default createStackNavigator({
    'properties': PropertiesScreen,
    'properties.sync': SyncScreen,
    'property.owner': OwnerDetailsScreen,
    'property.assessment': AssessmentScreen,
    'property.geo-registry': GeoRegistryScreen,
    'account.profile': ProfileScreen,
    'map.navigation': MapNavigationScreen,

}, {
    //initialRouteName: 'property.geo-registry'
});
