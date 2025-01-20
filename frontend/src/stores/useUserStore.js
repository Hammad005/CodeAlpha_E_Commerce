import { create } from 'zustand';
import axios from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,


    signup: async (name, email, password, confirmPassword) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Password do not match");
        }

        if (password.length < 6 || confirmPassword.length < 6) {
            set({ loading: false });
            return toast.error("Password must be at least 6 characters long");
        }


        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            set({ loading: false, user: res.data.user });
            toast.success(res.data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }

    },


    login: async (email, password) => {
        set({ loading: true });

        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ loading: false, user: res.data.user });
            toast.success(res.data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    logout: async () => {
        set({loading: true});
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            await axios.post("/auth/logout");
            set({ user: null, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },


    checkAuth: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ checkingAuth: true });
        try {
            const res = await axios.get("/auth/profile");
            set({ user: res.data, checkingAuth: false });
            
        } catch (error) {
            set({ checkingAuth: false, user: null, error: error });
        } finally {
            set({ checkingAuth: false });
        }
    },

    refreshToken: async () => {
        if (get().checkingAuth) return;
        set({ checkingAuth: true });

        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false});
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false});
            throw error;
        }
    }
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
        
	}
);