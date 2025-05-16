import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../../src/services/apiService";
import axios from "axios";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "", image: null });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = "";

            if (form.image) {
                const imageData = new FormData();
                imageData.append("file", form.image);
                imageData.append("upload_preset", "ml_default");
                imageData.append("cloud_name", "nitinclouds");

                const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/nitinclouds/image/upload", imageData);

                imageUrl = uploadRes.data.secure_url;
            }

            await signUpUser({
                email: form.email,
                password: form.password,
                image: imageUrl,
            });

            navigate("/");
        } catch (err) {
            console.error("Signup error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
            <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                className="w-full mb-2 p-2 border rounded"
                required
            />

            <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
                className="w-full mb-2 p-2 border rounded"
                required
            />

            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
            />

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Sign Up
            </button>
            <div className="text-center mt-4">
                <Link to="/" className="text-green-600 hover:underline">Login</Link>
            </div>
        </form>
    );
}