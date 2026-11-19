import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { API_URL } from "../config";

const quillModules = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};

export default function BlogEditor() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        image_url: "",
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await fetch(`${API_URL}/upload-image/`, {
                method: "POST",
                body: uploadData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            setFormData((prev) => ({ ...prev, image_url: data.image_url }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/blogs/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const savedData = await response.json();
                alert(`Blog published successfully! Auto-generated ID: ${savedData.id}`);
                setFormData({ title: "", description: "", content: "", image_url: "" });
            } else {
                alert("Failed to publish blog.");
            }
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Network error while saving blog.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 mt-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Create New Post</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="text"
                    placeholder="Main Blog Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                    required
                />

                <textarea
                    placeholder="Write a few lines describing this blog post..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    required
                />

                <div className="w-full p-4 rounded-xl border border-gray-300 bg-white">
                    <label className="block text-sm text-gray-500 mb-2 font-semibold">
                        Upload Hero Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                    />
                    {isUploading && (
                        <p className="text-sm text-blue-600 mt-2 font-medium">
                            Uploading to server...
                        </p>
                    )}
                    {formData.image_url && (
                        <p className="text-sm text-green-600 mt-2 font-medium break-all">
                            Image successfully attached: {formData.image_url}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-xl overflow-hidden border border-gray-300">
                    <ReactQuill
                        theme="snow"
                        modules={quillModules}
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        className="h-72 mb-12"
                        placeholder="Write your subtitles (using H2/H3 in the toolbar) and paragraphs here..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                    {isUploading ? "Waiting for image upload..." : "Publish Post"}
                </button>
            </form>
        </div>
    );
}