import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Packages from '../components/Packages';
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
      <ReviewCarousel />
    </>
  );
};

export default Home;
