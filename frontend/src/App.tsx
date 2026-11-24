import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./components/BlogList";

const BlogDetail = lazy(() => import("./components/BlogDetail"));
const BlogEditor = lazy(() => import("./components/BlogEditor"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6" role="status" aria-live="polite">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" aria-hidden="true"></div>
      <p className="text-slate-400 text-sm">Loading content...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:font-medium focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white transition-all"
      >
        Skip to main content
      </a>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route
            path="/editor"
            element={
              <div className="min-h-screen bg-gray-50 py-10">
                <BlogEditor />
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
