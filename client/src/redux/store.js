import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';

import ErrorReducer from './reducers/errReducer';
import loaderReducer from './reducers/LoaderReducer';
import userReducer from './reducers/userReducer';
import providerCartReducer from './reducers/providerCartReducer.js';

// שילוב כל הרדוסרים
const reducer = combineReducers({
  loader: loaderReducer,
  err: ErrorReducer,
  user: userReducer,
  providerCart: providerCartReducer,
});

// מצב התחלתי ריק
const initialState = {};
const middleware = [thunk];

// compose רגיל בלי devtools
const composedEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// יצירת store
const store = createStore(
  reducer,
  initialState,
  composedEnhancers(applyMiddleware(...middleware))
);

export default store;
