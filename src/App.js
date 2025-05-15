// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BlogForm from "./pages/BlogForm";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blogs/add" element={<BlogForm />} />
        <Route path="/blogs/edit/:id" element={<BlogForm />} />
        <Route path="/blogs/view/:id" element={<BlogForm />} />
      </Routes>
    </Router>
  );
}