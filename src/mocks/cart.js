import axios from "axios";


class CartAPI {
    async fetchProduct(productId) {
        try {
            const { data } = await axios.get(`/api/products/${productId}`);
            console.log('data', data)
            return data;
        } catch (error) {
            throw error;
        }
    }
}

const cartAPI = new CartAPI();

export default cartAPI;