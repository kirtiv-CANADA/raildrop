import { formatTime, formatDelay } from '../data';

export default function Stations({ journey, delayMins, onSelectStation, onBack }) {
  const { deliverableStops } = journey;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-[#FC8019] mb-4">
          Back to Journey
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a delivery station</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your train is {delayMins > 0 ? formatDelay(delayMins) : 'on time'}. We will deliver to your seat at these stations.
        </p>

        <div className="space-y-4">
          {deliverableStops.map((stop) => (
            <div 
              key={stop.code} 
              onClick={() => onSelectStation(stop)}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-[#FC8019] hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{stop.name} ({stop.code})</h3>
                  <p className="text-xs text-gray-500">Halt time: {stop.haltMins} mins</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 line-through">{formatTime(stop.arrival)}</p>
                  <p className="text-sm font-bold text-red-500">
                    {formatTime(new Date(new Date(`2000-01-01T${stop.arrival}:00`).getTime() + delayMins * 60000).toTimeString().slice(0, 5))}
                  </p>
                </div>
              </div>
              <span className="inline-block mt-2 text-xs font-semibold text-[#FC8019] bg-orange-50 px-3 py-1 rounded-full">
                View Restaurants
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}