import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Packages from '../components/Packages';
import Location from '../components/Location';
import ReviewCarousel from '../components/ReviewCarousel';


const Home = () => {
  return (
    <>
      <Hero />
      <div className="mt-20">
        <About />
      </div>
      <Services />
      <Packages />
      <Location />
      <ReviewCarousel />
      
    </>
  );
};

export default Home;
