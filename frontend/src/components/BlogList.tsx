import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { INITIAL_BLOGS, type Blog } from "../data/initialBlogs";

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>(INITIAL_BLOGS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchLatestBlogs = async () => {
            setIsRefreshing(true);
            try {
                const response = await fetch(`${API_URL}/blogs/`);
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted && Array.isArray(data) && data.length > 0) {
                        setBlogs(data);
                    }
                }
            } catch (err) {
                // Silently fallback to cached initial blogs for seamless UX
                console.info("Using cached blog list:", err);
            } finally {
                if (isMounted) {
                    setIsRefreshing(false);
                }
            }
        };

        fetchLatestBlogs();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white font-sans flex flex-col justify-between">
            <main id="main-content" className="p-6 md:p-10 max-w-[1400px] mx-auto w-full flex-1">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 id="articles-heading" className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                            Latest Articles
                        </h1>
                        <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                            Insights, engineering architectures, and technical deep-dives from our team.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isRefreshing && (
                            <span className="text-xs text-indigo-300 animate-pulse flex items-center gap-1.5" role="status" aria-live="polite">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" aria-hidden="true"></span>
                                Syncing
                            </span>
                        )}
                        <Link
                            to="/editor"
                            aria-label="Create a new blog post"
                            className="inline-flex items-center justify-center min-h-[48px] min-w-[48px] bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-[#0B0F19] px-6 py-3 rounded-full text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap active:scale-95"
                        >
                            Create New Post
                        </Link>
                    </div>
                </header>

                {/* Content Section */}
                <section aria-labelledby="articles-heading">
                    <ul
                        role="list"
                        className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 md:gap-8"
                    >
                        {blogs.map((blog) => (
                            <li key={blog.id} className="h-full list-none">
                                <article className="h-full">
                                    <Link
                                        to={`/blog/${blog.id}`}
                                        aria-label={`Read full article: ${blog.title}`}
                                        title={blog.title}
                                        className="bg-[#151A26] rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0F19] transition-all duration-300 shadow-xl flex flex-col h-full group block"
                                    >
                                        {/* Image Area with fixed aspect ratio to eliminate layout shift (CLS = 0) */}
                                        <div className="h-48 w-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 overflow-hidden relative">
                                            {blog.image_url ? (
                                                <img
                                                    src={blog.image_url}
                                                    alt=""
                                                    aria-hidden="true"
                                                    width="400"
                                                    height="192"
                                                    loading="lazy"
                                                    decoding="async"
                                                    onError={(e) => {
                                                        // Gracefully fallback to background gradient on image error
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-indigo-300 text-sm font-semibold" aria-hidden="true">
                                                    <span>Engineering Deep Dive</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                {/* Category Badge - WCAG AAA compliant contrast */}
                                                <div className="mb-3">
                                                    <span className="text-[11px] font-bold text-indigo-200 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/40 uppercase tracking-wider inline-block">
                                                        Engineering
                                                    </span>
                                                </div>

                                                {/* Article Title */}
                                                <h2 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                                                    {blog.title}
                                                </h2>

                                                {/* Description */}
                                                <p className="text-slate-300 text-sm line-clamp-3 mb-6 leading-relaxed">
                                                    {blog.description}
                                                </p>
                                            </div>

                                            {/* Footer Metadata */}
                                            <footer className="flex items-center text-xs text-slate-300 border-t border-slate-800/90 pt-4 mt-auto">
                                                <span className="truncate max-w-[140px] font-mono">ID: {blog.id}</span>
                                                <span className="mx-2 shrink-0" aria-hidden="true">•</span>
                                                <span className="shrink-0 font-medium">5 min read</span>
                                            </footer>
                                        </div>
                                    </Link>
                                </article>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            {/* Accessible Landmark Footer */}
            <footer role="contentinfo" className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-400 mt-16 bg-[#0B0F19]">
                <p>&copy; {new Date().getFullYear()} BlogEditor. Built for speed, accessibility, and precision.</p>
            </footer>
        </div>
    );
}
