import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginUser = (email, password) => api.post("/auth/login", { email, password });

export const signUpUser = (payload) => api.post("/auth/signup", payload);

export const getProfile = () => api.get("/auth/profile");
export const logoutUser = () => api.get("/auth/logout");

export const createBlog = (payload) => api.post("/blogs", payload);
export const updateBlog = (id, payload) => api.put(`/blogs/${id}`, payload);
export const getAllBlogs = () => api.get("/blogs");
export const getBlogById = (id) => api.get(`/blogs/${id}`);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
export const deleteBlogImage = (public_id) => api.post("/blogs/delete", { public_id });

export const createComment = (blogId, comment) => api.post(`/comments/${blogId}`, { comment });
export const updateComment = (commentId, newComment) => api.put(`/comments/${commentId}`, { newComment });
export const getComments = (blogId) => api.get(`/comments/${blogId}`);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

export default api;