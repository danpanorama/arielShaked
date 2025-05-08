const initialState = {
    items: [],
    total: 0,
  };
  
  const providerCartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          ...state,
          items: [...state.items, action.payload],
          total: state.total + action.payload.price, // עדכון מחיר בסך הכל
        };
      case 'REMOVE_ITEM':
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
          total: state.total - action.payload.price,
        };
      case 'CLEAR_CART':
        return initialState;
      default:
        return state;
    }
  };
  
  export default providerCartReducer;
  