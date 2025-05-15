import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <Link to="/dashboard" className="text-xl font-bold text-blue-700">
                Dashboard
            </Link>

            <div className="flex items-center space-x-4">
                {user?.image && (
                    <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full border" />
                )}
                <button onClick={onLogout} className="text-red-600 hover:underline">
                    Logout
                </button>
            </div>
        </nav>
    );
}