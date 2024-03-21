import {applyMiddleware, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';


import Reducers from './reducers';

//const composeEnhancers = composeWithDevTools({realtime: true});

//const store = createStore(Reducers, {}, composeEnhancers(applyMiddleware(ReduxThunk)));

const store = createStore(Reducers, applyMiddleware(ReduxThunk));


export default store;
