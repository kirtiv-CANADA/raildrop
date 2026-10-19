import { useEffect, useState } from 'react';

export default function Confirmed({ journey, station, paymentMethod, onDone }) {
  const [otp, setOtp] = useState('');
  const [showTracking, setShowTracking] = useState(false);

  useEffect(() => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp);
  }, []);

  if (showTracking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Track Order</h2>
          
          {/* Timeline Container */}
          <div className="relative pl-8">
            {/* Vertical Line (Background) */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200"></div>
            
            {/* Active Line (Orange) */}
            <div className="absolute left-3 top-2 w-0.5 bg-[#FC8019]" style={{ height: '45%' }}></div>

            {/* Step 1: Confirmed */}
            <div className="relative mb-8">
              <div className="absolute -left-8 bg-white rounded-full p-0.5">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              </div>
              <div className="ml-4">
                <p className="font-bold text-gray-800">Order Confirmed</p>
                <p className="text-xs text-gray-500 mt-1">Payment via {paymentMethod}</p>
              </div>
            </div>

            {/* Step 2: Preparing */}
            <div className="relative mb-8">
              <div className="absolute -left-8 bg-white rounded-full p-0.5">
                <div className="w-6 h-6 rounded-full bg-[#FC8019] text-white flex items-center justify-center text-xs animate-pulse">
                  🍳
                </div>
              </div>
              <div className="ml-4">
                <p className="font-bold text-gray-800">Preparing Food</p>
                <p className="text-xs text-gray-500 mt-1">Restaurant is cooking your meal</p>
              </div>
            </div>

            {/* Step 3: Out for Delivery */}
            <div className="relative opacity-50">
              <div className="absolute -left-8 bg-white rounded-full p-0.5">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
                  🏃
                </div>
              </div>
              <div className="ml-4">
                <p className="font-bold text-gray-800">Out for Delivery</p>
                <p className="text-xs text-gray-500 mt-1">Partner will reach your coach</p>
              </div>
            </div>
          </div>

          {/* OTP Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-8 text-center">
            <p className="text-sm text-blue-800 mb-1 font-semibold">Delivery OTP</p>
            <p className="text-3xl font-bold tracking-widest text-blue-900">{otp}</p>
            <p className="text-xs text-blue-600 mt-1">Share this with the delivery partner</p>
          </div>

          <button 
            onClick={onDone}
            className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-green-600">✓</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-6 text-sm">Paid via {paymentMethod}</p>

        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 border border-gray-100">
          <p className="text-xs text-gray-500">Delivering to</p>
          <p className="font-semibold text-gray-800">Coach {journey.booking.coach}, Seat {journey.booking.seat}</p>
          <p className="text-sm text-gray-600">at {station.name}</p>
        </div>

        <button 
          onClick={() => setShowTracking(true)}
          className="w-full bg-[#FC8019] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all mb-3 shadow-lg shadow-orange-200"
        >
          Track Order Live
        </button>
        
        <button 
          onClick={onDone}
          className="w-full text-gray-500 text-sm font-medium hover:text-gray-800"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}