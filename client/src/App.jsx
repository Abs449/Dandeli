import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import Home from "./pages/Home";
import Booking from "./pages/Booking";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-gray-900 font-body">
        <Navbar />
        <main className="grow pt-20 md:pt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </Router>
  );
}

export default App;
