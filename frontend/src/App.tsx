import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogEditor from "./components/BlogEditor";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail"; // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogList />} />

        {/* Dynamic route that captures the ID */}
        <Route path="/blog/:id" element={<BlogDetail />} />

        <Route path="/editor" element={
          <div className="min-h-screen bg-gray-50 py-10">
            <BlogEditor />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;