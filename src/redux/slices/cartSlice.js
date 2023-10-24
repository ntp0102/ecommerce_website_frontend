import { createSlice, current } from '@reduxjs/toolkit'
import cartAPI from '../../mocks/cart'


const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    shippingAddress: {},
    paymentMethod: {},
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartItems(state, action) {
            state.cartItems = action.payload;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        removeCartItem(state, action) {
            const id = action.payload;
            state.cartItems = state.cartItems.filter((item) => item._id !== id)
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        setShippingAddress(state, action) {
            state.shippingAddress = action.payload;
            localStorage.setItem("shippingAddress", JSON.stringify(action.payload))
        },
        setPaymentMethod(state, action) {
            state.paymentMethod = action.payload;
            localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
        },
    }
});

export const {
    setCartItems,
    removeCartItem,
    setShippingAddress,
    setPaymentMethod,
} = cartSlice.actions;

export const addToCart = (id, qty) => async (dispatch, getState) => {
    try {
        const { cartItems } = getState().cart;

        const product = await cartAPI.fetchProduct(id);
        let existingItemIndex = -1;

        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i]._id === Number(id)) {
                existingItemIndex = i;
                break;
            }
        }

        if (existingItemIndex !== -1) {
            // if an item with the same productID exist, update its quantity
            // const updatedCartItems = [...cartItems];
            const updatedCartItems = cartItems.map((elem, index) => {
                if (index === existingItemIndex) 
                    { return Object.assign({}, elem, { qty: Number(elem.qty) + Number(qty) }) }
                else 
                    { return Object.assign({}, elem) }
            })
            // updatedCartItems[existingItemIndex].qty += qty;
            dispatch(setCartItems(updatedCartItems));
        }
        else {
            // If the product doesn't exist in the cart, add it as a new item
            dispatch(setCartItems([...cartItems, { ...product, qty }]));
        }
    } catch (error) {
        console.log("Error adding item to cart:", error);
    }
};

export const removeFromCart = (id) => (dispatch, getState) => {
    try {
        dispatch(removeCartItem(id));
    } catch (error) {
        console.log("Error removing item from cart:", error);
    }
};



export const saveShippingAddress = (data) => (dispatch) => {
    dispatch(setShippingAddress(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch(setPaymentMethod(data));
};

export const { reducer } = cartSlice;
export default cartSlice;