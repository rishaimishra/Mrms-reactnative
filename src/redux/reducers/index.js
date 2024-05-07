import {combineReducers} from 'redux';
import UserReducer from "./UserReducer";
import OptionReducer from "./OptionReducer";
import AddPropertyReducer from "./AddPropertyReducer";
import PropertiesReducer from "./PropertiesReducer";
import AppReducer from "./AppReducer";
import SyncReducer from "./SyncReducer";

export default combineReducers({
    user: UserReducer,
    options: OptionReducer,
    addProperty: AddPropertyReducer,
    properties: PropertiesReducer,
    app: AppReducer,
    sync: SyncReducer
});