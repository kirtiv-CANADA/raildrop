import { useState } from 'react';
import { addMinutes, formatTime, formatDelay } from '../data';
import { getEta, isOpenAt, getCookStart } from '../utils/rules';
import RestaurantPanel from '../components/RestaurantPanel';

const STAGES = [
  'Order confirmed',
  'Restaurant is preparing your food',
  'Delivery partner is waiting at the platform',
  'Handover at your seat',
  'Delivered',
];

export default function Tracking({ order, customer, delayMins, onChangeStation, onHome }) {
  const [stage, setStage] = useState(0);
  const { station, restaurant } = order;

  const eta = getEta(station, delayMins);
  const placedEta = getEta(station, order.placedDelayMins);
  const halt = station.haltMins > 0 ? station.haltMins : 10; // boarding station: train starts here
  const windowEnd = addMinutes(eta, halt);
  const cookStart = getCookStart(eta, restaurant);
  const placedCookStart = getCookStart(placedEta, restaurant);
  const delta = delayMins - order.placedDelayMins;
  const atRisk = !isOpenAt(restaurant, eta);
  const shortHalt = halt <= 2;
  const delivered = stage === STAGES.length - 1;

  const notes = [
    `Paid ₹${order.bill.total}`,
    `Cooking starts at ${formatTime(cookStart)}`,
    `Train arrives at ${formatTime(eta)}`,
    `Delivery window ${formatTime(eta)} - ${formatTime(windowEnd)}`,
    'Enjoy your meal',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6 pb-24">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Track order</h2>
        <p className="text-sm text-gray-600 mb-4">
          {restaurant.name} · Order {order.id} · Train {formatDelay(delayMins)}
        </p>

        {/* Delay changed after ordering */}
        {atRisk ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="font-semibold text-red-600">The restaurant will be closed when your train arrives</p>
            <p className="text-sm text-gray-700 mt-1">
              Your train now arrives at {formatTime(eta)}, after {restaurant.name} closes. Your payment of ₹
              {order.bill.total} will be refunded (simulated). You can order from another station.
            </p>
            <button
              onClick={onChangeStation}
              className="mt-3 w-full bg-[#FC8019] text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
            >
              Choose another station
            </button>
          </div>
        ) : (
          delta !== 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <p className="font-semibold text-[#FC8019]">
                Train arrival moved {Math.abs(delta)} min {delta > 0 ? 'later' : 'earlier'}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                New delivery window: {formatTime(eta)} - {formatTime(windowEnd)}. The restaurant was told to start
                cooking at {formatTime(cookStart)} instead of {formatTime(placedCookStart)}. Your order stays active.
              </p>
            </div>
          )
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
          {STAGES.map((label, i) => {
            const done = i < stage || (delivered && i === stage);
            const current = i === stage && !delivered;
            return (
              <div key={label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      done ? 'bg-green-500' : current ? 'bg-[#FC8019] animate-pulse' : 'bg-gray-200'
                    }`}
                  >
                    {done ? '✓' : ''}
                  </div>
                  {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 ${done ? 'bg-green-300' : 'bg-gray-200'}`} />}
                </div>
                <div className="pb-5">
                  <p className={`font-semibold ${i <= stage ? 'text-gray-800' : 'text-gray-400'}`}>{label}</p>
                  {i <= stage && <p className="text-xs text-gray-500 mt-0.5">{notes[i]}</p>}
                </div>
              </div>
            );
          })}

          {shortHalt && !delivered && (
            <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2 mt-1">
              This station stops for only {halt} min. Keep your coach door ready.
            </p>
          )}
        </div>

        {/* OTP */}
        {!delivered && !atRisk && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 text-center">
            <p className="text-sm text-blue-800 font-semibold">Delivery OTP</p>
            <p className="text-3xl font-bold tracking-widest text-blue-900">{order.otp}</p>
            <p className="text-xs text-blue-600 mt-1">
              The delivery partner will ask for the passenger name ({customer.name}) and this OTP.
            </p>
          </div>
        )}

        {delivered && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4 text-center">
            <p className="font-semibold text-green-700">Delivered to Coach {order.coach}, Seat {order.seat}</p>
            <p className="text-xs text-green-600 mt-1">OTP and name verified (simulated).</p>
          </div>
        )}

        {!delivered && !atRisk && (
          <button
            onClick={() => setStage((s) => Math.min(s + 1, STAGES.length - 1))}
            className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-700"
          >
            Demo: next order step
          </button>
        )}

        <RestaurantPanel
          order={order}
          eta={eta}
          cookStart={cookStart}
          placedCookStart={placedCookStart}
          delta={delta}
          atRisk={atRisk}
        />

        <button onClick={onHome} className="w-full mt-6 text-sm text-gray-500 hover:text-gray-800">
          Back to home
        </button>
      </div>
    </div>
  );
}