import * as actionTypes from "../contents/loaderContent";

const initialState = {
connect:false,
user:{}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  

    // case actionTypes.START_LOAD:
    //   const loader = {
    //     ...state,
    //   };
    //   loader.Loader = true
   
    //   return loader;


    //   case actionTypes.STOP_LOAD:
    //     const stopLoad = {
    //       ...state,
    //     };
    //     stopLoad.Loader = false
     
    //     return stopLoad;


    default:
      break;
  }
  return state;
};

export default reducer;