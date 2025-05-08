import * as actionTypes from "../contents/errContent";

const initialState = {
  message: "",
  active_message: false,
  header: "",
  active_error: false
};

const products = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ERROR:
      return {
        ...state,
        message: action.data.message, 
        header: action.data.header, // העברת הודעה
        active_message: true,   // הפעלת הודעה
        active_error: true      // הפעלת מצב שגיאה
      };

    case actionTypes.CLEAR:
      return {
        ...state,
        message: "",      
        header: "",     // ניקוי הודעה
        active_message: false, // כיבוי הודעה
        active_error: false    // כיבוי מצב שגיאה
      };

    default:
      return state;
  }
};

export default products;
