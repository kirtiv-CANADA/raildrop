import { calcBill } from '../data';

export default function Cart({ cart, station, coach, seat, onBack, onCheckout, onUpdateQty }) {
  const bill = calcBill(cart);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Menu
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h2>

        {/* Delivery Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <p className="text-sm text-gray-500">Delivering to</p>
          <p className="font-semibold text-gray-800">Coach {coach}, Seat {seat}</p>
          <p className="text-xs text-gray-500 mt-1">Station: {station.name}</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1 pr-2">
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">₹{item.price}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                  <button onClick={() => onUpdateQty(item, 'remove')} className="px-2 py-1 text-[#FC8019] font-bold hover:bg-gray-50">-</button>
                  <span className="px-2 text-sm font-bold text-gray-800">{item.qty}</span>
                  <button onClick={() => onUpdateQty(item, 'add')} className="px-2 py-1 text-[#FC8019] font-bold hover:bg-gray-50">+</button>
                </div>
                <p className="font-semibold text-gray-800 w-12 text-right">₹{item.price * item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Bill Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{bill.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee (Station Handover)</span>
              <span>₹{bill.delivery}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{bill.gst}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-100 mt-2 text-base">
              <span>To Pay</span>
              <span>₹{bill.total}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onCheckout}
          className="w-full bg-[#FC8019] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all"
        >
          Proceed to Pay ₹{bill.total}
        </button>
      </div>
    </div>
  );
}