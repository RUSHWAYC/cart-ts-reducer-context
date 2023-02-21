import { createContext, ReactElement, useMemo, useReducer } from "react";

//Types for the cart items.
export interface CartItemType {
  sku: string;
  name: string;
  price: number;
  qty: number;
}

//Types for the cart specifically.
interface CartStateType {
  cart: CartItemType[];
}

//Initial cart state.
const initCartState: CartStateType = { cart: [] };

//Actions that will be used in the reducer.
const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  QUANTITY: "QUANTITY",
  SUBMIT: "SUBMIT",
};

//Not needed? REDUCER_ACTION_TYPE sets everything to string by default.
export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

//Setting up types for actions that will be used by the reducer.
export interface ReducerAction {
  type: string;
  payload?: CartItemType;
}

const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    //ADD button action.
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) {
        throw new Error("action.payload missing in ADD action.");
      }
      const { sku, name, price } = action.payload;
      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );
      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );
      const qty: number = itemExists ? itemExists.qty + 1 : 1;
      return { ...state, cart: [...filteredCart, { sku, name, price, qty }] };
    }

    //REMOVE button action.
    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error("action.payload missing in REMOVE action.");
      }
      const { sku } = action.payload;
      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );
      return { ...state, cart: [...filteredCart] };
    }

    //QUANTITY change action.
    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error("action.payload missing in QUANTITY action.");
      }
      const { sku, qty } = action.payload;

      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );
      if (!itemExists) {
        throw new Error("Item must exist in order to update quantity.");
      }
      const updatedItem: CartItemType = { ...itemExists, qty };
      const filteredCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );
      return { ...state, cart: [...filteredCart, updatedItem] };
    }

    //SUBMIT button press. In this case just empties the cart.
    case REDUCER_ACTION_TYPE.SUBMIT: {
      return { ...state, cart: [] };
    }

    //DEFAULT
    default:
      throw new Error("Unidentified reducer action type.");
  }
};

const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState);
  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);
  //Get the amount of items in the cart.
  const totalItems: number = state.cart.reduce((previousValue, cartItem) => {
    return previousValue + cartItem.qty;
  }, 0);
  //Get total price of the cart.
  const totalPrice: string = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    state.cart.reduce((previousValue, cartItem) => {
      return previousValue + cartItem.qty * cartItem.price;
    }, 0)
  );
  //Sort items my sku.
  const cart = state.cart.sort((a, b) => {
    const itemA: number = Number(a.sku.slice(-4));
    const itemB: number = Number(b.sku.slice(-4));
    return itemA - itemB;
  });

  return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart };
};

export type UseCartContextType = ReturnType<typeof useCartContext>;

//Takes returned values of useCartContext.
const initCartContextState: UseCartContextType = {
  dispatch: () => {},
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
  totalItems: 0,
  totalPrice: "",
  cart: [],
};

//Making Cart context from code above.
export const CartContext =
  createContext<UseCartContextType>(initCartContextState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const CartProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
