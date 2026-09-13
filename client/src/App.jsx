import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";

const Home = lazy(() => import("./pages/Home"));
const Booking = lazy(() => import("./pages/Booking"));
const RaftingInDandeli = lazy(() => import("./pages/RaftingInDandeli"));
const DandeliPackages = lazy(() => import("./pages/DandeliPackages"));

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const NO_FOOTER_PATHS = ["/rafting-in-dandeli", "/dandeli-packages"];

function AppShell() {
  const location = useLocation();
  const hideFooter = NO_FOOTER_PATHS.some(
    (path) => location.pathname === path || location.pathname === `${path}/`
  );

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
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
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
