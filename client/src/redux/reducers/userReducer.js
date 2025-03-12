import * as actionTypes from "../contents/connectContent";

const initialState = {
  connect: false,
  user: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CONNECT:
      return {
        ...state,
        connect: true,
        user: action.data, // עדכון של ה-user עם הערכים שמגיעים ב-action
      };

    default:
      return state;
  }
};

export default reducer;
