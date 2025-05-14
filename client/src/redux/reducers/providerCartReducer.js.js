const initialState = {
  orders: [],
};

const providerCartReducer = (state = initialState, action) => {
  switch (action.type) {
   case 'ADD_ITEM': {
  const existingProvider = state.orders.find(order => order.providerId === action.payload.providerId);
  if (existingProvider) {
    const existingItem = existingProvider.items.find(item => item.id === action.payload.id);
    if (existingItem) {
      return {
        ...state,
        orders: state.orders.map(order =>
          order.providerId === action.payload.providerId
            ? {
                ...order,
                items: order.items.map(item =>
                  item.id === action.payload.id
                    ? { ...item, quantity: item.quantity + action.payload.quantity }
                    : item
                ),
              }
            : order
        ),
      };
    } else {
      return {
        ...state,
        orders: state.orders.map(order =>
          order.providerId === action.payload.providerId
            ? { ...order, items: [...order.items, action.payload] }
            : order
        ),
      };
    }
  } else {
    return {
      ...state,
      orders: [
        ...state.orders,
        { providerId: action.payload.providerId, items: [action.payload] },
      ],
    };
  }
}


    case 'REMOVE_ITEM': {
      const provider = state.orders.find(order => order.providerId === action.payload.providerId);
      if (provider) {
        return {
          ...state,
          orders: state.orders.map(order =>
            order.providerId === action.payload.providerId
              ? {
                  ...order,
                  items: order.items.filter(item => item.id !== action.payload.id),
                }
              : order
          ),
        };
      }
      return state;
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export default providerCartReducer;
