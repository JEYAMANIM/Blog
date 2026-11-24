import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../config";

interface Blog {
    id: string;
    title: string;
    description: string;
    content: string;
    image_url: string;
}

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${API_URL}/blogs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        setBlog(data);
                        if (data.title) {
                            document.title = `${data.title} | BlogEditor`;
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchBlog();
        return () => {
            isMounted = false;
            document.title = "BlogEditor | Engineering, AI & Tech Articles";
        };
    }, [id]);

    if (loading) {
        return (
            <main id="main-content" className="min-h-screen bg-[#0B0F19] text-white p-8 flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" aria-hidden="true"></div>
                <p className="text-slate-400">Loading article...</p>
            </main>
        );
    }

    if (!blog) {
        return (
            <main id="main-content" className="min-h-screen bg-[#0B0F19] text-white p-8 flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-white">Article Not Found</h1>
                <p className="text-slate-300">The article you are looking for does not exist or has been removed.</p>
                <Link
                    to="/"
                    aria-label="Back to all articles"
                    className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors mt-2"
                >
                    ← Back to Articles
                </Link>
            </main>
        );
    }

    const cleanContent = blog.content
        .replace(/&nbsp;|\u00A0/g, " ")
        .replace(/\sstyle=(["']).*?\1/gi, "");

    return (
        <main id="main-content" className="min-h-screen w-full overflow-x-hidden bg-[#0B0F19] text-slate-200 font-sans pb-24">
            <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
                <Link
                    to="/"
                    aria-label="Return to all articles"
                    className="inline-flex items-center gap-2 min-h-[44px] text-indigo-400 hover:text-indigo-300 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg px-2"
                >
                    <span aria-hidden="true">←</span>
                    <span>Back to Articles</span>
                </Link>
            </nav>

            <article className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
                <header className="flex flex-col lg:flex-row gap-12 items-center mb-16">
                    <div className="flex-1 w-full">
                        <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-3 py-1.5 rounded-full border border-indigo-400/30 mb-6 inline-block tracking-wide uppercase">
                            Engineering
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight break-words">
                            {blog.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 break-words">
                            {blog.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-400 border-t border-slate-800/80 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0" aria-hidden="true">
                                    PL
                                </div>
                                <div>
                                    <p className="text-slate-200 font-medium">Pathi Labs Research</p>
                                    <p className="text-xs text-slate-400">AI Research Team</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-800 mx-2" aria-hidden="true"></div>
                            <p className="text-slate-400">ID: {blog.id}</p>
                        </div>
                    </div>

                    {blog.image_url && (
                        <div className="lg:w-5/12 w-full shrink-0">
                            <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-500/10 bg-slate-900 aspect-video lg:aspect-square">
                                <img
                                    src={blog.image_url}
                                    alt={`Hero illustration for ${blog.title}`}
                                    width="600"
                                    height="600"
                                    loading="eager"
                                    decoding="async"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </header>

                <div className="max-w-3xl mx-auto w-full">
                    <div
                        className="prose prose-invert prose-lg prose-indigo max-w-none w-full
                         break-words whitespace-normal
                         prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-14 prose-h2:mb-6 prose-h2:text-white prose-h2:tracking-tight
                         prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-slate-100
                         prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-8
                         prose-strong:text-white prose-em:not-italic
                         prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                         prose-ul:text-slate-300 prose-li:my-2
                         prose-img:rounded-2xl prose-img:border prose-img:border-slate-800"
                        dangerouslySetInnerHTML={{ __html: cleanContent }}
                    />
                </div>
            </article>
        </main>
    );
}
