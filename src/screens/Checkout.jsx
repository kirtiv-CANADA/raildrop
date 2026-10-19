import { useState } from 'react';
import { calcBill } from '../data';

export default function Checkout({ cart, onBack, onPay }) {
  const bill = calcBill(cart);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // 2.5 second ka wait to simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPay(paymentMethod);
    }, 2500);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
          <div className="w-16 h-16 border-4 border-[#FC8019] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Processing Payment...</h2>
          <p className="text-gray-500 text-sm">Please do not close or refresh this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Cart
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

        <div className="space-y-3 mb-6">
          {['UPI (GPay/PhonePe)', 'Credit/Debit Card', 'Cash on Delivery'].map((method) => (
            <div 
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center transition-all ${paymentMethod === method ? 'border-[#FC8019] bg-orange-50' : 'border-gray-200 bg-white'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === method ? 'border-[#FC8019]' : 'border-gray-400'}`}>
                 {paymentMethod === method && <div className="w-2.5 h-2.5 bg-[#FC8019] rounded-full"></div>}
              </div>
              <span className="font-medium text-gray-800">{method}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Amount to Pay:</span>
            <span className="text-2xl font-bold text-gray-800">₹{bill.total}</span>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          className="w-full bg-[#FC8019] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
        >
          Pay ₹{bill.total} & Confirm
        </button>
      </div>
    </div>
  );
}