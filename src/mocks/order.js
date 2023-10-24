import axios from 'axios';


class OrderAPI {
    async createOrder(order) {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`/api/orders/add/`,order, config);
            return data;
        } catch (error) {
            throw error.response && error.response.data.detail ? error.response.data.detail : error.message;
        }
    }

    async getOrderDetails(id) {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token;
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`/api/orders/${id}/`, config);
            console.log('data', data)
            return data;
        } catch (error) {
            console.log('chekc err')
            console.log(error)
            throw error.response && error.response.data.detail ? error.response.data.detail : error.message;
        }
    }

    async payOrder(id, paymentResult) {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token;
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(`/api/orders/${id}/pay`, paymentResult, config);
            return data;
        } catch (error) {
            throw error.response && error.response.data.detail ? error.response.data.detail : error.message;
        }
    }

    async listMyOrders() {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token;
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`/api/orders/myorders`, config);
            return data;
        } catch (error) {
            throw error.response && error.response.data.detail ? error.response.data.detail : error.message;
        }
    }

    async deliverOrder(order) {
        try {
            const token = JSON.parse(localStorage.getItem("userInfo")).token;

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.put(
                `/api/orders/${order._id}/deliver/`,
                {},
                config
            );

            return data;
        } catch (error) {
            throw error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message;
        }
    }
}

const orderAPI = new OrderAPI();

export default orderAPI;