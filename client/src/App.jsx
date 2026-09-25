import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import { shouldShowFooter } from "./lib/layout";
// Home is loaded eagerly, unlike every other route below: it's by far the
// most common landing page, and code-splitting it out only added a second
// sequential chunk fetch before the browser could even discover the hero's
// background image — Lighthouse measured ~600ms of that delay directly
// against LCP on this page specifically.
import Home from "./pages/Home";

const Booking = lazy(() => import("./pages/Booking"));
const RaftingInDandeli = lazy(() => import("./pages/RaftingInDandeli"));
const DandeliPackages = lazy(() => import("./pages/DandeliPackages"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideArticle = lazy(() => import("./pages/GuideArticle"));

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

function AppShell() {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-900 font-body overflow-x-hidden">
      <Navbar />
      <main className="grow">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/rafting-in-dandeli" element={<RaftingInDandeli />} />
            <Route path="/dandeli-packages" element={<DandeliPackages />} />
            <Route path="/dandeli-guides" element={<Guides />} />
            <Route path="/dandeli-guides/:slug" element={<GuideArticle />} />
          </Routes>
        </Suspense>
      </main>
      {shouldShowFooter(location.pathname) && <Footer />}
      <FloatingButtons />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
