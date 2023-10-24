import { createSlice } from '@reduxjs/toolkit'
import orderAPI from '../../mocks/order'


const initialState = {
    listOrder: [],
    orderDetails: {
        User: {},
        orderItems: {},
        shippingAddress: {},
    },
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        getOrderDetailsStart(state) {
            state.loading = true;
            state.error = null;
        },
        getOrderDetailsSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.orderDetails = action.payload;
        },
        getOrderDetailsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createOrderStart(state) {
            state.loading = true;
            state.error = null;
        },
        createOrderSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.listOrder.push(action.payload);
            state.orderDetails = action.payload;
        },
        createOrderFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        payOrderStart(state) {
            state.loading = true;
            state.error = null;
        },
        payOrderSuccess(state, action) {
            state.loading = false;
            state.error = null;
            if (action.payload === 'Order was paid') {
                state.orderDetails.isPaid = true; // Update the 'isPaid' property of 'orderDetails'
            }
            return state // Return the updated state
        },
        payOrderFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        listMyOrdersStart(state) {
            state.loading = true;
            state.error = null;
        },
        listMyOrdersSuccess(state, action) {
            state.loading = false;
            state.error = null;
            state.listOrder = action.payload;

        },
        listMyOrdersFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        // listOrdersStart(state) {
        //     state.loading = true;
        //     state.error = null;
        // },
        // listOrdersSuccess(state, action) {
        //     state.loading = false;
        //     state.error = null;
        //     state.listOrder = action.payload;

        // },
        // listOrdersFailure(state, action) {
        //     state.loading = false;
        //     state.error = action.payload;
        // },
        deliverOrderStart(state) {
            state.loading = true;
            state.error = null;
        },
        deliverOrderSuccess(state, action) {
            state.loading = false;
            state.error = null;
            const updatedOrder = action.payload;
            const index = state.listOrder.findIndex((order) => order._id === updatedOrder._id);
            if (index !== -1) {
                state.listOrder[index] = updatedOrder;
            }
        },
        deliverOrderFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const {
    getOrderDetailsStart,
    getOrderDetailsSuccess,
    getOrderDetailsFailure,
    createOrderStart,
    createOrderSuccess,
    createOrderFailure,
    payOrderStart,
    payOrderSuccess,
    payOrderFailure,
    listMyOrdersStart,
    listMyOrdersSuccess,
    listMyOrdersFailure,
    // listOrdersStart,
    // listOrdersSuccess,
    // listOrdersFailure,
    deliverOrderStart,
    deliverOrderSuccess,
    deliverOrderFailure,
} = orderSlice.actions;

export const createOrder = (order) => async (dispatch) => {
    try {
        dispatch(createOrderStart());
        const createdOrder = await orderAPI.createOrder(order);
        dispatch(createOrderSuccess(createdOrder));
        localStorage.removeItem("cartItems");
        return createdOrder._id
    } catch (error) {
        dispatch(createOrderFailure(error.message));
    }
};

export const getOrderDetails = (orderId) => async (dispatch) => {
    try {
        dispatch(getOrderDetailsStart());
        const orderDetails = await orderAPI.getOrderDetails(orderId);
        dispatch(getOrderDetailsSuccess(orderDetails));
    } catch (error) {
        dispatch(getOrderDetailsFailure(error));
    }
};

export const payOrder = (orderId, paymentResult) => async (dispatch) => {
    try {
        dispatch(payOrderStart());
        const updatedOrder = await orderAPI.payOrder(orderId, paymentResult);
        dispatch(payOrderSuccess(updatedOrder));
    } catch (error) {
        dispatch(payOrderFailure(error.message));
    }
};

export const listMyOrders = () => async (dispatch) => {
    try {
        dispatch(listMyOrdersStart());
        const myOrders = await orderAPI.listMyOrders();
        dispatch(listMyOrdersSuccess(myOrders));
    } catch (error) {
        dispatch(listMyOrdersFailure(error.message));
    }
};

// export const listOrders = () => async (dispatch) => {
//     try {
//         dispatch(listOrdersStart());
//         const allOrders = await orderAPI.listOrders();
//         dispatch(listOrdersSuccess(allOrders));
//     } catch (error) {
//         dispatch(listOrdersFailure(error.message));
//     }
// };

export const deliverOrder = (orderId) => async (dispatch) => {
    try {
        dispatch(deliverOrderStart());
        const updatedOrder = await orderAPI.deliverOrder(orderId);
        dispatch(deliverOrderSuccess(updatedOrder));
    } catch (error) {
        dispatch(deliverOrderFailure(error.message));
    }
};

export const { reducer } = orderSlice;
export default orderSlice;