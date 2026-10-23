import { formatTime } from '../data';
import { getEta } from '../utils/rules';

export default function Confirmed({ order, customer, paymentMethod, onTrack, onDone }) {
  const eta = getEta(order.station, order.placedDelayMins);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl text-green-600">✓</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center">Order confirmed</h2>
        <p className="text-gray-500 text-sm text-center mt-1">
          Order {order.id} · ₹{order.bill.total} · {paymentMethod}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mt-6 border border-gray-100 text-sm">
          <p className="font-semibold text-gray-800">{order.restaurant.name}</p>
          <ul className="text-gray-600 mt-1">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.qty} × {item.name}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Delivering to Coach {order.coach}, Seat {order.seat} at {order.station.name}
          </p>
          <p className="text-xs text-gray-500">Train arrival: {formatTime(eta)}</p>
          <p className="text-xs text-gray-500">Passenger: {customer.name}</p>
        </div>

        <button
          onClick={onTrack}
          className="w-full mt-6 bg-[#FC8019] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
        >
          Track order
        </button>
        <button onClick={onDone} className="w-full mt-3 text-gray-500 text-sm font-medium hover:text-gray-800">
          Back to home
        </button>
      </div>
    </div>
  );
}
