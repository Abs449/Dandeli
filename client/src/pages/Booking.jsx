import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { packages } from '../data/mockData';

const Booking = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-20 px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Booking Received!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for choosing Dandeli Adventure. We have received your inquiry and our team will contact you shortly to confirm your booking details.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Book Your <span className="text-accent">Adventure</span></h1>
          <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you to confirm your trip.</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 sm:p-12">
            {/* Customer Details */}
            <div className="mb-10">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 border-b pb-2">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" placeholder="Same as phone number" />
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="mb-10">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 border-b pb-2">Booking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Package *</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none bg-white">
                    <option value="">-- Choose a Package --</option>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.name}>{pkg.name} ({pkg.price}/person)</option>
                    ))}
                    <option value="custom">Custom Experience</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults *</label>
                    <input type="number" min="1" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" defaultValue="2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <input type="number" min="0" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none" defaultValue="0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="mb-10">
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 border-b pb-2">Additional Services</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent" />
                  <span className="text-gray-700">Accommodation Required</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent" />
                  <span className="text-gray-700">Transportation Required (Pick up / Drop off)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent" />
                  <span className="text-gray-700">Include Food Package</span>
                </label>
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
              <textarea 
                rows="4" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none resize-none"
                placeholder="Any allergies, specific requirements, or questions?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Submit Booking Inquiry
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
