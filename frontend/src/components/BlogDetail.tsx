import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

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
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white p-8 flex items-center justify-center">
                Loading article...
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white p-8 flex flex-col items-center justify-center gap-4">
                <p className="text-lg text-slate-300">Article not found.</p>
                <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
                    ← Back to Articles
                </Link>
            </div>
        );
    }

    // Strip non-breaking spaces and pasted inline styles so text wraps properly
    const cleanContent = blog.content
        .replace(/&nbsp;|\u00A0/g, " ")
        .replace(/\sstyle=(["']).*?\1/gi, "");

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#0B0F19] text-slate-200 font-sans pb-24">

            {/* Top Navigation */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
                <Link
                    to="/"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-8 transition-colors w-fit"
                >
                    <span>← Back to Articles</span>
                </Link>
            </div>

            {/* Hero Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full flex flex-col lg:flex-row gap-12 items-center mb-16">
                <div className="flex-1 w-full">
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-900/40 px-3 py-1.5 rounded-full border border-indigo-400/20 mb-6 inline-block tracking-wide uppercase">
                        Engineering
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight break-words">
                        {blog.title}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8 break-words">
                        {blog.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 border-t border-slate-800/80 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                                PL
                            </div>
                            <div>
                                <p className="text-slate-300 font-medium">Pathi Labs Research</p>
                                <p className="text-xs">AI Research Team</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-800 mx-2"></div>
                        <p>ID: {blog.id}</p>
                    </div>
                </div>

                {/* Hero Image */}
                {blog.image_url && (
                    <div className="lg:w-5/12 w-full shrink-0">
                        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-500/10">
                            <img
                                src={blog.image_url}
                                alt={blog.title}
                                className="w-full h-auto object-cover aspect-video lg:aspect-square"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Article Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
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
        </div>
    );
}