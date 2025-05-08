import * as actionTypes from "../contents/loaderContent";

const initialState = {
  Loader: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LOAD:
      return { ...state, Loader: true };
    
    case actionTypes.STOP_LOAD:
      return { ...state, Loader: false };

    default:
      return state;
  }
};

export default reducer;
