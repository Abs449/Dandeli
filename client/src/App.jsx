import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import BottomNav from "./components/BottomNav";

const Home = lazy(() => import("./pages/Home"));
const Booking = lazy(() => import("./pages/Booking"));

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-gray-900 font-body">
        <Navbar />
        <main className="grow pt-20 md:pt-0 pb-16 md:pb-0">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <FloatingButtons />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
