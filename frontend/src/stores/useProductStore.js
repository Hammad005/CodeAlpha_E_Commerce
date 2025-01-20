import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }));
            toast.success(res.data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },


    fetchAllProducts: async () => {
        set({ loading: true });

        try {
            const response = await axios.get('/products');
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ error: error.response.data.message || "An error occurred", loading: false });
            toast.error(error.response.data.message || "Failed to fetch products")
        }
    },


    fetchProductsByCategory: async (category) => {
        set({loading: true});
        try {
            const response = await axios.get(`/products/category/${category}`);
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Failed to fetch products", loading: false });
            toast.error(error.response.data.message || "Failed to fetch products")
        }
    },


    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            const res = await axios.delete(`/products/${productId}`);
            set((prevProduct) => ({
                products: prevProduct.products.filter((product) =>
                    product._id !== productId
                ),
                loading: false
            }));
            toast.success(res.data.message)
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Failed to delete product");
        }
    },


    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            set((prevProduct) => ({
                products: prevProduct.products.map((product) =>
                    product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
                ),
                loading: false
            }));
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    fetchFeaturedProducts: async () => {
        set({loading: true});
        try {
            const response = await axios.get('/products/featured');
            console.log(response);
            
            set({ products: response.data, loading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Failed to fetch featured products", loading: false});
        }
    }
}));