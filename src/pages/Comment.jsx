import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CommentSection({ blogId, token }) {
    const id = localStorage.getItem("id");
    const [data, setData] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/comments/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };

        if (blogId) fetchComments();
    }, [blogId, token]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        console.log(123, newComment)
        try {
            const res = await axios.post(
                `http://localhost:8000/api/comments/${blogId}`,
                { comment: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData((prev) => [...prev, res.data.data]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment.");
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.id} className="border p-3 rounded bg-gray-50">
                        <p className="text-sm text-gray-800">{item.comment}</p>
                        <div className="text-xs text-gray-500 mt-1">
                            {item.commentorEmail} , {new Date(item.createdAt).toLocaleString()}
                        </div>
                        {item.commentorId === id && <>
                            <Link className="text-yellow-500 hover:underline mr-4">Edit</Link>
                            <Link className="text-red-500 hover:underline">Delete</Link>
                        </>
                        }
                    </div>
                ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="mb-4 mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="2"
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded mb-2"
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Comment
                </button>
            </form>
        </div>
    );
}