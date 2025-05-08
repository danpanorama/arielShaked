import * as actionTypes from "../contents/connectContent";

const savedUser = localStorage.getItem("user");
const initialState = {
  connect: !!savedUser,
  user: savedUser ? JSON.parse(savedUser) : {}, // מוודא שתמיד נקבל אובייקט
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CONNECT:
      localStorage.setItem("user", JSON.stringify(action.data));
      return {
        ...state,
        connect: true,
        user: action.data,
      };

    case actionTypes.REMEMBER_ME:
      const user = localStorage.getItem("user");
      return {
        ...state,
        connect: !!user,
        user: user ? JSON.parse(user) : {}, // שים לב: בדיקה בטוחה
      };

    default:
      return state;
  }
};

export default reducer;
