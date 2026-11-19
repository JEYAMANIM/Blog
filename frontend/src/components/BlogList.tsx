import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

interface Blog {
    id: string;
    title: string;
    description: string;
    image_url: string;
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/blogs/`);
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-8 font-sans">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Latest Articles</h1>
                    <Link
                        to="/editor"
                        className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30 whitespace-nowrap"
                    >
                        Create New Post
                    </Link>
                </div>

                {loading ? (
                    <p className="text-slate-400">Loading articles...</p>
                ) : (
                    /* 
                      MAGIC GRID CLASS:
                      This automatically calculates how many cards fit based on the screen size.
                      Each card will shrink down to 280px before wrapping to a new row.
                    */
                    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 md:gap-6">
                        {blogs.map((blog) => (
                            <Link
                                to={`/blog/${blog.id}`}
                                key={blog.id}
                                className="bg-[#151A26] rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-colors shadow-xl flex flex-col group cursor-pointer block"
                            >
                                {/* Image Area - Height reduced slightly to look balanced on small cards */}
                                <div className="h-48 w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden relative">
                                    {blog.image_url && (
                                        <img
                                            src={blog.image_url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                        />
                                    )}
                                </div>

                                {/* Content Area - Padding adjusted for tighter spaces */}
                                <div className="p-5 flex-1 flex flex-col">
                                    {/* Category Badge */}
                                    <div className="mb-3">
                                        <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-900/40 px-2.5 py-1 rounded-full border border-indigo-400/20 uppercase tracking-wider">
                                            Engineering
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h2 className="text-lg md:text-xl font-bold mb-2 text-slate-100 line-clamp-2 leading-snug">
                                        {blog.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm line-clamp-3 mb-5 flex-1">
                                        {blog.description}
                                    </p>

                                    {/* Footer Metadata */}
                                    <div className="flex items-center text-[11px] md:text-xs text-slate-500 border-t border-slate-800/80 pt-4 mt-auto">
                                        <span className="truncate max-w-[120px]">ID: {blog.id}</span>
                                        <span className="mx-2 shrink-0">•</span>
                                        <span className="shrink-0">5 min read</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}