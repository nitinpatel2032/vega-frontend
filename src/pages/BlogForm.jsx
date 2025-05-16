import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CommentSection from "./Comment";
import { getBlogById, createBlog, updateBlog, deleteBlogImage, } from "../services/apiService";
import axios from "axios";

export default function BlogForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [form, setForm] = useState({ title: "", description: "", image: null });
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageId, setCurrentImageId] = useState(null);
    const [removedImage, setRemovedImage] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const isEdit = location.pathname.includes("/edit");
    const isView = location.pathname.includes("/view");

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await getBlogById(id);
                    const data = res.data.data;
                    if (data) {
                        setForm({
                            title: data.title,
                            description: data.description,
                            image: null,
                        });
                        setCurrentImage(data.image || null);
                        setCurrentImageId(data.imageId || null);
                    }
                    if (isView) setViewMode(true);
                } catch (error) {
                    console.error("Error in loading:", error);
                    alert("Failed to load.");
                }
            };

            fetchData();
        }
    }, [id, isView]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.description) {
            return alert("Title and Description are required.");
        }

        try {
            let imageUrl = currentImage;
            let imageId = currentImageId;

            if (removedImage && currentImageId) {
                try {
                    await deleteBlogImage(currentImageId);
                    imageUrl = "";
                    imageId = "";
                } catch (error) {
                    console.error("Error deleting image:", error);
                }
            }

            if (form.image) {
                const imageData = new FormData();
                imageData.append("file", form.image);
                imageData.append("upload_preset", "ml_default");
                imageData.append("cloud_name", "nitinclouds");

                const uploadImage = await axios.post("https://api.cloudinary.com/v1_1/nitinclouds/image/upload",
                    imageData
                );

                imageUrl = uploadImage.data.secure_url;
                imageId = uploadImage.data.public_id;
            }

            const payload = {
                title: form.title,
                description: form.description,
                image: imageUrl,
                imageId: imageId,
            };

            if (isEdit) {
                await updateBlog(id, payload);
            } else {
                await createBlog(payload);
            }

            navigate("/dashboard");
        } catch (err) {
            console.error("Error in submitting:", err);
            alert("Submission failed.");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">
                {isView ? "View Blog" : isEdit ? "Edit Blog" : "Add Blog"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    disabled={viewMode}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Enter blog title"
                    required
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={viewMode}
                    className="w-full mb-2 p-2 border rounded"
                    rows="3"
                    placeholder="Enter blog description..."
                    required
                ></textarea>

                {currentImage && !removedImage && (
                    <div>
                        <label className="block font-medium mb-1">Image</label>
                        <img
                            src={`${currentImage}`}
                            alt="Blog"
                            className="w-full h-40 object-cover rounded mb-2"
                        />
                        {!viewMode && (
                            <button
                                type="button"
                                onClick={() => {
                                    setRemovedImage(true);
                                    setForm((prev) => ({ ...prev, image: null }));
                                }}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove Image
                            </button>
                        )}
                    </div>
                )}

                {!viewMode && (removedImage || !currentImage) && (
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full mb-2 p-2 border rounded"
                    />
                )}

                {!viewMode && (
                    <button
                        type="submit"
                        className={`w-full py-2 rounded text-white ${isEdit ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {isEdit ? "Update" : "Submit"}
                    </button>
                )}
            </form>

            {(isView) && id && (
                <CommentSection blogId={id} />
            )}
        </div>
    );
}