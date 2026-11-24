import { useState } from "react";
import ReactQuill from "react-quill-new";
import { Link } from "react-router-dom";
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
            <nav aria-label="Breadcrumb" className="mb-6">
                <Link
                    to="/"
                    aria-label="Back to all articles"
                    className="inline-flex items-center gap-2 min-h-[44px] text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    <span aria-hidden="true">←</span>
                    <span>Back to Articles</span>
                </Link>
            </nav>

            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Post</h1>
                    <p className="text-gray-600 text-sm mt-1">Publish insightful engineering articles to the blog.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="blog-title" className="block text-sm font-semibold text-gray-800 mb-2">
                            Post Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="blog-title"
                            type="text"
                            placeholder="e.g. Architecting Scalable AI Microservices"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-bold text-lg text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="blog-description" className="block text-sm font-semibold text-gray-800 mb-2">
                            Short Summary / Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="blog-description"
                            placeholder="A concise, 1-2 sentence preview for search engines and social cards..."
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-gray-900 leading-relaxed"
                            required
                        />
                    </div>

                    <div className="w-full p-5 rounded-xl border border-gray-300 bg-gray-50/50">
                        <label htmlFor="hero-image-upload" className="block text-sm font-semibold text-gray-800 mb-2">
                            Hero Image (Optional)
                        </label>
                        <input
                            id="hero-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            aria-describedby="upload-status"
                            className="w-full outline-none file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                        />
                        <div id="upload-status" className="mt-2 text-sm" role="status" aria-live="polite">
                            {isUploading && (
                                <p className="text-indigo-600 font-medium">Uploading image to server...</p>
                            )}
                            {formData.image_url && (
                                <p className="text-green-700 font-medium break-all">
                                    ✓ Image attached: {formData.image_url}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label id="content-editor-label" className="block text-sm font-semibold text-gray-800 mb-2">
                            Article Body <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500" aria-labelledby="content-editor-label">
                            <ReactQuill
                                theme="snow"
                                modules={quillModules}
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                className="h-72 mb-12"
                                placeholder="Write your headings (H2/H3 in the toolbar) and detailed article content..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading || isSubmitting}
                        className="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
                    >
                        {isUploading ? "Uploading Image..." : isSubmitting ? "Publishing Post..." : "Publish Post"}
                    </button>
                </form>
            </div>
        </main>
    );
}
