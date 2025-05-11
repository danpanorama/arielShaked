const initialState = {
  items: [],
  total: 0,
};

const providerCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + action.payload.price * action.payload.quantity,
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload }],
          total: state.total + action.payload.price * action.payload.quantity,
        };
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload.id);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        total: state.total - (itemToRemove.price * itemToRemove.quantity),
      };
    }

    case 'DECREASE_ITEM': {
      const item = state.items.find(i => i.id === action.payload.id);
      if (!item) return state;

      const newQuantity = item.quantity - action.payload.amount;
      if (newQuantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.payload.id),
          total: state.total - item.quantity * item.price,
        };
      } else {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: newQuantity } : i
          ),
          total: state.total - (action.payload.amount * item.price),
        };
      }
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export default providerCartReducer;
