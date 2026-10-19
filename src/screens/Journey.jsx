import { useState, useEffect } from 'react';
import { addMinutes, formatTime, formatDelay } from '../data';

export default function Journey({ journey, delayMins, onBack, onContinue }) {
  const { booking, train, deliverableStops } = journey;

  const startIdx = train.stops.findIndex((s) => s.code === booking.boardingCode);
  const endIdx = train.stops.findIndex((s) => s.code === booking.destinationCode);
  const stops = train.stops.slice(startIdx, endIdx + 1);
  const isLate = delayMins > 0;

  // Current Location Logic (Assuming train is heading to the next station)
  const currentStation = stops[0];
  const nextStation = stops[1] || stops[0];

  // Live Current Time logic
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // updates every minute
    return () => clearInterval(timer);
  }, []);

  const formattedCurrentTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back
        </button>

        {/* Passenger */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5">
          <p className="text-xs text-gray-500">Passenger</p>
          <p className="text-lg font-bold text-gray-800">{booking.passenger}</p>
          <p className="text-sm text-gray-600 mt-1">
            PNR {booking.pnr} · Coach {booking.coach}, Seat {booking.seat} ({booking.berth})
          </p>
        </div>

        {/* Train status & Live Clock */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 mt-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-gray-800">{train.name}</p>
              <p className="text-sm text-gray-500">Train {train.number}</p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isLate ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
              }`}
            >
              {formatDelay(delayMins)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Running Status • Current Time: <span className="font-semibold text-gray-700">{formattedCurrentTime}</span>
          </div>

          {isLate && (
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mt-4">
              <p className="text-sm font-semibold text-[#FC8019]">Delivery window will adjust</p>
              <p className="text-sm text-gray-700 mt-1">
                Your train is running late, so we use the new arrival time (ETA) for every order. Your order will not be cancelled.
              </p>
            </div>
          )}
        </div>

        {/* Live Train Location & Progress */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 mt-4">
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-5 flex items-start gap-3">
            <div className="text-2xl animate-bounce mt-1">🚂</div>
            <div>
              <p className="text-sm font-bold text-[#FC8019]">Train is currently running</p>
              <p className="text-xs text-gray-700 mt-1">
                Departed <strong>{currentStation.name}</strong> and heading towards <strong>{nextStation.name}</strong>.
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1 font-semibold">
            <span>{currentStation.name}</span>
            <span>{nextStation.name}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 relative">
            <div className="bg-[#FC8019] h-2 rounded-full" style={{ width: '45%' }}></div>
            <div className="absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2" style={{ left: '45%' }}>
              <div className="bg-white border-2 border-[#FC8019] rounded-full p-1 shadow-md text-[10px]">
                🚂
              </div>
            </div>
          </div>

          {/* Route Stops */}
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold text-gray-800">Your route</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Scheduled / ETA</p>
          </div>

          {stops.map((stop, i) => {
            const isFirst = i === 0;
            const isLast = i === stops.length - 1;
            const canOrder = !isFirst && stop.haltMins > 0;
            const newTime = addMinutes(stop.arrival, delayMins);

            return (
              <div key={stop.code} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${canOrder ? 'bg-[#FC8019]' : 'bg-gray-300'}`} />
                  {!isLast && <div className="w-0.5 flex-1 bg-gray-200" />}
                </div>

                <div className="pb-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{stop.name}</p>
                      <p className="text-xs text-gray-500">
                        {isFirst
                          ? 'Your boarding station'
                          : isLast
                          ? 'Your destination'
                          : `Stops for ${stop.haltMins} min`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-gray-400 line-through">
                        {formatTime(stop.arrival)}
                      </p>
                      <p className={`text-sm font-bold ${isLate ? 'text-red-500' : 'text-green-600'}`}>
                        {formatTime(newTime)}
                      </p>
                    </div>
                  </div>

                  {canOrder && (
                    <span className="inline-block mt-2 text-xs font-medium text-[#FC8019] bg-orange-50 px-2 py-1 rounded">
                      Food delivery available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {deliverableStops.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-6">
            No delivery stations are available on this journey.
          </p>
        ) : (
          <button
            onClick={onContinue}
            className="w-full mt-6 py-3 rounded-lg font-semibold text-white bg-[#FC8019] hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
          >
            Order food at a station
          </button>
        )}
      </div>
    </div>
  );
}