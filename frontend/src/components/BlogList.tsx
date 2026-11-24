import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

interface Blog {
    id: string;
    title: string;
    description: string;
    image_url: string;
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${API_URL}/blogs/`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                const data = await response.json();
                if (isMounted) {
                    setBlogs(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error fetching blogs:", err);
                if (isMounted) {
                    setError("Unable to load latest articles. Please try again later.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchBlogs();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main id="main-content" className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-8 font-sans">
            <div className="max-w-[1400px] mx-auto">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 id="articles-heading" className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Latest Articles
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Insights, engineering architectures, and deep-dives from our team.
                        </p>
                    </div>
                    <Link
                        to="/editor"
                        aria-label="Create a new blog post"
                        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0F19] px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap active:scale-95"
                    >
                        Create New Post
                    </Link>
                </header>

                {/* Content Section */}
                <section aria-labelledby="articles-heading">
                    {loading ? (
                        <div
                            className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 md:gap-6"
                            aria-busy="true"
                            aria-label="Loading articles"
                        >
                            {[1, 2, 3, 4].map((n) => (
                                <div
                                    key={n}
                                    className="bg-[#151A26] rounded-2xl overflow-hidden border border-slate-800/80 animate-pulse flex flex-col h-[400px]"
                                    aria-hidden="true"
                                >
                                    <div className="h-48 w-full bg-slate-800/60" />
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="w-20 h-5 bg-indigo-900/40 rounded-full mb-3" />
                                            <div className="w-full h-6 bg-slate-800 rounded mb-2" />
                                            <div className="w-3/4 h-4 bg-slate-800/70 rounded" />
                                        </div>
                                        <div className="w-1/2 h-3 bg-slate-800/50 rounded mt-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-6 text-center" role="alert">
                            <p className="text-red-300 font-medium mb-3">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="min-h-[44px] px-5 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 text-sm font-medium transition-colors"
                            >
                                Retry Loading
                            </button>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-16 bg-[#151A26] rounded-2xl border border-slate-800/80 p-8">
                            <p className="text-slate-300 text-lg font-medium mb-2">No articles published yet.</p>
                            <p className="text-slate-400 text-sm mb-6">Be the first to share your thoughts!</p>
                            <Link
                                to="/editor"
                                className="inline-flex items-center justify-center min-h-[44px] bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
                            >
                                Write an Article
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 md:gap-6">
                            {blogs.map((blog, index) => {
                                const isPriorityImage = index < 2;
                                return (
                                    <article key={blog.id} className="h-full">
                                        <Link
                                            to={`/blog/${blog.id}`}
                                            aria-label={`Read full article: ${blog.title}`}
                                            title={blog.title}
                                            className="bg-[#151A26] rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0B0F19] transition-all shadow-xl flex flex-col h-full group cursor-pointer block"
                                        >
                                            {/* Image Area with fixed aspect ratio to eliminate layout shift (CLS) */}
                                            <div className="h-48 w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 overflow-hidden relative">
                                                {blog.image_url ? (
                                                    <img
                                                        src={blog.image_url}
                                                        alt=""
                                                        aria-hidden="true"
                                                        width="400"
                                                        height="192"
                                                        loading={isPriorityImage ? "eager" : "lazy"}
                                                        decoding={isPriorityImage ? "sync" : "async"}
                                                        {...(isPriorityImage ? ({ fetchpriority: "high" } as any) : {})}
                                                        onError={(e) => {
                                                            // Hide broken image smoothly so the gradient cleanly shows
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-medium" aria-hidden="true">
                                                        <span>Pathi Labs</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-5 flex-1 flex flex-col justify-between">
                                                <div>
                                                    {/* Category Badge - WCAG AA compliant contrast */}
                                                    <div className="mb-3">
                                                        <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-400/30 uppercase tracking-wider">
                                                            Engineering
                                                        </span>
                                                    </div>

                                                    {/* Article Title */}
                                                    <h2 className="text-lg md:text-xl font-bold mb-2 text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                                                        {blog.title}
                                                    </h2>

                                                    {/* Description */}
                                                    <p className="text-slate-300 text-sm line-clamp-3 mb-5 leading-relaxed">
                                                        {blog.description}
                                                    </p>
                                                </div>

                                                {/* Footer Metadata - WCAG AA compliant contrast */}
                                                <div className="flex items-center text-xs text-slate-400 border-t border-slate-800/80 pt-4 mt-auto">
                                                    <span className="truncate max-w-[130px]">ID: {blog.id}</span>
                                                    <span className="mx-2 shrink-0" aria-hidden="true">•</span>
                                                    <span className="shrink-0">5 min read</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
