import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProfile, logoutUser, getAllBlogs, deleteBlog } from "../services/apiService";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getProfile();
                setUser(res.data.data);
                fetchBlogs();
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await getAllBlogs();
            setBlogs(res.data.data);
        } catch (err) {
            console.error("Error fetching blogs:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog ?")) {
            try {
                await deleteBlog(id);
                setBlogs(prev => prev.filter(blog => blog._id !== id));
            } catch (err) {
                console.error("Error deleting blog:", err);
            }
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("token");
            navigate("/");
        } catch (err) {
            console.error("Error in logout:", err);
        }
    }

    return (
        <div className="p-6 max-w-full">
            <Navbar user={user} onLogout={logout} />

            <div className="my-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Blogs</h2>
                    <Link
                        to="/blogs/add"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    >
                        + New Blog
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-2 border-b">Title</th>
                            <th className="px-4 py-2 border-b">Image</th>
                            <th className="px-4 py-2 border-b">Description</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(blog => (
                            <tr key={blog._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{blog.title}</td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        onClick={() => setSelectedImage(`${blog.image}`)}
                                        className="text-green-500 hover:underline"
                                    >
                                        View Image
                                    </button>
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {blog.description.length > 50
                                        ? blog.description.substring(0, 50) + "..."
                                        : blog.description}
                                </td>
                                <td className="px-4 py-2 border-b space-x-2">
                                    <Link
                                        to={`/blogs/view/${blog._id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                    {blog.author === localStorage.getItem("id") &&
                                        <>
                                            <Link
                                                to={`/blogs/edit/${blog._id}`}
                                                className="text-yellow-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </>}
                                </td>
                            </tr>
                        ))}
                        {blogs.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No blogs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg relative max-w-md w-full">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-auto rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}