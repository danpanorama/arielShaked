import { createStore, combineReducers, applyMiddleware,compose } from 'redux';
import {thunk} from 'redux-thunk'; 
import { composeWithDevTools } from 'redux-devtools-extension'; 
import ErrorReducer from './reducers/errReducer';
import loaderReducer from './reducers/LoaderReducer'
import userReducer from './reducers/userReducer'


const reducer = combineReducers({
  loader:loaderReducer,
  err: ErrorReducer,
  user:userReducer

});
console.log("composeWithDevTools: ", composeWithDevTools);

const initialState = {};

const middleware = [thunk];

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;