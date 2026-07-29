import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "@/components/NavBar";
import HomePage from "@/pages/HomePage";
import ResourcesPage from "@/pages/ResourcesPage";
import ResourceDetailPage from "@/pages/ResourceDetailPage";
import PlannerPage from "@/pages/PlannerPage";
import ItineraryPage from "@/pages/ItineraryPage";
import LibraryPage from "@/pages/LibraryPage";
import SavedPage from "@/pages/SavedPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-xuanzhi-100">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:type/:id" element={<ResourceDetailPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/itinerary/:id" element={<ItineraryPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route
            path="*"
            element={
              <div className="py-32 text-center">
                <div className="font-serif text-6xl font-black text-cinnabar-700 mb-3">
                  404
                </div>
                <p className="font-kai text-celadon-700 mb-6">
                  您访问的页面不存在，先回首页逛逛吧～
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cinnabar-600 text-white font-kai shadow-seal"
                >
                  返回首页
                </a>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
