import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComments, createComment, updateComment, deleteComment, } from "../services/apiService";

export default function CommentSection({ blogId }) {
    const [userId] = useState(localStorage.getItem("id"));
    const [data, setData] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editedText, setEditedText] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await getComments(blogId);
                setData(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };

        if (blogId) fetchComments();
    }, [blogId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        try {
            const res = await createComment(blogId, newComment);
            setData((prev) => [...prev, res.data.data]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setData((prev) => prev.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Failed to delete comment.");
        }
    };

    const handleUpdateClick = (item) => {
        setEditingId(item._id);
        setEditedText(item.comment);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedText("");
    };

    const handleSaveEdit = async (commentId) => {
        try {
            const res = await updateComment(commentId, editedText);

            setData((prev) =>
                prev.map((item) =>
                    item._id === commentId ? { ...item, comment: res.data.data.comment, updatedAt: res.data.data.updatedAt } : item
                )
            );
            setEditingId(null);
            setEditedText("");
        } catch (error) {
            console.error("Failed to update comment:", error);
            alert("Failed to update comment.");
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item._id} className="border p-3 rounded bg-gray-50">
                        {editingId === item._id ? (
                            <>
                                <textarea
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    rows="2"
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <button onClick={() => handleSaveEdit(item._id)} className="text-green-600 mr-2">Save</button>
                                <button onClick={handleCancelEdit} className="text-gray-500">Cancel</button>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-800">{item.comment}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                    {item.commentorEmail} , {item.createdAt === item.updatedAt ? `${new Date(item.createdAt).toLocaleDateString('en-GB')} , ${new Date(item.createdAt).toLocaleTimeString('en-GB')}` : `Updated at ${new Date(item.updatedAt).toLocaleDateString('en-GB')} , ${new Date(item.createdAt).toLocaleTimeString('en-GB')}`}
                                </div>
                                {item.commentorId === userId && (
                                    <>
                                        <Link onClick={() => handleUpdateClick(item)} className="text-yellow-500 hover:underline mr-4">Edit</Link>
                                        <Link onClick={() => handleDeleteComment(item._id)} className="text-red-500 hover:underline">Delete</Link>
                                    </>
                                )}
                            </>
                        )}
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
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Comment
                </button>
            </form>
        </div>
    );
}