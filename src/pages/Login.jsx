import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../src/services/apiService";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(email, password);
            localStorage.setItem("id", res.data.user.id);
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Welcome</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full mb-2 p-2 border rounded"
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full mb-2 p-2 border rounded"
            />

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                Login
            </button>
            <div className="text-center mt-4">
                <Link to="/signup" className="text-blue-600 hover:underline">
                    Sign Up
                </Link>
            </div>
        </form>
    );
}